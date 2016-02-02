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

  def prev_chapter_path
    return false unless current_page.data.sort_order
    curr = current_page.data.sort_order
    prev_chapter = sitemap.resources.find { |p| p.data.sort_order == curr - 1 }

    prev_chapter ? prev_chapter.url : false
  end

  # Next Chapter link
  # does not expect an argument (pulls data from current_page)
  # returns the path of the next chapter or false if next chapter does not exist
  def next_chapter_path
    return false unless current_page.data.sort_order
    curr = current_page.data.sort_order
    next_chapter = sitemap.resources.find { |p| p.data.sort_order == curr + 1 }

    next_chapter ? next_chapter.url : false
  end
end
