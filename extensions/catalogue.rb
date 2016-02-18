require_relative "catalogue_resource"

class Catalogue < Middleman::Extension
  option :catalogue_path, "catalogue.json"
  expose_to_template :sort_catalogue_contents, :catalogue_sections

  def initialize(app, options_hash = {}, &block)
    super
    puts @app
  end

  def manipulate_resource_list(resources)
    resources.push Middleman::Sitemap::CatalogueResource.new(
      @app.sitemap,
      @options[:catalogue_path])
    resources
  end

  # Sort Catalogue Contents
  # returns an array of resource objects ordered by sort_order attribute
  def sort_catalogue_contents
    contents = @app.sitemap.resources.find_all { |p| p.data.sort_order }
    contents.sort_by { |p| p.data.sort_order }
  end

  # Get Catalogue Sections
  # Returns 3 arrays of resource objects (frontmatter, catalogue, backmatter)
  def catalogue_sections
    contents    = sort_catalogue_contents
    frontmatter = contents.find_all { |p| p.data.sort_order <= 10 }
    backmatter  = contents.find_all { |p| p.data.sort_order > 100 }
    catalogue   = contents.find_all do |p|
      p.data.sort_order > 10 && p.data.sort_order <= 100
    end
    frontmatter.sort_by! { |p| p.data.sort_order }
    catalogue.sort_by! { |p| p.data.sort_order }
    backmatter.sort_by! { |p| p.data.sort_order }

    return frontmatter, catalogue, backmatter
  end

  helpers do
    def author_name
      author = data.book.creators.first
      "#{author.first_name} #{author.last_name}"
    end
    # ---------------------------------------------------------------------------
    # Data attribute methods
    # The following helper methods provide data which can be stashed in data-
    # attributes of elements in templates. Use them to store information from
    # YAML data files for future consumption by front-end JS.

    # Define Term helper method
    # Expects a term (string)
    # looks for term in the definitions.yml file and returns its definition
    def define_term(term)
      data.definitions.find { |entry| entry.id == term }.definition
    end

    # Location helper method
    # Expects a location ID (string)
    # Looks up the location in locations.yml and returns its id
    # In the future this method could do more if more data exists in this file
    def location(loc_id)
      data.locations.find { |loc| loc.id == loc_id }.id
    end

    # Pic helper method
    # Expects a pic id (string)
    # Returns a serialized json object
    def pic(pic_id)
      data.pics.find { |pic| pic.id == pic_id }.to_json
    end

    # Lookup Catalogue Entry
    # expects a cat number (int)
    # returns a hash of entry data or nil if no entry is found
    def lookup_entry(cat)
      data.catalogue.find { |entry| entry.cat == cat }
    end

    # Previous Chapter Path
    # Does not expect an argument (pulls data from current_page)
    # Returns the path of the previous chapter or false if prev chapter does not
    # exist. This method also checks if the chapter is the first in a given
    # section and pulls the last chapter from the previous section if so.
    def prev_chapter_path
      return false unless current_page.data.sort_order
      curr = current_page.data.sort_order
      frontmatter, catalogue, backmatter = catalogue_sections
      case curr
      when frontmatter.first.data.sort_order
        prev_chapter = false
      when catalogue.first.data.sort_order
        prev_chapter = frontmatter.last
      when backmatter.first.data.sort_order
        prev_chapter = catalogue.last
      else
        prev_chapter = sitemap.resources.find { |p| p.data.sort_order == curr - 1 }
      end

      prev_chapter ? prev_chapter : false
    end

    # Next Chapter Path
    # Does not expect an argument (pulls data from current_page)
    # Returns the path of the next chapter or false if next chapter does not
    # exist. This method also checks if the chapter is the last in a given
    # section and pulls the first chapter from the next section if so.
    def next_chapter_path
      return false unless current_page.data.sort_order
      curr = current_page.data.sort_order
      frontmatter, catalogue, backmatter = catalogue_sections
      case curr
      when frontmatter.last.data.sort_order
        next_chapter = catalogue.first
      when catalogue.last.data.sort_order
        next_chapter = backmatter.first
      when backmatter.last.data.sort_order
        next_chapter = false
      else
        next_chapter = sitemap.resources.find { |p| p.data.sort_order == curr + 1 }
      end

      next_chapter ? next_chapter : false
    end
  end
end

::Middleman::Extensions.register(:catalogue, Catalogue)
