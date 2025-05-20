const allCards = document.querySelectorAll('.card');
    const bottomCards = document.querySelectorAll('.snap-back');
    const topCards = document.querySelectorAll('.active-card');

    // Position bottom (snap-back) cards
    bottomCards.forEach((card, idx) => {
      const total = bottomCards.length;
      const spacing = 200;
      const cardWidth = card.offsetWidth;
      const groupWidth = spacing * (total - 1) + cardWidth;
      const startX = window.innerWidth / 2 - groupWidth / 2;
      const y = window.innerHeight - 50 - card.offsetHeight;

      const originalLeft = startX + idx * spacing;
      const originalTop = y;

      card.style.left = `${originalLeft}px`;
      card.style.top = `${originalTop}px`;

      setupDrag(card, originalLeft, originalTop, true);
    });

    // Position top (active) cards vertically above center
//     topCards.forEach((card, idx) => {
//   const spacing = 240;
//   const x = window.innerWidth / 2 - card.offsetWidth / 2;
//   const startY = window.innerHeight / 2 - 200;
//   const y = startY + idx * spacing;

//   card.style.left = `${x}px`;
//   card.style.top = `${y}px`;

//   // Removed setupDrag to keep them fixed
// });


    function setupDrag(card, originalLeft, originalTop, shouldSnapBack) {
      let offsetX, offsetY, isDragging = false;

      card.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - card.offsetLeft;
        offsetY = e.clientY - card.offsetTop;
        card.setPointerCapture(e.pointerId);
        card.style.cursor = 'grabbing';
        card.classList.remove('snap-back');
      });

      card.addEventListener('pointermove', e => {
        if (!isDragging) return;
        card.style.left = `${e.clientX - offsetX}px`;
        card.style.top  = `${e.clientY - offsetY}px`;
      });

      card.addEventListener('pointerup', e => {
        if (e.button !== 0 || !isDragging) return;
        isDragging = false;
        card.releasePointerCapture(e.pointerId);
        card.style.cursor = 'grab';

        if (shouldSnapBack) {
          card.classList.add('snap-back');
          card.style.left = `${originalLeft}px`;
          card.style.top = `${originalTop}px`;
        }
      });
    }