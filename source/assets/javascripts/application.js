//= require_tree .

$(document).ready(function() {
  // Sidebar nav toggle
  var $sidebar = $(".nav-contents");
  var $menuButton = $("#navbar-menu");

  $menuButton.on("click touchstart", function() {
    $sidebar.toggleClass("is-visible");
  });

});
