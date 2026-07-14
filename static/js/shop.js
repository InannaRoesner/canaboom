document.querySelectorAll('.buy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    btn.disabled = true;
    btn.textContent = 'Stripe…';
    try {
      const res = await fetch('/api/v1/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: id, player_id: 'web_player_1' }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.detail || 'Checkout fehlgeschlagen');
        btn.disabled = false;
        btn.textContent = 'Kaufen (Test)';
      }
    } catch (e) {
      alert('Fehler: ' + e.message);
      btn.disabled = false;
      btn.textContent = 'Kaufen (Test)';
    }
  });
});
