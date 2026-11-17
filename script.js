async function updateRepoData(repoName, starsId, verId, statusId) {
  const starsEl = document.getElementById(starsId);
  const verEl = document.getElementById(verId);
  const statusEl = document.getElementById(statusId);

  try {
    // Запрос данных о репозитории
    const res = await fetch(`https://api.github.com/repos/VEKX-CODE/${repoName}`);
    
    // Если репозиторий приватный (404) или заблокирован
    if (!res.ok) {
      if (starsEl) starsEl.textContent = 'Stars: private';
      if (verEl) verEl.textContent = 'Ver: unreleased';
      if (statusEl) statusEl.textContent = 'Status: In Dev';
      const descEl = document.getElementById(`desc-text-${repoName}`);
      if (descEl) descEl.textContent = 'Project in active development. Open on GitHub to learn more.';
      return;
    }

    const data = await res.json();
    if (starsEl) starsEl.textContent = `Stars: ${data.stargazers_count}`;
    if (statusEl) statusEl.textContent = data.archived ? 'Status: Archived' : 'Status: Active';

    // Подтягиваем описание с GitHub
    const descEl = document.getElementById(`desc-text-${repoName}`);
    if (descEl) {
      descEl.textContent = data.description || 'No description provided on GitHub.';
    }

    // Запрос релиза
    const relRes = await fetch(`https://api.github.com/repos/VEKX-CODE/${repoName}/releases/latest`);
    if (relRes.ok) {
      const relData = await relRes.json();
      if (verEl) verEl.textContent = `Ver: ${relData.tag_name || relData.name}`;
    } else {
      // Проверяем теги, если нет релизов
      const tagRes = await fetch(`https://api.github.com/repos/VEKX-CODE/${repoName}/tags`);
      if (tagRes.ok) {
        const tags = await tagRes.json();
        if (tags.length > 0) {
          if (verEl) verEl.textContent = `Ver: ${tags[0].name}`;
          return;
        }
      }
      if (verEl) verEl.textContent = 'Ver: v0.0.1';
    }
  } catch (err) {
    console.error(`Ошибка при загрузке ${repoName}:`, err);
  }
}
// Открытие скриншотов
updateRepoData('VFIX', 'STARS_VFIX', 'VER_VFIX', 'STATUS_VFIX');
updateRepoData('VUIX', 'STARS_VUIX', 'VER_VUIX', 'STATUS_VUIX');

const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeBtn = document.querySelector('.modal-close');

document.querySelectorAll('.capsule-side img').forEach((img) => {
  img.style.cursor = 'pointer';

  img.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.add('active');
    modalImg.src = img.src;
    const label = img.parentElement.querySelector('span');
    modalCaption.textContent = label ? label.textContent : '';
  });
});

// Закрытие по крестику
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

// Закрытие по клику в любую темную область вокруг картинки
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Закрытие по клавише Escape на клавиатуре
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
  }
});
// Логика двухэтажного скролла внутри капсулы
const slider = document.querySelector('.capsule-slider');
const toDescBtn = document.getElementById('btn-to-desc');
const toPrevBtn = document.getElementById('btn-to-preview');
const capsule = document.getElementById('capsule-VFIX');

// Клик по DESCRIPTION ▼ -> едем на 2-й этаж
if (toDescBtn && slider) {
  toDescBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    slider.classList.add('show-desc');
  });
}

// Клик по ▲ BACK -> возвращаемся на 1-й этаж к логотипу
if (toPrevBtn && slider) {
  toPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    slider.classList.remove('show-desc');
  });
}

// Прокрутка колёсиком мыши СТРОГО внутри капсулы (страница намертво стоит на месте!)
if (capsule && slider) {
  capsule.addEventListener('wheel', (e) => {
    // ЗАПРЕЩАЕМ браузеру скроллить саму страницу
    e.preventDefault();

    // Колесо вниз -> едем на 2-й этаж к описанию
    if (e.deltaY > 0 && !slider.classList.contains('show-desc')) {
      slider.classList.add('show-desc');
    }
    // Колесо вверх -> возвращаем 1-й этаж со скриншотами
    else if (e.deltaY < 0 && slider.classList.contains('show-desc')) {
      slider.classList.remove('show-desc');
    }
  }, { passive: false });
}