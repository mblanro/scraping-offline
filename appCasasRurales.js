var listaCasasRurales = [];
var datosFiltrados = null;

function loadTopRural() {
    const file = "CasasRurales.html"; 
    const outputId = "output-CasasRuralesUsuario";
    const arbolId = "output-arbol";

    fetch(file)
        .then(r => r.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");

            // SCRAPING: solo enlaces de provincias
            const enlaces = doc.querySelectorAll("a[href*='/casas-rurales/']");
            listaCasasRurales = [];
            enlaces.forEach((a, index) => {
                const texto = a.innerText.trim();
                if (texto.length > 0) {
                    listaCasasRurales.push({
                        id: index + 1,
                        texto: texto,
                        href: a.href
                    });
                }
            });

            // --- TABLA ---
            function generarTabla(subset = listaCasasRurales) {
                let html = `
                <div style="background:white; padding:15px; border:1px solid #ccc; margin-bottom:10px;">
                    <h3 style="margin-top:0; color:#4caf50;">Lista de Casas Rurales</h3>
                    <div style="height:250px; overflow-y:auto; border:1px solid #ddd; margin-bottom:10px;">
                        <table style="width:100%; font-size:12px; border-collapse:collapse;">
                            <thead>
                                <tr style="background:#f1f8e9;">
                                    <th style="padding:8px; border-bottom:1px solid #8bc34a;">ID</th>
                                    <th style="padding:8px; border-bottom:1px solid #8bc34a;">Nombre</th>
                                    <th style="padding:8px; border-bottom:1px solid #8bc34a;">URL</th>
                                </tr>
                            </thead>
                            <tbody>`;
                subset.forEach(c => {
                    html += `<tr>
                        <td style="padding:6px; border-bottom:1px solid #eee;">${c.id}</td>
                        <td style="padding:6px; border-bottom:1px solid #eee;">${c.texto}</td>
                        <td style="padding:6px; border-bottom:1px solid #eee;">${c.href}</td>
                    </tr>`;
                });
                html += `</tbody></table></div>
                    <button onclick="botonGuardarCasasRurales()" 
                            style="background:#8bc34a; color:white; border:none; padding:10px 15px; cursor:pointer; border-radius:4px;">
                        💾 Exportar JSON
                    </button>
                </div>`;
                document.getElementById(outputId).innerHTML = html;
            }

            generarTabla();

            // --- ÁRBOL jerárquico dinámico ---
            function crearArbol() {
                const divArbol = document.getElementById(arbolId);
                divArbol.innerHTML = `<h3>Árbol de Nodos de Casas Rurales</h3>`;
                const ulPrincipal = document.createElement('ul');

                listaCasasRurales.forEach((c, index) => {
                    const li = document.createElement('li');
                    li.style.cursor = 'pointer';
                    li.style.marginBottom = '5px';
                    li.dataset.id = c.id;
                    li.dataset.href = c.href;

                    li.innerHTML = `
                        <details>
                            <summary><strong>Nodo_${c.id}</strong> - ${c.texto}</summary>
                            <ul style="color: #666">
                                <li><strong>Nombre:</strong> ${c.texto}</li>
                                <li><strong>URL:</strong> <a href="${c.href}" target="_blank">${c.href}</a></li>
                                <li><strong>Origen:</strong> Scraping_CasasRurales</li>
                            </ul>
                        </details>`;

                    // Click simple → mostrar solo el nodo en la tabla
                    li.addEventListener('click', function(event) {
                        event.stopPropagation();
                        datosFiltrados = [c];
                        generarTabla(datosFiltrados);
                    });

                    // Doble click → abrir enlace
                    li.addEventListener('dblclick', function(event) {
                        event.stopPropagation();
                        window.open(c.href, "_blank");
                    });

                    ulPrincipal.appendChild(li);
                });

                divArbol.appendChild(ulPrincipal);
            }

            window.botonGuardarCasasRurales = function() {
                const datos = datosFiltrados || listaCasasRurales;
                if (!datos.length) return alert("No hay datos para exportar.");
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datos, null, 2));
                const a = document.createElement("a");
                a.href = dataStr;
                a.download = "Casas_Rurales_json.txt"; // nombre correcto
                document.body.appendChild(a);
                a.click();
                a.remove();
            };

            crearArbol();
        })
        .catch(err => console.error(err));
}