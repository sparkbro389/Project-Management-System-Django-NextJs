from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

from permissions.permissions import isProjectManager, isQA, isDeveloper
from ..serializers.serializer import BugCreateSerializer, BugListSerializer
from ...infrastructure.models.bugs import BUG

class BugCreateAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isQA]

    def post(self, request):
        serializer = BugCreateSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        bug = serializer.save()
        return Response(
            BugListSerializer(bug).data,
            status=status.HTTP_201_CREATED,
        )


class QABugListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isQA]

    def get(self, request):
        bugs = BUG.objects.filter(
            deleted=False
        ).filter(
            Q(reported_by=request.user) |
            Q(project__qas=request.user)
        )
        return Response(BugListSerializer(bugs, many=True).data)



class PMBugListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isProjectManager]

    def get(self, request):
        bugs = BUG.objects.filter(
            project__project_manager=request.user,
            deleted=False
        )
        return Response(BugListSerializer(bugs, many=True).data)


class DevBugListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isDeveloper]

    def get(self, request):
        bugs = BUG.objects.filter(
            assigned_to=request.user,
            deleted=False
        )
        return Response(BugListSerializer(bugs, many=True).data)
