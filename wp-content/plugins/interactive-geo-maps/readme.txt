=== Interactive Geo Maps ===
Contributors: carlosmoreirapt
Tags: map, interactive map, world map, travel map, us map
Requires at least: 5.0
Tested up to: 5.5
Requires PHP: 7.0
Stable tag: 1.2.10
Donate link: https://interactivegeomaps.com
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Create interactive vector maps of the world, continents, any country in the world and specific regions, including individual US state county maps.

== Description ==

Create interactive maps with regions and coloured markers. You can display the world map, continent maps and single country maps.

[Demo](https://interactivegeomaps.com/features) | [Available Maps](https://interactivegeomaps.com/maps/) | [Documentation](https://interactivegeomaps.com/documentation/) | [Pro Version](https://interactivegeomaps.com/pricing/)

= More than 250 maps available =
- World map (with and without Antarctica)
- World map divided by continents (different variations)
- Maps of continents and regions (Africa, Asia, Caribbean, Central America, Europe, Latin America, Middle East, North America, Oceania, South America )
- US States divided by counties (California, Texas, Florida, New York and all the others)
- Mexico county maps
- Canada county maps
- Most countries in the world, including United States of America (USA), Germany, France, United Kingdom (UK), Netherlands, Spain, Australia, Italy, Poland, South Africa, Brazil, India, Japan and many others.
- Some countries with different map variations like France, divided by regions or departments, Portugal divided by districts or municipalities, among others.

Create your first interactive map in minutes! Use it to display your visited countries map, travel map, office locations, projects map, representatives map, statistics map, data visualization map or any other thing!

[Browse Full List of Maps](https://interactivegeomaps.com/maps/)

= Features =
- Create as many maps as you want
- Responsive and cross-device
- Color countries
- Add round coloured markers
- Set hover color change
- Set click actions, like open a new window
- Choose from different map projections (Mercator, Miller, NaturalEarth1, among others)
- Select which regions to display in a map
- Exclude specific regions from a map
- Display HTML tooltips on hover
- Zoom controls and Pan

= Pro only Features =
- Colour regions and markers individually
- Change initial zoom and center
- Cluster markers
- Add Legend
- Custom images as markers
- Vector icons as markers
- Text Labels
- Display content on click outside the map
- Display content in a lightbox
- Group regions
- Create heatmaps (choropleth maps)
- Add lines connecting markers
- Overlay different maps (have US states map on world map for example)
- Populate map automatically from existing categories or Tags
- Advanced zoom options

[Features Examples](https://interactivegeomaps.com/features/) | [Go Pro](https://interactivegeomaps.com/pricing/)

The plugin generates interactive, responsive, touch-enabled SVG maps which are embeded directly into your HTML5 pages and compatible with all modern browsers and devices.

= Privacy Information & External Services =
This plugin will build the maps using the [amcharts visualization library](https://www.amcharts.com/javascript-charts/) which provides hundreds of different maps. The plugin loads some files from their CDN to build the map and display it on your page. You won't need to have a amcharts account for the maps to work. More information about their [amcharts Privacy Policy](https://www.amcharts.com/privacy-policy/).
When you first install the plugin, you can choose to [opt-in to share non-sensitive data with Freemius](https://interactivegeomaps.com/docs/opt-in-to-non-sensitive-diagnostic-tracking/), a framework we use to collect data about your WordPress installation that will help us improve the plugin. This is optional and the plugin will still work if you don't opt-in. It will not collect any data from your visitors.

== Frequently Asked Questions ==
= Do I need an amcharts account or license for the plugin to work? =
No, you won't need any license or specific account. The plugin will work out of the box.

= Do I need a Google Maps API Key for the plugin to work? =
No, you won't need one. The plugin will not use the Google Maps API. However you can add a Google Maps API Key in the settings of the plugin to enable geocoding when adding markers and therefore get the latitude and longitude directly in the plugin's administration.

= Where can I get coordinates for a marker? =
You can get the latitude and longitude needed to a add a marker to a map using sites like [GetLatLong](https://getlatlong.net/) or [LatLong.net](https://www.latlong.net/) or any other similar website. Optionally, you can add a Google Maps API Key in the settings page of the plugin and this will enable you to get the coordinates directly in the map administration panel, when adding a maker. In this case, Google's geocoding service is only used in the administration to get the coordinates, it won't be used when the map displays in your pages.

= Where can I learn how to use the plugin? =
You can visit the [documentation pages on the official website](https://interactivegeomaps.com/documentation/).


== Screenshots ==
1. World map example
2. Add HTML Tooltips to your maps
3. USA Map
4. US county maps example
5. World Map with coloured countries
6. Single country map
7. Administration 01
8. Administration 02
9. Administration 03
10. Administration 04

== Changelog ==
= 1.2.10 =
[Pro] zoom to cluster markers improvements

= 1.2.9 =
* [Pro] Auto Labels bug fix
* Saltus framework updates

= 1.2.8 =
* Code improvements to prevent conflicts
* [Pro] Marker actions bug fix
* [Pro] Drilldown bug fix

= 1.2.7 =
* Code Improvements - Saltus Framework update

= 1.2.6 =
* [Pro] Cluster Markers improvements

= 1.2.5 =
* Bug fix in admin screen
* [Pro] Heatmap ranges for markers
* [Pro] Marker clusters improvements

= 1.2.4 =
* New maps: Norway, Montenegro, Iran and South Sudan
* [Pro] Overlay bug fixed
* [Pro] Option to enable visual map (OpenStreetMaps) for coordinates fields

= 1.2.3 =
* Grouped Regions bug fix
* Asia map default zoom fix

= 1.2.2 =
* Bug fixes
* New setting options and reviewed labels
* Warning when click action is not selected

= 1.2.1 =
* [Pro] Legend bug fixed
* [Pro] JSON source improvements

= 1.2.0 =
* Elementor Widget added
* Better assets loading in admin
* Marker selection tap bug solved
* [Pro] Allow heatmap value reference to have dot notation

= 1.1.13 =
* Allow files to load async - beta
* [Pro] Custom taxonomy as map regions source

= 1.1.12 =
* Fixed bug causing bulk editing to be broken
* [Pro] overlay map options are not now sortable

= 1.1.11 =
* [Pro] trigger custom action on custom json data source bug fixed
* [Pro] allow styles when sanitizing action content
* [Pro] improve group hover behaviour on Select
* [Pro] extra options for JSON data source
* Added better javascript methods to maps manager object
* Improve sanitizing meta info on save

= 1.1.9 =
* [Pro] label position bug fixed

= 1.1.8 =
* New maps: UK Countries (consists of England, Scotland, Wales, North Ireland, with Ireland for shape consistency), World Timezones, British Indian Ocean Territory, Cayman Islands, Cocos (Keeling) Islands, Comoros.
* Update to amcharts v4.9.10
* [Pro] Option have external dropdown

= 1.1.7 =
* [Pro] Improved fullscreen behaviour
* [Pro] Option to have external/bigger zoom controls on mobile
* [Pro] Option to set custom toolip Template for each series of data
* [Pro] Option load specific amcharts version and setup locale

= 1.1.6 =
* Live preview improvements
* [Pro] Touch devices options - drag grip and tap to activate
* [Pro] Bug fix on labels, preventing actions from running
* [Pro] Fullscreen feature improvements
* [Pro] Option to allow empty overlay

= 1.1.5 =
* [Pro] Button to expand the map full screen
* [Pro] Fix bug on display content actions
* [Pro] Callback function added

= 1.1.4 =
* Workaround New Zealand and Russia default projections offset
* New maps: Bahamas, Eritrea, Ethiopia, Gambia, Ghana, Guinea Bissau, Guyana, Kuwait, Laos, Libya, Luxembourg, Madagascar, Mozambique, Myanmar, Niger, North Macedonia, Rwanda, Sierra Leone, Suriname, Togo, Turkmenistan.
* [Pro] Option to display live filter of overlay maps
* [Pro] Labels improvements and bug fixes
* [Pro] Bug fix for click action not being triggered in some markers
* [Pro] Bug fix for Legend not hilighting markers

= 1.1.3 =
* [Pro] Option to add label below round markers and icon markers automatically
* [Pro] Active state color option for regions
* [Pro] Custom json as source for regions
* [Pro] Custom Legend Option
* [Pro] Labels bug fixed
* [Pro] Group regions fix
* [Pro] Marker Pro Actions bug fix
* Allow decimal values on border width option

= 1.1.2 =
* Translation improvements
* [Pro] Render shortcodes in tooltip

= 1.1.1 =
* New Maps for Cuba, Jamaica, Uruguay and Mexican county maps
* [Pro] Customize tooltip shadow options

= 1.1.0 =
* Improved compatibility with Elementor
* [Pro] Custom Action bug fixed

= 1.0.9 =
* Improved loading of assets to workaround cache
* Added Actions to help adding markers and regions
* Forced amcharts version to 4.8.0 (4.8.1 introduced a hover bug)

= 1.0.8 =
* Improved group hover
* Added new maps (Canada regions and other world maps)
* [Pro] Fix group hover bug
* [Pro] Improved Lightbox feature

= 1.0.7 =
* Fix conflict with Async Javascript plugin
* [Pro] Improved feature to drag auto Labels
* [Pro] Fixed bug when initial zoom was changed
* [Pro] Fixed bug with Albers projection
* [Pro] Better handling of Pro Actions

= 1.0.6 =
* Upgrade option introduced
* Remove drag/resize on mobile

= 1.0.5 =
* Freemius OptIn added
* Zoom in preview bug fix
* Map List Update

= 1.0.4 =
* Disable drag when zoom is disabled
* Gutenberg block bug fix (ccs class)
* Small code improvements

= 1.0.3 =
* Extra maps for Portugal added
* Tooltip improvements to handle images
* Preview bugs fixed

= 1.0.2 =
* Zoom Controls added (Settings > Map Features )
* Automatic line breaks in tooltips
* Option to enable rich editor for the tooltip (Settings > Editing )

= 1.0.1 =
* Gutenberg Block
* Map Image Preview
* PHP 7 compatibility

= 1.0 =
* Initial Release

== Upgrade Notice ==
= 1.1.3 =
* Bug fixes and new features


== Credits ==
* [amcharts](https://www.amcharts.com/)
* [jsonTree](http://github.com/summerstyle/jsonTreeViewer)
* [autocomplete](https://kraaden.github.io/autocomplete/)
* [unDraw](https://undraw.co/) - Banner Illustrations
* [Codestar Framework](http://codestarframework.com/)
* [Extended CPTs](https://github.com/johnbillion/extended-cpts)