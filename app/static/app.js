(() => {
  const logEl = document.getElementById('log');
  const buzzBtn = document.getElementById('buzz');
  const resetBtn = document.getElementById('reset');
  const playerEl = document.getElementById('player');
  const colorEl = document.getElementById('color');

  const ws = new WebSocket(`${location.origin.replace('http', 'ws')}/ws/buzz`);

  function log(message) {
    const time = new Date().toLocaleTimeString();
    logEl.textContent = `[${time}] ${message}\n` + logEl.textContent;
  }

  ws.onopen = () => log('Connected');
  ws.onclose = () => log('Disconnected');
  ws.onerror = (e) => log('Error: ' + (e?.message || 'unknown'));
  ws.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      if (data.type === 'buzz') {
        const { winner } = data;
        log(`WINNER: ${winner.player} (${winner.color})`);
        document.body.style.backgroundColor = winner.color;
      } else if (data.type === 'reset') {
        log('Reset received');
        document.body.style.backgroundColor = '';
      } else if (data.type === 'ignored') {
        log('Ignored: already won');
      } else if (data.type === 'error') {
        log('Server error: ' + data.message);
      }
    } catch (err) {
      log('Parse error: ' + String(err));
    }
  };

  buzzBtn.onclick = () => {
    ws.send(JSON.stringify({
      type: 'buzz',
      player: playerEl.value || 'anonymous',
      color: colorEl.value || '#ffcc00'
    }));
  };

  resetBtn.onclick = () => {
    ws.send(JSON.stringify({ type: 'reset' }));
  };
})();

