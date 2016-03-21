//= require vendor/leaflet
//= require vendor/underscore-min

// Deep Zoom Class
// ----------------------------------------------------------------------------
// Initialized with a Cat number (integer) and a Zoom Data object (containing the
// properties listed in the plates.yml file for a given image)

// Properties
function DeepZoom(catnum, zoomData) {
  this.baseurl = "http://gettypubs.github.io/maptiles/mosaics/";
  this.bounds  = {};
  this.cat     = catnum;
  this.layers  = {};
  this.map     = {};
  this.minZoom = 1;

  this.maxZoom = zoomData.max_zoom;
  this.height  = zoomData.height;
  this.width   = zoomData.width;

  // Run on instantiation
  this.map = this.init();
  if (Array.isArray(this.cat)) {
    this.addMultipleLayers();
  } else {
    this.addSingleLayer();
  }
}

// Methods
DeepZoom.prototype = {
  init: function() {
    // Create map
    this.map = L.map('plate', {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      crs: L.CRS.Simple,
      attributionControl: false
    }).setView([0, 0], this.maxZoom);
    // Set bounds
    this.bounds = new L.LatLngBounds(
      this.map.unproject([0, this.height], this.maxZoom),
      this.map.unproject([this.width, 0], this.maxZoom)
    );
    this.map.fitBounds(this.bounds);
    this.map.scrollWheelZoom.disable();
    return this.map;
  },

  addSingleLayer: function() {
    L.tileLayer(this.baseurl + this.cat + "/{z}/{x}/{y}.png",
      {
        bounds: this.bounds,
        errorTileUrl: "/mosaics/assets/images/empty.png",
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        noWrap: true,
        tms: false
      }
    ).addTo(this.map);
  },

  addMultipleLayers: function() {
    var parent = this;
    this.cat.forEach(function(catNum) {
      var layerName, layerPath, layerData, layerBounds;
      layerName = "Cat. " + catNum;
      layerPath = parent.baseurl + catNum + "/{z}/{x}/{y}.png";
      layerData = _.find(window.PLATES, function(plate) {
        return plate.id == catNum;
      });
      layerBounds = new L.LatLngBounds(
        parent.map.unproject([0, layerData.height], layerData.max_zoom),
        parent.map.unproject([layerData.width, 0], layerData.max_zoom)
      );
      parent.layers[layerName] = L.tileLayer(layerPath, {
        bounds: layerBounds,
        errorTileUrl: "/mosaics/assets/images/empty.png",
        maxZoom: layerData.max_zoom,
        minZoom: layerData.min_zoom,
        noWrap: true,
        tms: false
      });
    });
    this.addLayerControl();
  },

  addLayerControl: function() {
    // Leaflet control object can accept 3 arguments
    // First arg = baselayers (one at a time)
    // second arg = overlay layers (can be toggled on/off individually)
    // third arg = options object for additional configuration
    L.control.layers(this.layers, null, {
      collapsed: false,
      position: "topright"
    }).addTo(this.map);

    var mainLayer = "Cat. " + this.cat[0];
    this.map.addLayer(this.layers[mainLayer]);

    // Subscribe to baselayerchange events
    var parent = this;
    this.map.on("baselayerchange", function(e){
      // e.layer is the new layer which has been added
      // e.layer.options.bounds = the bounding coordinates of this layer
      // by calling map.fitBounds() and passing this, we can zoom the new layer to fit
      parent.map.fitBounds(e.layer.options.bounds);
    });
  }
};
