const params = new URLSearchParams(location.search);
const codigo = (params.get("codigo") || params.get("c") || "").padStart(3, "0");
const invitado = window.INVITADOS?.[codigo];

const mapsButton = document.getElementById("mapsButton");
if (mapsButton) {
  mapsButton.href = window.CONFIG.mapsUrl;
}

const openInvitation = document.getElementById("openInvitation");
if (openInvitation) {
  openInvitation.addEventListener("click", () => {
    document.getElementById("bienvenida")?.scrollIntoView({
      behavior: "smooth"
    });
  });
}

const greeting = document.getElementById("guestGreeting");
const reserved = document.getElementById("reservedText");
const form = document.getElementById("rsvpForm");
const alreadyRespondedMessage =
  document.getElementById("alreadyRespondedMessage");
const rsvpClosedMessage =
  document.getElementById("rsvpClosedMessage");
const note = document.getElementById("formNote");
const success = document.getElementById("successMessage");
const attendingMessage = document.getElementById("attendingMessage");
const notAttendingMessage = document.getElementById("notAttendingMessage");


// ======================================================
// MOSTRAR INVITADO
// ======================================================

if (invitado) {

  if (greeting) {
    greeting.textContent = `Hola, ${invitado.nombre}`;
  }

  if (reserved) {
    reserved.innerHTML =
      `Esta invitación ha sido reservada para <strong>${invitado.lugares} ${
        invitado.lugares === 1 ? "persona" : "personas"
      }</strong>.`;
  }

} else {

  if (greeting) {
    greeting.textContent = "Confirmación de asistencia";
  }

  if (reserved) {
    reserved.textContent =
      "Abre el enlace personalizado que recibiste para confirmar tu asistencia.";
  }

  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
    }
  }

  if (note) {
    note.textContent =
      "No se encontró un código de invitación válido.";
  }
}


// ======================================================
// FECHA LÍMITE DE CONFIRMACIÓN
// ======================================================

const rsvpDeadline =
  new Date("2026-09-21T00:00:00-07:00");

function checkRsvpDeadline() {

  const now = new Date();

  if (now >= rsvpDeadline) {

    if (form) {
      form.hidden = true;
    }

    if (rsvpClosedMessage) {
      rsvpClosedMessage.hidden = false;
    }

    return true;
  }

  return false;
}

checkRsvpDeadline();


// ======================================================
// VERIFICAR SI EL CÓDIGO YA RESPONDIÓ
// ======================================================

async function verificarRespuestaPrevia() {

  if (!invitado) return;

  if (!window.CONFIG?.appsScriptUrl) return;

  try {

    const url =
      ${window.CONFIG.appsScriptUrl}?codigo=${encodeURIComponent(codigo)};

    const respuesta = await fetch(url);

    const datos = await respuesta.json();

    if (datos.yaRespondio) {

      if (form) {
        form.hidden = true;
      }

      if (alreadyRespondedMessage) {
        alreadyRespondedMessage.hidden = false;
      }
    }

  } catch (error) {

    console.warn(
      "No fue posible verificar el RSVP previo.",
      error
    );
  }
}


// Ejecutar al abrir la invitación
if (!checkRsvpDeadline()) {
  verificarRespuestaPrevia();
}


// ======================================================
// ENVÍO DE CONFIRMACIÓN
// ======================================================

