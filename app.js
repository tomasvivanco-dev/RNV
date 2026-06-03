/* =========================================================
   Casos de corrupción política · Chile
   Vanilla JS. Sin dependencias.
   ========================================================= */

(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const state = {
    casos: [],
    filtro: 'todos',
    busqueda: '',
    orden: 'anio-desc',
  };

  // Etiquetas legibles por sector
  const SECTOR_LABEL = {
    derecha: 'Derecha',
    centroizquierda: 'Centroizquierda',
    izquierda: 'Izquierda',
    transversal: 'Transversal',
    institucional: 'Institucional',
  };

  // Util: escape HTML
  const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Fecha en cabecera (formato editorial)
  function setFechaActual() {
    const f = new Date();
    const opt = { day: '2-digit', month: 'long', year: 'numeric' };
    $('#fechaActual').textContent = f.toLocaleDateString('es-CL', opt);
  }

  // Cargar datos
  async function cargarCasos() {
    try {
      const res = await fetch('casos.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('No se pudo cargar casos.json');
      state.casos = await res.json();
      renderStats();
      render();
    } catch (err) {
      console.error(err);
      $('#casos').innerHTML = `
        <li class="caso">
          <p class="caso__resumen">
            No se pudieron cargar los datos. Si abriste el archivo
            <code>index.html</code> directamente (file://), el navegador
            bloquea fetch local. Levantá un servidor estático:
            <br><br>
            <code>python3 -m http.server</code> &nbsp;o&nbsp;
            <code>npx serve</code>
          </p>
        </li>`;
    }
  }

  // Estadísticas de cabecera
  function renderStats() {
    const total = state.casos.length;
    const anios = state.casos.map(c => c.anio);
    const rango = anios.length ? `${Math.min(...anios)}–${Math.max(...anios)}` : '—';
    const partidos = new Set();
    state.casos.forEach(c => (c.partidos || []).forEach(p => partidos.add(p)));

    $('#stats').innerHTML = `
      <div class="stat">
        <span class="stat__num">${total}</span>
        <span class="stat__lbl">Casos registrados</span>
      </div>
      <div class="stat">
        <span class="stat__num">${rango}</span>
        <span class="stat__lbl">Periodo</span>
      </div>
      <div class="stat">
        <span class="stat__num">${partidos.size}</span>
        <span class="stat__lbl">Partidos / colectividades</span>
      </div>
    `;
  }

  // Filtrar + ordenar
  function procesar() {
    let lista = [...state.casos];

    if (state.filtro !== 'todos') {
      lista = lista.filter(c => c.sector === state.filtro);
    }

    if (state.busqueda) {
      const q = state.busqueda.toLowerCase().trim();
      lista = lista.filter(c => {
        const haystack = [
          c.nombre, c.resumen, c.tipo, c.estado,
          ...(c.partidos || []),
          ...(c.involucrados || []),
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }

    switch (state.orden) {
      case 'anio-asc':  lista.sort((a, b) => a.anio - b.anio); break;
      case 'nombre':    lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); break;
      default:          lista.sort((a, b) => b.anio - a.anio);
    }

    return lista;
  }

  // Render principal
  function render() {
    const lista = procesar();
    const cont = $('#casos');
    const empty = $('#empty');

    if (lista.length === 0) {
      cont.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    cont.innerHTML = lista.map(c => casoHTML(c)).join('');
  }

  // Plantilla de un caso
  function casoHTML(c) {
    const partidos = (c.partidos || []).map(p => `<span class="partido-tag">${esc(p)}</span>`).join('');
    const involucrados = (c.involucrados || []).join(', ');
    const sectorLabel = SECTOR_LABEL[c.sector] || c.sector || '—';

    return `
      <li class="caso" id="caso-${esc(c.id)}">
        <div class="caso__header">
          <div class="caso__anio">${esc(c.anio)}</div>
          <div class="caso__head-text">
            <span class="caso__num"></span>
            <h2 class="caso__nombre">${esc(c.nombre)}</h2>
            <p class="caso__tipo">${esc(c.tipo)}</p>
          </div>
        </div>

        <p class="caso__resumen">${esc(c.resumen)}</p>

        <div class="caso__meta">
          <div class="meta-row">
            <span class="meta-row__lbl">Sector</span>
            <span class="meta-row__val sector-badge">
              <span class="sector-dot" data-sector="${esc(c.sector)}"></span>
              ${esc(sectorLabel)}
            </span>
          </div>
          <div class="meta-row">
            <span class="meta-row__lbl">Partidos / colectividades</span>
            <span class="meta-row__val partidos">${partidos || '—'}</span>
          </div>
          <div class="meta-row">
            <span class="meta-row__lbl">Personas / actores</span>
            <span class="meta-row__val">${esc(involucrados) || '—'}</span>
          </div>
          <div class="meta-row">
            <span class="meta-row__lbl">Estado procesal</span>
            <span class="meta-row__val"><span class="estado-pill">${esc(c.estado)}</span></span>
          </div>
        </div>

        ${c.fuente ? `
          <p class="caso__fuente">
            <a href="${esc(c.fuente)}" target="_blank" rel="noopener">Fuente / más información</a>
          </p>` : ''}
      </li>
    `;
  }

  // Eventos
  function bindEvents() {
    $('#search').addEventListener('input', (e) => {
      state.busqueda = e.target.value;
      render();
    });

    $('#sort').addEventListener('change', (e) => {
      state.orden = e.target.value;
      render();
    });

    $$('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('.chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.filtro = chip.dataset.sector;
        render();
      });
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    setFechaActual();
    bindEvents();
    cargarCasos();
  });
})();
