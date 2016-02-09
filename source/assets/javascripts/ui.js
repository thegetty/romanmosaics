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

function mapSetup() {
  if ($("#map").length) {
    var centerPoint = $("#map").data("center");
    var map = new GeoMap(centerPoint);

    if ($("#map").parent().hasClass("cover-map")) {
      map.map.setZoom(5);
    }
  }
}

function offCanvasNav() {
  var $sidebar = $(".nav-sidebar");
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

  // bind escape key to menu close if menu is open
  $(document).keydown(function(event) {
    if (event.which === 27 && $sidebar.hasClass("is-visible")) {
      $sidebar.removeClass("is-visible");
      $curtain.removeClass("is-visible");
    }
  });
}

function searchSetup() {
  var $searchButton = $("#navbar-search");
  var $searchCloseButton = $("#search-close");
  var $navbar = $(".navbar");
  var $results = $(".search-results");

  $searchButton.on("click touchstart", function() {
    $navbar.toggleClass("search-active");
    $results.toggleClass("search-active");
  });

  $searchCloseButton.on("click touchstart", function() {
    $navbar.removeClass("search-active");
    $results.removeClass("search-active");
  });

  // bind escape key to search close if search is active
  $(document).keydown(function(event) {
    if (event.which === 27 && $navbar.hasClass("search-active")) {
      $navbar.removeClass("search-active");
      $results.removeClass("search-active");
    }
  });
}

// Use this function as "export"
// Calls all other functions defined here inside of this one
function uiSetup() {
  keyboardNav();
  offCanvasNav();
  searchSetup();
  mapSetup();
}
