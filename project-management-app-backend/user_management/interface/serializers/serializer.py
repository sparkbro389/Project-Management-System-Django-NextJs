from django.contrib.auth.models import User, Group
from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=["Developer", "ProjectManager", "QA"])

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists!")
        return value
    
    def create(self, validated_data):
        role = validated_data.pop("role")
        name = validated_data.pop("name")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        user.first_name = name
        user.save()
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)
        return user
    

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    # name is not the part of user model, must explicitly tell where it comes from
    name = serializers.SerializerMethodField(source="first_name")
    class Meta:
        model = User
        fields = ["id","name", "role", "username"]
        
    def get_name(self, obj):
        return obj.first_name

    def get_role(self, obj):
        group = obj.groups.first()
        return group.name if group else None

