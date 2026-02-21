from django.urls import path
from .interface.views.view import RegisterAPIView, MeAPIView, DevelopersListView, QAsListAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
    path("developers/", DevelopersListView.as_view()),
    path("qas/", QAsListAPIView.as_view()),
]