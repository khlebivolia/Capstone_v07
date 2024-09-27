document.getElementById('planningForm').onsubmit = function(event) {
    event.preventDefault();  // Evita que el formulario se envíe de manera convencional.

    // Mostrar el ícono de carga
    document.getElementById('loadingIcon').style.display = 'block';

    // Ocultar los resultados previos, si existen
    document.getElementById('generatedPlans').style.display = 'none';

    var formData = new FormData(this);  // Captura los datos del formulario

    fetch("/generate_plan/", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        // Oculta el ícono de carga
        document.getElementById('loadingIcon').style.display = 'none';

        // Mostrar los resultados
        if (data.plan) {
            document.getElementById('plansContent').innerHTML = `
                <div class="plan">
                    <p>${data.plan.replace(/\n/g, '<br>')}</p>
                </div>
            `;
            document.getElementById('generatedPlans').style.display = 'block';
        } else if (data.error) {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        // Oculta el ícono de carga y muestra un mensaje de error
        document.getElementById('loadingIcon').style.display = 'none';
        alert("Hubo un error: " + error);
    });
};

// Función para generar y descargar el PDF usando jsPDF
function downloadPDF(planText) {
    const { jsPDF } = window.jspdf; // Asegurarse de que jsPDF está disponible
    const doc = new jsPDF();

    // Dividir el texto en líneas para no sobrepasar los márgenes
    var lines = doc.splitTextToSize(planText, 180);

    // Añadir el título del PDF
    doc.setFontSize(16);
    doc.text("Planificación Generada", 10, 10);

    // Añadir el contenido generado al PDF
    doc.setFontSize(12);
    doc.text(lines, 10, 20);

    // Descargar el archivo PDF
    doc.save("planificacion.pdf");
}