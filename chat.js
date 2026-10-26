(() => {
  const dialog = document.querySelector('#jun-chat');
  const input = document.querySelector('#chat-question');
  const form = document.querySelector('#chat-form');
  const status = document.querySelector('#chat-status');
  const log = document.querySelector('#chat-messages');
  const ai = document.querySelector('#chat-ai');
  let busy = false;
  const add = (text, who = 'assistant') => {
    const p = document.createElement('p');
    p.className = `chat-message chat-${who}`;
    p.textContent = `${who === 'user' ? 'You' : 'Jun’s assistant'}: ${text}`;
    log.append(p);
    while (log.children.length > 30) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  };
  const normalize = text => text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  document.querySelector('.assistant-prompt').addEventListener('click', () => { dialog.showModal(); input.focus(); });
  document.querySelector('#chat-close').addEventListener('click', () => dialog.close());
  add('Hi! Choose a topic for an instant answer, or ask a question about Jun.');
  for (const item of JUN_PROFILE) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = item.topic;
    button.addEventListener('click', () => { if (!busy) { add(item.question, 'user'); add(item.answer); } });
    document.querySelector('#chat-topics').append(button);
  }
  if (!window.JUN_CHAT_ENDPOINT) {
    ai.disabled = true;
    status.textContent = 'Instant answers are ready. AI connection is not configured yet.';
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;
    add(question, 'user'); input.value = '';
    const match = JUN_PROFILE.find(item => [item.question, ...item.aliases].some(q => normalize(q) === normalize(question)));
    if (match) { add(match.answer); return; }
    if (!ai.checked || !window.JUN_CHAT_ENDPOINT) {
      add('I don’t have a saved answer for that. Try a topic above' + (ai.disabled ? ', or contact Jun at junchangsong0@gmail.com.' : ', or enable AI and send your question again.'));
      return;
    }
    busy = true; form.querySelector('button').disabled = true;
    log.setAttribute('aria-busy', 'true'); status.textContent = 'Thinking…';
    try {
      const response = await fetch(window.JUN_CHAT_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }), signal: AbortSignal.timeout(20000)
      });
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Empty response');
      add(data.answer);
    } catch {
      add('AI is unavailable or its free allowance has been reached. Please try a topic above, try again later, or contact Jun at junchangsong0@gmail.com.');
    } finally {
      busy = false; form.querySelector('button').disabled = false;
      log.setAttribute('aria-busy', 'false'); status.textContent = '';
    }
  });
})();
