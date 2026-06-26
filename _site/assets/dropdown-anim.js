(function() {
  document.addEventListener('hide.bs.dropdown', function(e) {
    // Find the associated dropdown menu
    var menu = e.target.nextElementSibling;
    if (!menu || !menu.classList.contains('dropdown-menu')) return;
    
    // If we're already animating out or actually hiding, don't prevent it
    if (menu.classList.contains('is-closing') || menu._isActuallyHiding) return;
    
    // Prevent immediate disappearance
    e.preventDefault();
    
    // Start the CSS exit animation
    menu.classList.add('is-closing');
    
    // Wait for the animation to end
    menu.addEventListener('animationend', function handler() {
      menu.removeEventListener('animationend', handler);
      
      // Now actually hide it using Bootstrap's API
      var dropdown = bootstrap.Dropdown.getInstance(e.target);
      if (dropdown) {
        menu._isActuallyHiding = true;
        dropdown.hide();
        menu.classList.remove('is-closing');
        menu._isActuallyHiding = false;
      } else {
        menu.classList.remove('is-closing');
      }
    });
  });
})();
