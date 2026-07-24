/*!
 * Size-aware 3D card tilt for Lemon's site.
 * Larger cards tilt less; smaller cards tilt more — so the motion feels even.
 */
(function () {
  var reduce =
    (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) ||
    window.__STILL__;
  if (reduce) return;

  // Diagonal (px) → max tilt (deg). Tuned so ~320px cards ≈ 8°, ~1000px ≈ 3.5°.
  function maxForSize(w, h) {
    var diag = Math.sqrt(w * w + h * h) || 1;
    var max = 2200 / diag;
    if (max < 2.5) max = 2.5;
    if (max > 9) max = 9;
    return max;
  }

  function attach(card) {
    if (card.dataset.tiltBound === "1") return;
    card.dataset.tiltBound = "1";
    card.classList.add("tilt-card");
    card.style.transformStyle = "preserve-3d";
    card.style.willChange = "transform";

    var raf = 0;
    var pending = null;

    function apply(e) {
      var r = card.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      var max = maxForSize(r.width, r.height);
      // Optional override: data-tilt-max="4"
      if (card.dataset.tiltMax) {
        var forced = parseFloat(card.dataset.tiltMax);
        if (!isNaN(forced)) max = forced;
      }
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      // Soften edges so corners don't crank to full max
      px = Math.max(-0.5, Math.min(0.5, px));
      py = Math.max(-0.5, Math.min(0.5, py));
      var rotY = px * max * 2;
      var rotX = -py * max * 2;
      // Scale lift also shrinks a bit for big cards
      var scale = 1 + Math.min(0.02, 8 / Math.max(r.width, r.height) * 8);
      card.style.transition = "transform 60ms linear";
      card.style.transform =
        "perspective(1000px) rotateX(" +
        rotX.toFixed(2) +
        "deg) rotateY(" +
        rotY.toFixed(2) +
        "deg) scale(" +
        scale.toFixed(4) +
        ")";
    }

    card.addEventListener(
      "mousemove",
      function (e) {
        pending = e;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          if (pending) apply(pending);
          pending = null;
        });
      },
      { passive: true }
    );

    card.addEventListener("mouseleave", function () {
      pending = null;
      card.style.transition = "transform 280ms cubic-bezier(.2,.7,.2,1)";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }

  function bindAll(root) {
    // Dialed down: only notes tiles + notes-nav get tilt (cards are rare now).
    (root || document)
      .querySelectorAll(".notes-tile, .notes-nav-btn")
      .forEach(attach);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindAll();
    });
  } else {
    bindAll();
  }

  // Quarto / dynamic sections
  window.addEventListener("load", function () {
    bindAll();
  });

  // Expose for manual re-bind after DOM swaps
  window.__bindCardTilt = bindAll;
})();
