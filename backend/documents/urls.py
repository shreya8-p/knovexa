from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    DocumentUploadView,
    DocumentListView,
    RegisterView,
    ChatView,
    DocumentDeleteView,
    CustomTokenObtainPairView,
)


urlpatterns = [
    path(
        'auth/register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'auth/login/',
        CustomTokenObtainPairView.as_view(),
        name='token-obtain-pair'
    ),

    path(
        'auth/refresh/',
        TokenRefreshView.as_view(),
        name='token-refresh'
    ),

    path(
        'documents/upload/',
        DocumentUploadView.as_view(),
        name='document-upload'
    ),

    path(
        'documents/',
        DocumentListView.as_view(),
        name='document-list'
    ),

    path(
        'documents/<int:document_id>/delete/',
        DocumentDeleteView.as_view(),
        name='document-delete'
    ),

    path(
        'chat/',
        ChatView.as_view(),
        name='chat'
    ),
]