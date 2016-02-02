module CatalogueHelpers
  # Sort Catalogue Contents
  # returns an array of resource objects ordered by sort_order attribute
  def sort_catalogue_contents
    contents        = sitemap.resources.find_all {|p| p.data.sort_order }
    contents.sort_by {|p| p.data.sort_order }
  end

  # Lookup Catalogue Entry
  # expects a cat number (int)
  # returns a hash of entry data or nil if no entry is found
  def lookup_entry(cat)
    data.catalogue.find { |entry| entry.cat == cat }
  end
end
