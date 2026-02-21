from django.urls import path
from .interface.views.view import (
    BugCreateAPIView,
    QABugListAPIView,
    PMBugListAPIView,
    DevBugListAPIView,
)

urlpatterns = [
    path("create/", BugCreateAPIView.as_view()),
    path("qa/", QABugListAPIView.as_view()),
    path("pm/", PMBugListAPIView.as_view()),
    path("dev/", DevBugListAPIView.as_view()),
]
