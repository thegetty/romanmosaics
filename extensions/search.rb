require_relative "search_index_resource"

class Search < Middleman::Extension
  option :index_path, "search.json"

  def initialize(app, options_hash = {}, &block)
    super
  end

  def manipulate_resource_list(resources)
    resources.push Middleman::Sitemap::SearchIndexResource.new(
      @app.sitemap,
      @options[:index_path])
    resources
  end

  def search_index_path
    "/" + sitemap.find_resource_by_path(
      extensions[:search].options[:index_path]
    ).destination_path
  end

end

::Middleman::Extensions.register(:search, Search)
