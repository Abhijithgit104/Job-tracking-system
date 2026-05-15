from rest_framework import serializers
from .models import User,Candidate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User

        fields=['username','password','role', 'email']

    def create(self, validated_data):
        
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','password']

class UserProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='candidate_profile.bio', read_only=True)
    skills = serializers.CharField(source='candidate_profile.skills', read_only=True)
    resume = serializers.FileField(source='candidate_profile.resume', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'email', 'bio', 'skills', 'resume']

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Candidate
        fields='__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role,
            'email': self.user.email
        }
        return data
