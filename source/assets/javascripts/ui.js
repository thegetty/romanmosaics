function keyboardNav(){
  $(document).keydown(function(event) {
    var prev, next;
    prev = document.getElementById("prev-link");
    next = document.getElementById("next-link");
    // 37 = left arrow key
    if (event.which === 37 && prev) {
      prev.click();
      event.preventDefault();
    }
    // 39 = right arrow key
    else if (event.which === 39 && next) {
      next.click();
      event.preventDefault();
    }
  });
}

function offCanvasNav() {
  // Sidebar nav toggle
  var $sidebar = $(".nav-contents");
  var $menuButton = $("#navbar-menu");
  var $curtain = $(".sliding-panel-fade-screen");

  $menuButton.on("click touchstart", function() {
    $sidebar.toggleClass("is-visible");
    $curtain.toggleClass("is-visible");
  });

  $curtain.on("click touchstart", function() {
    $sidebar.removeClass("is-visible");
    $curtain.removeClass("is-visible");
  });
}
