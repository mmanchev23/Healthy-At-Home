# Generated by Django 3.1.3 on 2021-02-28 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apps', '0002_remove_workout_savedinprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='workout',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]