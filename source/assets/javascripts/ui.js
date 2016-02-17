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
    // Get Catalogue data
    $.getJSON("/catalogue.json", function(data){
      // Stash catalogue json data for later use
      window.CATALOGUE = data;
      // Instantiate map
      var centerPoint = $("#map").data("center");
      var map = new GeoMap(centerPoint);
      if ($("#map").parent().hasClass("cover-map")) {
        map.map.setZoom(5);
      }
    }).fail(function() {
      console.log("Failed to load catalogue json");
    });
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

function popupSetup() {
  var $popups = $(".popup");
  $popups.each(function(index) {

    var $popup = $(this);

    // Definition Popup--------------------------------------------------------
    // ------------------------------------------------------------------------
    if ($popup.data("definition")) {
      var $el = $("<span>", {class: "popup-content"});
      $el.html($popup.data("definition"));
      $popup.append($el);
      $popup.on("click", function() {
        $popup.find(".popup-content").toggleClass("visible");
      });

    // Location Popup ---------------------------------------------------------
    // ------------------------------------------------------------------------
    } else if ($popup.data("location")) {
      var mapLocation;
      // Look for location that corresponds to data-location ID
      mapLocation = _.find(geojsonFeature.features, function(loc) {
        return loc.properties.id == $popup.data("location");
      });
      if (mapLocation == undefined) {
        console.log("No location data for " + $popup.text());
        $popup.removeClass("popup popup-location");
      } else {
        var $el, map, coords, label;

        $el = $("<div>", {class: "popup-content"});
        $popup.append($el);

        coords = mapLocation.geometry.coordinates.reverse();
        map    = new PopupMap(coords, $popup.find(".popup-content")[0]).map;

        var marker = L.marker(coords).addTo(map);
        marker.bindPopup(mapLocation.properties.custom_name);

        $popup.on("click", function() {
          if (!$popup.find(".popup-content").hasClass("visible")) {
            map.setView(coords, 10);
            $popup.find(".popup-content").addClass("visible");
            window.setTimeout(function() { map.invalidateSize(); }, 200);
          }
        });
      }

    // Image Popup ------------------------------------------------------------
    // ------------------------------------------------------------------------
    } else if ($popup.data("pic")) {
      // TODO: Add pop-up images here
      // Should have same full-width appearance as map elements
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
  popupSetup();
}
