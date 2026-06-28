/**
 * navbar-intellisense.js
 * Automatically hides the navbar when scrolling down and reveals it when the mouse
 * is in proximity to the top of the viewport (within ~150px) or when at the top of the page.
 */
(function() {
  var header = document.querySelector('#quarto-header');
  if (!header) return;

  var isHidden = false;
  var mouseY = window.innerHeight; // Assume starting outside the hot zone

  function showHeader() {
    if (!isHidden) return;
    header.classList.remove('navbar-hidden');
    isHidden = false;
  }

  function hideHeader() {
    if (isHidden) return;
    // Don't hide if a dropdown menu is actively open
    var openDropdown = header.querySelector('.dropdown-menu.show');
    if (openDropdown) return;
    header.classList.add('navbar-hidden');
    isHidden = true;
  }

  // Update on mouse movement
  document.addEventListener('mousemove', function(e) {
    mouseY = e.clientY;
    if (window.scrollY < 100) {
      showHeader();
    } else if (mouseY < 150) { // Distance from top to trigger appearance
      showHeader();
    } else {
      hideHeader();
    }
  });

  // Also check on scroll to hide it when scrolling down, or show if reaching top
  document.addEventListener('scroll', function() {
    if (window.scrollY < 100) {
      showHeader();
    } else if (mouseY >= 150) {
      hideHeader();
    }
  });
})();
