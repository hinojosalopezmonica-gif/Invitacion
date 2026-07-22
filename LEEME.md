# Invitación Mónica & Ulises

Primera versión funcional y gratuita para GitHub Pages.

## Probarla
Abre `index.html?codigo=001` en un servidor local. Cada código del 001 al 062 muestra el nombre y los lugares asignados.

## Publicar gratis en GitHub Pages
1. Crea un repositorio llamado `invitacion`.
2. Sube el contenido de esta carpeta a la raíz.
3. En Settings > Pages, elige Deploy from a branch, rama `main`, carpeta `/root`.
4. Sustituye `TU-USUARIO` en `enlaces_personalizados.csv` por tu usuario real de GitHub.

## Activar respuestas en Google Sheets
1. Crea una hoja nueva de Google Sheets.
2. Abre Extensiones > Apps Script.
3. Pega `google-apps-script.gs`.
4. Implementa como aplicación web con acceso para cualquier persona.
5. Copia la URL de implementación en `config.js`, dentro de `appsScriptUrl`.

Mientras no se agregue esa URL, el formulario funciona en modo de prueba y guarda la respuesta solamente en el navegador del dispositivo.
