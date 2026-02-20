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

            // --- ÁRBOL con distinción click / doble click ---
            function crearArbol() {
                let html = `<ul style="list-style:none; padding-left:0;">`;
                listaCasasRurales.forEach(c => {
                    html += `<li style="cursor:pointer; margin-bottom:5px;" data-id="${c.id}" data-href="${c.href}">
                                • ${c.texto}
                             </li>`;
                });
                html += `</ul>`;
                document.getElementById(arbolId).innerHTML = html;

                // Eventos
                let clickTimer;
                document.querySelectorAll(`#${arbolId} li`).forEach(li => {
                    li.addEventListener("click", function(event) {
                        clearTimeout(clickTimer);
                        clickTimer = setTimeout(() => {
                            const id = parseInt(this.dataset.id);
                            const casa = listaCasasRurales.find(c => c.id === id);
                            if (casa) {
                                datosFiltrados = [casa];
                                generarTabla(datosFiltrados);
                            }
                        }, 200);
                    });
                    li.addEventListener("dblclick", function(event) {
                        clearTimeout(clickTimer); // evita que se ejecute el click simple
                        const url = this.dataset.href;
                        if (url) window.open(url, "_blank");
                    });
                });
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