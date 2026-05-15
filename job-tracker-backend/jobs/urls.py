from django.urls import path
from .views import JobView, ApplicationView, DashboardStatsView

urlpatterns=[
    path('jobs/', JobView.as_view()),
    path('jobs/<int:id>/', JobView.as_view()),
    path('jobs/applications/', ApplicationView.as_view()),
    path('jobs/applications/<int:pk>/', ApplicationView.as_view()),
    path('jobs/stats/', DashboardStatsView.as_view()),
]