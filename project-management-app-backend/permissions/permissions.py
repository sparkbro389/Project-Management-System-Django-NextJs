from rest_framework.permissions import BasePermission

class isProjectManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name="ProjectManager").exists()
        )

class isQA(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name="QA").exists()
        )
        
class isDeveloper(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name="Developer").exists()
        )