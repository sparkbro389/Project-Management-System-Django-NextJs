from django.urls import path
from .interface.views.view import (
    ProjectCreateAPIView,
    ProjectAssignAPIView,
    PMProjectListAPIView,
    DeveloperProjectListAPIView,
    QAProjectListAPIView,
)

urlpatterns = [
    path("create/", ProjectCreateAPIView.as_view()),              # POST (PM)
    path("pm/", PMProjectListAPIView.as_view()),                 # GET (PM)
    path("<int:pk>/assign/", ProjectAssignAPIView.as_view()),    # PATCH (PM)
    path("dev/", DeveloperProjectListAPIView.as_view()),         # GET (DEV)
    path("qa/", QAProjectListAPIView.as_view()),                 # GET (QA)
]