if (form) {

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (checkRsvpDeadline()) {
      return;
    }

    if (!invitado) {
      return;
    }

    const asistencia =
      new FormData(form).get("asistencia");

    if (!asistencia) {
      if (note) {
        note.textContent =
          "Selecciona si asistirás o no.";
      }
      return;
    }

    const data = {

      codigo,

      invitado: invitado.nombre,

      lugares: invitado.lugares,

      asistencia,

      mensaje:
        document
          .getElementById("mensaje")
          ?.value
          .trim() || "",

      fecha: new Date().toISOString()
    };


    const button =
      form.querySelector('button[type="submit"]');

    if (button) {

      button.disabled = true;

      button.textContent =
        "Enviando…";
    }

    if (note) {
      note.textContent = "";
    }


    try {

      if (window.CONFIG?.appsScriptUrl) {

        await fetch(
          window.CONFIG.appsScriptUrl,
          {
            method: "POST",

            mode: "no-cors",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(data)
          }
        );

      } else {

        localStorage.setItem(
          rsvp-${codigo},
          JSON.stringify(data)
        );

        console.info(
          "Modo de prueba: respuesta guardada localmente.",
          data
        );
      }


      form.hidden = true;

      if (success) {
        success.hidden = false;
      }

      if (attendingMessage) {
        attendingMessage.hidden =
          asistencia !== "Sí";
      }

      if (notAttendingMessage) {
        notAttendingMessage.hidden =
          asistencia !== "No";
      }

      if (success) {

        success.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }


    } catch (error) {

      if (note) {
        note.textContent =
          "No fue posible enviar la confirmación. Inténtalo nuevamente.";
      }

      if (button) {

        button.disabled = false;

        button.textContent =
          "Confirmar asistencia";
      }
    }
  });
}


// ======================================================
// VOLVER A LA INVITACIÓN
// ======================================================

const backToInvitation =
  document.getElementById("backToInvitation");

if (backToInvitation) {

  backToInvitation.addEventListener(
    "click",
    () => {

      document
        .getElementById("evento")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }
  );
}


// ======================================================
// CUENTA REGRESIVA
// ======================================================

const weddingDate =
  new Date("2026-10-09T18:15:00-07:00");

function updateCountdown() {

  const now = new Date();

  const diff =
    weddingDate - now;

  const countdown =
    document.getElementById("countdown");

  const message =
    document.getElementById(
      "weddingDayMessage"
    );


  if (diff <= 0) {

    if (countdown) {
      countdown.hidden = true;
    }

    if (message) {
      message.hidden = false;
    }

    return;
  }


  const days =
    Math.floor(
      diff / 86400000
    );

  const hours =
    Math.floor(
      (diff % 86400000) /
      3600000
    );

  const minutes =
    Math.floor(
      (diff % 3600000) /
      60000
    );

  const seconds =
    Math.floor(
      (diff % 60000) /
      1000
    );


  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");


  if (daysElement) {
    daysElement.textContent =
      String(days).padStart(2, "0");
  }

  if (hoursElement) {
    hoursElement.textContent =
      String(hours).padStart(2, "0");
  }

  if (minutesElement) {
    minutesElement.textContent =
      String(minutes).padStart(2, "0");
  }

  if (secondsElement) {
    secondsElement.textContent =
      String(seconds).padStart(2, "0");
  }
}

updateCountdown();

setInterval(
  updateCountdown,
  1000
);


// ======================================================
// ANIMACIONES
// ======================================================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add("visible");
          }
        }
      );
    },
    {
      threshold: 0.12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(
    element =>
      observer.observe(element)
  );


// ======================================================
// BARRA DE PROGRESO Y VOLVER ARRIBA
// ======================================================

const progressBar =
  document.getElementById(
    "progressBar"
  );

const backTop =
  document.getElementById(
    "backTop"
  );


function updateScrollUI() {

  const max =
    document.documentElement
      .scrollHeight -
    window.innerHeight;

  const pct =
    max > 0
      ? (window.scrollY / max) *
        100
      : 0;


  if (progressBar) {

    progressBar.style.width =
      ${Math.min(100, pct)}%;
  }


  if (backTop) {

    backTop.classList.toggle(
      "visible",
      window.scrollY >
        window.innerHeight *
          0.75
    );
  }
}


window.addEventListener(
  "scroll",
  updateScrollUI,
  {
    passive: true
  }
);

updateScrollUI();


if (backTop) {

  backTop.addEventListener(
    "click",
    () => {

      document
        .getElementById("portada")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }
  );
}
