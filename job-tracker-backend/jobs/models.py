from django.db import models
from django.conf import settings
# Create your models here.
User=settings.AUTH_USER_MODEL
class JobPosting(models.Model):
  
    JOB_STATUS=[
        ('open','Open'),
        ('closed','Closed'),
    ]
    
    employer=models.ForeignKey(User,on_delete=models.CASCADE,blank=True)
    title=models.CharField(max_length=50)
    role=models.CharField(max_length=50,blank=True,null=True)
    location=models.CharField(max_length=50)
    salary=models.FloatField(max_length=50)
    description=models.TextField()
    status=models.CharField(max_length=10,choices=JOB_STATUS,default='open')
    skills=models.TextField(blank=True)
    created_at=models.DateField(auto_now_add=True)

class Application(models.Model):

    APPLICATION_STATUS=[
        ('applied','Applied'),
        ('shortlisted','Shortlisted'),
        ('rejected','Rejected')
    ]

    candidate=models.ForeignKey(User,on_delete=models.CASCADE)
    job=models.ForeignKey(JobPosting,on_delete=models.CASCADE)
    status=models.CharField(max_length=20,choices=APPLICATION_STATUS,default='applied')
    applied_at=models.DateField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:20]}..."


