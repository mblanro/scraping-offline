async function loadContactsFacebook(archivo, targetId) {
    // Definimos los contenedores según tu HTML
    const divInterfaz = document.getElementById('output-interfaz');
    const divArbol = document.getElementById(targetId); // El de la parte D
    
    try {
        // --- PUNTO B3: MENSAJES DEL SERVIDOR ---
        const respuesta = await fetch(archivo);
        const textoHtml = await respuesta.text();
        console.log("B3 - Datos retornados por el server:", textoHtml.substring(0, 500)); 

        // --- SCRAPING CON REGEX ---
        const patron = /"keyword_text":"([^"]+)"/g;
        let coincidencias;
        let listaNombres = [];

        while ((coincidencias = patron.exec(textoHtml)) !== null) {
            // Limpiamos los códigos \u00ed (Unicode) para que se lean bien
            let nombreLimpio = decodeURIComponent(JSON.parse('"' + coincidencias[1] + '"'));
            listaNombres.push(nombreLimpio);
        }
        const contactos = [...new Set(listaNombres)];

        // --- PUNTO B4: TEXTO PLANO (Simulación de fichero) ---
        // Generamos un bloque de texto puro
        const textoPlano = contactos.join('\n');
        console.log("B4 - Datos en texto plano preparados");

        // --- PUNTO B5: INTERFAZ Y NAVEGACIÓN ---
        divInterfaz.innerHTML = `
            <div style="background:#e7f3ff; padding:10px; border-radius:8px; border:1px solid #1877f2">
                <p><strong>Total de contactos:</strong> ${contactos.length}</p>
                <button onclick="descargarTextoPlano()">📥 Descargar Texto Plano (Punto B4)</button>
                <div style="max-height:200px; overflow-y:scroll; margin-top:10px; background:white; padding:5px">
                    ${contactos.map(c => `<div style="border-bottom:1px solid #eee; padding:5px">👤 ${c}</div>`).join('')}
                </div>
            </div>`;

        // --- PUNTO D1: ÁRBOL DE NODOS DINÁMICO ---
        divArbol.innerHTML = `<h3>Árbol Jerárquico de Nodos</h3>`;
        const ulPrincipal = document.createElement('ul');
        
        contactos.forEach((nombre, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <details>
                    <summary><strong>Nodo_Contacto_${index}</strong></summary>
                    <ul style="color: #666">
                        <li><strong>Nombre:</strong> ${nombre}</li>
                        <li><strong>Propiedad:</strong> keyword_text</li>
                        <li><strong>Origen:</strong> Scraped_JSON_Node</li>
                    </ul>
                </details>`;
            ulPrincipal.appendChild(li);
        });
        divArbol.appendChild(ulPrincipal);

        // Guardamos los datos globalmente para la descarga
        window.datosScraping = textoPlano;

    } catch (error) {
        console.error(error);
        divArbol.innerHTML = "Error al cargar los datos.";
    }
}

// Función para el Punto B4: Presentar/Descargar datos completos
function descargarTextoPlano() {
    const blob = new Blob([window.datosScraping], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Facebook_json.txt';
    a.click();
} 