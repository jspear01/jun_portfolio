const root = document.documentElement;
const navigation = document.querySelector('.nav');

if (navigation) {
  const navLinks = document.createElement('div');
  navLinks.className = 'nav-links';

  const navigationItems = [...navigation.querySelectorAll('a, .nav-contact')];
  navigationItems.forEach(item => navLinks.append(item));

  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.type = 'button';
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = '<span></span><span></span><span></span>';

  let themeToggle = navigation.querySelector('.theme-toggle');
  if (!themeToggle) {
    themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.type = 'button';
    themeToggle.setAttribute('aria-label', 'Toggle color theme');
    navigation.append(themeToggle);
  }

  navigation.prepend(menuToggle);
  navigation.insertBefore(navLinks, themeToggle);

  const setMenuOpen = isOpen => {
    navLinks.classList.toggle('is-open', isOpen);
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} navigation menu`);
  };

  menuToggle.addEventListener('click', () => setMenuOpen(!navLinks.classList.contains('is-open')));
  navLinks.addEventListener('click', event => {
    if (event.target.closest('a, .nav-contact')) setMenuOpen(false);
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target)) setMenuOpen(false);
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', event => {
    if (event.matches) setMenuOpen(false);
  });

  const applyTheme = isDark => {
    root.dataset.theme = isDark ? 'dark' : 'light';
    themeToggle.textContent = isDark ? '☾' : '☼';
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  };

  applyTheme(localStorage.getItem('theme') === 'dark');
  themeToggle.addEventListener('click', () => {
    const isDark = root.dataset.theme !== 'dark';
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

const greeting = document.querySelector('#typed-greeting');
if (greeting) {
  const phrases = ['a Data scientist', 'an Analytical thinker', 'a Pioneer'];
  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  const typeGreeting = () => {
    const phrase = phrases[phraseIndex];

    characterIndex += isDeleting ? -1 : 1;
    greeting.textContent = phrase.slice(0, characterIndex);

    if (!isDeleting && characterIndex === phrase.length) {
      isDeleting = true;
      window.setTimeout(typeGreeting, 1650);
      return;
    }

    if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      window.setTimeout(typeGreeting, 250);
      return;
    }

    window.setTimeout(typeGreeting, isDeleting ? 42 : 72);
  };

  greeting.textContent = '';
  typeGreeting();
}

const openModal = id => document.querySelector(id)?.classList.add('is-open');
const closeAllModals = () => document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('is-open'));
// Shared contact menu, available from every page.
const contactIcons = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  linkedin: '<path d="M5 9v11M5 5v.1M10 20V9h5v2c2-3 6-2 6 2v7M15 12v8"/>',
  phone: '<path d="M8 3H4a1 1 0 0 0-1 1c0 9 8 17 17 17a1 1 0 0 0 1-1v-4l-5-2-2 2a14 14 0 0 1-6-6l2-2-2-5Z"/>'
};
const contactMethods = [
  { icon: 'email', title: 'Email', detail: 'junchangsong0@gmail.com', href: 'mailto:junchangsong0@gmail.com', newTab: true },
  { icon: 'linkedin', title: 'LinkedIn', detail: 'Connect professionally', href: 'https://www.linkedin.com/in/junchangsong', newTab: true },
  { icon: 'phone', title: 'Phone', detail: '770-670-1138', href: 'tel:+17706701138' }
];
const contactCards = contactMethods.map(method => `
  <a class="contact-method-card" href="${method.href}" ${method.newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contactIcons[method.icon]}</svg>
    <strong>${method.title}</strong><span>${method.detail}</span>
  </a>`).join('');
document.querySelector('.contact-page-options')?.insertAdjacentHTML('beforeend', contactCards);
const contactDialog = document.createElement('dialog');
contactDialog.className = 'contact-dialog';
contactDialog.setAttribute('aria-labelledby', 'contact-dialog-title');
contactDialog.innerHTML = `<button class="close-contact-dialog" type="button" aria-label="Close contact menu" autofocus>×</button>
  <h2 id="contact-dialog-title">Get in touch</h2><div class="contact-methods">${contactCards}</div>`;
document.body.append(contactDialog);
document.querySelectorAll('.contact-trigger, .nav-contact, .nav a[href="contact.html"]').forEach(trigger => {
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.addEventListener('click', event => {
    event.preventDefault();
    contactDialog.showModal();
  });
});
contactDialog.querySelector('.close-contact-dialog').addEventListener('click', () => contactDialog.close());
contactDialog.addEventListener('click', event => {
  const bounds = contactDialog.getBoundingClientRect();
  if (event.target === contactDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) contactDialog.close();
});
document.querySelector('.portrait-button')?.addEventListener('click', () => openModal('#photo-modal'));
const assistantButton = document.querySelector('.assistant-prompt');
const assistantMessage = document.querySelector('#assistant-message');
if (assistantButton && assistantMessage) {
  assistantButton.addEventListener('click', () => {
    assistantMessage.hidden = !assistantMessage.hidden;
    assistantButton.setAttribute('aria-expanded', String(!assistantMessage.hidden));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      assistantMessage.hidden = true;
      assistantButton.setAttribute('aria-expanded', 'false');
    }
  });
}
document.querySelectorAll('.close-modal').forEach(button => button.addEventListener('click', closeAllModals));
document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeAllModals(); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAllModals(); });
document.querySelectorAll('.nav a').forEach(link => {
  if (link.getAttribute('href') === location.pathname.split('/').pop() || (location.pathname.endsWith('/') && link.getAttribute('href') === 'index.html')) link.classList.add('active');
});
