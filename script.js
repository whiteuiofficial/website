// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Email notify form ----------
// NOTE: This is a static GitHub Pages site with no backend.
// To actually collect emails, sign up for a free form endpoint
// (Formspree, Getform, or Mailchimp embed) and set FORM_ENDPOINT below.
// Example: const FORM_ENDPOINT = "https://formspree.io/f/yourFormId";
const FORM_ENDPOINT = "";

const form = document.getElementById('notifyForm');
const input = document.getElementById('emailInput');
const status = document.getElementById('statusMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = input.value.trim();

  if (!isValidEmail(email)) {
    status.textContent = "Please enter a valid email.";
    status.style.color = "#f472b6";
    return;
  }

  if (!FORM_ENDPOINT) {
    // No backend connected yet — store locally as a placeholder so the
    // interaction still feels complete during development/testing.
    const saved = JSON.parse(localStorage.getItem('whiteui_waitlist') || '[]');
    saved.push(email);
    localStorage.setItem('whiteui_waitlist', JSON.stringify(saved));

    status.textContent = "You're on the list. We'll be in touch.";
    status.style.color = "#38bdf8";
    form.reset();
    return;
  }

  try {
    status.textContent = "Submitting...";
    status.style.color = "#8b8b9e";

    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    });

    if (res.ok) {
      status.textContent = "You're on the list. We'll be in touch.";
      status.style.color = "#38bdf8";
      form.reset();
    } else {
      throw new Error("Submission failed");
    }
  } catch (err) {
    status.textContent = "Something went wrong. Try again.";
    status.style.color = "#f472b6";
  }
});

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ---------- Subtle mouse parallax on gradient blobs ----------
const blobs = document.querySelectorAll('.blob');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    blobs.forEach((blob, i) => {
      const strength = (i + 1) * 8;
      blob.style.setProperty('--mx', `${currentX * strength}px`);
      blob.style.setProperty('--my', `${currentY * strength}px`);
      blob.style.marginLeft = `${currentX * strength}px`;
      blob.style.marginTop = `${currentY * strength}px`;
    });

    requestAnimationFrame(animate);
  }
  animate();
}
