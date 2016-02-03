//= require_tree .

$(document).ready(function() {
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
});
