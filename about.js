// Keep complete content available without JavaScript or with reduced motion.
const steps = [...document.querySelectorAll('.terminal-step')];
const showAll = document.querySelector('#show-about');
const signoff = document.querySelector('.terminal-signoff');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (steps.length && showAll && signoff && !motionPreference.matches) {
  let timer;
  let stopped = false;
  const commands = steps.map(step => step.querySelector('.typed-command').textContent);
  steps.forEach(step => { step.hidden = true; });
  signoff.hidden = true;
  showAll.hidden = false;

  const revealAll = () => {
    stopped = true;
    clearTimeout(timer);
    steps.forEach((step, index) => {
      step.hidden = false;
      step.querySelector('.typed-command').textContent = commands[index];
      step.querySelector('ul').hidden = false;
    });
    signoff.hidden = false;
    showAll.hidden = true;
  };
  showAll.addEventListener('click', revealAll);
  motionPreference.addEventListener('change', revealAll);

  const revealStep = index => {
    if (stopped) return;
    if (index === steps.length) {
      signoff.hidden = false;
      showAll.hidden = true;
      return;
    }
    const step = steps[index];
    const command = step.querySelector('.typed-command');
    const output = step.querySelector('ul');
    step.hidden = false;
    output.hidden = true;
    command.textContent = '';
    let position = 0;
    const type = () => {
      if (stopped) return;
      command.textContent = commands[index].slice(0, ++position);
      if (position < commands[index].length) timer = setTimeout(type, 45);
      else {
        output.hidden = false;
        timer = setTimeout(() => revealStep(index + 1), 500);
      }
    };
    type();
  };
  revealStep(0);
}
