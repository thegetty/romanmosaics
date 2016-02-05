require "sanitize"

module Middleman
  module Sitemap
    class SearchIndexResource < ::Middleman::Sitemap::Resource
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
        page_index = build_page_index
        page_index.to_json
      end

      def build_page_index
        index = []
        pages = @app.sitemap.resources.find_all { |p| p.data.sort_order }
        pages.each_with_index do |resource, id|
          next if resource.data["index"] == false
          item = {
            :id       => id,
            :title    => resource.data.title.to_s,
            :url      => resource.url,
            :cat      => resource.data.cat.to_s,
            :inv      => "",
            :material => "",
            :location => "",
            :culture  => "",
            :contents => Sanitize.fragment(resource.render(:layout => false))
          }
          if resource.data.cat.is_a? Integer
            entry = lookup_entry(resource.data.cat)
            item[:title]    = entry.title
            item[:inv]      = entry.inv
            item[:material] = entry.material
            item[:location] = entry.location
            item[:culture]  = entry.culture
          end

          index.push(item)
        end
        index
      end

      def lookup_entry(cat)
        @app.data.catalogue.find { |entry| entry.cat == cat }
      end
    end
  end
end
