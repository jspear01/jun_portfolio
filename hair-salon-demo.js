const walkthrough = document.querySelector('#salon-walkthrough');
const walkthroughToggle = document.querySelector('#walkthrough-toggle');
if (walkthrough && walkthroughToggle) {
  walkthroughToggle.hidden = false;
  walkthroughToggle.addEventListener('click', () => {
    const playing = walkthroughToggle.getAttribute('aria-pressed') !== 'true';
    walkthrough.src = playing
      ? 'assets/hair-salon-demo/portfolio_walkthrough.webp'
      : 'assets/hair-salon-demo/03_staff_dashboard.png';
    walkthrough.alt = playing
      ? 'Animated walkthrough of the Hair Salon Management App.'
      : 'Hair salon app staff calendar. Play the walkthrough to see the app flow.';
    walkthroughToggle.setAttribute('aria-pressed', String(playing));
    walkthroughToggle.textContent = playing ? 'Stop walkthrough' : 'Play walkthrough';
  });
}
