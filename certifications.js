// certifications.js
document.addEventListener('DOMContentLoaded', () => {
  const certificationsData = [
    {
      title: "Azure Fundamentals (AZ-900)",
      issuer: "Microsoft",
      logo: "assets/azure_fund.png",
      credentialUrl: "https://learn.microsoft.com/api/credentials/share/en-us/JunSong-5041/786AEB5C9A3CF009?sharingId=45F5A439DD34DA79"
    },
    {
      title: "Machine Learning Specialization",
      issuer: "DeepLearning.AI",
      logo: "assets/deepLearning.jpeg",
      credentialUrl: "https://coursera.org/share/9d072142a12734248b81b4aaf64e20a6"
    },
    {
      title: "Google Data Analytics Professional Certificate",
      issuer: "Google",
      logo: "assets/google_logo_v2.png",
      credentialUrl: "https://coursera.org/share/6954042ae7c1941480899e8a50f0ad79"
    },
    {
      title: "IBM Data Science Professional Certificate",
      issuer: "IBM",
      logo: "assets/IBM_LOGO.png",
      credentialUrl: "https://coursera.org/share/33d001c7b204eb3d05c72447b0ecef38"
    },
    {
      title: "IBM Data Analyst Professional Certificate",
      issuer: "IBM",
      logo: "assets/IBM_LOGO.png",
      credentialUrl: "https://coursera.org/share/0ccbc6368cf1e00b3603ab1f33f13eef"
    }
  ];

  const track = document.querySelector('.certifications-track');
  const navContainer = document.querySelector('.carousel-navigation');

  if (!track) return;

  let currentIndex = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  const dragThreshold = 40;

  // Build Cards
  track.innerHTML = '';
  if (navContainer) navContainer.innerHTML = '';

  certificationsData.forEach((cert, index) => {
    const card = document.createElement('article');
    card.className = 'certification-card';
    card.setAttribute('data-index', String(index));
    card.setAttribute('tabindex', index === 0 ? '0' : '-1');
    card.setAttribute('aria-label', `${cert.title} by ${cert.issuer}`);

    card.innerHTML = `
      <div class="cert-logo">
        <img src="${cert.logo}" alt="${cert.issuer} logo" width="90" height="90" draggable="false" loading="lazy">
      </div>
      <h3>${cert.title}</h3>
      <p class="cert-issuer">${cert.issuer}</p>
      <a class="view-credential" href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer">
        View Credential <span aria-hidden="true">↗</span>
      </a>
    `;

    // Click behavior
    card.addEventListener('click', (e) => {
      if (e.target.closest('.view-credential')) return;
      if (currentIndex !== index) {
        currentIndex = index;
        updateCarousel();
      }
    });

    track.appendChild(card);

    // Build Dots
    if (navContainer) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to ${cert.title}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      navContainer.appendChild(dot);
    }
  });

  const cards = track.querySelectorAll('.certification-card');
  const dots = navContainer ? navContainer.querySelectorAll('.nav-dot') : [];

  function getPosition(index, current) {
    const total = certificationsData.length;
    const diff = (index - current + total) % total;

    if (diff === 0) return 'center';
    if (diff === 1 || diff === -(total - 1)) return 'right';
    if (diff === total - 1 || diff === -1) return 'left';
    if (diff > 1 && diff <= Math.floor(total / 2)) return 'far-right';
    return 'far-left';
  }

  function updateCarousel() {
    cards.forEach((card, index) => {
      const pos = getPosition(index, currentIndex);
      card.setAttribute('data-position', pos);
      card.setAttribute('aria-hidden', pos !== 'center' ? 'true' : 'false');
      card.setAttribute('tabindex', pos === 'center' ? '0' : '-1');
      card.querySelector('.view-credential').tabIndex = pos === 'center' ? 0 : -1;
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
      dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });
    document.querySelector('.carousel-status').textContent = `${currentIndex + 1} of ${cards.length}`;
  }

  document.querySelectorAll('.carousel-arrow').forEach(button => {
    button.addEventListener('click', () => {
      currentIndex = (currentIndex + Number(button.dataset.step) + cards.length) % cards.length;
      updateCarousel();
    });
  });

  // Pointer / Touch Handlers
  function onDragStart(e) {
    if (e.target.closest('.view-credential')) return;
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    startY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
  }

  function onDragEnd(e) {
    if (!isDragging) return;
    const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].pageX : startX);
    const diffX = endX - startX;

    if (Math.abs(diffX) > dragThreshold) {
      if (diffX > 0) {
        currentIndex = (currentIndex - 1 + certificationsData.length) % certificationsData.length;
      } else {
        currentIndex = (currentIndex + 1) % certificationsData.length;
      }
      updateCarousel();
    }

    isDragging = false;
  }

  track.addEventListener('mousedown', onDragStart);
  window.addEventListener('mouseup', onDragEnd);

  track.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchend', onDragEnd, { passive: true });

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + certificationsData.length) % certificationsData.length;
      updateCarousel();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % certificationsData.length;
      updateCarousel();
    } else if (e.key === 'Home') {
      currentIndex = 0;
      updateCarousel();
    } else if (e.key === 'End') {
      currentIndex = certificationsData.length - 1;
      updateCarousel();
    }
  });

  // Initial update
  updateCarousel();
});
