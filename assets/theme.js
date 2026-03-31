/* ============================================
   ONE PRODUCT THEME — JAVASCRIPT
   ============================================ */

(function () {
  'use strict';

  /* ── HELPERS ── */
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* ============================================
     CART DRAWER
     ============================================ */
  var CartDrawer = {
    drawer:  null,
    overlay: null,
    body:    null,
    itemsEl: null,
    emptyEl: null,
    footerEl: null,
    subtotalEl: null,

    init: function () {
      this.drawer    = document.getElementById('cart-drawer');
      this.overlay   = document.getElementById('cart-drawer-overlay');
      this.body      = document.getElementById('cart-drawer-body');
      this.itemsEl   = document.getElementById('cart-drawer-items');
      this.emptyEl   = document.getElementById('cart-drawer-empty');
      this.footerEl  = document.getElementById('cart-drawer-footer');
      this.subtotalEl = document.getElementById('cart-drawer-subtotal');

      var closeBtn = document.getElementById('cart-drawer-close');
      if (closeBtn) closeBtn.addEventListener('click', this.close.bind(this));
      if (this.overlay) this.overlay.addEventListener('click', this.close.bind(this));

      // Cart icon in header opens drawer
      var cartLink = document.querySelector('.site-header__cart');
      if (cartLink) {
        cartLink.addEventListener('click', function (e) {
          e.preventDefault();
          CartDrawer.open();
          CartDrawer.refresh();
        });
      }

      // Keyboard close
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') CartDrawer.close();
      });
    },

    open: function () {
      if (!this.drawer) return;
      this.drawer.classList.add('is-open');
      this.drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cart-drawer-open');
    },

    close: function () {
      if (!this.drawer) return;
      this.drawer.classList.remove('is-open');
      this.drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cart-drawer-open');
    },

    refresh: function () {
      fetch('/cart.js')
        .then(function (r) { return r.json(); })
        .then(function (cart) { CartDrawer.render(cart); })
        .catch(function () {});
    },

    render: function (cart) {
      if (!this.itemsEl) return;

      // Update header count badge
      var countEl = document.querySelector('.site-header__cart-count');
      if (cart.item_count > 0) {
        if (!countEl) {
          var cartLink = document.querySelector('.site-header__cart');
          if (cartLink) {
            var span = document.createElement('span');
            span.className = 'site-header__cart-count';
            cartLink.appendChild(span);
            countEl = span;
          }
        }
        if (countEl) countEl.textContent = cart.item_count;
      } else {
        if (countEl) countEl.remove();
      }

      // Empty / filled state
      if (cart.item_count === 0) {
        this.emptyEl && (this.emptyEl.style.display = 'flex');
        this.itemsEl.innerHTML = '';
        this.footerEl && (this.footerEl.style.display = 'none');
        return;
      }

      this.emptyEl && (this.emptyEl.style.display = 'none');
      this.footerEl && (this.footerEl.style.display = 'block');
      if (this.subtotalEl) this.subtotalEl.textContent = formatMoney(cart.total_price);

      // Build item list
      var html = '';
      cart.items.forEach(function (item) {
        html += '<li class="cart-item" data-key="' + item.key + '">';
        if (item.image) {
          html += '<img class="cart-item__image" src="' + item.image + '" alt="' + (item.title || '') + '" width="72" height="72">';
        }
        html += '<div class="cart-item__details">';
        html += '<p class="cart-item__title">' + item.product_title + '</p>';
        if (item.variant_title && item.variant_title !== 'Default Title') {
          html += '<p class="cart-item__variant">' + item.variant_title + '</p>';
        }
        html += '<div class="cart-item__row">';
        html += '<div class="cart-item__qty">';
        html += '<button class="cart-item__qty-btn" data-key="' + item.key + '" data-action="decrease" aria-label="Decrease quantity">&#8722;</button>';
        html += '<span class="cart-item__qty-num">' + item.quantity + '</span>';
        html += '<button class="cart-item__qty-btn" data-key="' + item.key + '" data-action="increase" aria-label="Increase quantity">&#43;</button>';
        html += '</div>';
        html += '<p class="cart-item__price">' + formatMoney(item.final_line_price) + '</p>';
        html += '</div>';
        html += '</div>';
        html += '<button class="cart-item__remove" data-key="' + item.key + '" aria-label="Remove item">';
        html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        html += '</button>';
        html += '</li>';
      });
      this.itemsEl.innerHTML = html;

      // Bind qty / remove buttons
      this.itemsEl.querySelectorAll('.cart-item__qty-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key    = btn.dataset.key;
          var action = btn.dataset.action;
          var qtyEl  = btn.closest('.cart-item__qty').querySelector('.cart-item__qty-num');
          var qty    = parseInt(qtyEl.textContent, 10);
          CartDrawer.updateItem(key, action === 'increase' ? qty + 1 : qty - 1);
        });
      });
      this.itemsEl.querySelectorAll('.cart-item__remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          CartDrawer.updateItem(btn.dataset.key, 0);
        });
      });
    },

    updateItem: function (key, quantity) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      })
        .then(function (r) { return r.json(); })
        .then(function (cart) { CartDrawer.render(cart); })
        .catch(function () {});
    },

    addItem: function (variantId, quantity, properties) {
      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: quantity || 1, properties: properties || {} })
      }).then(function (r) {
        if (!r.ok) throw new Error('Cart add failed');
        return r.json();
      });
    }
  };

  /* ============================================
     IMAGE GALLERY
     ============================================ */
  function initGallery() {
    var gallery = document.getElementById('product-gallery');
    if (!gallery) return;

    var slides  = gallery.querySelectorAll('.product-gallery__slide');
    var thumbs  = gallery.querySelectorAll('.product-gallery__thumb');
    var prevBtn = gallery.querySelector('.product-gallery__arrow--prev');
    var nextBtn = gallery.querySelector('.product-gallery__arrow--next');
    var current = 0;

    function goTo(index) {
      slides[current].classList.remove('active');
      thumbs[current] && thumbs[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      thumbs[current] && thumbs[current].classList.add('active');
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        goTo(parseInt(thumb.dataset.index, 10));
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Touch swipe
    var touchStartX = 0;
    var mainEl = gallery.querySelector('.product-gallery__main');
    if (mainEl) {
      mainEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      mainEl.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      }, { passive: true });
    }
  }

  /* ============================================
     BUNDLE SELECTOR
     ============================================ */
  function initBundleSelector() {
    var form = document.getElementById('product-form');
    if (!form) return;

    var radios      = form.querySelectorAll('.bundle-option__radio');
    var variantInput = form.querySelector('#selected-variant-id');
    var labels      = form.querySelectorAll('.bundle-option');

    radios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        labels.forEach(function (lbl) { lbl.classList.remove('bundle-option--selected'); });
        var parentLabel = radio.closest('.bundle-option');
        if (parentLabel) parentLabel.classList.add('bundle-option--selected');
        if (variantInput && radio.dataset.variantId) {
          variantInput.value = radio.dataset.variantId;
        }
      });
    });
  }

  /* ============================================
     PRODUCT TABS
     ============================================ */
  function initTabs() {
    var tabs = document.querySelectorAll('.product-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      });
    });
  }

  /* ============================================
     CART FORM — ADD TO CART → OPEN DRAWER
     ============================================ */
  function initCartForm() {
    var form = document.getElementById('product-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn          = form.querySelector('#add-to-cart-btn');
      var variantInput = form.querySelector('#selected-variant-id');

      if (!variantInput || !variantInput.value) {
        if (btn) {
          var orig = btn.innerHTML;
          btn.textContent = 'Set a variant ID in theme settings';
          btn.disabled = true;
          setTimeout(function () { btn.innerHTML = orig; btn.disabled = false; }, 3000);
        }
        return;
      }

      if (btn) {
        var originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-spinner"></span> Adding…';

        CartDrawer.addItem(variantInput.value, 1)
          .then(function () {
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added!';
            return fetch('/cart.js').then(function (r) { return r.json(); });
          })
          .then(function (cart) {
            CartDrawer.render(cart);
            CartDrawer.open();
            setTimeout(function () {
              btn.innerHTML = originalHTML;
              btn.disabled = false;
            }, 2000);
          })
          .catch(function () {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          });
      }
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    CartDrawer.init();
    CartDrawer.refresh(); // prime count on load
    initGallery();
    initBundleSelector();
    initTabs();
    initCartForm();
  });
})();
