# If you do not have OpenSSL installed, change
# the following line to use "http://"
source "https://rubygems.org"

# Uncomment these gems if you are using Windows
# gem "wdm", "~> 0.1.0", platforms: [:mswin, :mingw]
# gem "tzinfo-data", platforms: [:mswin, :mingw, :jruby]

gem "bourbon", "~> 4.2"
gem "middleman", "~> 4.0"
gem "middleman-autoprefixer", "~> 2.6"
gem "middleman-deploy", "= 2.0.0.pre.alpha"
gem "middleman-livereload", "~> 3.4"

# gem "middleman-sprockets", "= 4.0.0.rc.1"
# gem "middleman-sprockets", "= 4.0.0.rc.2"
gem "middleman-sprockets", github: "middleman/middleman-sprockets"

gem "neat", "~> 1.7"
gem "sassc", "~> 1.8"
gem "sanitize"
gem "slugify"
gem "rubyzip"

# Testing
group :test do
  gem "rspec"
  gem "capybara"
  # Use the qt-fix branch of capybara-webkit until qt5 is available
  gem "capybara-webkit", git: 'git://github.com/thoughtbot/capybara-webkit.git', branch: 'qt-4.8-fix'
  gem "selenium-webdriver"
end
