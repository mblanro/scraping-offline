/**
 * Scraping offline LinkedIn – Escenario 3.3
 * Extrae perfiles desde enlaces /in/
 */

window.datosLinkedin = []; // GLOBAL para exportar JSON

function loadContactsLinkedin(file, outputId) {
  fetch(file)
    .then(r => r.text())
    .then(html => extractLinkedinProfiles(html, outputId))
    .catch(e => {
      console.error(e);
      document.getElementById(outputId).textContent =
        "Error cargando HTML de LinkedIn";
    });
}

function extractLinkedinProfiles(html, outputId) {
  const regex = /href="https:\/\/www\.linkedin\.com\/in\/([^"/]+)\/?"/g;
  let match;
  let perfiles = [];

  while ((match = regex.exec(html)) !== null) {
    perfiles.push(decodeURIComponent(match[1]));
  }

  // Guardamos global para exportación
  window.datosLinkedin = perfiles.map((p, i) => ({
    id: i + 1,
    perfil: p
  }));

  // ===== SALIDA EN PANTALLA =====
  let salida = `<b>Contactos LinkedIn encontrados:</b><br><br>`;
  perfiles.forEach((p, i) => {
    salida += `${i + 1}. ${p}<br>`;
  });

  // Botón descarga JSON TXT
  salida += `
    <br>
    <button onclick="descargarJSONLinkedin()"
    style="background:#4CAF50;color:white;padding:8px;border:none;cursor:pointer">
    💾 Guardar JSON
    </button>
  `;

  document.getElementById(outputId).innerHTML =
    perfiles.length ? salida : "No se encontraron contactos LinkedIn";
}

// ===== FUNCIÓN DESCARGA TXT =====
function descargarJSONLinkedin() {
  if (!window.datosLinkedin || window.datosLinkedin.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const dataStr = JSON.stringify(window.datosLinkedin, null, 2);
  const blob = new Blob([dataStr], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "Linkedin_json.txt";
  a.click();
  a.remove();
}