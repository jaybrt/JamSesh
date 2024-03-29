from django.shortcuts import render
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from django.shortcuts import redirect
from api.models import Room
from .models import Vote

# Create your views here.
class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
        'scope': scopes,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response  = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    save_user_token(request.session.session_key, access_token, token_type, expires_in, refresh_token)
    return redirect('frontend:')

class IsAuthenticated(APIView):
    def get(self, request, format = None):
        if not request.session.exists(request.session.session_key):
            request.session.create()

        authentication = is_authenticated(self.request.session.session_key)
        return Response({'Status': authentication}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status = status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = '/me/player/currently-playing'
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_sring = ''
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_sring += ', '
            name = artist.get('name')
            artist_sring += name

        votes = len(Vote.objects.filter(room=room, song_id=room.current_song))
        song = {
            'title': item.get('name'),
            'artist': artist_sring,
            'time': progress,
            'duration': duration,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()

class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status = status.HTTP_204_NO_CONTENT)
        return Response({}, status = status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status = status.HTTP_204_NO_CONTENT)
        return Response({}, status = status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip
        usr_votes = Vote.objects.filter(room=room, song_id=room.current_song, user=self.request.session.session_key)

        if self.request.session.session_key == room.host:
            skip_song(room.host)
        elif usr_votes.exists():
            usr_votes[0].delete()
        else:
            vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
            vote.save()
        votes = Vote.objects.filter(room=room, song_id=room.current_song)

        if len(votes) >= votes_needed:
            skip_song(room.host)

        return Response({}, status.HTTP_204_NO_CONTENT)

class SearchSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        data = {
        'q': self.request.GET.get('q'),
        'type': 'track',
        'limit': 5
        }
        query_results=execute_spotify_api_request(room.host, '/search', data=data)
        tracks = query_results.get('tracks')
        items = tracks.get('items')
        songs = []
        for song in items:
            name = song.get('name')
            artist = song.get('artists')[0].get('name')
            image_url = song.get('album').get('images')[2].get('url')
            duration = song.get('duration_ms')
            id = song.get('uri')
            songs.append({
                'name': name,
                'artist': artist,
                'image_url': image_url,
                'duration': duration,
                'uri': id
            })
        songs_response = {
        'songs': songs
        }

        return Response(songs_response, status=status.HTTP_200_OK)

class QueueSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        uri = self.request.data.get('uri')
        url = Request('POST', 'https://api.spotify.com/v1/me/player/queue', params={'uri': uri}).prepare().url
        tokens = get_user_tokens(room.host)
        header ={'Content-Type': 'application/json', 'Authorization': f'Bearer {tokens.access_token}'}
        response = post(url, headers=header)
        return Response({}, status=status.HTTP_204_NO_CONTENT)
