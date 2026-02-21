from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from permissions.permissions import isProjectManager
from ...infrastructure.models.projects import PROJECT
from ..serializers.serializer import (
    ProjectCreateSerializer, SimpleUserSerializer, ProjectAssignSerializer, ProjectListSerializer
    
)

# ---------- CREATE PROJECT (PM) ----------
class ProjectCreateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isProjectManager]
    
    def post(self, request):
        serializer = ProjectCreateSerializer(
            data = request.data,
            context = {"request": request},
        )
        serializer.is_valid(raise_exception=True)
        project = serializer.save() 
        return Response(
            ProjectListSerializer(project).data,
            status=status.HTTP_201_CREATED,
        )


# ---------- ASSIGN DEV / QA ----------
class ProjectAssignAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isProjectManager]

    def patch(self, request, pk):
        project = get_object_or_404(PROJECT, pk=pk)
        serializer = ProjectAssignSerializer(
            project,
            data = request.data,
            partial = True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            ProjectListSerializer(project).data,
            status=status.HTTP_200_OK
        )
        
# ---------- LIST PROJECTS FOR PM ----------
class PMProjectListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isProjectManager]

    def get(self, request):
        projects = PROJECT.objects.filter(project_manager=request.user)
        return Response(ProjectListSerializer(projects, many=True).data)
    

# ---------- LIST PROJECTS FOR DEV ----------

class DeveloperProjectListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = PROJECT.objects.filter(developers=request.user)
        return Response(ProjectListSerializer(projects, many=True).data)


# ---------- LIST PROJECTS FOR QA ----------

class QAProjectListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = PROJECT.objects.filter(qas=request.user)
        return Response(ProjectListSerializer(projects, many=True).data)
