require "extensions/search"
require "extensions/catalogue"

activate :search
activate :catalogue
activate :directory_indexes
activate :autoprefixer
activate :sprockets do |c|
  c.expose_middleman_helpers = true
end

set :relative_links, true
set :css_dir, "assets/stylesheets"
set :js_dir, "assets/javascripts"
set :images_dir, "assets/images"
set :fonts_dir, "assets/fonts"
set :layout, "layouts/application"
set :markdown, :parse_block_html => true

page "/*.xml", layout: false
page "/*.json", layout: false
page "/*.txt", layout: false

configure :development do
  activate :livereload
end

configure :build do
  activate :relative_assets
  activate :minify_html
  activate :minify_css
  activate :minify_javascript
  activate :gzip
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.deploy_method = :git
end

helpers do
  def baseurl
    if environment? :development
      ""
    elsif environment? :production
      "/publications/romanmosaics"
    end
  end

  def og_image_path
    "http://www.getty.edu#{baseurl}/assets/images/og_cover.jpg"
  end
end
