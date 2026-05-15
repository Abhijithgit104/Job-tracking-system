from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterSerializer,UserProfileSerializer,MyTokenObtainPairSerializer
from .models import Candidate
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.
class RegisterView(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Registered successfully"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class ProfileView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        serializer=UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        
        # Update user fields
        if 'email' in request.data:
            user.email = request.data.get('email')
            user.save()
            
        # Update candidate fields if applicable
        if user.role == 'candidate':
            candidate, created = Candidate.objects.get_or_create(user=user)
            if 'bio' in request.data:
                candidate.bio = request.data.get('bio')
            if 'skills' in request.data:
                candidate.skills = request.data.get('skills')
            if 'resume' in request.FILES:
                candidate.resume = request.FILES.get('resume')
            candidate.save()
            
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


