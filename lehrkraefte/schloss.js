/* Bereich für Lehrkräfte: Entschlüsselung im Browser
   Das Passwort wird nur auf diesem Gerät verarbeitet (Web Crypto API, PBKDF2 + AES-GCM).
   Nach erfolgreicher Eingabe liegt der abgeleitete Schlüssel bis zum Schließen des Tabs
   im sessionStorage, damit nicht jedes Dokument einzeln entsperrt werden muss. */
(function () {
  'use strict';
  var CFG = window.TV_LK || {};
  var ABLAGE = 'tv-lehrkraefte-schluessel';
  var subtle = window.crypto && window.crypto.subtle;

  function b64d(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function b64e(u) { var s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }

  function ableiten(pw) {
    return subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits'])
      .then(function (base) { return subtle.deriveBits({ name: 'PBKDF2', salt: b64d(CFG.salz), iterations: CFG.iter, hash: 'SHA-256' }, base, 256); })
      .then(function (bits) { return new Uint8Array(bits); });
  }
  function entschluesseln(roh, enc) {
    return subtle.importKey('raw', roh, 'AES-GCM', false, ['decrypt'])
      .then(function (k) { return subtle.decrypt({ name: 'AES-GCM', iv: b64d(enc.iv) }, k, b64d(enc.ct)); })
      .then(function (buf) { return new Uint8Array(buf); });
  }
  function gespeichert() {
    try { var s = JSON.parse(sessionStorage.getItem(ABLAGE)); if (s && s.id === CFG.id) return b64d(s.k); } catch (e) {}
    return null;
  }
  function speichern(roh) { try { sessionStorage.setItem(ABLAGE, JSON.stringify({ id: CFG.id, k: b64e(roh) })); } catch (e) {} }
  function vergessen() { try { sessionStorage.removeItem(ABLAGE); } catch (e) {} }

  var LK = window.TVLehrkraefte = { gespeichert: gespeichert, vergessen: vergessen };

  // Prüft ein Passwort (bzw. einen gespeicherten Schlüssel) an einem verschlüsselten Block
  LK.oeffnen = function (pwOderSchluessel, enc) {
    var weg = typeof pwOderSchluessel === 'string' ? ableiten(pwOderSchluessel) : Promise.resolve(pwOderSchluessel);
    return weg.then(function (roh) { return entschluesseln(roh, enc).then(function (daten) { speichern(roh); return daten; }); });
  };
  LK.verfuegbar = !!subtle;

  // Formular verdrahten: ruft weiter(daten) auf, sobald entschlüsselt ist
  LK.formular = function (form, meldung, enc, weiter) {
    var input = form.querySelector('input[type=password]');
    var knopf = form.querySelector('button');
    if (!subtle) {
      meldung.textContent = 'Dieser Browser kann das Dokument nicht entschlüsseln. Bitte die Seite über https aufrufen oder einen aktuellen Browser verwenden.';
      knopf.disabled = true; return;
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      knopf.disabled = true; meldung.className = 'lk-meldung';
      meldung.textContent = 'Passwort wird geprüft …';
      LK.oeffnen(input.value, enc).then(function (d) {
        meldung.textContent = ''; input.value = ''; weiter(d);
      }, function () {
        meldung.className = 'lk-meldung lk-fehler';
        meldung.textContent = 'Das Passwort stimmt nicht.';
        input.select();
      }).then(function () { knopf.disabled = false; });
    });
  };

  // ---------- Verschlüsseltes Einzeldokument ----------
  var datenEl = document.getElementById('lk-daten');
  if (!datenEl) return;
  var dok = JSON.parse(datenEl.textContent);
  var form = document.querySelector('[data-lk-form]');
  var meldung = document.querySelector('[data-lk-meldung]');
  var dateiBox = document.querySelector('[data-lk-datei]');

  function anzeigen(bytes) {
    if (dok.typ === 'html') {
      var html = new TextDecoder().decode(bytes);
      var schreiben = function () { document.open(); document.write(html); document.close(); };
      // Erst schreiben, wenn die Hülle fertig geladen ist; sonst hängt der Browser den Text nur an
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schreiben); else schreiben();
      return;
    }
    var mime = dok.typ === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    var url = URL.createObjectURL(new Blob([bytes], { type: mime }));
    form.hidden = true;
    dateiBox.hidden = false;
    dateiBox.innerHTML = '';
    var p = document.createElement('p'); p.textContent = 'Entschlüsselt. Die Datei wird nur auf diesem Gerät geöffnet oder gespeichert.';
    var row = document.createElement('div'); row.className = 'lk-zeile';
    if (dok.typ === 'pdf') {
      var auf = document.createElement('a'); auf.className = 'go'; auf.href = url; auf.target = '_blank'; auf.rel = 'noopener'; auf.textContent = 'PDF öffnen';
      row.appendChild(auf);
    }
    var dl = document.createElement('a'); dl.className = 'go go-hell'; dl.href = url; dl.download = dok.datei; dl.textContent = 'Herunterladen';
    row.appendChild(dl);
    dateiBox.appendChild(p); dateiBox.appendChild(row);
  }

  var roh = gespeichert();
  if (roh && subtle) {
    document.body.classList.add('lk-pruefe');
    LK.oeffnen(roh, dok).then(anzeigen, function () { vergessen(); }).then(function () { document.body.classList.remove('lk-pruefe'); });
  }
  LK.formular(form, meldung, dok, anzeigen);
  if (!roh) { var i = form.querySelector('input'); if (i) i.focus(); }
})();
