async function loadTutorial() {
  const res = await fetch('/api/v1/ai/tutorial?player_name=Commander');
  const lines = await res.json();
  const box = document.getElementById('dialog-lines');
  if (!box) return;
  box.innerHTML = '';
  for (const line of lines) {
    const el = document.createElement('div');
    el.className = 'line';
    el.innerHTML = `<strong>${line.speaker}</strong>: ${line.line}`;
    if (line.source) el.title = `Quelle: ${line.source}`;
    box.appendChild(el);
  }
}

function renderWorld() {
  const w = window.CANABOOM || {};
  const pEl = document.getElementById('planets');
  if (pEl && w.planets) {
    pEl.innerHTML = w.planets.map(p => `
      <div class="card">
        <strong>${p.name}</strong>
        <p style="color:#8b9dc3;font-size:.85rem">${p.description}</p>
        <p class="deco">HQ ${p.unlock_hq_level}+ · ${p.theme}</p>
      </div>
    `).join('');
  }
}

document.getElementById('btn-start')?.addEventListener('click', loadTutorial);
renderWorld();
