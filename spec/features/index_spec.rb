require "spec_helper"

describe "index", :type => :feature, js: true do
  before do
    visit "/"
  end

  it "has correct cover title" do
    page.should have_selector ".cover-title"
    within ".cover-title" do
      page.should have_content(/Roman Mosaics/i)
    end
  end

  it "has correct subtitle" do
    page.should have_selector ".cover-subtitle"
    within ".cover-subtitle" do
      page.should have_content(/In the J. Paul Getty Museum/i)
    end
  end

  it "has a map" do
    page.should have_selector "#map"
  end

  it "has a menu button" do
    page.should have_selector "#navbar-menu"
  end

  it "should have a nav menu" do
    page.should have_selector ".nav-sidebar"
  end

  it "should go to the TOC page when TOC link is clicked" do
    within ".cover-copy" do
      click_link "Contents"
      current_path.should eq("/contents/")
    end
  end

  it "should open the nav menu when icon is clicked", :driver => :selenium do
    page.find("#navbar-menu").click
    page.should have_selector ".nav-sidebar.is-visible"
  end

  it "successfully initializes leaflet.js", :driver => :selenium do
    page.should have_selector ".leaflet-container"
  end
end
