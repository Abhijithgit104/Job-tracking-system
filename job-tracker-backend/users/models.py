from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
# Create your models here.
class User(AbstractUser):

    ROLE_CHOICES=[

        ('candidate','Candidate' ),
            ('employer','Employer')
    ]

    role=models.CharField(max_length=10,choices=ROLE_CHOICES)

class Candidate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile', null=True, blank=True)
    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    @property
    def email(self):
        return self.user.email if self.user else ""

    def __str__(self):
        return self.user.username if self.user else "Unnamed Candidate"
