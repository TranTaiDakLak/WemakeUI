/* WemakeUI — Core JS (sidebar, tabs, modals, dark mode) */
(function () {
  'use strict';

  /* ── SIDEBAR COLLAPSE ─────────────────────────────────── */
  document.querySelectorAll('[data-toggle-sidebar]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sidebar = document.querySelector('.wx-sidebar');
      if (sidebar) sidebar.classList.toggle('collapsed');
    });
  });

  /* ── MOBILE SIDEBAR OPEN ──────────────────────────────── */
  document.querySelectorAll('[data-open-sidebar]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sidebar = document.querySelector('.wx-sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    });
  });

  /* ── NAV GROUP ACCORDION ──────────────────────────────── */
  document.querySelectorAll('.wx-nav-group-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var group = this.closest('.wx-nav-group');
      if (group) group.classList.toggle('open');
    });
  });

  /* ── TABS ─────────────────────────────────────────────── */
  document.querySelectorAll('.wx-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var container = this.closest('.wx-tabs');
      if (!container) return;
      container.querySelectorAll('.wx-tab').forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      var target = this.dataset.tab;
      if (target) {
        document.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
          panel.classList.toggle('hidden', panel.dataset.tabPanel !== target);
        });
      }
    });
  });

  /* ── MODAL ────────────────────────────────────────────── */
  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = this.dataset.openModal;
      var el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var overlay = this.closest('.wx-overlay');
      if (overlay) overlay.classList.add('hidden');
    });
  });

  document.querySelectorAll('.wx-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
  });

  /* ── DARK MODE TOGGLE ─────────────────────────────────── */
  var darkToggle = document.querySelector('[data-dark-toggle]');
  if (darkToggle) {
    var saved = localStorage.getItem('wx-dark');
    if (saved === 'true') document.body.classList.add('dark');

    darkToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      localStorage.setItem('wx-dark', document.body.classList.contains('dark'));
    });
  }

  /* ── ACTIVE NAV LINK (auto-detect current page) ───────── */
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.wx-nav-item[href]').forEach(function (link) {
    var href = link.getAttribute('href').split('/').pop();
    if (href === current) {
      link.classList.add('active');
      var group = link.closest('.wx-nav-group');
      if (group) group.classList.add('open');
    }
  });

  /* ── TOAST ────────────────────────────────────────────── */
  window.wxToast = function (msg, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'wx-alert wx-alert-' + type;
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;min-width:280px;max-width:400px;box-shadow:0 8px 30px rgba(0,0,0,0.12)';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 3500);
  };

  /* ── CONFIRM DIALOG ───────────────────────────────────── */
  document.querySelectorAll('[data-confirm]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!confirm(this.dataset.confirm || 'Bạn có chắc chắn không?')) {
        e.preventDefault(); e.stopPropagation();
      }
    });
  });

  /* ── PASSWORD TOGGLE ──────────────────────────────────── */
  document.querySelectorAll('[data-pw-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.querySelector(this.dataset.pwToggle);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        this.textContent = input.type === 'password' ? '👁' : '🙈';
      }
    });
  });

  /* ── PROGRESS STRENGTH ────────────────────────────────── */
  var pwInput = document.querySelector('[data-pw-strength]');
  if (pwInput) {
    var bar = document.querySelector(pwInput.dataset.pwStrength);
    pwInput.addEventListener('input', function () {
      var v = this.value;
      var score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      if (bar) {
        bar.style.width = (score * 25) + '%';
        bar.className = 'wx-progress-bar ' + ['', 'wx-progress-danger', 'wx-progress-warning', '', 'wx-progress-success'][score];
      }
    });
  }

  /* ── STEP WIZARD ──────────────────────────────────────── */
  document.querySelectorAll('[data-next-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var form = this.closest('[data-wizard]');
      if (!form) return;
      var steps = form.querySelectorAll('[data-step]');
      var current = form.querySelector('[data-step]:not(.hidden)');
      var idx = Array.from(steps).indexOf(current);
      if (current) current.classList.add('hidden');
      var next = steps[idx + 1];
      if (next) next.classList.remove('hidden');
      updateProgress(form, idx + 2, steps.length);
    });
  });

  document.querySelectorAll('[data-prev-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var form = this.closest('[data-wizard]');
      if (!form) return;
      var steps = form.querySelectorAll('[data-step]');
      var current = form.querySelector('[data-step]:not(.hidden)');
      var idx = Array.from(steps).indexOf(current);
      if (current) current.classList.add('hidden');
      var prev = steps[idx - 1];
      if (prev) prev.classList.remove('hidden');
      updateProgress(form, idx, steps.length);
    });
  });

  function updateProgress(form, step, total) {
    var bar = form.querySelector('.wx-progress-bar');
    if (bar) bar.style.width = ((step / total) * 100) + '%';
    var dots = form.querySelectorAll('[data-step-dot]');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i < step);
    });
  }
})();
