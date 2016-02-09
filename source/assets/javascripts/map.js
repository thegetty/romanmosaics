// require vendor/leaflet
// require geojson

function GeoMap(center) {
  this.map         = {};
  this.el          = 'map';
  this.center      = [37.0, 35.5];
  this.defaultZoom = 7;
  this.maxZoom     = 12;
  this.minZoom     = 5;
  this.tiles       = "http://pelagios.org/tilesets/imperium/{z}/{x}/{y}.png";
  this.attribution = "Tiles <a href='http://dare.ht.lu.se/'>Pelagios/DARE</a> <a href='http://creativecommons.org/licenses/by-sa/3.0/'>CC-BY-SA 3.0</a>";
  this.geojson     = geojsonFeature;

  this.init(center);
  this.addTiles();
}

GeoMap.prototype = {
  init: function(center) {
    this.map = L.map(this.el, { maxZoom: this.maxZoom, minZoom: this.minZoom })
                .setView(center, this.defaultZoom);
  },
  addTiles: function() {
    L.tileLayer(this.tiles, { attribution: this.attribution }).addTo(this.map);
  }
};
