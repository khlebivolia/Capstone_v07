from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Ruta para la página principal
    path('generate_plan/', views.generate_plan, name='generate_plan'),  # Ruta para generar planificación
]
