// ============================================================
// AMBITUM — Backend Google Apps Script
// Instrucciones de instalación:
// 1. Ir a script.google.com → Nuevo proyecto
// 2. Pegar este código completo
// 3. Ejecutar setupSheets() UNA VEZ para crear las hojas
// 4. Publicar → Implementar como aplicación web
//    - Ejecutar como: Yo (tu cuenta)
//    - Acceso: Cualquier persona (o personas de tu organización)
// 5. Copiar la URL de implementación y pegarla en la app HTML
// ============================================================

var SS_ID = ''; // Dejar vacío — se auto-detecta
var PRICES_KEY = 'ambitum_prices';

function getSpreadsheet() {
  if (SS_ID) return SpreadsheetApp.openById(SS_ID);
  var files = DriveApp.getFilesByName('Ambitum_Cotizaciones_DB');
  if (files.hasNext()) {
    var f = files.next();
    SS_ID = f.getId();
    return SpreadsheetApp.openById(SS_ID);
  }
  var ss = SpreadsheetApp.create('Ambitum_Cotizaciones_DB');
  SS_ID = ss.getId();
  return ss;
}

function setupSheets() {
  var ss = getSpreadsheet();
  
  // Hoja de cotizaciones
  var sheetQ = ss.getSheetByName('Cotizaciones');
  if (!sheetQ) {
    sheetQ = ss.insertSheet('Cotizaciones');
  }
  var headers = [
    'ID', 'Referencia', 'Fecha', 'Cliente', 'Localidad', 'Email',
    'Moneda', 'TipoCambio',
    'SPT_N', 'SPT_Prof', 'DPL_N', 'DPL_Prof', 'Infiltraciones', 'DiasCAMPO',
    'Informe', 'MuestrasLab', 'Proctor', 'CBR', 'Taludes',
    'PersonalProf', 'PersonalCalif', 'Giras', 'KM', 'Peajes',
    'PersonasAlim', 'Hospedaje', 'Ferry', 'EnvioMuestras',
    'Utilidad', 'Comision',
    'CostoDirCRC', 'SubtotalCRC', 'IVACRC', 'TotalCRC',
    'SubtotalMon', 'IVAMon', 'TotalMon',
    'Estado', 'Notas', 'FechaGuardado', 'GuardadoPor',
    'Adelanto_Pagado', 'Adelanto_Fecha', 'Adelanto_Metodo', 'Adelanto_Ref',
    'Saldo_Pagado', 'Saldo_Fecha', 'Saldo_Metodo', 'Saldo_Ref'
  ];
  if (sheetQ.getLastRow() === 0) {
    sheetQ.appendRow(headers);
    sheetQ.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheetQ.setFrozenRows(1);
  }

  // Hoja de precios
  var sheetP = ss.getSheetByName('Precios');
  if (!sheetP) {
    sheetP = ss.insertSheet('Precios');
    var defaultPrices = [
      ['Clave', 'Descripcion', 'Valor', 'Unidad', 'FechaModif'],
      ['spt', 'SPT por metro', 4900, 'CRC/m', new Date().toISOString()],
      ['dpl', 'DPL por metro', 4000, 'CRC/m', new Date().toISOString()],
      ['inf', 'Prueba de infiltración', 9000, 'CRC/c/u', new Date().toISOString()],
      ['informe', 'Informe geotécnico', 35000, 'CRC/c/u', new Date().toISOString()],
      ['lab', 'Muestras de laboratorio', 15000, 'CRC/c/u', new Date().toISOString()],
      ['proctor', 'Ensayo Proctor', 24000, 'CRC/c/u', new Date().toISOString()],
      ['cbr', 'Ensayo CBR', 45000, 'CRC/c/u', new Date().toISOString()],
      ['taludes', 'Estabilidad de taludes', 35000, 'CRC/eje', new Date().toISOString()],
      ['km', 'Vehículo por km', 258.62, 'CRC/km', new Date().toISOString()],
      ['alim', 'Alimentación por persona/gira', 6000, 'CRC/pers/gira', new Date().toISOString()],
      ['hosp', 'Hospedaje por noche', 25000, 'CRC/noche', new Date().toISOString()],
      ['ferry', 'Ferry por viaje', 16000, 'CRC/viaje', new Date().toISOString()],
      ['peaje', 'Peajes por gira', 1000, 'CRC/gira', new Date().toISOString()],
      ['envio', 'Envío de muestras', 5000, 'CRC/c/u', new Date().toISOString()],
      ['profDay', 'Personal profesional por día', 35000, 'CRC/día', new Date().toISOString()],
      ['califDay', 'Personal calificado por día', 20000, 'CRC/día', new Date().toISOString()],
      ['envioMuestra', 'Envío por muestra Proctor/CBR', 20000, 'CRC/c/u', new Date().toISOString()],
      ['utilidad', 'Utilidad por defecto (%)', 23.3, '%', new Date().toISOString()],
      ['comision', 'Comisión por defecto (%)', 10, '%', new Date().toISOString()],
      ['tcVenta', 'Tipo de cambio venta', 500, 'CRC/USD', new Date().toISOString()],
    ];
    sheetP.getRange(1, 1, defaultPrices.length, 5).setValues(defaultPrices);
    sheetP.getRange(1, 1, 1, 5).setFontWeight('bold');
    sheetP.setFrozenRows(1);
  }

  return { status: 'ok', message: 'Hojas creadas correctamente', ssId: SS_ID };
}

