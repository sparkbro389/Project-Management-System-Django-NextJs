from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from permissions.permissions import isProjectManager
from ..serializer.serializer import TaskCreateSerializer, TaskListSerializer
from ...infrastructure.models.tasks import TASK


class TaskCreateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isProjectManager]

    def post(self, request):
        serializer = TaskCreateSerializer(
            data=request.data,
            context={"request":request}
        )
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response(
            TaskCreateSerializer(task).data,
            status=status.HTTP_201_CREATED,
        )

class PMTaskListAPIView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated,isProjectManager]
    
    def get(self, request):
        tasks = TASK.objects.filter(created_by=request.user, is_deleted=False)
        return Response(TaskListSerializer(tasks, many=True).data,
                        )
class TaskSoftDeleteAPIView(APIView):
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated, isProjectManager]

    def delete(self, request, pk):
        try:
            task = TASK.objects.get(
                pk=pk,
                created_by=request.user,
                is_deleted=False
            )
        except TASK.DoesNotExist:
            return Response(
                {"detail": "Task not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        task.is_deleted = True
        task.save(update_fields=["is_deleted",])        

        return Response(
            {"detail": "Task marked as completed"},
            status=status.HTTP_200_OK
        )