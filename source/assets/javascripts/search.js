//= require vendor/vue
//= require vendor/vue-resource.min
//= require vendor/lunr.min


// Make search index global for now
var SearchIndex = lunr(function () {
  this.field('title', { boost: 100 });
  this.field('contents', { boost: 10 });
  this.field('location', { boost: 50 });
  this.field('material', { boost: 10 });
  this.field('culture', { boost: 10 });
  this.field('inv', { boost: 10 });
});

// Vue component
Vue.config.debug = true;

var Search = {
  el: "#js-nav",
  data: {
    contents: [],
    query: "",
    loaded: false,
    url: "http://gettypubs.github.io/mosaics/search.json"
  },
  computed: {
    searchResults: function () {
      var results = [];
      var query = this.$get("query");
      var contents = this.$get("contents");

      SearchIndex.search(query).forEach(function(result) {
        var item = {
          title: contents[result.ref].title,
          url: "/mosaics" + contents[result.ref].url
        };

        results.push(item);
      });

      return this.loaded ? results : [];
    }
  },
  methods: {
    // Stash search.json data into contents array to cross-reference against
    // search results
    contentList: function (data) {
      this.$set("contents", data);
    },
    // Load the search.json data via AJAX and feed it to the Lunr index instance
    // This function should only be called through explicit action on the part
    // of the user, as it makes a network request for a potentially large
    // amount of data (a few hundred KB for full text search)
    loadSearchIndex: function () {
      if ( !this.loaded ) {
        this.$http({url: this.url, method: 'GET'}).then(function(response) {
          this.lunrSetup(response.data);
          this.contentList(response.data);
          this.$set("loaded", true);
        }, function (response) {
          console.log("Error...");
        });
      }
    },
    // Feed json data of site text content into the pre-existing Lunr index
    // so it can be queried
    lunrSetup: function (data) {
      // Populate the index with our data
      data.forEach(function (item) {
        SearchIndex.add(item);
      });
    },
  },
  destroyed: function () {
    this.$set("query", "");
    console.log("Destroyed successfully");
  }
};