function doGet(e) {
  var result;

  try {
    // Si viene un payload JSON codificado, es una operación de escritura enviada como GET
    // (workaround CORS: los navegadores bloquean POST con Content-Type: application/json)
    if (e.parameter.payload) {
      var data = JSON.parse(decodeURIComponent(e.parameter.payload));
      var action = data.action;
      if (action === 'saveQuote') {
        result = saveQuote(data.quote, data.user);
      } else if (action === 'updateQuote') {
        result = updateQuote(data.id, data.quote, data.user);
      } else if (action === 'updatePrices') {
        result = updatePrices(data.prices);
      } else if (action === 'deleteQuote') {
        result = deleteQuote(data.id);
      } else {
        result = { status: 'error', message: 'Acción desconocida en payload: ' + action };
      }
    } else {
      // Operaciones de lectura normales
      var action = e.parameter.action || 'ping';
      if (action === 'ping') {
        result = { status: 'ok', message: 'Ambitum API activa', version: '2.1' };
      } else if (action === 'getPrices') {
        result = getPrices();
      } else if (action === 'getQuotes') {
        result = getQuotes(e.parameter);
      } else if (action === 'getQuote') {
        result = getQuote(e.parameter.id);
      } else if (action === 'setup') {
        result = setupSheets();
      } else {
        result = { status: 'error', message: 'Acción desconocida: ' + action };
      }
    }
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  var result;

  try {
    if (action === 'saveQuote') {
      result = saveQuote(data.quote, data.user);
    } else if (action === 'updateQuote') {
      result = updateQuote(data.id, data.quote, data.user);
    } else if (action === 'updatePrices') {
      result = updatePrices(data.prices);
    } else if (action === 'deleteQuote') {
      result = deleteQuote(data.id);
    } else {
      result = { status: 'error', message: 'Acción desconocida: ' + action };
    }
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getPrices() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Precios');
  if (!sheet) return { status: 'error', message: 'Hoja Precios no existe. Ejecute setupSheets().' };
  var data = sheet.getDataRange().getValues();
  var prices = {};
  for (var i = 1; i < data.length; i++) {
    prices[data[i][0]] = {
      descripcion: data[i][1],
      valor: parseFloat(data[i][2]),
      unidad: data[i][3],
      fechaModif: data[i][4]
    };
  }
  return { status: 'ok', prices: prices };
}

function updatePrices(prices) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Precios');
  if (!sheet) return { status: 'error', message: 'Hoja no existe' };
  var data = sheet.getDataRange().getValues();
  var now = new Date().toISOString();
  for (var key in prices) {
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 3).setValue(parseFloat(prices[key]));
        sheet.getRange(i + 1, 5).setValue(now);
        break;
      }
    }
  }
  return { status: 'ok', message: 'Precios actualizados' };
}

function generateId() {
  return 'Q' + new Date().getTime();
}

