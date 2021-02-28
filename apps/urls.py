from django.urls import path
from . import views

urlpatterns = [
    path("", views.index_view, name="index"),
    path("tasks/", views.tasks_view, name="tasks"),
    path("workout/create/", views.create_workout_view, name="create_workout"),
    path("BMICalculator/", views.bmi_calculator_view, name="BMI_Calculator"),
    path("CalorieCounter/", views.calorie_counter_view, name="Calorie_Counter"),
    path("workouts/", views.workouts_view, name="workouts"),
    path("workout/<str:name>/", views.workout_view, name="workout"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register_view, name="register"),
    path("profile/config/<str:username>/", views.config_view, name="config")
]
