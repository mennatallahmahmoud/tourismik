// Menu

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");
const closeMenu = document.getElementById("closeMenu");

function openMenu() {
  mobileMenu.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
}

function closeMenuFn() {
  mobileMenu.classList.add("translate-x-full");
  overlay.classList.add("hidden");
}

menuBtn.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeMenuFn);
overlay.addEventListener("click", closeMenuFn);

// Search Section

const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(btn => btn.classList.remove("active-tab"));

    contents.forEach(content => {
      content.classList.add("hidden");
      content.classList.remove("active-content");
    });

    tab.classList.add("active-tab");

    const target = document.getElementById(tab.dataset.tab);

    target.classList.remove("hidden");
    target.classList.add("active-content");
  });
});

// Slider

const swiper = new Swiper(".heroSwiper", {
  loop: true,
  spaceBetween: 20,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  effect: "fade",
});

const destSwiper = new Swiper(".destSwiper", {
  slidesPerView: "auto",
  spaceBetween: 20,
  loop: true,
  speed: 700,
  grabCursor: true,
  pagination: {
    el: ".dest-pagination",
    clickable: true,
  },
});

// Statistics

const counters = document.querySelectorAll(".count");

function formatNumber(value) {
  if (value >= 1000) {
    return "+" + (value / 1000).toFixed(1) + "K";
  } else {
    return "+" + value;
  }
}

function runCounter(counter) {
  const target = +counter.getAttribute("data-target");
  let current = 0;

  const update = () => {
    const increment = target / 100;
    current += increment;

    if (current < target) {
      counter.innerText = formatNumber(Math.floor(current));
      requestAnimationFrame(update);
    } else {
      counter.innerText = formatNumber(target);
    }
  };

  update();
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      runCounter(counter);
      observer.unobserve(counter);
    }
  });
}, {
  threshold: 0.5
});

counters.forEach(counter => {
  observer.observe(counter);
});

// Gallery

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");
  const bar = document.getElementById("bar");
  const thumb = document.getElementById("thumb");

  const slides = document.querySelectorAll(".slide");

  const slideWidth = document.querySelector(".slide").offsetWidth + 20;
  const totalOriginal = 5;

  let offset = 0;
  let velocity = 0;

  let isDragging = false;
  let startX = 0;
  let moved = false;

  let isPaused = false;
  let draggingBar = false;

  function animate() {
    if (!isDragging && !isPaused) {
      velocity *= 0.95;
      offset += 0.6 + velocity;
    }

    const loopWidth = totalOriginal * slideWidth;

    if (offset >= loopWidth) offset = 0;
    if (offset < 0) offset = loopWidth;

    slider.style.transform = `translateX(${-offset}px)`;

    syncThumb();

    requestAnimationFrame(animate);
  }

  animate();

  slider.addEventListener("mouseenter", () => (isPaused = true));
  slider.addEventListener("mouseleave", () => (isPaused = false));

  slider.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
    moved = false;
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;

    if (Math.abs(dx) > 6) {
      moved = true;
    }

    offset -= dx;
    velocity = dx * 0.2;

    startX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  function syncThumb() {
    const loopWidth = totalOriginal * slideWidth;
    const percent = offset / loopWidth;
    const maxMove = bar.offsetWidth - thumb.offsetWidth;

    thumb.style.transform = `translateX(${percent * maxMove}px)`;
  }

  bar.addEventListener("mousedown", e => {
    draggingBar = true;
    moveBar(e);
  });

  window.addEventListener("mousemove", e => {
    if (draggingBar) moveBar(e);
  });

  window.addEventListener("mouseup", () => {
    draggingBar = false;
  });

  function moveBar(e) {
    const rect = bar.getBoundingClientRect();

    let x = e.clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percent = x / rect.width;

    const loopWidth = totalOriginal * slideWidth;

    offset = percent * loopWidth;

    syncThumb();
  }

  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const closeModal = document.getElementById("closeModal");

  slider.addEventListener("click", e => {
    const img = e.target.closest(".slide img");
    if (!img) return;

    if (moved) {
      moved = false;
      return;
    }

    console.log("MODAL OPENED");

    modal.style.display = "flex";
    modalImg.src = img.src;
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Testimonails

const users = document.querySelectorAll(".user");

const mainImage = document.getElementById("mainImage");

const personName = document.getElementById("personName");
const personRole = document.getElementById("personRole");
const personText = document.getElementById("personText");

const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

function changeTestimonial(user) {
  users.forEach(u => u.classList.remove("active"));

  user.classList.add("active");

  mainImage.style.opacity = 0;

  setTimeout(() => {
    mainImage.src = user.dataset.img;

    personName.textContent = user.dataset.name;
    personRole.textContent = user.dataset.role;
    personText.textContent = user.dataset.text;

    mainImage.style.opacity = 1;
  }, 200);
}

users.forEach(user => {
  user.addEventListener("click", () => {
    currentIndex = [...users].indexOf(user);
    changeTestimonial(user);
  });
});

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= users.length) {
    currentIndex = 0;
  }

  changeTestimonial(users[currentIndex]);
});

prevBtn.addEventListener("click", () => {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = users.length - 1;
  }

  changeTestimonial(users[currentIndex]);
});

let currentIndex = 0;

function autoSlide() {
  currentIndex++;

  if (currentIndex >= users.length) {
    currentIndex = 0;
  }

  changeTestimonial(users[currentIndex]);
}

setInterval(autoSlide, 3500);

// Cursor

const cursor = document.querySelector(".cursor-follower");

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function cursorAnimate() {
  currentX += (mouseX - currentX) * 0.15;
  currentY += (mouseY - currentY) * 0.15;

  cursor.style.left = currentX + "px";
  cursor.style.top = currentY + "px";

  requestAnimationFrame(cursorAnimate);
}

cursorAnimate();

// Scroll To Top Btn

const btn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Copyright

document.getElementById("copyright-year").textContent = new Date().getFullYear()