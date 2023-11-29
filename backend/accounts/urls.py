from django.urls import path

from . import views

urlpatterns = [
    path('api/csrf/', views.get_csrf.as_view(), name='api-csrf'),
    path('api/login/', views.LoginView.as_view(), name='api-login'),
    path('api/logout/', views.LogoutView.as_view(), name='api-logout'),
    path('api/session/', views.SessionView.as_view(), name='api-session'),
    path('api/whoami/', views.WhoAmIView.as_view(), name='api-whoami'),
    path('api/posts/', views.PostListCreateView.as_view(), name='post-list'),

]


