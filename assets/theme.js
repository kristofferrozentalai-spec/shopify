/* ============================================
   ONE PRODUCT THEME — JAVASCRIPT
   ============================================ */

(function () {
  'use strict';

  /* ── IMAGE GALLERY ── */
  function initGallery() {
    const gallery = document.getElementById('product-gallery');
    if (!gallery) return;

    const slides = gallery.querySelectorAll('.product-gallery__slide');
    const thumbs = gallery.querySelectorAll('.product-gallery__thumb');
    const prevBtn = gallery.querySelector('.product-gallery__arrow--prev');
    const nextBtn = gallery.querySelector('.product-gallery__arrow--next');
    let current = 0;

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

    /* Touch / swipe support */
    let touchStartX = 0;
    const mainEl = gallery.querySelector('.product-gallery__main');
    if (mainEl) {
      mainEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      mainEl.addEventListener('touchend', function (e) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      }, { passive: true });
    }
  }

  /* ── BUNDLE SELECTOR ── */
  function initBundleSelector() {
    const form = document.getElementById('product-form');
    if (!form) return;

    const radios = form.querySelectorAll('.bundle-option__radio');
    const variantInput = form.querySelector('#selected-variant-id');
    const labels = form.querySelectorAll('.bundle-option');

    radios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        /* Update selected state on label cards */
        labels.forEach(function (lbl) { lbl.classList.remove('bundle-option--selected'); });
        const parentLabel = radio.closest('.bundle-option');
        if (parentLabel) parentLabel.classList.add('bundle-option--selected');

        /* Update hidden variant ID input */
        const vid = radio.dataset.variantId;
        if (variantInput && vid) variantInput.value = vid;
      });
    });
  }

  /* ── PRODUCT TABS ── */
  function initTabs() {
    const tabs = document.querySelectorAll('.product-tab');
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

  /* ── CART FORM SUBMIT ── */
  function initCartForm() {
    const form = document.getElementById('product-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('#add-to-cart-btn');
      const variantInput = form.querySelector('#selected-variant-id');

      if (!variantInput || !variantInput.value) {
        /* No variant ID configured — show feedback */
        if (btn) {
          const original = btn.innerHTML;
          btn.textContent = 'Please configure a variant ID in theme settings';
          btn.disabled = true;
          setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 3000);
        }
        return;
      }

      if (btn) {
        btn.disabled = true;
        const original = btn.innerHTML;
        btn.textContent = 'Adding…';

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: variantInput.value,
            quantity: 1
          })
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Cart error');
            return res.json();
          })
          .then(function () {
            btn.textContent = 'Added to cart!';
            updateCartCount();
            setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 2000);
          })
          .catch(function () {
            btn.textContent = 'Error — please try again';
            setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 2000);
          });
      }
    });
  }

  /* ── CART COUNT UPDATE ── */
  function updateCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        const countEl = document.querySelector('.site-header__cart-count');
        if (cart.item_count > 0) {
          if (!countEl) {
            const cartLink = document.querySelector('.site-header__cart');
            if (cartLink) {
              const span = document.createElement('span');
              span.className = 'site-header__cart-count';
              span.textContent = cart.item_count;
              cartLink.appendChild(span);
            }
          } else {
            countEl.textContent = cart.item_count;
          }
        }
      })
      .catch(function () {});
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    initGallery();
    initBundleSelector();
    initTabs();
    initCartForm();
  });
})();
