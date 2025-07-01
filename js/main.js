// === Sidebar Toggle with Memory ===
const toggleBtn = document.getElementById('toggleMenuBtn');
const menu = document.getElementById('courseMenu');
const allItems = menu.querySelectorAll("ul li");

function updateMenuState(isCollapsed) {
  allItems.forEach((li, index) => {
    li.style.display = (isCollapsed && index >= 4) ? "none" : "block";
  });
  toggleBtn.textContent = isCollapsed ? '☰' : '☰ Course Menu';
  localStorage.setItem('menuState', isCollapsed ? 'closed' : 'open');
}

if (toggleBtn && menu) {
  const savedState = localStorage.getItem('menuState');
  const isCollapsed = savedState === 'closed';
  if (isCollapsed) menu.classList.add('collapsed');
  updateMenuState(isCollapsed);

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('collapsed');
    updateMenuState(menu.classList.contains('collapsed'));
  });
}


// === Quiz Sub-Menu Toggle ===
const quizLink = document.querySelector('.quiz-link');
if (quizLink) {
  quizLink.addEventListener('click', (e) => {
    e.preventDefault();
    const subMenu = quizLink.nextElementSibling;
    if (subMenu && subMenu.classList.contains('sub-menu')) {
      subMenu.classList.toggle('active');
    }
  });
}



document.addEventListener('click', (e) => {
  if (!e.target.closest('.quiz-link') && !e.target.closest('.sub-menu')) {
    const subMenu = document.querySelector('.sub-menu.active');
    if (subMenu) subMenu.classList.remove('active');
  }
});

// === Show Only Selected Section ===
const menuLinks = document.querySelectorAll('.menu-link');
const sections = document.querySelectorAll('.page-section');

function showSection(targetId) {
  sections.forEach(section => {
    section.style.display = section.id === targetId ? 'block' : 'none';
  });
  menuLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-target') === targetId);
  });
  history.replaceState(null, "", "#" + targetId); // update URL hash
}

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-target');
    showSection(targetId);
  });
});

// === Map Initialization ===
const mapElement = document.getElementById('map');
if (mapElement) {
  const map = L.map('map').setView([26.30, 50.05], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const gyms = [
    { name: "Power Hall Sports gym", coords: [26.2796, 50.0549] },
    { name: "Gymnation Al Khobar Men's", coords: [26.3248, 50.0609] },
    { name: "FLEX STUDIO gym", coords: [26.3005, 50.0345] }
  ];

  gyms.forEach(gym => {
    L.marker(gym.coords).addTo(map).bindPopup(gym.name);
  });

  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const value = searchBar.value.toLowerCase();
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          const name = layer.getPopup().getContent().toLowerCase();
          layer.setOpacity(name.includes(value) ? 1 : 0.2);
        }
      });
    });
  }
}

// === Quiz Functionality ===
const quizForms = document.querySelectorAll('.quiz-form');
quizForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedback = form.querySelector('.quiz-feedback');
    const nextBtn = form.querySelector('.continue-btn');
    const selected = form.querySelector('input[type="radio"]:checked');
    const name = form.querySelector('input[type="radio"]').name;

    // correct answers
    const correctAnswers = {
      q1: "b",
      q2: "c",
      q3: "b"
    };

    if (!selected) {
      feedback.textContent = "❗Please select an answer before submitting.";
      feedback.style.color = "red";
      nextBtn.style.display = "none";
      return;
    }

    if (selected.value === correctAnswers[name]) {
      feedback.textContent = "✅ Correct! Well done!";
      feedback.style.color = "green";
      nextBtn.style.display = "inline-block";
    } else {
      feedback.textContent = "❌ Incorrect. Try again!";
      feedback.style.color = "red";
      nextBtn.style.display = "none";
    }
  });

  // continue button logic
  const continueBtn = form.querySelector('.continue-btn');
  continueBtn.addEventListener('click', () => {
    const nextSection = form.getAttribute('data-next');
    if (nextSection) showSection(nextSection);
  });
});

// === Initial Section View ===
document.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace("#", "") || "welcome";
  showSection(hash);
});

// === Global Continue Buttons ===
const globalContinueBtns = document.querySelectorAll('.continue-btn.global');
globalContinueBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('data-next');
    if (next) showSection(next);
  });
});
