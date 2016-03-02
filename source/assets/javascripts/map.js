//= require vendor/leaflet
//= require vendor/underscore-min
//= require geojson

// Underscore utility mixin
_.mixin({
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }
});

// Custom button
L.Control.Close = L.Control.extend({
  options: {
    position: 'topright',
  },

  onAdd: function (map) {
    var controlDiv, controlUI;
    controlDiv = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    controlUI  = L.DomUtil.create('i', 'ion-android-close', controlDiv);

    controlDiv.style.backgroundColor = "white";
    controlDiv.style.width           = '26px';
    controlDiv.style.height          = '26px';
    controlDiv.style.cursor          = 'pointer';
    controlUI.style.fontSize         = '20px';
    controlUI.style.lineHeight       = '1.35';
    controlUI.style.margin           = '7px';

    L.DomEvent
      .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
      .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
      .addListener(controlDiv, 'click', function () {
        $(this).closest(".visible").removeClass("visible");
      });

    controlUI.title = 'Close';
    return controlDiv;
  }
});

L.Control.close = function(options) {
  return new L.Control.Close(options);
}

// Pop-up map class
// Inset map bound to a particular location
// ----------------------------------------------------------------------------
function PopupMap(center, domElement) {
  this.map         = {};
  this.center      = center;
  this.defaultZoom = 9;
  this.maxZoom     = 12;
  this.minZoom     = 5;
  this.geojson     = geojsonFeature;
  this.tiles       = "http://pelagios.org/tilesets/imperium/{z}/{x}/{y}.png";
  this.attribution = "Tiles: Pelagios/DARE";
  this.init(center, domElement);
  this.addTiles();
}

PopupMap.prototype = {
  init: function(center, domElement) {
    this.map = L.map(domElement, {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    }).setView(center, this.defaultZoom);
    this.map.scrollWheelZoom.disable();
    var closeButton = L.Control.close();
    this.map.addControl(closeButton);
  },
  addTiles: function() {
    L.tileLayer(this.tiles, {
      attribution: this.attribution
    }).addTo(this.map);
  }
}

// GeoMap Class
// Large/full-screen map initialized on the #map element on a page
// ----------------------------------------------------------------------------
function GeoMap(center) {
  this.map         = {};
  this.el          = 'map';
  this.center      = [37.0, 35.5];
  this.defaultZoom = 7;
  this.maxZoom     = 12;
  this.minZoom     = 5;
  this.tiles       = "http://pelagios.org/tilesets/imperium/{z}/{x}/{y}.png";
  this.attribution = "Tiles <a href='http://dare.ht.lu.se/'>Pelagios/DARE</a>" +
                     "<a href='http://creativecommons.org/licenses/by-sa/3.0/'>" +
                     "CC-BY-SA 3.0</a>";
  this.geojson     = geojsonFeature;

  // Run these methods on instantiation
  this.init(center);
  this.addTiles();

  // Populate map
  var catalogueLabels = L.geoJson(this.geojson, {
    filter: function (feature, layer) {
      return feature.properties.catalogue;
    },
    pointToLayer: this.addCatalogueLabels,
    onEachFeature: this.addPopups,
  });

  this.map.addLayer(catalogueLabels);
}

// GeoMap Methods
GeoMap.prototype = {
  // Initialize Map
  init: function(center) {
    this.map = L.map(this.el, { 
      maxZoom: this.maxZoom, 
      minZoom: this.minZoom 
    }).setView(center, this.defaultZoom);
    this.map.scrollWheelZoom.disable();
  },
  // Add Tiles
  addTiles: function() {
    L.tileLayer(this.tiles, {
      attribution: this.attribution,
      errorTileUrl: "/assets/images/empty.png",
    }).addTo(this.map);
  },
  // Add Labels
  addCatalogueLabels: function(feature, latlng) {
    return L.marker(latlng);
  },
  // Add Popup content
  addPopups: function(feature, layer) {
    var props, popupMsg, cat_ids, linkedEntries, pleiadesUrl, popupOptions;
    var locationName;
    props         = feature.properties;
    locationName  = props.customName;
    popupMsg      = "<h4 class='feature-name'>" + props.custom_name + "</h4>";
    cat_ids       = props.catalogue;
    pleiadesUrl   = "http://pleiades.stoa.org/places/" + props.pleiades;
    popupOptions  = { minWidth: 100, maxHeight: 250 };

    linkedEntries = _.filter(window.CATALOGUE, function(entry) {
      return _.includes(cat_ids, entry.cat);
    });

    if (linkedEntries.length > 0) {
      locationName = _(linkedEntries[0].location).capitalize();
      popupMsg     = "<h4 class='feature-name'>" + locationName + "</h4>";
      popupMsg     += "<strong>Catalogue Entries:</strong><ul>";

      linkedEntries.forEach(function(entry) {
        var entryURL, currentEntry;
        if ( entry.cat < 9 || entry.cat > 19) {
          entryURL = "/catalogue/" + entry.cat + "/";
        } else {
          entryURL = "/catalogue/9-19/";
        }
        popupMsg += "<li><a href='" + entryURL + "'>";
        popupMsg += entry.cat + ". ";
        popupMsg += entry.title;
        popupMsg += "</a></li>";
      });
      popupMsg += "</ul>";
    }
    layer.bindPopup(popupMsg, popupOptions);
  }
};
