from django.urls import path
from .interface.views.view import TaskCreateAPIView, PMTaskListAPIView, TaskSoftDeleteAPIView

urlpatterns = [
    path("create/", TaskCreateAPIView.as_view()),
    path("list/", PMTaskListAPIView.as_view()),
    path("<int:pk>/delete/", TaskSoftDeleteAPIView.as_view())
]
