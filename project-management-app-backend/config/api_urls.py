from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # JWT
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    # apps
    path("users/", include("user_management.urls")),
    path("projects/", include("projects.urls")),
    path("tasks/", include("tasks.urls")),
    path("bugs/", include("bugs.urls")),
]