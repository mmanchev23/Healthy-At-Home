from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Workout(models.Model):
    name = models.CharField(max_length=100)
    image = models.URLField(max_length=200)
    video = models.URLField(max_length=300)
    content = models.TextField(max_length=255)
    exercises = models.TextField(max_length=500)
    is_approved = models.BooleanField(default=False)
