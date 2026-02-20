/**
 * ARCHIVO: appLinkedinContacts.js
 * Descripción: Modulo de scraping offline para LinkedIn con exportación JSON.
 */

// Variable global para persistencia de datos (Requisito para el JSON)
var listaContactosLinkedin = [];

// --- FUNCIÓN PARA GUARDAR EL JSON ---
window.botonGuardarLinkedin = function() {
    if (typeof window.exportarAJSON === "function") {
        // Exportamos la lista de nombres limpios
        window.exportarAJSON(listaContactosLinkedin, "Contactos_LinkedIn_Limpios");
    } else {
        alert("Error: La función exportarAJSON no está definida en apps.html");
    }
};

// --- FUNCIÓN PRINCIPAL DE CARGA (Requisito B1) ---
function loadContactsLinkedin(file, outputId) {
    const interfaz = document.getElementById(outputId);
    const arbolNodos = document.getElementById("output-arbol");

    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error("Archivo HTML no encontrado");
            return response.text();
        })
        .then(html => {
            console.log("LinkedIn: Datos capturados correctamente.");
            processLinkedinData(html, interfaz, arbolNodos);
        })
        .catch(error => {
            console.error("Error en el fetch:", error);
            interfaz.innerHTML = `<span style="color:red">Error: No se pudo cargar el archivo ${file}</span>`;
        });
}

// --- FUNCIÓN DE PROCESAMIENTO Y LIMPIEZA (Requisito B2, B4, B5) ---
function processLinkedinData(html, containerUI, containerPlain) {
    // B2: Sistema de scraping mediante Expresiones Regulares
    const regex = /href="https:\/\/www\.linkedin\.com\/in\/([^"/]+)\/?"/g;
    let match;
    
    let uniqueSlugs = new Set();

    while ((match = regex.exec(html)) !== null) {
        uniqueSlugs.add(match[1]);
    }

    // Transformamos los "slugs" en nombres limpios
    let cleanedProfiles = Array.from(uniqueSlugs).map(slug => {
        let name = decodeURIComponent(slug);
        name = name.replace(/-[a-z0-9]+$/, ""); // Quitar ID alfanumérico
        return name.replace(/-/g, " ").toUpperCase(); // Formatear a espacios y Mayúsculas
    });

    // Guardamos en la variable global para la exportación JSON
    listaContactosLinkedin = cleanedProfiles.map((p, index) => ({ id: index + 1, nombre: p }));

    // --- B4: PRESENTACIÓN EN TEXTO PLANO (Estructura Interna) ---
    if (containerPlain) {
        containerPlain.innerText = cleanedProfiles.length > 0 
            ? "INFORME DE CONTACTOS ÚNICOS:\n\n" + cleanedProfiles.join("\n") 
            : "Buffer vacío: No se extrajeron datos.";
    }

    // --- B5: VISTA DE USUARIO (Interfaz Visual con Botón JSON) ---
    if (cleanedProfiles.length > 0) {
        let htmlContent = `
            <div style="border: 1px solid #0077b5; padding: 10px; background: white;">
                <h3 style="color: #0077b5;">Total: ${cleanedProfiles.length} perfiles únicos</h3>
                <div style="height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 10px; margin-bottom: 10px;">
                    <ul style="padding: 0;">`;
        
        cleanedProfiles.forEach(profile => {
            htmlContent += `<li style="list-style: none; margin-bottom: 8px; border-bottom: 1px solid #f0f0f0;">👤 <strong>${profile}</strong></li>`;
        });

        htmlContent += `
                    </ul>
                </div>
                <button type="button" onclick="window.botonGuardarLinkedin()" 
                        style="width: 100%; background: #4CAF50; color: white; border: none; padding: 10px; cursor: pointer; font-weight: bold; border-radius: 4px;">
                    💾 GUARDAR CONTACTOS EN JSON
                </button>
            </div>`;
        
        containerUI.innerHTML = htmlContent;
    } else {
        containerUI.innerHTML = "<strong>No se encontraron contactos en el documento.</strong>";
    }
}