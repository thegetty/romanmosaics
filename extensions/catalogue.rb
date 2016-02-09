require_relative "catalogue_resource"

class Catalogue < Middleman::Extension
  option :catalogue_path, "catalogue.json"

  def initialize(app, options_hash = {}, &block)
    super
  end

  def manipulate_resource_list(resources)
    resources.push Middleman::Sitemap::CatalogueResource.new(
      @app.sitemap,
      @options[:catalogue_path])
    resources
  end
end

::Middleman::Extensions.register(:catalogue, Catalogue)
