/* Achievement carousel: layered 2D loop, without rotating the photos themselves. */
(() => {
  const gallery = document.querySelector('[data-achievement-gallery]');
  const viewport = gallery?.querySelector('[data-achievement-viewport]');
  const track = gallery?.querySelector('[data-achievement-track]');
  if (!gallery || !viewport || !track) return;

  const originals = [...track.children];
  const count = originals.length;
  let current = count;
  let timer;
  let fallbackTimer;
  let moving = false;

  const clone = (slide, index) => {
    const copy = slide.cloneNode(true);
    copy.dataset.logicalIndex = String(index);
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    return copy;
  };
  const slides = [
    ...originals.map((slide, index) => clone(slide, index)),
    ...originals,
    ...originals.map((slide, index) => clone(slide, index))
  ];
  slides.forEach((slide, index) => { slide.dataset.logicalIndex = String(index % count); });
  track.replaceChildren(...slides);

  function position(animate = true) {
    slides.forEach((slide, index) => {
      if (!animate) slide.style.transition = 'none';
      slide.classList.toggle('is-active', index === current);
      slide.classList.toggle('is-prev', index === current - 1);
      slide.classList.toggle('is-next', index === current + 1);
      if (index === current) slide.setAttribute('aria-current', 'true');
      else slide.removeAttribute('aria-current');
    });
    if (!animate) requestAnimationFrame(() => slides.forEach(slide => { slide.style.transition = ''; }));
  }

  function schedule() {
    clearTimeout(timer);
    if (!document.hidden && !moving) timer = setTimeout(() => move(1), 1500);
  }

  function normalize() {
    if (current >= count * 2) current -= count;
    if (current < count) current += count;
    position(false);
  }

  function finish() {
    if (!moving) return;
    clearTimeout(fallbackTimer);
    normalize();
    moving = false;
    schedule();
  }

  function move(direction) {
    if (moving) return;
    clearTimeout(timer);
    moving = true;
    current += direction;
    position(true);
    fallbackTimer = setTimeout(finish, 1000);
  }

  track.addEventListener('transitionend', event => {
    if (event.target === slides[current] && event.propertyName === 'transform') finish();
  });
  gallery.querySelector('[data-achievement-prev]')?.addEventListener('click', () => move(-1));
  gallery.querySelector('[data-achievement-next]')?.addEventListener('click', () => move(1));
  track.addEventListener('click', event => {
    const card = event.target.closest('.achievement-card');
    if (!card || card === slides[current]) return;
    const active = ((current - count) % count + count) % count;
    const target = Number(card.dataset.logicalIndex);
    const ahead = (target - active + count) % count;
    move(ahead <= count / 2 ? 1 : -1);
  });
  document.addEventListener('visibilitychange', schedule);
  position(false);
  schedule();
})();
