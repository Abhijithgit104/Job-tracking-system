from rest_framework import serializers
from .models import JobPosting, Application, Notification
from users.serializers import UserProfileSerializer

class JobSerializer(serializers.ModelSerializer):
    
    employer = UserProfileSerializer(read_only=True)
    
    class Meta:
        model=JobPosting
        fields='__all__'
        read_only_fields=['employer']

class ApplicationSerializer(serializers.ModelSerializer):

    job_details = JobSerializer(source='job', read_only=True)
    candidate = UserProfileSerializer(read_only=True)
    candidate_username = serializers.CharField(source='candidate.username', read_only=True)
    
    class Meta:
        model=Application
        fields='__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        