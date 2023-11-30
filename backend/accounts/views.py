from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Post
from .serializers import PostSerializer

from rest_framework.authentication import SessionAuthentication
from rest_framework import generics, permissions, status

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if username is None or password is None:
            return Response({'detail': 'Please provide username and password.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)
        return Response({'detail': 'Successfully logged in.'})


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'You\'re not logged in.'}, status=400)

        logout(request)
        return Response({'detail': 'Successfully logged out.'})
    
class SessionView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'isAuthenticated': False, 'username': None})

        return Response({'isAuthenticated': True, 'username': request.user.username})

class WhoAmIView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'isAuthenticated': False})

        return Response({'username': request.user.username})


class get_csrf(APIView):
    def get(self, request):
        response = Response({'detail': 'CSRF cookie set'})
        response['X-CSRFToken'] = get_token(request)
        return response
    





class PostListCreateView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        # Access the "request" parameter to fix the Pylance problem
        _ = request

        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Check if the user is authenticated before processing the request
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# import json

# from django.contrib.auth import authenticate, login, logout
# from django.http import JsonResponse
# from django.middleware.csrf import get_token
# from django.views.decorators.csrf import ensure_csrf_cookie
# from django.views.decorators.http import require_POST


# def get_csrf(request):
#     response = JsonResponse({'detail': 'CSRF cookie set'})
#     response['X-CSRFToken'] = get_token(request)
#     return response


# @require_POST
# def login_view(request):
#     data = json.loads(request.body)
#     username = data.get('username')
#     password = data.get('password')

#     if username is None or password is None:
#         return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

#     user = authenticate(username=username, password=password)

#     if user is None:
#         return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

#     login(request, user)
#     return JsonResponse({'detail': 'Successfully logged in.'})


# def logout_view(request):
#     if not request.user.is_authenticated:
#         return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

#     logout(request)
#     return JsonResponse({'detail': 'Successfully logged out.'})


# @ensure_csrf_cookie
# def session_view(request):
#     if not request.user.is_authenticated:
#         return JsonResponse({'isAuthenticated': False})

#     return JsonResponse({'isAuthenticated': True})


# def whoami_view(request):
#     if not request.user.is_authenticated:
#         return JsonResponse({'isAuthenticated': False})

#     return JsonResponse({'username': request.user.username})
