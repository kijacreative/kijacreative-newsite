/* ==========================================================================
   SIGNATURE BUILDER — /signature

   Builds the team's Gmail signature as email-safe tables with inline styles,
   and uploads the headshot so it has a permanent public URL.

   Two constraints shape everything here:

   1. Email clients ignore CSS cropping. `object-fit` does nothing in Outlook,
      so the photo is cropped to a real 1:1 square in a canvas BEFORE it is
      uploaded. What gets stored is already square.

   2. Email clients strip data: URIs. A photo has to be fetched over https by
      every recipient, so the file goes to /api/signature-photo and the
      signature points at the URL that comes back. If that upload fails there
      is no photo — the builder says so rather than quietly embedding one that
      will show as a broken image in half the inboxes it lands in.

   Copied to dist/assets/widgets verbatim, so it imports nothing and reads its
   configuration from window.KIJA_SIGNATURE.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.KIJA_SIGNATURE || {};
  var PALETTE = CFG.palette || {};
  var ENDPOINT = CFG.endpoint || '/api/signature-photo';
  var STORE_KEY = 'kija.signature.v2';
  var KEY_STORE = 'kija.signature.key';
  var WIDTH = 512;
  var PHOTO_PX = 208;

  var DEFAULTS = {
    name: '',
    role: '',
    company: 'Kija Creative',
    website: 'kijacreative.com',
    email: '',
    phone: '',
    photoOn: true,
    photoUrl: '',
    links: [
      { label: '@kijacreative', url: 'https://www.instagram.com/kijacreative/' },
      { label: '', url: '' }
    ],
    bookingOn: true,
    bookingLabel: 'Book a call →',
    bookingUrl: CFG.bookingUrl || '',
    accent: PALETTE.accent || '#C21E7A',
    c2: PALETTE.c2 || '#F5E61A',
    c3: PALETTE.c3 || '#3DFFAE',
    barColor: PALETTE.bar || '#1E0A1E'
  };

  var state = load() || clone(DEFAULTS);
  var currentHtml = '';

  /* ---------------------------------------------------------------------- */
  /* helpers                                                                 */
  /* ---------------------------------------------------------------------- */

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function byId(id) { return document.getElementById(id); }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      var merged = clone(DEFAULTS);
      Object.keys(merged).forEach(function (k) {
        if (Object.prototype.hasOwnProperty.call(parsed, k)) merged[k] = parsed[k];
      });
      if (!Array.isArray(merged.links)) merged.links = [];
      return merged;
    } catch (e) {
      return null;
    }
  }

  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function uploadKey() {
    try { return window.localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }

  function setUploadKey(value) {
    try { window.localStorage.setItem(KEY_STORE, value); } catch (e) { /* private mode */ }
  }

  function esc(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function safeUrl(raw) {
    var s = String(raw === null || raw === undefined ? '' : raw).trim();
    if (!s) return '';
    if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'mailto:' + s;
    if (/^[+(]?[\d][\d\s().-]{5,}$/.test(s)) return 'tel:' + s.replace(/[^\d+]/g, '');
    if (/^(javascript|data|vbscript):/i.test(s)) return '';
    return 'https://' + s.replace(/^\/+/, '');
  }

  function safeImg(raw) {
    var s = String(raw === null || raw === undefined ? '' : raw).trim();
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return s;
    if (/^\/\//.test(s)) return 'https:' + s;
    return '';
  }

  function color(raw, fallback) {
    var s = String(raw === null || raw === undefined ? '' : raw).trim();
    return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(s) ? s : fallback;
  }

  function gap(px) {
    return '<div style="height:' + px + 'px;line-height:' + px + 'px;font-size:0;">&nbsp;</div>';
  }

  /* ---------------------------------------------------------------------- */
  /* signature markup                                                        */
  /*                                                                         */
  /* Literal hex and table layout are deliberate. This output is email HTML,  */
  /* not site CSS: custom properties, classes and modern layout do not        */
  /* survive a paste into Gmail, let alone Outlook's Word renderer.           */
  /* ---------------------------------------------------------------------- */

  function buildSignature(d) {
    var accent = color(d.accent, '#C21E7A');
    var c2 = color(d.c2, '#F5E61A');
    var c3 = color(d.c3, '#3DFFAE');
    var bar = color(d.barColor, '#1E0A1E');
    var ink = '#1E0A1E';
    var face = 'Arial,Helvetica,sans-serif';

    var photoSrc = safeImg(d.photoUrl);
    var showPhoto = !!(d.photoOn && photoSrc);
    var cols = showPhoto ? 2 : 1;
    var out = [];

    out.push('<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:' + face + ';color:' + ink + ';width:' + WIDTH + 'px;">');
    out.push('<tbody><tr>');

    if (showPhoto) {
      out.push('<td width="112" style="vertical-align:top;padding-right:24px;">');
      out.push('<img src="' + esc(photoSrc) + '" width="104" height="104" alt="' + esc(d.name || 'Profile photo') + '" style="display:block;width:104px;height:104px;border-radius:50%;border:3px solid ' + accent + ';">');
      out.push('</td>');
    }

    out.push('<td style="vertical-align:top;">');

    if (d.name) {
      out.push('<div style="font-size:21px;line-height:21px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:' + ink + ';">' + esc(d.name) + '</div>');
    }

    var roleBits = [];
    if (d.role) roleBits.push(esc(d.role));
    if (d.company) roleBits.push(esc(d.company));
    if (roleBits.length) {
      out.push(gap(9));
      out.push('<div style="font-size:11px;line-height:11px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:' + accent + ';">' + roleBits.join('&nbsp; ·&nbsp; ') + '</div>');
    }

    var rows = [];
    if (d.email) rows.push({ label: d.email, url: 'mailto:' + d.email });
    if (d.phone) rows.push({ label: d.phone, url: 'tel:' + String(d.phone).replace(/[^\d+]/g, '') });
    (d.links || []).forEach(function (link) {
      if (link && (link.label || link.url)) rows.push({ label: link.label || link.url, url: link.url || link.label });
    });

    if (rows.length) {
      out.push(gap(14));
      out.push('<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tbody>');
      rows.forEach(function (row) {
        var href = safeUrl(row.url);
        var inner = '<span style="color:' + ink + ';text-decoration:none;display:inline-block;">' + esc(row.label) + '</span>';
        var cell = href ? '<a href="' + esc(href) + '" style="color:' + ink + ';text-decoration:none;">' + inner + '</a>' : inner;
        out.push('<tr><td style="font-size:12px;line-height:19px;font-family:' + face + ';">' + cell + '</td></tr>');
      });
      out.push('</tbody></table>');
    }

    var bookHref = safeUrl(d.bookingUrl);
    if (d.bookingOn && bookHref && d.bookingLabel) {
      out.push(gap(16));
      out.push('<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tbody><tr>');
      out.push('<td bgcolor="' + accent + '" style="background:' + accent + ';background-color:' + accent + ';border-radius:999px;padding:9px 17px;font-family:' + face + ';font-size:10px;line-height:10px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;">');
      out.push('<a href="' + esc(bookHref) + '" style="color:#FFFFFF;text-decoration:none;"><span style="color:#FFFFFF;text-decoration:none;display:inline-block;">' + esc(d.bookingLabel) + '</span></a>');
      out.push('</td></tr></tbody></table>');
    }

    out.push('</td></tr>');
    out.push('<tr><td colspan="' + cols + '" style="padding-top:20px;">');

    var w1 = 174;
    var w2 = 169;
    var w3 = WIDTH - w1 - w2;
    out.push('<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="' + WIDTH + '" style="border-collapse:collapse;width:' + WIDTH + 'px;table-layout:fixed;"><tbody><tr>');
    [[w1, accent], [w2, c2], [w3, c3]].forEach(function (seg) {
      out.push('<td width="' + seg[0] + '" height="4" bgcolor="' + seg[1] + '" style="background:' + seg[1] + ';background-color:' + seg[1] + ';font-size:0;line-height:0;height:4px;">&nbsp;</td>');
    });
    out.push('</tr></tbody></table>');

    if (d.company || d.website) {
      var siteHref = safeUrl(d.website);
      var barInk = '#F5F3EC';
      out.push('<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="' + WIDTH + '" style="border-collapse:collapse;width:' + WIDTH + 'px;"><tbody><tr>');
      out.push('<td bgcolor="' + bar + '" style="background:' + bar + ';background-color:' + bar + ';padding:14px 20px;font-family:' + face + ';">');
      var nameSpan = '<span style="color:' + barInk + ';text-decoration:none;display:inline-block;font-size:12px;font-weight:800;letter-spacing:2.6px;text-transform:uppercase;">' + esc(d.company || d.website) + '</span>';
      out.push(siteHref ? '<a href="' + esc(siteHref) + '" style="color:' + barInk + ';text-decoration:none;">' + nameSpan + '</a>' : nameSpan);
      if (d.website && d.company) {
        out.push('<span style="color:#9A9A9A;font-size:10px;letter-spacing:1.3px;text-transform:uppercase;">&nbsp;&nbsp;·&nbsp;&nbsp;' + esc(d.website) + '</span>');
      }
      out.push('</td></tr></tbody></table>');
    }

    out.push('</td></tr></tbody></table>');
    return out.join('');
  }

  function plainText(d) {
    var head = [d.name, [d.role, d.company].filter(Boolean).join(', ')].filter(Boolean).join(' — ');
    var line = [d.email, d.phone]
      .concat((d.links || []).map(function (l) { return l.label || l.url; }))
      .filter(Boolean).join(' · ');
    var book = (d.bookingOn && d.bookingUrl) ? 'Book a call: ' + d.bookingUrl : '';
    return [head, line, book].filter(Boolean).join('\n');
  }

  /* ---------------------------------------------------------------------- */
  /* photo: crop to 1:1, then upload                                         */
  /* ---------------------------------------------------------------------- */

  function say(message, tone) {
    var el = byId('sig-photo-status');
    if (!el) return;
    el.textContent = message || '';
    el.className = 'k-sm' + (tone ? ' sig-status--' + tone : '');
  }

  /**
   * Centre-crop an image file to a PHOTO_PX square.
   *
   * @param {File} file Chosen file.
   * @returns {Promise<Blob>} Square JPEG.
   */
  function cropSquare(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();

      reader.onerror = function () { reject(new Error('read_failed')); };
      reader.onload = function () {
        var img = new Image();

        img.onerror = function () { reject(new Error('decode_failed')); };
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = PHOTO_PX;
          canvas.height = PHOTO_PX;

          var ctx = canvas.getContext('2d');
          var side = Math.min(img.width, img.height);
          var sx = (img.width - side) / 2;
          var sy = (img.height - side) / 2;

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, PHOTO_PX, PHOTO_PX);
          ctx.drawImage(img, sx, sy, side, side, 0, 0, PHOTO_PX, PHOTO_PX);

          canvas.toBlob(function (blob) {
            if (blob) resolve(blob);
            else reject(new Error('encode_failed'));
          }, 'image/jpeg', 0.88);
        };

        img.src = String(reader.result);
      };

      reader.readAsDataURL(file);
    });
  }

  var UPLOAD_ERRORS = {
    not_configured: 'Photo storage is not set up on this deploy yet. Paste a hosted image URL instead.',
    storage_missing: 'The upload library is missing from this deploy. Paste a hosted image URL for now.',
    bad_key: 'That upload key was not accepted. Check it and try again.',
    too_large: 'That image is too big. Try one under 2MB.',
    unsupported_type: 'Use a JPEG, PNG or WebP.',
    origin: 'Uploads are refused from this address.'
  };

  function handleFile(file) {
    if (!file || !/^image\//.test(file.type)) return;

    var key = uploadKey();
    if (!key) {
      say('Enter the upload key below first, then choose the photo again.', 'warn');
      var keyInput = byId('sig-key');
      if (keyInput) keyInput.focus();
      return;
    }

    say('Cropping to a square…');

    cropSquare(file).then(function (blob) {
      say('Uploading…');
      return fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', 'X-Signature-Key': key },
        body: blob
      });
    }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (result) {
      if (!result.ok || !result.data || !result.data.url) {
        var reason = result.data && result.data.reason;
        var detail = result.data && result.data.detail;
        // Show what the server actually said. A generic "upload failed" on an
        // internal tool just means somebody has to go and read the logs.
        say(UPLOAD_ERRORS[reason] || ('Upload failed. ' + (detail || 'Try again, or paste a hosted image URL.')), 'warn');
        return;
      }
      state.photoUrl = result.data.url;
      state.photoOn = true;
      var toggle = byId('sig-photoOn');
      if (toggle) toggle.checked = true;
      var urlField = byId('sig-photoUrl');
      if (urlField) urlField.value = state.photoUrl;
      say('Uploaded and cropped to 1:1.', 'ok');
      render();
    }).catch(function () {
      say('Upload failed. Try again, or paste a hosted image URL.', 'warn');
    });
  }

  /* ---------------------------------------------------------------------- */
  /* rendering                                                               */
  /* ---------------------------------------------------------------------- */

  function render() {
    currentHtml = buildSignature(state);
    byId('sig-out').innerHTML = currentHtml;
    byId('sig-code').textContent = currentHtml;

    var src = safeImg(state.photoUrl);
    var thumb = byId('sig-thumb');
    if (thumb) thumb.style.backgroundImage = src ? 'url("' + src.replace(/"/g, '\\"') + '")' : 'none';

    save();
  }

  function syncInputs() {
    var fields = document.querySelectorAll('[data-sig]');
    Array.prototype.forEach.call(fields, function (el) {
      var key = el.getAttribute('data-sig');
      if (el.type === 'checkbox') el.checked = !!state[key];
      else el.value = state[key] === null || state[key] === undefined ? '' : state[key];
    });
    renderLinks();
  }

  function renderLinks() {
    var list = byId('sig-links');
    if (!list) return;
    list.innerHTML = '';

    state.links.forEach(function (link, index) {
      var row = document.createElement('div');
      row.className = 'sig-linkrow';

      var labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.className = 'k-input';
      labelInput.setAttribute('aria-label', 'Link label ' + (index + 1));
      labelInput.placeholder = 'Label';
      labelInput.value = link.label || '';
      labelInput.addEventListener('input', function () {
        state.links[index].label = labelInput.value;
        render();
      });

      var urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.className = 'k-input';
      urlInput.setAttribute('aria-label', 'Link URL ' + (index + 1));
      urlInput.placeholder = 'https://';
      urlInput.value = link.url || '';
      urlInput.addEventListener('input', function () {
        state.links[index].url = urlInput.value;
        render();
      });

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'sig-remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', function () {
        state.links.splice(index, 1);
        renderLinks();
        render();
      });

      row.appendChild(labelInput);
      row.appendChild(urlInput);
      row.appendChild(remove);
      list.appendChild(row);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* copying                                                                 */
  /* ---------------------------------------------------------------------- */

  function flash(button, message) {
    var original = button.getAttribute('data-label') || button.textContent;
    button.setAttribute('data-label', original);
    button.textContent = message;
    window.setTimeout(function () { button.textContent = original; }, 1800);
  }

  function copyRich(button) {
    var html = currentHtml;
    var text = plainText(state);
    var done = function () { flash(button, 'Copied ✓'); };

    var fallback = function () {
      var range = document.createRange();
      range.selectNodeContents(byId('sig-out'));
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      var copied = false;
      try { copied = document.execCommand('copy'); } catch (e) { copied = false; }
      selection.removeAllRanges();
      if (copied) done();
      else flash(button, 'Use Copy HTML');
    };

    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      try {
        navigator.clipboard.write([new window.ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' })
        })]).then(done, fallback);
      } catch (e) {
        fallback();
      }
    } else {
      fallback();
    }
  }

  /* ---------------------------------------------------------------------- */
  /* wiring                                                                  */
  /* ---------------------------------------------------------------------- */

  function init() {
    if (!byId('sig-out')) return;

    var fields = document.querySelectorAll('[data-sig]');
    Array.prototype.forEach.call(fields, function (el) {
      var key = el.getAttribute('data-sig');
      var evt = (el.type === 'checkbox' || el.type === 'color') ? 'change' : 'input';
      el.addEventListener(evt, function () {
        state[key] = el.type === 'checkbox' ? el.checked : el.value;
        render();
      });
      if (el.type === 'color') {
        el.addEventListener('input', function () {
          state[key] = el.value;
          render();
        });
      }
    });

    var keyInput = byId('sig-key');
    if (keyInput) {
      keyInput.value = uploadKey();
      keyInput.addEventListener('input', function () { setUploadKey(keyInput.value.trim()); });
    }

    var fileInput = byId('sig-file');
    var pick = byId('sig-pick');
    if (pick && fileInput) {
      pick.addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
      });
    }

    var drop = byId('sig-drop');
    if (drop) {
      ['dragenter', 'dragover'].forEach(function (type) {
        drop.addEventListener(type, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
      });
      ['dragleave', 'drop'].forEach(function (type) {
        drop.addEventListener(type, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
      });
      drop.addEventListener('drop', function (e) {
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleFile(file);
      });
    }

    var add = byId('sig-add-link');
    if (add) {
      add.addEventListener('click', function () {
        state.links.push({ label: '', url: '' });
        renderLinks();
        render();
      });
    }

    var clear = byId('sig-clear-photo');
    if (clear) {
      clear.addEventListener('click', function () {
        state.photoUrl = '';
        var urlField = byId('sig-photoUrl');
        if (urlField) urlField.value = '';
        say('');
        render();
      });
    }

    var copy = byId('sig-copy');
    if (copy) copy.addEventListener('click', function () { copyRich(this); });

    var copyHtml = byId('sig-copy-html');
    if (copyHtml) {
      copyHtml.addEventListener('click', function () {
        var button = this;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(currentHtml).then(
            function () { flash(button, 'Copied ✓'); },
            function () { flash(button, 'Select & copy'); }
          );
        } else {
          flash(button, 'Select & copy');
        }
      });
    }

    syncInputs();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
