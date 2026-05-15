from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.core.mail import send_mail
from .models import JobPosting,Application
from .serializers import JobSerializer,ApplicationSerializer

# Create your views here.

class JobView(APIView):
    
    def get_permissions(self):

        return [IsAuthenticated()]
    
    def get(self, request, id=None):

        if id:

            try:
                job = JobPosting.objects.get(id=id)
                serializer = JobSerializer(job)
                return Response(serializer.data)
            
            except JobPosting.DoesNotExist:
                return Response({"error": "Job not found"}, status=404)

        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=401)
            
        if request.user.role == 'employer':
            
            jobs = JobPosting.objects.filter(employer=request.user)

        elif request.user.role == 'candidate':
          
            jobs = JobPosting.objects.all()

        else:
            return Response({"error": "Unauthorized role"}, status=403)
            
        
        search = request.query_params.get('search')
        role = request.query_params.get('role')
        location = request.query_params.get('location')
        min_salary = request.query_params.get('min_salary')
        
        if search:
            jobs = jobs.filter(title__icontains=search) | jobs.filter(description__icontains=search)

        if role:
            jobs = jobs.filter(role__icontains=role)

        if location:
            jobs = jobs.filter(location__icontains=location)

        if min_salary:
            try:
                jobs = jobs.filter(salary__gte=float(min_salary))
            except ValueError:
                pass
            
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    def post(self, request):

        if request.user.role != 'employer':
            return Response({"error": "Only employers can post jobs"}, status=403)
            
        serializer = JobSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(employer=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=400)
        

    def put(self, request, id):

        job = get_object_or_404(
            JobPosting,
            id=id,
            employer=request.user
        )

        serializer = JobSerializer(
            job,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    
class ApplicationView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):

        if request.user.role == "candidate":
            application = Application.objects.filter(candidate=request.user)
            serializer = ApplicationSerializer(application, many=True)
            return Response(serializer.data)
        
        elif request.user.role == "employer":
            # Employers see applications for their jobs
            application = Application.objects.filter(job__employer=request.user)
            serializer = ApplicationSerializer(application, many=True)
            return Response(serializer.data)
        
        return Response({"error": "Unauthorized"}, status=403)

    def post(self, request, pk=None):

        if request.user.role != "candidate":
            return Response({"error": "Only candidates can apply for jobs"}, status=403)
        
        job_id = request.data.get('job')

        try:
            job = JobPosting.objects.get(pk=job_id)
        except JobPosting.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)
            
       
        if Application.objects.filter(candidate=request.user, job=job).exists():
            return Response({"error": "Already applied for this job"}, status=400)
            
        application = Application.objects.create(candidate=request.user, job=job)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def patch(self, request, pk):
        
        if request.user.role != "employer":

            return Response(
                {"error": "Only employers can update status"},
                status=403
            )

        application = get_object_or_404(
            Application,
            pk=pk,
            job__employer=request.user
        )

        new_status = request.data.get("status")

        allowed_status = [
            "applied",
            "shortlisted",
            "rejected"
        ]
        if new_status not in allowed_status:
            return Response(
                {"error": "Invalid status"},
                status=400
            )

        application.status = new_status
        application.save()

        
        try:
            subject = f"Application Status Update: {application.job.title}"
            message = f"Hello {application.candidate.username},\n\nYour application status for '{application.job.title}' has been updated to: {new_status}.\n\nBest regards,\nJob Tracker Team"
            recipient_list = [application.candidate.email]
            send_mail(subject, message, None, recipient_list)

        except Exception as e:
            print(f"Error sending email: {e}")

        return Response({
            "message": "Status updated and notification sent",
            "status": application.status
        })

class DashboardStatsView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role == 'employer':
            total_jobs = JobPosting.objects.filter(employer=request.user).count()
            total_apps = Application.objects.filter(job__employer=request.user).count()
            pending_apps = Application.objects.filter(job__employer=request.user, status='applied').count()
            return Response({
                "total_jobs": total_jobs,
                "total_applications": total_apps,
                "pending_applications": pending_apps
            })
        else:
            total_applied = Application.objects.filter(candidate=request.user).count()
            shortlisted = Application.objects.filter(candidate=request.user, status='shortlisted').count()
            return Response({
                "total_applied": total_applied,
                "shortlisted": shortlisted
            })

