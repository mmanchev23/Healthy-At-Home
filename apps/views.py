from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import User, Workout


def index_view(request):
    return render(request, "apps/index.html")


def tasks_view(request):
    if request.user.is_authenticated:
        return render(request, "apps/tasks.html")
    else:
        return render(request, "apps/error.html")


def create_workout_view(request):
    if request.method == "POST":
        name = request.POST["name"]
        image = request.POST["image"]
        video = request.POST["video"]
        content = request.POST["content"]
        exercises = request.POST["exercises"]

        if not name:
            return render(request, "apps/create.html", {
                "messageError": "The 'Name' field can not be empty!"
            })

        if not video:
            return render(request, "apps/create.html", {
                "messageError": "The 'Video' field can not be empty!"
            })

        if not content:
            return render(request, "apps/create.html", {
                "messageError": "The 'Content' field can not be empty!"
            })

        if not exercises:
            return render(request, "apps/create.html", {
                "messageError": "The 'Exercises' field can not be empty!"
            })

        workout = Workout(name=name, image=image, video=video, content=content, exercises=exercises)

        if request.POST["image"] != '':
            workout.image = request.POST["image"]
        else:
            workout.image = "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"

        workout.save()
        return render(request, "apps/create.html", {
            "messageSuccess": "Workout was sent for approval successfully!"
        })
    else:
        return render(request, "apps/create.html")


def bmi_calculator_view(request):
    if request.user.is_authenticated:
        return render(request, "apps/BMI_Calculator.html")
    else:
        return render(request, "apps/error.html")


def calorie_counter_view(request):
    if request.user.is_authenticated:
        return render(request, "apps/Calorie_Counter.html")
    else:
        return render(request, "apps/error.html")


def workouts_view(request):
    if request.user.is_authenticated:
        workout = Workout.objects.all()
        return render(request, "apps/workouts.html", {
            "workout": workout
        })
    else:
        return render(request, "apps/error.html")


def workout_view(request, name):
    workout = Workout.objects.get(name=name)
    return render(request, "apps/workout.html", {
        "workout": workout
    })


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "apps/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "apps/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register_view(request):
    if request.method == "POST":

        """Getting the input data"""
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        """Variables needed for the validation of the password"""
        hasAtleast8Characters = False
        hasAtleast1Digit = any(map(str.isdigit, password))
        hasAtleast1Upper = any(map(str.isupper, password))
        hasAtleast1Lower = any(map(str.islower, password))
        hasNoForbidden = False

        """Validation"""
        if len(str(password)) >= 8:
            hasAtleast8Characters = True

        if not str(password).__contains__('!') or not str(password).__contains__('$') or not str(password).__contains__(
                '#') or not str(password).__contains__('%'):
            hasNoForbidden = True

        if not username:
            return render(request, "apps/register.html", {
                "message": "The 'Username' field can not be empty!"
            })

        if not email:
            return render(request, "apps/register.html", {
                "message": "The 'Email' field can not be empty!"
            })

        if not password:
            return render(request, "apps/register.html", {
                "message": "The 'Password' field can not be empty!"
            })

        if not confirmation:
            return render(request, "apps/register.html", {
                "message": "The 'Confirm password' field can not be empty!"
            })

        if password != confirmation:
            return render(request, "apps/register.html", {
                "message": "Passwords must match!"
            })

        if not hasAtleast8Characters:
            return render(request, "apps/register.html", {
                "message": "The password can not contain less than 8 characters!"
            })

        if not hasAtleast1Digit:
            return render(request, "apps/register.html", {
                "message": "The password should contains atleast one digit!"
            })

        if not hasAtleast1Upper:
            return render(request, "apps/register.html", {
                "message": "The password should contains atleast one upper character!"
            })

        if not hasAtleast1Lower:
            return render(request, "apps/register.html", {
                "message": "The password should contains atleast one lower character!"
            })

        if not hasNoForbidden:
            return render(request, "apps/register.html", {
                "message": "The password should not contains '!', '$', '#' or '%'!"
            })

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        except IntegrityError:
            return render(request, "apps/register.html", {
                "message": "Username already taken."
            })
    else:
        return render(request, "apps/register.html")


def config_view(request, username):
    if request.method == "POST":
        user = User.objects.get(username=username)
        username = request.POST["username"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        email = request.POST["email"]

        """Validation"""
        if not username:
            return render(request, "apps/config.html", {
                "messageError": "The 'Username' field can not be empty!"
            })

        if not first_name:
            return render(request, "apps/config.html", {
                "messageError": "The 'First name' field can not be empty!"
            })

        if not last_name:
            return render(request, "apps/config.html", {
                "messageError": "The 'Last name' field can not be empty!"
            })

        if not email:
            return render(request, "apps/config.html", {
                "messageError": "The 'Email' field can not be empty!"
            })

        """Updating Data"""
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.email = email

        user.save()
        return render(request, "apps/config.html", {
            "messageSuccess": "Profile updated successfully!"
        })
    else:
        return render(request, "apps/config.html")
