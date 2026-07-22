
const params = new URLSearchParams(location.search);
const codigo = (params.get("codigo") || params.get("c") || "").padStart(3,"0");
const invitado = window.INVITADOS[codigo];

document.getElementById("mapsButton").href = window.CONFIG.mapsUrl;
document.getElementById("openInvitation").addEventListener("click", () => {
  document.getElementById("invitacion").scrollIntoView({behavior:"smooth"});
});

const greeting = document.getElementById("guestGreeting");
const reserved = document.getElementById("reservedText");
const form = document.getElementById("rsvpForm");
const note = document.getElementById("formNote");
const success = document.getElementById("successMessage");

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
  const data = {
    codigo,
    invitado: invitado.nombre,
    lugares: invitado.lugares,
    asistencia: new FormData(form).get("asistencia"),
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
        headers: {"Content-Type": "text/plain;charset=utf-8"},
        body: JSON.stringify(data)
      });
    } else {
      localStorage.setItem(`rsvp-${codigo}`, JSON.stringify(data));
      console.info("Modo de prueba: respuesta guardada localmente.", data);
    }
    form.hidden = true;
    success.hidden = false;
  } catch (error) {
    note.textContent = "No fue posible enviar la confirmación. Inténtalo nuevamente.";
    button.disabled = false;
    button.textContent = "Confirmar asistencia";
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
