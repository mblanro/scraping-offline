function loadAmazonIntro() {

  const file = "AmazonIntro.html";
  const outputId = "output-AmazonIntro";
  const arbolId = "output-arbol";

  fetch(file)
    .then(r => r.text())
    .then(html => {

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // ===== CONTAR NODOS =====
      const totalNodos = doc.body.querySelectorAll("*").length;

      // ===== LIMPIAR ÁRBOL ANTERIOR =====
      document.getElementById(arbolId).innerHTML = "";

      // ===== FUNCIÓN ÁRBOL DOM =====
      function crearArbol(nodo, nivel = 0, max = 3) {
        if (nivel > max) return "";

        let nombre = nodo.nodeName.toLowerCase();
        let html = `<div style="margin-left:${nivel*15}px">└─ ${nombre}</div>`;

        nodo.childNodes.forEach(h => {
          html += crearArbol(h, nivel+1, max);
        });

        return html;
      }

      // ===== GENERAR ÁRBOL =====
      const arbolDOM = crearArbol(doc.body,0,3);

      // 👉 PRIMERA LÍNEA = NOMBRE DEL FICHERO
      document.getElementById(arbolId).innerHTML =
        `<b>Árbol DOM de: ${file}</b><br>${arbolDOM}`;

      // ===== PRODUCTOS =====
      const imgs = doc.querySelectorAll("img");
      let productos = [];

      imgs.forEach(img => {

        let src = null;

        if (img.src && img.src.includes("m.media-amazon.com")) src = img.src;
        if (!src && img.dataset?.src) src = img.dataset.src;

        if (!src && img.getAttribute("data-a-dynamic-image")) {
          try {
            const json = JSON.parse(img.getAttribute("data-a-dynamic-image"));
            src = Object.keys(json)[0];
          } catch {}
        }

        if (!src) return;
        if (src.includes("video")) return;

        let nombre =
          img.alt?.trim() ||
          img.closest("a")?.textContent.trim() ||
          "Producto Amazon";

        productos.push({ id: productos.length+1, nombre, img: src });

      });

      // quitar duplicados
      productos = productos.filter((p,i,a)=>a.findIndex(x=>x.img===p.img)===i);

      // JSON sin imágenes
      window.datosAmazonIntro = productos.map(p=>({id:p.id,nombre:p.nombre}));

      // ===== SALIDA =====
      let htmlOut = `
      <h3>Amazon Intro</h3>
      <p><b>Total nodos:</b> ${totalNodos}</p>
      <p><b>Productos detectados:</b> ${productos.length}</p>

      <button onclick="descargarJSONAmazonIntro()"
      style="background:#4CAF50;color:white;padding:8px;border:none;cursor:pointer">
      💾 Guardar JSON
      </button>

      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;">
      `;

      productos.forEach(p=>{
        htmlOut += `
        <div style="border:1px solid #ccc;padding:8px;width:170px;text-align:center">
          <img src="${p.img}" style="width:140px;height:140px;object-fit:contain">
          <div style="font-size:12px">${p.nombre}</div>
        </div>`;
      });

      htmlOut += `</div>`;
      document.getElementById(outputId).innerHTML = htmlOut;

    })
    .catch(err=>{
      console.error(err);
      document.getElementById(outputId).innerHTML="Error cargando HTML";
    });
}

// ===== FUNCIÓN PARA GUARDAR EL JSON EXACTAMENTE COMO TXT =====
function descargarJSONAmazonIntro() {
  if (!window.datosAmazonIntro || window.datosAmazonIntro.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }
  const dataStr = JSON.stringify(window.datosAmazonIntro, null, 2);
  const blob = new Blob([dataStr], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "Amazon_General_json.txt";
  a.click();
  a.remove();
}