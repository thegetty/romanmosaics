require "spec_helper"

describe "search", :type => :feature, js: true do
  before do
    visit "/"
  end

  it "contains a .search-results element on the page" do
    page.should have_selector ".search-results"
  end

  it "hides search results by default" do
    ".search-results".should_not have_selector ".search-active"
  end

  it "opens the search mode when search is clicked", :driver => :selenium do
    page.find("#navbar-search").click
    page.should have_selector ".search-active"
    page.fill_in("search", :with => "Rome")
    page.should have_selector(".search-results-list-item", :count => 12)
  end
end
