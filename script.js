// ==========================================
// 1. АВТОМАТИЧЕСКАЯ ПОДГРУЗКА ИЗ GITHUB API
// ==========================================
async function updateRepoData(repoName, starsId, verId, statusId, descId) {
  const starsEl = document.getElementById(starsId);
  const verEl = document.getElementById(verId);
  const statusEl = document.getElementById(statusId);
  const descEl = document.getElementById(descId);

  try {
    const res = await fetch(`https://api.github.com/repos/VEKX-CODE/${repoName}`);
    
    // Если лимит GitHub или ошибка сети
    if (!res.ok) {
      if (starsEl) starsEl.textContent = repoName === 'VFIX' ? 'Stars: ★ 2' : 'Stars: ★ 1';
      if (statusEl) statusEl.textContent = 'Status: Active';
      if (verEl) verEl.textContent = 'Ver: v1.0.0';
      if (descEl) {
        descEl.textContent = repoName === 'VUCX' 
          ? 'Web application unit converter engineered for swift metric and imperial transformations.' 
          : 'Utility and repair toolkit for seamless developer workflows.';
      }
      return;
    }

    const data = await res.json();
    if (starsEl) starsEl.textContent = `Stars: ★ ${data.stargazers_count}`;
    if (statusEl) statusEl.textContent = data.archived ? 'Status: Archived' : 'Status: Active';

    if (descEl) {
      descEl.textContent = data.description || 'No description provided on GitHub.';
    }

    // Релиз / Теги
    const relRes = await fetch(`https://api.github.com/repos/VEKX-CODE/${repoName}/releases/latest`);
    if (relRes.ok) {
      const relData = await relRes.json();
      if (verEl) verEl.textContent = `Ver: ${relData.tag_name || relData.name}`;
    } else {
      const tagRes = await fetch(`https://api.github.com/repos/VEKX-CODE/${repoName}/tags`);
      if (tagRes.ok) {
        const tags = await tagRes.json();
        if (tags.length > 0) {
          if (verEl) verEl.textContent = `Ver: ${tags[0].name}`;
          return;
        }
      }
      if (verEl) verEl.textContent = 'Ver: v1.0.0';
    }
  } catch (err) {
    console.error(`Ошибка при загрузке ${repoName}:`, err);
  }
}

// Запускаем подгрузку для VFIX и VUCX
updateRepoData('VFIX', 'STARS_VFIX', 'VER_VFIX', 'STATUS_VFIX', 'desc-text-VFIX');
updateRepoData('VUCX', 'STARS_VUCX', 'VER_VUCX', 'STATUS_VUCX', 'desc-text-VUCX');

// ==========================================
// 2. УПРАВЛЕНИЕ КАПСУЛАМИ (VFIX И VUCX)
// ==========================================
function setupCapsule(id) {
  const capsule = document.getElementById(`capsule-${id}`);
  if (!capsule) return;

  const slider = capsule.querySelector('.capsule-slider');
  const toDescBtn = document.getElementById(`btn-to-desc-${id}`);
  const toPrevBtn = document.getElementById(`btn-to-preview-${id}`);

  if (toDescBtn && slider) {
    toDescBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      slider.classList.add('show-desc');
    });
  }

  if (toPrevBtn && slider) {
    toPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      slider.classList.remove('show-desc');
    });
  }

  // Скролл колесиком внутри капсулы
  capsule.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0 && !slider.classList.contains('show-desc')) {
      slider.classList.add('show-desc');
    } else if (e.deltaY < 0 && slider.classList.contains('show-desc')) {
      slider.classList.remove('show-desc');
    }
  }, { passive: false });
}

setupCapsule('VFIX');
setupCapsule('VUCX');

// ==========================================
// 3. ЗУМ СКРИНШОТОВ (МОДАЛКА)
// ==========================================
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeBtn = document.querySelector('.modal-close');

document.querySelectorAll('.capsule-side img').forEach((img) => {
  img.style.cursor = 'pointer';

  img.addEventListener('click', (e) => {
    e.stopPropagation();
    if (modal && modalImg) {
      modal.classList.add('active');
      modalImg.src = img.src;
      modalCaption.textContent = img.alt || 'PROJECT PREVIEW';
    }
  });
});

if (closeBtn && modal) {
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    modal.classList.remove('active');
  }
});
