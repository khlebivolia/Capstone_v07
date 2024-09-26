from django.shortcuts import render
from django.http import JsonResponse
import openai

# Asegúrate de que ya tienes configurada tu clave API

# Vista para la página principal
def index(request):
    return render(request, 'planning.html')

def generate_plan(request):
    if request.method == 'POST':
        materia = request.POST.get('materia')
        periodo = request.POST.get('periodo')
        dias_clases = request.POST.get('dias_clases')
        curso = request.POST.get('curso')
        descripcion = request.POST.get('descripcion')

        # Preparar el mensaje para el modelo
        prompt = f"Genera un plan de clases para la materia {materia}, curso {curso}, durante el periodo {periodo}, con {dias_clases} días de clases a la semana. Descripción: {descripcion}"

        try:
            # Llamada a la nueva API de OpenAI utilizando 'openai.Completion.create'
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Eres un asistente educativo que genera planes de clases."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Procesar la respuesta
            generated_plan = response['choices'][0]['message']['content']
            return JsonResponse({'plan': generated_plan})

        except Exception as e:
            return JsonResponse({'error': str(e)})

    return render(request, 'planning.html')
