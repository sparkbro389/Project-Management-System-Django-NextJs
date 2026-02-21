from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from permissions.permissions import isProjectManager
from ..serializers.serializer import RegisterSerializer, UserSerializer


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class DevelopersListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isProjectManager]

    def get(self, request):
        users = User.objects.filter(groups__name="Developer")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class QAsListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isProjectManager]

    def get(self, request):
        users = User.objects.filter(groups__name="QA")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
