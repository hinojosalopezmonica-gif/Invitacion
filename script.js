const params = new URLSearchParams(location.search);
const codigo = (params.get("codigo") || params.get("c") || "").padStart(3,"0");
const invitado = window.INVITADOS?.[codigo];

const mapsButton = document.getElementById("mapsButton");
if (mapsButton) mapsButton.href = window.CONFIG.mapsUrl;

const openInvitation = document.getElementById("openInvitation");
openInvitation.addEventListener("click", () => {
  document.getElementById("bienvenida").scrollIntoView({behavior:"smooth"});
});

const greeting = document.getElementById("guestGreeting");
const reserved = document.getElementById("reservedText");
const form = document.getElementById("rsvpForm");
const note = document.getElementById("formNote");
const success = document.getElementById("successMessage");
const attendingMessage = document.getElementById("attendingMessage");
const notAttendingMessage = document.getElementById("notAttendingMessage");

if (invitado) {
  greeting.textContent = `Hola, ${invitado.nombre}`;
  reserved.innerHTML = `Esta invitación ha sido reservada para <strong>${invitado.lugares} ${invitado.lugares === 1 ? "persona" : "personas"}</strong>.`;
} else {
  greeting.textContent = "Confirmación de asistencia";
  reserved.textContent = "Abre el enlace personalizado que recibiste para confirmar tu asistencia.";
  form.querySelector('button[type="submit"]').disabled = true;
  note.textContent = "No se encontró un código de invitación válido.";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!invitado) return;

  const asistencia = new FormData(form).get("asistencia");
  const data = {
    codigo,
    invitado: invitado.nombre,
    lugares: invitado.lugares,
    asistencia,
    mensaje: document.getElementById("mensaje").value.trim(),
    fecha: new Date().toISOString()
  };

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Enviando…";
  note.textContent = "";

  try {
    if (window.CONFIG.appsScriptUrl) {
      await fetch(window.CONFIG.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {"Content-Type":"text/plain;charset=utf-8"},
        body: JSON.stringify(data)
      });
    } else {
      localStorage.setItem(`rsvp-${codigo}`, JSON.stringify(data));
      console.info("Modo de prueba: respuesta guardada localmente.", data);
    }

    form.hidden = true;
    success.hidden = false;
    attendingMessage.hidden = asistencia !== "Sí";
    notAttendingMessage.hidden = asistencia !== "No";
    success.scrollIntoView({behavior:"smooth", block:"center"});
  } catch (error) {
    note.textContent = "No fue posible enviar la confirmación. Inténtalo nuevamente.";
    button.disabled = false;
    button.textContent = "Confirmar asistencia";
  }
});

document.getElementById("backToInvitation").addEventListener("click", () => {
  document.getElementById("evento").scrollIntoView({behavior:"smooth"});
});

const weddingDate = new Date("2026-10-09T18:15:00-07:00");
function updateCountdown(){
  const now = new Date();
  const diff = weddingDate - now;
  const countdown = document.getElementById("countdown");
  const message = document.getElementById("weddingDayMessage");

  if (diff <= 0) {
    countdown.hidden = true;
    message.hidden = false;
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById("days").textContent = String(days).padStart(2,"0");
  document.getElementById("hours").textContent = String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const progressBar = document.getElementById("progressBar");
const backTop = document.getElementById("backTop");
function updateScrollUI(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = `${Math.min(100, pct)}%`;
  backTop.classList.toggle("visible", window.scrollY > window.innerHeight * 0.75);
}
window.addEventListener("scroll", updateScrollUI, {passive:true});
updateScrollUI();
backTop.addEventListener("click", () => document.getElementById("portada").scrollIntoView({behavior:"smooth"}));