function saveQuote(q, user) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Cotizaciones');
  if (!sheet) return { status: 'error', message: 'Hoja no existe. Ejecute setupSheets().' };
  var id = generateId();
  var row = [
    id, q.quoteRef, q.date, q.clientName, q.location, q.email,
    q.currency, q.exchangeRate,
    q.sptCount, q.sptDepth, q.dplCount, q.dplDepth, q.infiltrationCount, q.days,
    q.informeCount, q.labCount, q.proctorCount, q.cbrCount, q.slopeAnalysis,
    q.profCount, q.califCount, q.giras, q.km, q.peajes,
    q.alimPersonas, q.hospNoches, q.ferry, q.envio,
    q.utilidad, q.comision,
    q.costoDirCRC || 0, q.subtotalCRC, q.ivaCRC, q.totalCRC,
    q.subtotal, q.iva, q.total,
    q.estado || 'Enviada', q.notas || '', new Date().toISOString(), user || 'Sistema',
    q.adelanto_pagado||false, q.adelanto_fecha||'', q.adelanto_metodo||'', q.adelanto_ref||'',
    q.saldo_pagado||false,    q.saldo_fecha||'',    q.saldo_metodo||'',    q.saldo_ref||''
  ];
  sheet.appendRow(row);
  return { status: 'ok', id: id, message: 'Cotización guardada' };
}

function updateQuote(id, q, user) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Cotizaciones');
  if (!sheet) return { status: 'error', message: 'Hoja no existe' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      var row = i + 1;
      var values = [
        id, q.quoteRef, q.date, q.clientName, q.location, q.email,
        q.currency, q.exchangeRate,
        q.sptCount, q.sptDepth, q.dplCount, q.dplDepth, q.infiltrationCount, q.days,
        q.informeCount, q.labCount, q.proctorCount, q.cbrCount, q.slopeAnalysis,
        q.profCount, q.califCount, q.giras, q.km, q.peajes,
        q.alimPersonas, q.hospNoches, q.ferry, q.envio,
        q.utilidad, q.comision,
        q.costoDirCRC || 0, q.subtotalCRC, q.ivaCRC, q.totalCRC,
        q.subtotal, q.iva, q.total,
        q.estado || 'Enviada', q.notas || '', new Date().toISOString(), user || 'Sistema',
        q.adelanto_pagado||false, q.adelanto_fecha||'', q.adelanto_metodo||'', q.adelanto_ref||'',
        q.saldo_pagado||false,    q.saldo_fecha||'',    q.saldo_metodo||'',    q.saldo_ref||''
      ];
      sheet.getRange(row, 1, 1, values.length).setValues([values]);
      return { status: 'ok', message: 'Cotización actualizada' };
    }
  }
  return { status: 'error', message: 'ID no encontrado: ' + id };
}

function getQuotes(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Cotizaciones');
  if (!sheet) return { status: 'ok', quotes: [] };
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { status: 'ok', quotes: [] };
  var headers = data[0];
  var quotes = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var q = {};
    for (var j = 0; j < headers.length; j++) {
      q[headers[j]] = row[j];
    }
    // Filtros opcionales
    if (params.estado && params.estado !== 'Todas' && q.Estado !== params.estado) continue;
    if (params.q && q.Cliente && !q.Cliente.toLowerCase().includes(params.q.toLowerCase()) &&
        !q.Referencia.toLowerCase().includes(params.q.toLowerCase())) continue;
    quotes.push(q);
  }
  // Ordenar por fecha de guardado desc
  quotes.sort(function(a, b) {
    return new Date(b.FechaGuardado) - new Date(a.FechaGuardado);
  });
  return { status: 'ok', quotes: quotes, total: quotes.length };
}

function getQuote(id) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Cotizaciones');
  if (!sheet) return { status: 'error', message: 'Hoja no existe' };
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      var q = {};
      for (var j = 0; j < headers.length; j++) {
        q[headers[j]] = data[i][j];
      }
      return { status: 'ok', quote: q };
    }
  }
  return { status: 'error', message: 'No encontrado' };
}

function deleteQuote(id) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Cotizaciones');
  if (!sheet) return { status: 'error', message: 'Hoja no existe' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { status: 'ok', message: 'Eliminada' };
    }
  }
  return { status: 'error', message: 'No encontrado' };
}
