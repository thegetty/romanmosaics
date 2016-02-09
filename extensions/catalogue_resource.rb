module Middleman
  module Sitemap
    class CatalogueResource < ::Middleman::Sitemap::Resource
      def initialize(store, path)
        super(store, path)
      end

      def template?
        false
      end

      def get_source_file
        path
      end

      def render(opts = {}, locs = {})
        @app.data.catalogue.to_json
      end
    end
  end
end
