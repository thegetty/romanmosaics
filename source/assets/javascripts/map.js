//= require vendor/leaflet
//= require vendor/underscore-min
//= require geojson

// GeoMap Properties
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
  console.log(this.catalogue);

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
      attribution: this.attribution
    }).addTo(this.map);
  },
  // Add Labels
  addCatalogueLabels: function(feature, latlng) {
    return L.marker(latlng);
  },
  // Add Popup content
  addPopups: function(feature, layer) {
    var props         = feature.properties;
    var popupMsg      = "<h4 class='feature-name'>" + props.custom_name + "</h4>";
    var linkedEntries = props.catalogue;
    var pleiadesUrl   = "http://pleiades.stoa.org/places/" + props.pleiades;
    var popupOptions  = { minWidth: 100, maxHeight: 250 };

    if (linkedEntries) {
      popupMsg += "<strong>Catalogue Entries:</strong><ul>";

      linkedEntries.forEach(function(num) {
        var entryURL, currentEntry;

        currentEntry = _.find(window.CATALOGUE, function(entry) {
          return entry.cat == num;
        });

        if (currentEntry.cat < 9 || currentEntry.cat > 19) {
          entryURL = "/catalogue/" + currentEntry.cat + "/";
        } else {
          entryURL = "/catalogue/9-19/";
        }

        popupMsg += "<li><a href='" + entryURL + "'>";
        popupMsg += currentEntry.cat + ". ";
        popupMsg += currentEntry.title;
        popupMsg += "</a></li>";
      });

      popupMsg += "</ul>";
    }

    layer.bindPopup(popupMsg, popupOptions);
  }
};
