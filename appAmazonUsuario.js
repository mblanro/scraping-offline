// Versión: Listado de Nodos para Amazon Login
// appAmazonUsuario.js
var bufferAmazonLogin = "";
window.datosAmazonLogin = []; // GLOBAL para guardar JSON

window.inspeccionarBufferLogin = function() {
    if (!bufferAmazonLogin) {
        alert("No se ha cargado ningún HTML de Amazon Login todavía.");
        return;
    }
    console.log("--- VOLCADO COMPLETO DEL HTML ---");
    console.log(bufferAmazonLogin);
    alert("El HTML completo de Amazon Login se ha volcado en la consola (F12).");
};

function loadAmazonUsuario() {

    const file = "AmazonUsuario.html";
    const outputId = "output-AmazonUsuario";
    const arbolId = "output-arbol";

    fetch(file)
        .then(r => r.text())
        .then(html => {

            bufferAmazonLogin = html;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Limpiamos árbol previo
            document.getElementById(arbolId).innerHTML = "";

            // Selección nodos visibles
            const elementos = doc.querySelectorAll("a, button, label, input, h1, h2, h3, p, span, div");

            let listaNodosCompleta = [];

            elementos.forEach((el, index) => {
                let texto = el.innerText ? el.innerText.trim().replace(/\n/g, " ") : "";
                if (texto.length > 0 && !texto.includes("{") && !texto.includes("<script")) {
                    listaNodosCompleta.push({
                        indice: index + 1,
                        tipo: el.tagName,
                        contenido: texto
                    });
                }
            });

            // Guardamos global para JSON
            window.datosAmazonLogin = listaNodosCompleta;

            // === Interfaz visual con tabla ===
            let tablaVisual = `
            <div style="background:white; padding:15px; border:1px solid #232f3e; font-family:Arial;">
                <h3 style="margin-top:0; color:#232f3e; border-bottom:2px solid #febd69;">
                    Nodos Extraídos de Amazon Login
                </h3>
                <p>Se han identificado <b>${listaNodosCompleta.length}</b> nodos visibles:</p>

                <button onclick="descargarJSONAmazonUsuario()"
                style="background:#4CAF50;color:white;padding:8px;border:none;cursor:pointer;margin-bottom:10px">
                💾 Guardar JSON
                </button>

                <div style="height:300px; overflow-y:scroll; border:1px solid #ccc; background:#f9f9f9;">
                    <table style="width:100%; border-collapse:collapse; font-size:12px;">
                        <thead>
                            <tr style="background:#232f3e; color:white; position:sticky; top:0;">
                                <th style="padding:8px;">ID</th>
                                <th style="padding:8px;">Tipo</th>
                                <th style="padding:8px;">Contenido</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            listaNodosCompleta.forEach(n=>{
                tablaVisual += `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:8px;color:#888;">${n.indice}</td>
                    <td style="padding:8px;"><b>${n.tipo}</b></td>
                    <td style="padding:8px;color:#333;">${n.contenido}</td>
                </tr>`;
            });

            tablaVisual += `</tbody></table></div></div>`;
            document.getElementById(outputId).innerHTML = tablaVisual;

            // === Árbol de nodos (texto plano) ===
            let textoArbol = `Árbol de nodos de: ${file}\n\n`;
            listaNodosCompleta.forEach(n=>{
                textoArbol += `[${n.indice}] ${n.tipo} → ${n.contenido}\n`;
            });

            document.getElementById(arbolId).innerText = textoArbol;

        })
        .catch(err=>{
            console.error(err);
            document.getElementById(outputId).innerHTML = "Error al cargar Amazon Login";
        });
}

// ===== FUNCIÓN PARA GUARDAR EL JSON COMO TXT EXACTO =====
function descargarJSONAmazonUsuario() {
    if (!window.datosAmazonLogin || window.datosAmazonLogin.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }
    const dataStr = JSON.stringify(window.datosAmazonLogin, null, 2);
    const blob = new Blob([dataStr], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "Amazon_Usuario_json.txt";
    a.click();
    a.remove();
}