/**
 * Google Apps Script para registrar confirmaciones.
 * 1) Crea una hoja de Google Sheets y abre Extensiones > Apps Script.
 * 2) Pega este código.
 * 3) Implementar > Nueva implementación > Aplicación web.
 * 4) Ejecutar como: tú. Acceso: cualquier persona.
 * 5) Copia la URL en config.js, en appsScriptUrl.
 */
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Confirmaciones");
  if (!sheet) {
    sheet = ss.insertSheet("Confirmaciones");
    sheet.appendRow(["Fecha","Código","Invitado","Lugares asignados","Asistencia","Mensaje"]);
  }
  sheet.appendRow([
    new Date(),
    data.codigo,
    data.invitado,
    data.lugares,
    data.asistencia,
    data.mensaje || ""
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
