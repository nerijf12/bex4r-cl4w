"use strict";
/* jshint node: true */
/* global Promise */
/* jshint browser: true */
/* global am4maps */
/* global am4core */
/* global iMapsData */
/* global geocluster */
/* global iMapsRouter */
/* global iMaps */
/* jshint esversion:5 */


/*
Model Object with methods and helpers to build the maps
*/
var iMapsManager = {};

iMapsManager.maps = {};

iMapsManager.init = function (i) {
	var im = this;
	im.addMap(i);
};

/**
 * Adds maps based on data index
 *
 */
iMapsManager.addMap = function (index) {
	var im = this,
		data = iMapsData.data[index],
		id = data.id,
		map,
		regionSeries,
		markerSeries,
		labelSeries,
		lineSeries,
		clusters,
		mapContainer,
		seriesColumn,
		legendHover,
		legendActive,
		customLegend,
		imageSeries,
		iconSeries,
		graticuleSeries,
		clusterSeries,
		mapVar,
		bgSeries,
		bgImage,
		container = document.getElementById(data.container);

	if (data.disabled) {
		return;
	}

	if (container === null) {
		return;
	}

	// if map was already built
	if (typeof im.maps[id] !== 'undefined') {
		im.maps[id].map.dispose();
	}

	// map container size adjustment
	container.closest(".map_aspect_ratio").style.paddingTop = String(data.visual.paddingTop) + "%";

	if (data.visual.maxWidth !== "") {
		//container.closest(".map_box").style.maxWidth = String(data.visual.maxWidth) + "px";
	}

	if (data.visual.fontFamily !== "" && data.visual.fontFamily !== "inherit") {
		container.closest(".map_box").style.fontFamily = data.visual.fontFamily;
	}

	// create map and a shorter reference to it
	im.maps[id] = {
		map: am4core.create(data.container, am4maps.MapChart),
		series: [],
		clusterSeries: {},
		seriesIndex: {},
		seriesById: {},
		data: data,
		allBaseSeries: [],
		baseRegionSeries: {}
	};

	map = im.maps[id].map;
	clusterSeries = im.maps[id].clusterSeries;

	// ready event
	map.events.on("ready", function (ev) {
		var event = new Event("mapready");
		container.dispatchEvent(event);
	});

	// locale
	if (
		typeof iMapsData.options !== "undefined" &&
		typeof iMapsData.options.locale !== "undefined" &&
		iMapsData.options.locale &&
		typeof window['am4lang_' + iMapsData.options.locale] !== "undefined"
	) {
		map.language.locale = window['am4lang_' + iMapsData.options.locale];
	}

	// enable small map
	if (data.zoom && data.zoom.smallMap && im.bool(data.zoom.smallMap)) {
		map.smallMap = new am4maps.SmallMap();
	}

	// load map geodata
	if (data.map === "custom" || im.bool(data.useGeojson)) {
		map.geodataSource.url = data.mapURL;
	} else {
		mapVar = iMapsRouter.getVarByName(data.map);
		map.geodata = window[mapVar];
	}



	// projection - moved to the end of the function to fix issue with Albers not rendering correctly
	map.projection = new am4maps.projections[data.projection]();

	map.fontFamily = data.visual.fontFamily;

	// export menu
	if (data.exportMenu && im.bool(data.exportMenu.enable)) {
		map.exporting.menu = new am4core.ExportMenu();
		map.exporting.menu.items[0].icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iNS45NDQ3NzMiIGhlaWdodD0iNS45NDQ3NzMiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0ibm9uZSIvPgogPC9nPgoKIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBzdHJva2U9Im51bGwiIGQ9Im0xNC40MjcwMzEsMTUuNzQwNDAxcTAsLTAuMjU3NjQzIC0wLjE4ODI3NCwtMC40NDU5MTd0LTAuNDQ1OTE3LC0wLjE4ODI3NHQtMC40NDU5MTcsMC4xODgyNzR0LTAuMTg4Mjc0LDAuNDQ1OTE3dDAuMTg4Mjc0LDAuNDQ1OTE3dDAuNDQ1OTE3LDAuMTg4Mjc0dDAuNDQ1OTE3LC0wLjE4ODI3NHQwLjE4ODI3NCwtMC40NDU5MTd6bTIuNTM2NzgsMHEwLC0wLjI1NzY0MyAtMC4xODgyNzQsLTAuNDQ1OTE3dC0wLjQ0NTkxNywtMC4xODgyNzR0LTAuNDQ1OTE3LDAuMTg4Mjc0dC0wLjE4ODI3NCwwLjQ0NTkxN3QwLjE4ODI3NCwwLjQ0NTkxN3QwLjQ0NTkxNywwLjE4ODI3NHQwLjQ0NTkxNywtMC4xODgyNzR0MC4xODgyNzQsLTAuNDQ1OTE3em0xLjI2ODM5LC0yLjIxOTY4NWwwLDMuMTcwOTdxMCwwLjM5NjM3NCAtMC4yNzc0NjEsMC42NzM4MzR0LTAuNjczODM0LDAuMjc3NDYxbC0xNC41ODY0NywwcS0wLjM5NjM3NCwwIC0wLjY3MzgzNCwtMC4yNzc0NjF0LTAuMjc3NDYxLC0wLjY3MzgzNGwwLC0zLjE3MDk3cTAsLTAuMzk2Mzc0IDAuMjc3NDYxLC0wLjY3MzgzNHQwLjY3MzgzNCwtMC4yNzc0NjFsNC42MDc4MTYsMGwxLjMzNzc1MSwxLjM0NzY1OXEwLjU3NDczOCwwLjU1NDkyMSAxLjM0NzY1OSwwLjU1NDkyMXQxLjM0NzY1OSwtMC41NTQ5MjFsMS4zNDc2NTksLTEuMzQ3NjU5bDQuNTk3OTA4LDBxMC4zOTYzNzQsMCAwLjY3MzgzNCwwLjI3NzQ2MXQwLjI3NzQ2MSwwLjY3MzgzNGwwLjAwMDAxOCwwem0tMy4yMjA1MjMsLTUuNjM4MzlxMC4xNjg0NTYsMC40MDYyODIgLTAuMTM4NzMsMC42OTM2NTFsLTQuNDM5MzYsNC40MzkzNnEtMC4xNzgzNjUsMC4xODgyNzQgLTAuNDQ1OTE3LDAuMTg4Mjc0dC0wLjQ0NTkxNywtMC4xODgyNzRsLTQuNDM5MzYsLTQuNDM5MzZxLTAuMzA3MTg3LC0wLjI4NzM2OSAtMC4xMzg3MywtMC42OTM2NTFxMC4xNjg0NTYsLTAuMzg2NDY1IDAuNTg0NjQ3LC0wLjM4NjQ2NWwyLjUzNjc4LDBsMCwtNC40MzkzNnEwLC0wLjI1NzY0MyAwLjE4ODI3NCwtMC40NDU5MTd0MC40NDU5MTcsLTAuMTg4Mjc0bDIuNTM2NzgsMHEwLjI1NzY0MywwIDAuNDQ1OTE3LDAuMTg4Mjc0dDAuMTg4Mjc0LDAuNDQ1OTE3bDAsNC40MzkzNmwyLjUzNjc4LDBxMC40MTYxOTEsMCAwLjU4NDY0NywwLjM4NjQ2NXoiIGlkPSJzdmdfMSIvPgogPC9nPgo8L3N2Zz4=";

		map.exporting.menu.align = data.exportMenu.align ? data.exportMenu.align : "right";
		map.exporting.menu.verticalAlign = data.exportMenu.verticalAlign ? data.exportMenu.verticalAlign : "top";
	}

	// touch devices options
	if (data.touchInterface) {
		if (im.bool(data.touchInterface.tapToActivate)) {
			map.tapToActivate = true;
			map.tapTimeout = data.touchInterface.tapTimeout;
		}
		if (im.bool(data.touchInterface.dragGrip)) {
			map.dragGrip.disabled = false;
			map.dragGrip.autoHideDelay = data.touchInterface.dragGripAutoHideDelay;
		}
	}


	// different map center
	//map.deltaLongitude = -10;

	// pan behaviours
	// map.panBehavior = "rotateLongLat";
	// map.panBehavior = "rotateLong";
	// map.deltaLatitude = -20;
	// map.padding(20, 20, 20, 20);

	// visual settings
	map.background.fill = data.visual.backgroundColor;
	map.background.fillOpacity = data.visual.backgroundOpacity;

	// backgroud image
	if (typeof data.visual.bgImage !== 'undefined' && typeof data.visual.bgImage.url !== 'undefined' && data.visual.bgImage.url !== '') {
		bgSeries = map.series.push(new am4maps.MapImageSeries());
		bgSeries.toBack();
		bgImage = bgSeries.mapImages.template.createChild(am4core.Image);
		bgImage.propertyFields.href = "src";
		bgImage.width = map.width;
		bgImage.height = map.height;
		bgSeries.data = [{
			src: data.visual.bgImage.url
		}];
	}

	map.exporting.backgroundColor = data.visual.backgroundColor;
	map.exporting.filePrefix = "interactive_map";
	map.exporting.useWebFonts = false;

	// graticulate - grid lines
	if (data.projection === "Orthographic" && data.grid) {
		graticuleSeries = map.series.push(new am4maps.GraticuleSeries());
		graticuleSeries.mapLines.template.line.stroke = data.grid.color;
		graticuleSeries.mapLines.template.line.strokeOpacity = 1;
		graticuleSeries.fitExtent = false;
		map.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
		map.backgroundSeries.mapPolygons.template.polygon.fill =
			data.grid.projectionBackgroundColor;
	}

	im.handleZoom(id);

	// Auto Legend
	if (data.legend && im.bool(data.legend.enabled)) {
		map.legend = new am4maps.Legend();

		// positioing
		if (data.legend.position === "top" || data.legend.position === "bottom") {
			map.legend.contentAlign = data.legend.align;
			map.legend.valign = data.legend.position;
		} else {
			map.legend.position = data.legend.position;
			map.legend.align = data.legend.position;
			map.legend.valign = data.legend.valign;
		}


		if (typeof data.legend.style !== 'undefined' && data.legend.style !== 'default') {
			im.setLegendStyle(id, map.legend, data.legend.style);
		}

		// interactive
		if (data.legend.clickable === "false") {
			map.legend.itemContainers.template.interactionsEnabled = false;
		}

		if (data.legend.clickable === "toggle") {
			// do nothing, it's the default event
		}

		if (data.legend.clickable === "select") {
			map.legend.itemContainers.template.togglable = false;
			map.legend.itemContainers.template.events.on("hit", function (ev) {

				iMapsManager.clearSelected(id);
				var select = [];

				var seriesType = im.getTargetSeriesType(ev.target.dataItem.dataContext);
				var target = '';

				// currently only works for region series
				if (seriesType === "MapPolygonSeries") {
					ev.target.dataItem.dataContext.mapPolygons.each(function (polygon) {
						if (!polygon.dataItem.dataContext.madeFromGeoData) {
							polygon.setState("active");
							polygon.isActive = true;
							polygon.isHover = false;
							select.push(polygon);
						}
					});
					im.maps[id].selected = select;
				}

			});

			map.legend.itemContainers.template.events.on("over", function (ev) {

				var seriesType = im.getTargetSeriesType(ev.target.dataItem.dataContext);
				var target = '';
				if (seriesType === "MapImageSeries") {
					target = ev.target.dataItem.dataContext.mapImages;
					target.each(function (marker) {
						marker.setState("highlight");
					});
				} else if (seriesType === "MapPolygonSeries") {
					target = ev.target.dataItem.dataContext.mapPolygons;
					target.each(function (polygon) {
						if (!polygon.dataItem.dataContext.madeFromGeoData) {
							polygon.setState("highlight");
						}
					});
				} else {
					return;
				}
			});

			map.legend.itemContainers.template.events.on("out", function (ev) {
				var seriesType = im.getTargetSeriesType(ev.target.dataItem.dataContext);
				var target = '';
				if (seriesType === "MapImageSeries") {
					target = ev.target.dataItem.dataContext.mapImages;
					target.each(function (marker) {
						marker.setState("default");
					});
				} else if (seriesType === "MapPolygonSeries") {
					target = ev.target.dataItem.dataContext.mapPolygons;
					target.each(function (polygon) {
						if (!polygon.dataItem.dataContext.madeFromGeoData) {
							polygon.setState("default");
						}
					});
				} else {
					return;
				}
			});
		}
	}

	// Custom Legend
	if (data.customLegend && im.bool(data.customLegend.enabled)) {
		if (data.customLegend.data && Array.isArray(data.customLegend.data)) {
			customLegend = new am4maps.Legend();
			customLegend.parent = map.chartContainer;
			customLegend.data = data.customLegend.data;

			if (typeof data.customLegend.style !== 'undefined' && data.customLegend.style !== 'default') {

				im.setLegendStyle(id, customLegend, data.customLegend.style);
			}

			// no interaction with mouse
			customLegend.itemContainers.template.clickable = false;
			customLegend.itemContainers.template.focusable = false;
			customLegend.itemContainers.template.hoverable = false;
			customLegend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

			// positioing
			if (data.customLegend.position === "top" || data.customLegend.position === "bottom") {
				customLegend.contentAlign = data.customLegend.align;
				customLegend.valign = data.customLegend.valign;
			} else {
				customLegend.position = data.customLegend.position;
				customLegend.align = data.customLegend.position;
				customLegend.valign = data.customLegend.valign;
			}
		}
	}

	// Create Main Series
	regionSeries = im.pushRegionSeries(id, data);
	im.maps[id].baseRegionSeries = regionSeries;

	// Check for grouped regions
	if (Array.isArray(data.regionGroups) && data.regionGroups.length) {
		im.pushGroupSeries(id, data);
	}


	// Overlay collections - we can add all series in the preset order
	if (Array.isArray(data.overlay) && data.overlay.length) {
		data.overlay.forEach(function (mapObj) {
			im.pushSeries(id, mapObj);
		});
	}


	// Create Other Series - we create them after the overlay to avoid overlap
	if (Array.isArray(data.lines) && data.lines.length) {
		lineSeries = im.pushLineSeries(id, data);
	}

	if (Array.isArray(data.roundMarkers) && data.roundMarkers.length) {
		markerSeries = im.pushRoundMarkerSeries(id, data);

		if (data.clusterMarkers && im.bool(data.clusterMarkers.enabled)) {
			markerSeries.hidden = true;
			clusters = im.setupClusters(data, id);
			clusterSeries[data.clusterMarkers.zoomLevel] = markerSeries;

			// we setup the main index series (zoom=1) to be visible
			// when doing it inside setupClusters function, there was a bug
			if (clusterSeries[1]) {
				clusterSeries[1].hidden = false;
			}
		}
	}

	if (Array.isArray(data.imageMarkers) && data.imageMarkers.length) {
		imageSeries = im.pushImageMarkerSeries(id, data);

		//imageSeries.hiddenInLegend = true;
		im.maps[id].allBaseSeries.push(imageSeries);
	}

	if (Array.isArray(data.iconMarkers) && data.iconMarkers.length) {
		iconSeries = im.pushIconMarkerSeries(id, data);

		//iconSeries.hiddenInLegend = true;
		im.maps[id].allBaseSeries.push(iconSeries);
	}

	if (Array.isArray(data.labels) && data.labels.length) {
		labelSeries = im.pushLabelSeries(id, data);

		//labelSeries.hiddenInLegend = true;
		im.maps[id].allBaseSeries.push(labelSeries);
	}

	// checks if we should display info and creates events.
	im.handleInfoBox(id);

	// map.projection = new am4maps.projections[data.projection]();

};

iMapsManager.setLegendStyle = function (id, legend, style) {
	var sizes = {
		'xsmall': 10,
		'small': 13,
		'regular': 16,
		'large': 19,
		'larger': 23
	};

	var legendSize = sizes[style];
	var legendMarkerTemplate = legend.markers.template;

	legend.labels.template.fontSize = legendSize;
	legend.useDefaultMarker = true;
	legendMarkerTemplate.width = legendSize;
	legendMarkerTemplate.height = legendSize;
};

iMapsManager.handleZoom = function (id) {
	var im = this,
		map = im.maps[id].map,
		data = im.maps[id].data,
		allCurrentSeries = im.maps[id].series,
		allBaseSeries = im.maps[id].allBaseSeries,
		defaultOffset = true,
		defaultZoom = true;

	// Viewport settings

	// Zoom Level
	if (typeof data.viewport !== "undefined" && parseFloat(data.viewport.zoomLevel) >= 1) {
		map.homeZoomLevel = parseFloat(data.viewport.zoomLevel);
		defaultZoom = false;

		// to make sure everything else is disabled by default
		map.seriesContainer.resizable = false;
		map.seriesContainer.draggable = false;
		map.chartContainer.wheelable = false;
	}

	// Home center point
	if (
		typeof data.viewport !== "undefined" &&
		data.viewport.homeGeoPoint &&
		data.viewport.homeGeoPoint.latitude !== 0 &&
		data.viewport.homeGeoPoint.longitude !== 0
	) {
		map.homeGeoPoint = data.viewport.homeGeoPoint;
	}

	// delta Coordinates Offset
	if (typeof data.viewport !== "undefined" && data.viewport.offset) {

		// only change if there are values, otherwise we might messup projections (Albers)
		if (data.viewport.offset.longitude !== '' && data.viewport.offset.longitude !== '0') {
			defaultOffset = false;
			map.deltaLongitude = data.viewport.offset.longitude;
		}
		if (data.viewport.offset.latitude !== '' && data.viewport.offset.latitude !== '0') {
			defaultOffset = false;
			map.deltaLatitude = data.viewport.offset.latitude;
		}

		if (defaultOffset) {
			iMapsManager.latlongOffsetFix(data, map, defaultZoom);
		}

	}

	// manual fixes for NZ and RU and Asia maps
	if (typeof data.viewport === "undefined") {
		iMapsManager.latlongOffsetFix(data, map, defaultZoom);
	}



	// default zoom behaviour
	if (typeof data.zoom === "undefined") {
		// default zoom behaviour when we can't find zoom settings

		if (typeof data.zoomMaster !== "undefined" && im.bool(data.zoomMaster)) {
			map.seriesContainer.draggable = true;
			map.seriesContainer.resizable = true;
			// display zoom controls by default
			map.zoomControl = new am4maps.ZoomControl();
			map.zoomControl.exportable = false;
			map.zoomControl.align = "right";
			map.zoomControl.valign = "bottom";
		} else {
			map.seriesContainer.resizable = false;
			map.seriesContainer.draggable = false;
		}

		map.seriesContainer.events.disableType("doublehit");
		map.chartContainer.background.events.disableType("doublehit");
		map.chartContainer.wheelable = false;
		return;
	}



	// disable drag in Ortographic and leave default for the rest
	if (data.projection !== "Orthographic") {
		map.seriesContainer.draggable = data.zoom ? im.bool(data.zoom.draggable) : false;
		map.seriesContainer.resizable = data.zoom ? im.bool(data.zoom.draggable) : false;

		// don't zoom out to center
		map.centerMapOnZoomOut = false;

		// zoom is enabled, only allowdrag on mobile
		if (
			im.bool(data.zoom.enabled) &&
			!im.bool(data.zoom.draggable) &&
			im.bool(data.zoom.mobileResizable) &&
			(/Mobi|Android/i.test(navigator.userAgent))
		) {
			map.seriesContainer.draggable = true;
			map.seriesContainer.resizable = true;
		}
	} else {
		map.seriesContainer.draggable = false;
		map.seriesContainer.resizable = false;
		map.panBehavior = "rotateLongLat";
	}

	// disable zoom
	if (!im.bool(data.zoom.enabled)) {
		map.maxZoomLevel = parseFloat(data.viewport.zoomLevel);
		map.seriesContainer.events.disableType("doublehit");
		map.chartContainer.background.events.disableType("doublehit");
		map.seriesContainer.draggable = false;
		map.seriesContainer.resizable = false;
	} else {
		// mouse wheel zoom
		map.chartContainer.wheelable = im.bool(data.zoom.wheelable);

		// double click zoom
		if (!im.bool(data.zoom.doubleHitZoom)) {
			map.seriesContainer.events.disableType("doublehit");
			map.chartContainer.background.events.disableType("doublehit");
		}

		if (typeof data.zoom.maxZoomLevel !== 'undefined') {
			map.maxZoomLevel = parseInt(data.zoom.maxZoomLevel);
		}

		// Zoom Controls
		if (im.bool(data.zoom.controls)) {
			map.zoomControl = new am4maps.ZoomControl();
			map.zoomControl.exportable = false;

			map.zoomControl.align = data.zoom.controlsPositions ? data.zoom.controlsPositions.align : "right";
			map.zoomControl.valign = data.zoom.controlsPositions ? data.zoom.controlsPositions.valign : "bottom";

			if (
				typeof data.zoom.homeButton === "undefined" ||
				im.bool(data.zoom.homeButton)
			) {
				// home button
				var homeButton = new am4core.Button();
				homeButton.events.on("hit", function () {
					map.goHome();
					// in case drillDown is enabled, we hide everything else
					if (im.bool(data.drillDownOnClick)) {
						for (var i = 0, len = allCurrentSeries.length; i < len; i++) {
							allCurrentSeries[i].hide();
							//map.deltaLongitude = 0;
						}
						for (var ib = 0, lenb = allBaseSeries.length; ib < lenb; ib++) {
							im.maps[id].allBaseSeries[ib].show();
						}

						iMapsManager.maps[id].isDrilling = false;
					}
				});

				homeButton.icon = new am4core.Sprite();
				homeButton.padding(7, 5, 7, 5);
				homeButton.width = 30;
				homeButton.icon.path =
					"M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
				homeButton.marginBottom = 3;
				homeButton.parent = map.zoomControl;
				homeButton.insertBefore(map.zoomControl.plusButton);
			}
		}

		// outside zoom controls
		if (im.bool(data.zoom.externalControls)) {
			// add home button
			iMapsManager.handleExternalZoom(data.id);
		}
	}

	// full screen button
	if (
		typeof data.fullScreen !== "undefined" &&
		im.bool(data.fullScreen.enabled)
	) {
		// full screen
		var fullScreenButton = map.chartContainer.createChild(am4core.Button);
		fullScreenButton.events.on("hit", function (ev) {

			var parentMap = document.querySelector('#map_' + ev.target.icon.mapID);
			var mainParent = parentMap.closest('.map_wrapper');

			//ev.target.icon.path = iMapsManager.library.icons.exitFullIconPath;
			//ev.target.icon.isFullScreen = true;
			// browser fullscreen
			iMapsManager.openFullscreen(mainParent);
			// set a master option to be used by esc keypress to identify current div in fullscreen
			iMapsManager.isFullScreen = ev.target;

			/* else {
				ev.target.icon.path = iMapsManager.library.icons.goFullIconPath;
				ev.target.icon.isFullScreen = false;
				iMapsManager.closeFullScreen(elem);
				mainParent.classList.toggle('map_fullscreen');
				// set a master option to be used by esc keypress
				iMapsManager.isFullScreen = false;
			} */

		});

		// Add button
		fullScreenButton.align = data.fullScreen.align;
		fullScreenButton.valign = data.fullScreen.valign;
		fullScreenButton.margin(5, 5, 5, 5);
		fullScreenButton.padding(5, 0, 5, 0);
		fullScreenButton.width = 30;
		fullScreenButton.icon = new am4core.Sprite();
		fullScreenButton.icon.path = iMapsManager.library.icons.goFullIconPath;
		fullScreenButton.icon.isFullScreen = false;
		fullScreenButton.icon.mapID = id;

		// if mobile only, add class
		if (im.bool(data.fullScreen.mobileOnly)) {
			fullScreenButton.id = '_fullscreen_button_only_mobile';
		} else {
			fullScreenButton.id = '_fullscreen_button';
		}
	}



	map.events.on("zoomlevelchanged", function (ev) {
		var clusterSeries = im.maps[id].clusterSeries,
			closest,
			zlevel = ev.target.zoomLevel,
			isDrilling = im.maps[id].isDrilling;

		if (isDrilling) {
			return;
		}

		if (clusterSeries && Object.keys(clusterSeries).length) {
			closest = Object.keys(clusterSeries).reduce(function (prev, curr) {
				prev = parseInt(prev);
				curr = parseInt(curr);
				return Math.abs(curr - zlevel) < Math.abs(prev - zlevel) ? curr : prev;
			});

			Object.keys(clusterSeries).forEach(function (key) {
				clusterSeries[key].hide();
				if (parseFloat(key) === closest) {
					clusterSeries[key].show();
				} else {
					clusterSeries[key].hide();
				}
			});
		}
	});
};

/** Manually fix lat/long offset for some countries in default projections/values */
iMapsManager.latlongOffsetFix = function (data, mapObj, defaultZoom) {

	var mapSelected = data.map;

	var mapsFixInclude = [
		'russiaLow',
		'russiaHigh',
		'russiaCrimeaLow',
		'russiaCrimeaHigh',
		'region/world/asiaLow',
		'region/world/asiaHigh',
		'region/world/asiaUltra',
	];

	// only do the fix if Russia is included
	if (mapsFixInclude.includes(mapSelected) && data.exclude && !data.exclude.includes('RU')) {
		mapObj.deltaLongitude = -100;
		if (defaultZoom) {
			mapObj.homeZoomLevel = 1.5;
		}
	}
	if (mapSelected === 'newZealandLow' || mapSelected == 'newZealandHigh') {
		mapObj.deltaLongitude = 20;
	}
};

/**
 * Push region series that are grouped together
 */
iMapsManager.pushGroupSeries = function (id, data) {

	data.regionGroups.forEach(function (group) {

		var newData = {},
			include = group.map(function (a) { return a.id; });
		// let's get all the options from the main map and change the group option to true
		newData = Object.assign({}, data);
		newData.regionsGroupHover = true;
		newData.regions = group;
		newData.include = include;
		// include only the regions we're grouping
		iMapsManager.pushRegionSeries(id, newData);
	});

	return;
};

/**
 * Push different series of overlay/child maps
 * int i - index of the map data
 * data - object with map data to push
 */
iMapsManager.pushSeries = function (id, data) {
	var im = this,
		regionSeries,
		markerSeries,
		labelSeries,
		lineSeries,
		iconSeries,
		imageSeries,
		parentData = im.maps[id].data,
		seriesIndex = im.maps[id].seriesIndex,
		seriesById = im.maps[id].seriesById,
		isDrill = im.bool(im.maps[id].data.drillDownOnClick),
		cleanMapName = iMapsRouter.getCleanMapName(data.map),
		defaultSeries = false;

	if (false === cleanMapName) {
		return;
	}

	if (typeof data.id === 'undefined') {
		return;
	}

	seriesById[data.id] = [];

	// check if it's set a map overlay by default
	if (typeof parentData.liveFilter !== 'undefined' && parentData.liveFilter.default !== parentData.id) {
		defaultSeries = parentData.liveFilter.default;
	}

	// setup series index
	if (!Array.isArray(im.maps[id].seriesIndex[data.map])) {
		im.maps[id].seriesIndex[cleanMapName] = [];
	}

	// to allow empty maps to overlay, we removed the check && data.regions.length and send empty array
	if (!Array.isArray(data.regions)) {
		data.regions = [];
	}

	if (typeof parentData.allowEmpty === 'undefined') {
		parentData.allowEmpty = 0;
	}
	// in case we want empty maps to overlay, we remove this check.
	// in are not allowing the emtpy so that the live filter works better and markers are not hidden behind the map
	// reference: https://interactivegeomaps.com/feature/live-filter/
	// but other overlays and empty maps might need to be added...
	if (im.bool(parentData.allowEmpty) || data.regions.length) {
		regionSeries = iMapsManager.pushRegionSeries(id, data);
		seriesIndex[cleanMapName].push(regionSeries);
		seriesById[data.id].push(regionSeries);
		if (isDrill) {
			regionSeries.hidden = true;
		}

		// hide in case we have a live filter and this is not the default
		if (parentData.liveFilter && im.bool(parentData.liveFilter.enabled) && defaultSeries && defaultSeries !== data.id) {
			regionSeries.hidden = true;
		}
	}

	// Check for grouped regions
	if (Array.isArray(data.regionGroups) && data.regionGroups.length) {
		im.pushGroupSeries(id, data);
	}

	if (Array.isArray(data.roundMarkers) && data.roundMarkers.length) {
		markerSeries = iMapsManager.pushRoundMarkerSeries(id, data);
		seriesIndex[cleanMapName].push(markerSeries);
		seriesById[data.id].push(markerSeries);
		if (isDrill) {
			markerSeries.hidden = true;
		}

		// hide in case we have a live filter and this is not the default
		if (parentData.liveFilter && im.bool(parentData.liveFilter.enabled) && defaultSeries && defaultSeries !== data.id) {
			markerSeries.hidden = true;
		}
	}

	if (Array.isArray(data.iconMarkers) && data.iconMarkers.length) {
		iconSeries = iMapsManager.pushIconMarkerSeries(id, data);
		seriesIndex[cleanMapName].push(iconSeries);
		seriesById[data.id].push(iconSeries);
		if (isDrill) {
			iconSeries.hidden = true;
		}
		// hide in case we have a live filter and this is not the default
		if (parentData.liveFilter && im.bool(parentData.liveFilter.enabled) && defaultSeries && defaultSeries !== data.id) {
			iconSeries.hidden = true;
		}
	}

	if (Array.isArray(data.imageMarkers) && data.imageMarkers.length) {
		imageSeries = iMapsManager.pushImageMarkerSeries(id, data);
		seriesIndex[cleanMapName].push(imageSeries);
		seriesById[data.id].push(imageSeries);
		if (isDrill) {
			imageSeries.hidden = true;
		}
		// hide in case we have a live filter and this is not the default
		if (parentData.liveFilter && im.bool(parentData.liveFilter.enabled) && defaultSeries && defaultSeries !== data.id) {
			imageSeries.hidden = true;
		}
	}

	if (Array.isArray(data.labels) && data.labels.length) {
		labelSeries = iMapsManager.pushLabelSeries(id, data);
		seriesIndex[cleanMapName].push(labelSeries);
		seriesById[data.id].push(labelSeries);
		if (isDrill) {
			labelSeries.hidden = true;
		}
		// hide in case we have a live filter and this is not the default
		if (parentData.liveFilter && im.bool(parentData.liveFilter.enabled) && defaultSeries && defaultSeries !== data.id) {
			labelSeries.hidden = true;
		}
	}

	if (Array.isArray(data.lines) && data.lines.length) {
		lineSeries = iMapsManager.pushLineSeries(id, data);
		seriesIndex[cleanMapName].push(lineSeries);
		seriesById[data.id].push(lineSeries);
		if (isDrill) {
			lineSeries.hidden = true;
		}
		// hide in case we have a live filter and this is not the default
		if (parentData.liveFilter && im.bool(parentData.liveFilter.enabled) && defaultSeries && defaultSeries !== data.id) {
			lineSeries.hidden = true;
		}
	}
};

iMapsManager.pushRegionSeries = function (id, data) {
	var im = this,
		map = im.maps[id].map, // shorter reference for the map
		regionSeries,
		tooltipConfig = data.tooltip || {},
		regionTemplate,
		hover,
		active,
		highlight,
		mapVar,
		clkLabel,
		groupHover = im.bool(data.regionsGroupHover);

	data = data || {};

	regionSeries = map.series.push(new am4maps.MapPolygonSeries());

	if (data.map === "custom" || im.bool(data.useGeojson)) {
		regionSeries.geodataSource.url = data.mapURL;
	} else {
		mapVar = iMapsRouter.getVarByName(data.map);
		regionSeries.geodata = window[mapVar];
	}

	regionSeries.name =
		data.regionLegend && data.regionLegend.title !== "" ? data.regionLegend.title : data.title;
	regionSeries.hiddenInLegend = data.regionLegend ? !im.bool(data.regionLegend.enabled) : true;

	// if it's a base series
	if (id === data.id) {
		// add it as the baseSeries
		im.maps[id].baseSeries = regionSeries;
		im.maps[id].allBaseSeries.push(regionSeries);
	}

	// Make map load polygon (like country names) data from GeoJSON
	regionSeries.useGeodata = true;

	// Exclude
	if (Array.isArray(data.exclude) && data.exclude.length) {
		regionSeries.exclude = data.exclude;
	}

	// Include
	if (Array.isArray(data.include) && data.include.length) {
		regionSeries.include = data.include;
	}

	// Setup Heatmap rules
	if (data.heatMapRegions && im.bool(data.heatMapRegions.enabled)) {

		im.setupHeatMap(regionSeries, id, data);
	}

	// Data
	// if (Array.isArray(data.regions)) {
	regionSeries.data = data.regions;

	// Configure series
	regionTemplate = regionSeries.mapPolygons.template;

	im.setupTooltip(regionSeries, id);

	// check for custom tooltip template
	if (typeof data.regionsTooltipTemplate !== 'undefined' && data.regionsTooltipTemplate.trim() !== '') {
		regionTemplate.tooltipText = data.regionsTooltipTemplate;
		regionTemplate.tooltipHTML = data.regionsTooltipTemplate;
	} else {
		regionTemplate.tooltipText = tooltipConfig.template ? tooltipConfig.template : "{tooltipContent}";
		regionTemplate.tooltipHTML = tooltipConfig.template ? tooltipConfig.template : "{tooltipContent}";
	}

	regionTemplate.adapter.add("tooltipHTML", function (value, target, key) {
		if (typeof target.dataItem.dataContext === 'object' && typeof tooltipConfig.onlyWithData !== 'undefined') {
			// check if we don't return tooltip on empty regions
			if (im.bool(tooltipConfig.onlyWithData)) {
				if (target.dataItem.dataContext.madeFromGeoData === true) {
					target.tooltip.tooltipText = undefined;
					target.tooltip.tooltipHTML = undefined;
					return '';
				}
			}
		}
		if (value === "") {
			return value;
		}
		return value.replace(/\\/g, "");
	});

	regionTemplate.adapter.add("tooltipText", function (value, target, key) {
		if (typeof target.dataItem.dataContext === 'object' && typeof tooltipConfig.onlyWithData !== 'undefined') {
			// check if we don't return tooltip on empty regions
			if (im.bool(tooltipConfig.onlyWithData)) {
				if (target.dataItem.dataContext.madeFromGeoData === true) {
					target.tooltip.tooltipText = undefined;
					target.tooltip.tooltipHTML = undefined;
					return '';
				}
			}
		}
		if (value === "") {
			return value;
		}
		return value.replace(/\\/g, "");
	});

	// For legend color
	regionSeries.fill = data.regionDefaults.fill;

	regionTemplate.fill = data.regionDefaults.inactiveColor;
	regionTemplate.stroke = data.visual.borderColor;
	regionTemplate.strokeWidth = data.visual.borderWidth;

	// fill
	regionTemplate.propertyFields.fill = "fill";

	// exploring adapter
	/*
		regionTemplate.adapter.add("fill", function(fill, target) {
			return chart.colors.getIndex(Math.round(Math.random() * 4)).saturate(0.3);
		});*/

	// hover - only create if it's not a group hover series
	if (!groupHover) {
		hover = regionTemplate.states.create("hover");
		hover.propertyFields.fill = "hover";
		//hover.propertyFields.strokeWidth = "borderWidthHover";
		//hover.propertyFields.stroke = "borderColorHover";
	}

	// active state
	if (data.regionActiveState && im.bool(data.regionActiveState.enabled)) {
		active = regionTemplate.states.create("active");

		if (data.regionActiveState.source === 'custom') {
			active.properties.fill = data.regionActiveState.fill;
		} else {
			active.propertyFields.fill = "hover";
		}
	}

	// highlight - for group hover
	highlight = regionTemplate.states.create("highlight");
	highlight.propertyFields.fill = "hover";

	// Events
	regionTemplate.events.on("hit", function (ev) {
		im.setupHitEvents(id, ev);
	});

	if (groupHover) {

		regionTemplate.events.on("out", function (ev) {
			im.groupHoverOut(id, ev);
		});
		regionTemplate.events.on("over", function (ev) {
			im.groupHover(id, ev);
		});
		regionTemplate.events.on("hit", function (ev) {
			im.groupHit(id, ev);
		});
	} else {
		regionTemplate.events.on("hit", function (ev) {
			im.singleHit(id, ev);
		});
		regionTemplate.events.on("over", function (ev) {
			im.setupHoverEvents(id, ev);
		});
	}

	// enable small map
	if (im.bool(data.smallMap)) {
		map.smallMap.series.push(regionSeries);
	}

	// auto Labels in progress
	if (data.regionLabels && im.bool(data.regionLabels.source)) {
		regionSeries.calculateVisualCenter = true;

		// Configure label series
		var labelSeries = map.series.push(new am4maps.MapImageSeries());
		var labelTemplate = labelSeries.mapImages.template.createChild(
			am4core.Label
		);

		labelTemplate.horizontalCenter = data.regionLabels.horizontalCenter;
		labelTemplate.verticalCenter = data.regionLabels.verticalCenter;
		labelTemplate.fontSize = data.regionLabels.fontSize;
		labelTemplate.fill = data.regionLabels.fill;

		// let's set a listener to the hide event of main series to hide this one also
		regionSeries.events.on("hidden", function (ev) {
			labelSeries.hide();
		});

		regionSeries.events.on("shown", function (ev) {
			labelSeries.show();
		});

		// label events
		labelTemplate.events.on("hit", function (ev) {
			clkLabel = regionSeries.getPolygonById(ev.target.parent.LabelForRegion);
			clkLabel.dispatchImmediately("hit");
		});
		labelTemplate.events.on("over", function (ev) {
			iMapsManager.hover(id, ev.target.parent.LabelForRegion, false);
		});
		labelTemplate.events.on("out", function (ev) {
			iMapsManager.clearHovered(id, ev.target.parent.LabelForRegion);
		});

		im.setupTooltip(labelSeries, id);

		labelTemplate.interactionsEnabled = true;
		labelTemplate.nonScaling = im.bool(data.regionLabels.nonScaling);
		labelSeries.hiddenInLegend = true;

		// fix initially hidden series - for example drilldown overlay
		regionSeries.events.on("inited", function () {
			if (regionSeries.hidden) {
				labelSeries.hide();
				labelSeries.hidden = true;
			}
		});

		// set labels drag listener
		// allow labels to be dragged if in admin
		if (im.bool(data.admin)) {

			labelTemplate.draggable = true;
			labelTemplate.cursorOverStyle = am4core.MouseCursorStyle.grab;
			labelTemplate.events.on("dragstop", function (ev) {

				var svgPoint = am4core.utils.spritePointToSvg({
					x: 0,
					y: 0
				}, ev.target);

				svgPoint = am4core.utils.spritePointToSvg({
					x: 0 - ev.target.maxLeft,
					y: 0 - ev.target.maxTop
				}, ev.target);

				var geo = map.svgPointToGeo(svgPoint);

				// check if field to add json object with adjustments exists
				var adjField = document.querySelector(
					"[data-depend-id=" + data.regionLabelCustomCoordinates + "]"
				);



				if (adjField) {

					var jsonAdjustments;

					if (iMapsManager.isJSON(adjField.value)) {
						jsonAdjustments = JSON.parse(adjField.value);
					} else {
						jsonAdjustments = {};
					}

					jsonAdjustments[ev.target.parent.LabelForRegion] = {
						latitude: geo.latitude,
						longitude: geo.longitude
					};

					adjField.value = JSON.stringify(jsonAdjustments);
				}

				map.seriesContainer.draggable = im.bool(data.zoom.draggable);
				ev.target.cursorOverStyle = am4core.MouseCursorStyle.grab;
			});

			labelTemplate.events.on("down", function (ev) {
				map.seriesContainer.draggable = false;
				ev.target.cursorOverStyle = am4core.MouseCursorStyle.grabbing;
			});
		}

		// end dragevent

		// convert custom json position string to object
		var regionLabelCustomCoordinates = im.isJSON(data.regionLabels.regionLabelCustomCoordinates) ? JSON.parse(data.regionLabels.regionLabelCustomCoordinates) : false;

		regionSeries.events.on("inited", function () {
			regionSeries.mapPolygons.each(function (polygon) {
				var label = labelSeries.mapImages.create(),
					text;


				// if we're only adding labels to active regions
				if (
					im.bool(data.regionLabels.activeOnly) && polygon.dataItem.dataContext &&
					typeof polygon.dataItem.dataContext.tooltipContent === "undefined"
				) {
					return;
				}

				// if it's a group entry, ignore
				if (polygon.dataItem.dataContext.id.includes(',')) {
					return;
				}

				if (data.regionLabels.source === "code") {
					text = polygon.dataItem.dataContext.id.split("-").pop();
				}
				if (data.regionLabels.source === "{name}") {
					text = polygon.dataItem.dataContext.name;
				}
				if (data.regionLabels.source === "{id}") {
					text = polygon.dataItem.dataContext.id;
				}

				label.LabelForRegion = polygon.dataItem.dataContext.id;

				// if it was a group
				if (typeof polygon.dataItem.dataContext.originalID !== 'undefined') {
					label.groupRegion = polygon.dataItem.dataContext.originalID;
				}

				// tooltip content
				label.tooltipDataItem = polygon.tooltipDataItem;
				label.tooltip = polygon.tooltip;
				label.tooltipHTML = polygon.tooltipHTML;
				label.tooltipPosition = im.bool(data.tooltip.fixed) ? "fixed" : "pointer";

				// cursor style
				if (
					polygon.dataItem.dataContext.action &&
					polygon.dataItem.dataContext.action !== "none"
				) {
					label.cursorOverStyle = am4core.MouseCursorStyle.pointer;
				}

				// use custom coordinates adjustments or use auto position
				if (
					regionLabelCustomCoordinates &&
					regionLabelCustomCoordinates.hasOwnProperty(
						polygon.dataItem.dataContext.id
					)
				) {
					label.latitude =
						regionLabelCustomCoordinates[
							polygon.dataItem.dataContext.id
						].latitude;
					label.longitude =
						regionLabelCustomCoordinates[
							polygon.dataItem.dataContext.id
						].longitude;
				} else {
					label.latitude = polygon.visualLatitude;
					label.longitude = polygon.visualLongitude;
				}
				if (label.children.getIndex(0)) {
					label.children.getIndex(0).text = text;
				}

			});
		});
	}

	// if the external dropdown is enabled, calculate visual center
	if (typeof data.externalDropdown !== 'undefined' && im.bool(data.externalDropdown.enabled)) {
		regionSeries.calculateVisualCenter = true;
	}

	// add this series to map series to reference it later if needed
	im.maps[id].series.push(regionSeries);

	return regionSeries;
};

iMapsManager.pushRoundMarkerSeries = function (id, data) {
	var im = this,
		map = im.maps[id].map, // shorter reference for the map
		markerSeries,
		markerSeriesTemplate,
		circle,
		label,
		activeState,
		highlightState,
		hoverState;

	if (Array.isArray(data.roundMarkers) && data.roundMarkers.length) {
		// Create image series
		markerSeries = map.series.push(new am4maps.MapImageSeries());
		markerSeries.name = data.roundMarkersLegend && data.roundMarkersLegend.title !== "" ? data.roundMarkersLegend.title : data.title;
		markerSeries.hiddenInLegend = data.roundMarkersLegend ? !im.bool(data.roundMarkersLegend.enabled) : false;

		im.setupTooltip(markerSeries, id);

		// Create a circle image in image series template so it gets replicated to all new images
		markerSeriesTemplate = markerSeries.mapImages.template;
		circle = markerSeriesTemplate.createChild(am4core.Circle);
		// default values

		circle.radius = data.markerDefaults.radius;
		circle.fill = data.markerDefaults.fill;
		circle.stroke = am4core.color("#FFFFFF");
		circle.strokeWidth = 1;
		circle.nonScaling = true;

		// label
		label = markerSeriesTemplate.createChild(am4core.Label);
		label.text = "{label}";
		label.fill = am4core.color("#fff");
		label.verticalCenter = "middle";
		label.horizontalCenter = "middle";
		label.nonScaling = true;
		label.fontSize = data.markerDefaults.radius;
		label.clickable = false;
		label.focusable = false;
		label.hoverable = false;

		// check for custom tooltip template
		if (typeof data.roundMarkersTooltipTemplate !== 'undefined' && data.roundMarkersTooltipTemplate.trim() !== '') {
			circle.tooltipText = data.roundMarkersTooltipTemplate;
			circle.tooltipHTML = data.roundMarkersTooltipTemplate;
		} else {
			circle.tooltipText = data.tooltip && data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
			circle.tooltipHTML = data.tooltip && data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
		}

		// fill can only be set if heatmap is not enabled and not a range
		if (data.heatMapMarkers && im.bool(data.heatMapMarkers.enabled)) {
			im.setupHeatMap(markerSeries, id, data);

			// setup the fill and radius if type is range
			if (typeof data.heatMapMarkers.type !== 'undefined' && data.heatMapMarkers.type === 'range') {
				circle.propertyFields.radius = "radius";
				circle.propertyFields.fill = "fill";
			}

		} else {
			circle.propertyFields.radius = "radius";
			circle.propertyFields.fill = "fill";
		}

		// Set property fields
		markerSeriesTemplate.propertyFields.radius = "radius";

		markerSeriesTemplate.propertyFields.latitude = "latitude";
		markerSeriesTemplate.propertyFields.longitude = "longitude";

		markerSeriesTemplate.setStateOnChildren = true;

		// hover & active
		hoverState = circle.states.create("hover");
		hoverState.properties.fill = data.hover;
		hoverState.propertyFields.fill = "hover";

		// active
		activeState = circle.states.create("active");
		activeState.properties.fill = data.hover;
		activeState.propertyFields.fill = "hover";

		// highlight - for legend hover
		highlightState = circle.states.create("highlight");
		highlightState.properties.fill = data.hover;
		highlightState.propertyFields.fill = "hover";

		// text label below

		if (data.roundMarkerLabels && im.bool(data.roundMarkerLabels.enabled)) {

			var markerLabel = markerSeriesTemplate.createChild(am4core.Label);
			markerLabel.text = "{name}";
			markerLabel.horizontalCenter = "middle";
			markerLabel.fontSize = data.roundMarkerLabels.fontSize;
			markerLabel.nonScaling = true; //im.bool(data.roundMarkerLabels.nonScaling);
			markerLabel.fill = data.roundMarkerLabels.fill;
			markerLabel.clickable = false;
			markerLabel.focusable = false;
			markerLabel.hoverable = false;
			markerLabel.padding(0, 0, 0, 0);
			markerLabel.propertyFields.paddingTop = "radius";
			/*
			markerLabel.adapter.add("dy", function (dy, target) {
				var circle = target.parent.children.getIndex(0);
				return circle.pixelRadius;
			});
			*/

		}



		// Add data
		markerSeries.data = data.roundMarkers;
		// For legend color
		markerSeries.fill = data.markerDefaults.fill;

		// Events
		markerSeriesTemplate.events.on("hit", function (ev) {
			im.setupHitEvents(id, ev);
			im.singleHit(id, ev);
		});
		markerSeriesTemplate.events.on("over", function (ev) {
			im.setupHoverEvents(id, ev);
		});
	}

	// enable small map
	if (data.zoom && data.zoom.smallMap && im.bool(data.zoom.smallMap)) {
		map.smallMap.series.push(markerSeries);
	}

	// add this series to map series to reference it later if needed
	im.maps[id].series.push(markerSeries);

	// if part of the parent map
	if (id === data.id) {
		// only add as base if not a cluster
		if (data.clusterMarkers && !im.bool(data.clusterMarkers.enabled)) {
			im.maps[id].allBaseSeries.push(markerSeries);
		} else if (data.clusterMarkers && im.bool(data.clusterMarkers.enabled)) {
			// it's a cluster, so the main series with all markers
			// markerSeries.hidden = true;
		}
	}
	return markerSeries;
};

iMapsManager.pushImageMarkerSeries = function (id, data) {
	var im = this,
		map = im.maps[id].map, // shorter reference for the map
		markerSeries,
		markerSeriesTemplate,
		imageMarker;

	if (Array.isArray(data.imageMarkers) && data.imageMarkers.length) {
		// Create image series
		markerSeries = map.series.push(new am4maps.MapImageSeries());
		markerSeries.name = data.imageMarkersLegend && data.imageMarkersLegend.title !== "" ? data.imageMarkersLegend.title : data.title;
		markerSeries.hiddenInLegend = data.imageMarkersLegend ? !im.bool(data.imageMarkersLegend.enabled) : false;

		im.setupTooltip(markerSeries, id);

		// Create a circle image in image series template so it gets replicated to all new images
		markerSeriesTemplate = markerSeries.mapImages.template;
		imageMarker = markerSeriesTemplate.createChild(am4core.Image);
		imageMarker.propertyFields.href = "href";
		imageMarker.propertyFields.width = "size";
		imageMarker.propertyFields.height = "size";
		//imageMarker.propertyFields.height = "height";
		imageMarker.propertyFields.horizontalCenter = "horizontalCenter";
		imageMarker.propertyFields.verticalCenter = "verticalCenter";
		imageMarker.nonScaling = true;

		// check for custom tooltip template
		if (typeof data.imageMarkersTooltipTemplate !== 'undefined' && data.imageMarkersTooltipTemplate.trim() !== '') {
			imageMarker.tooltipText = data.imageMarkersTooltipTemplate;
			imageMarker.tooltipHTML = data.imageMarkersTooltipTemplate;
		} else {
			imageMarker.tooltipText = data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
			imageMarker.tooltipHTML = data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
		}

		// Set property fields
		markerSeriesTemplate.propertyFields.latitude = "latitude";
		markerSeriesTemplate.propertyFields.longitude = "longitude";

		// Add data for the three cities
		markerSeries.data = data.imageMarkers;

		// Events
		markerSeriesTemplate.events.on("hit", function (ev) {
			im.setupHitEvents(id, ev);
			im.singleHit(id, ev);
		});
		markerSeriesTemplate.events.on("over", function (ev) {
			im.setupHoverEvents(id, ev);
		});
	}

	// enable small map
	if (data.zoom && data.zoom.smallMap && im.bool(data.zoom.smallMap)) {
		map.smallMap.series.push(markerSeries);
	}

	// add this series to map series to reference it later if needed
	im.maps[id].series.push(markerSeries);

	return markerSeries;
};

iMapsManager.pushIconMarkerSeries = function (id, data) {
	var im = this,
		map = im.maps[id].map, // shorter reference for the map
		markerSeries,
		markerSeriesTemplate,
		icon,
		hover,
		active,
		highlightState,
		label,
		clickableOverlay;

	if (Array.isArray(data.iconMarkers) && data.iconMarkers.length) {
		// Create image series
		markerSeries = map.series.push(new am4maps.MapImageSeries());
		markerSeries.hiddenInLegend = data.iconMarkersLegend ? !im.bool(data.iconMarkersLegend.enabled) : false;
		markerSeries.name = data.iconMarkersLegend && data.iconMarkersLegend.title !== "" ? data.iconMarkersLegend.title : data.title;
		markerSeriesTemplate = markerSeries.mapImages.template;
		markerSeriesTemplate.nonScaling = true;

		markerSeriesTemplate.setStateOnChildren = true; //apply parent's current state to children
		markerSeriesTemplate.states.create('hover'); //create dummy state for hover

		im.setupTooltip(markerSeries, id);

		// Create a circle image in image series template so it gets replicated to all new images
		icon = markerSeriesTemplate.createChild(am4core.Sprite);
		icon.propertyFields.scale = "scale";
		icon.propertyFields.path = "path";

		// check for custom tooltip template
		if (typeof data.iconMarkersTooltipTemplate !== 'undefined' && data.iconMarkersTooltipTemplate.trim() !== '') {
			icon.tooltipText = data.iconMarkersTooltipTemplate;
			icon.tooltipHTML = data.iconMarkersTooltipTemplate;
		} else {
			icon.tooltipText = data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
			icon.tooltipHTML = data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
		}

		icon.propertyFields.horizontalCenter = "horizontalCenter";
		icon.propertyFields.verticalCenter = "verticalCenter";
		icon.propertyFields.fill = "fill";

		// For legend color
		markerSeries.fill = data.iconMarkerDefaults.fill;

		// clickable overlay
		clickableOverlay = markerSeriesTemplate.createChild(am4core.Sprite);
		clickableOverlay.propertyFields.scale = "scale";
		clickableOverlay.path = "M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0";
		clickableOverlay.opacity = 0;
		clickableOverlay.propertyFields.horizontalCenter = "horizontalCenter";
		clickableOverlay.propertyFields.verticalCenter = "verticalCenter";
		clickableOverlay.tooltipText = data.tooltip.template
			? data.tooltip.template
			: "{tooltipContent}";
		clickableOverlay.tooltipHTML = data.tooltip.template
			? data.tooltip.template
			: "{tooltipContent}";

		if (data.iconMarkerLabels && im.bool(data.iconMarkerLabels.enabled)) {
			var markerLabel = markerSeriesTemplate.createChild(am4core.Label);
			markerLabel.text = "{name}";
			markerLabel.horizontalCenter = "middle";
			markerLabel.verticalCenter = "top";
			markerLabel.fontSize = data.iconMarkerLabels.fontSize;
			markerLabel.nonScaling = false;
			markerLabel.fill = data.iconMarkerLabels.fill;
			markerLabel.clickable = false;
			markerLabel.focusable = false;
			markerLabel.hoverable = false;
			markerLabel.padding(0, 0, 0, 0);
			markerLabel.adapter.add("dy", function (dy, target) {
				var icon = target.parent.children.getIndex(0);
				var scale = icon.scale;
				var space;
				if (icon.verticalCenter === 'middle') {
					space = (10 * scale);
				}
				if (icon.verticalCenter === 'bottom') {
					space = 0;
				}
				if (icon.verticalCenter === 'top') {
					space = (20 * scale) + 5;
				}
				// formula to get the label to distance at an accepted level
				return space;
			});


		}

		// hover & active
		hover = icon.states.create("hover");
		hover.propertyFields.fill = "hover";
		active = icon.states.create("active");
		active.propertyFields.fill = "hover";
		// highlight - for legend hover
		highlightState = icon.states.create("highlight");
		highlightState.properties.fill = data.hover;
		highlightState.propertyFields.fill = "hover";

		// Set property fields
		markerSeriesTemplate.propertyFields.latitude = "latitude";
		markerSeriesTemplate.propertyFields.longitude = "longitude";

		// Add data
		markerSeries.data = data.iconMarkers;

		// Events
		markerSeriesTemplate.events.on("hit", function (ev) {
			im.setupHitEvents(id, ev);
			im.singleHit(id, ev);
		});
		markerSeriesTemplate.events.on("over", function (ev) {
			im.setupHoverEvents(id, ev);
		});
	}

	// enable small map
	if (data.zoom && data.zoom.smallMap && im.bool(data.zoom.smallMap)) {
		map.smallMap.series.push(markerSeries);
	}
	// add this series to map series to reference it later if needed
	im.maps[id].series.push(markerSeries);

	return markerSeries;
};

iMapsManager.pushLineSeries = function (id, data) {
	var im = this,
		map = im.maps[id].map, // shorter reference for the map
		lineSeries = {},
		lineData = [];

	// Lines
	if (Array.isArray(data.lines) && data.lines.length) {
		// Add line series

		if (data.projection === "Orthographic") {
			lineSeries = map.series.push(new am4maps.MapLineSeries());
			lineSeries.mapLines.template.propertyFields.shortestDistance = true;
		} else {
			lineSeries = map.series.push(new am4maps.MapArcSeries());
			lineSeries.mapLines.template.line.propertyFields.controlPointDistance =
				"curvature";
			lineSeries.mapLines.template.line.controlPointPosition = 0.5;
		}

		lineSeries.name = data.linesLegend && data.linesLegend.title !== "" ? data.linesLegend.title : data.title;
		lineSeries.hiddenInLegend = data.linesLegend ? !im.bool(data.linesLegend.enabled) : false;

		lineSeries.mapLines.template.nonScalingStroke = true;
		lineSeries.mapLines.template.propertyFields.strokeWidth = "strokeWidth";
		lineSeries.mapLines.template.propertyFields.strokeDasharray = "strokeDash";

		lineSeries.mapLines.template.propertyFields.stroke = "stroke";

		//lineObj.multiGeoLine = [lineObj.multiGeoLine];
		//lineSeries.data = [lineObj];

		data.lines.forEach(function (lineObj) {
			// make sure multiGeoLine is array of arrays:
			lineObj.multiGeoLine = [lineObj.multiGeoLine];
			lineData.push(lineObj);
		});

		lineSeries.data = lineData;

		// enable small map
		if (data.zoom && data.zoom.smallMap && im.bool(data.zoom.smallMap)) {
			map.smallMap.series.push(lineSeries);
		}

		//let's hide this from legend, since they don't group in the same Series
		//lineSeries.hiddenInLegend = true;

		// add this series to map series to reference it later if needed
		im.maps[id].series.push(lineSeries);

		// For legend color
		lineSeries.fill = data.lineDefaults.stroke;

		// if it's part of the parent map
		if (id === data.id) {
			im.maps[id].allBaseSeries.push(lineSeries);
		}
	}

	return lineSeries;
};


iMapsManager.pushLabelSeries = function (id, data) {
	var im = this,
		map = im.maps[id].map, // shorter reference for the map
		labelSeries,
		labelSeriesTemplate,
		label,
		activeState,
		highlightState,
		hoverState;

	if (Array.isArray(data.labels) && data.labels.length) {
		// Create image series
		labelSeries = map.series.push(new am4maps.MapImageSeries());
		labelSeries.name = data.roundMarkersLegend && data.roundMarkersLegend.title !== "" ? data.roundMarkersLegend.title : data.title;
		labelSeries.hiddenInLegend = data.roundMarkersLegend ? !im.bool(data.roundMarkersLegend.enabled) : false;

		im.setupTooltip(labelSeries, id);

		// Create a circle image in image series template so it gets replicated to all new images
		labelSeriesTemplate = labelSeries.mapImages.template;
		labelSeriesTemplate.setStateOnChildren = true;

		// label
		label = labelSeriesTemplate.createChild(am4core.Label);
		label.text = "{id}";
		label.nonScaling = true;
		if (data.labelStyle) {
			label.fontFamily = data.labelStyle.fontFamily;
			label.fontWeight = data.labelStyle.fontWeight;
		}

		label.horizontalCenter = data.labelPosition.horizontalCenter;
		label.verticalCenter = data.labelPosition.verticalCenter;

		label.propertyFields.fill = "fill";
		label.propertyFields.fontSize = "fontSize";

		// custom fields
		if (typeof data.labelsTooltipTemplate !== 'undefined' && data.labelsTooltipTemplate.trim() !== '') {
			label.tooltipText = data.labelsTooltipTemplate;
			label.tooltipHTML = data.labelsTooltipTemplate;
		} else {
			label.tooltipText = data.tooltip && data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
			label.tooltipHTML = data.tooltip && data.tooltip.template ? data.tooltip.template : "{tooltipContent}";
		}

		// Set property fields
		labelSeriesTemplate.propertyFields.latitude = "latitude";
		labelSeriesTemplate.propertyFields.longitude = "longitude";
		labelSeriesTemplate.propertyFields.fill = "fill";
		labelSeriesTemplate.propertyFields.fontSize = "fontSize";

		label.propertyFields.verticalCenter = "verticalCenter";
		label.propertyFields.horizontalCenter = "horizontalCenter";

		// hover & active
		hoverState = label.states.create("hover");
		hoverState.properties.fill = data.hover;
		hoverState.propertyFields.fill = "hover";

		// active
		activeState = label.states.create("active");
		activeState.properties.fill = data.hover;
		activeState.propertyFields.fill = "hover";

		// highlight - for legend hover
		highlightState = label.states.create("highlight");
		highlightState.properties.fill = data.hover;
		highlightState.propertyFields.fill = "hover";

		// Add data
		labelSeries.data = data.labels;
		// For legend color
		labelSeries.fill = data.labelDefaults.fill;

		// Events
		labelSeriesTemplate.events.on("hit", function (ev) {
			im.setupHitEvents(id, ev);
			im.singleHit(id, ev);
		});
		labelSeriesTemplate.events.on("over", function (ev) {
			im.setupHoverEvents(id, ev);
		});
	}

	// enable small map
	if (data.zoom && data.zoom.smallMap && im.bool(data.zoom.smallMap)) {
		map.smallMap.series.push(labelSeries);
	}

	// add this series to map series to reference it later if needed
	im.maps[id].series.push(labelSeries);

	// if part of the parent map
	if (id === data.id) {
		im.maps[id].allBaseSeries.push(labelSeries);
	}
	return labelSeries;
};

iMapsManager.setupTooltip = function (regionSeries, id) {
	var im = this,
		data = im.maps[id].data,
		tooltip = data.tooltip,
		shadow;

	// don't include it in export
	// regionSeries.tooltip.exportable = false;

	// default behaviour
	if (typeof data.tooltip === "undefined") {
		regionSeries.tooltip.disabled = false;
		regionSeries.tooltip.getFillFromObject = false;
		regionSeries.tooltip.getStrokeFromObject = false;
		regionSeries.tooltip.label.fill = am4core.color("#000000");
		regionSeries.tooltip.background.fill = am4core.color("#FFFFFF");
		return;
	}

	if (!im.bool(data.tooltip.enabled)) {
		regionSeries.tooltip.disabled = true;
		return regionSeries;
	}

	//if it's overlay, it might have a custom config

	// tooltip settings from map config
	regionSeries.tooltip.label.interactionsEnabled = im.bool(tooltip.fixed);
	regionSeries.tooltip.background.cornerRadius = tooltip.cornerRadius;
	regionSeries.tooltip.getFillFromObject = false;
	regionSeries.tooltip.getStrokeFromObject = false;
	regionSeries.tooltip.label.fill = tooltip.color;
	regionSeries.tooltip.background.fill = tooltip.backgroundColor;
	regionSeries.tooltip.fontFamily = tooltip.fontFamily;
	regionSeries.tooltip.fontSize = tooltip.fontSize;
	regionSeries.tooltip.fontWeight = tooltip.fontWeight;

	// animation - disable the fly out effect on markers
	regionSeries.tooltip.animationDuration = 0;

	// border
	if (tooltip.borderColor !== 'undefined') {
		regionSeries.tooltip.background.stroke = tooltip.borderColor;
		regionSeries.tooltip.background.strokeWidth = tooltip.borderWidth;
	}


	// box-shadow

	if (typeof tooltip.customShadow !== 'undefined' && im.bool(tooltip.customShadow)) {
		shadow = regionSeries.tooltip.background.filters.getIndex(0);
		shadow.dx = tooltip.customShadowOpts.dx;
		shadow.dy = tooltip.customShadowOpts.dy;
		shadow.blur = tooltip.customShadowOpts.blur;
		shadow.opacity = tooltip.customShadowOpts.opacity;
		shadow.color = tooltip.customShadowOpts.color;
	}

	// Set up fixed tooltips
	if (im.bool(tooltip.fixed)) {
		if (regionSeries.mapPolygons) {
			regionSeries.calculateVisualCenter = true;
			regionSeries.mapPolygons.template.tooltipPosition = "fixed";
			regionSeries.tooltip.keepTargetHover = true;
		} else {
			// for markers
			regionSeries.mapImages.template.tooltipPosition = "fixed";
			regionSeries.tooltip.keepTargetHover = true;
		}
	}

	return regionSeries;
};

iMapsManager.setupHitEvents = function (id, ev) {
	var im = this,
		data = im.maps[id].data,
		dataContext,
		map = im.maps[id],
		customActionName,
		targetType = im.getTargetSeriesType(ev.target);

	if (ev.target.isLabels) {
		dataContext = ev.target.dataItems.first.dataContext;
	} else {
		dataContext = ev.target.dataItem.dataContext;
	}

	// for admin log
	im.populateClickInfo(dataContext);

	console.log(dataContext);

	// Zoom on click
	if (
		data.zoom &&
		im.bool(data.zoom.enabled) &&
		im.bool(data.zoom.zoomOnClick)
	) {
		ev.zooming = true;
		im.zoomToRegion(ev, id);
	}

	// drill down
	if (targetType === "MapPolygon" && im.bool(data.drillDownOnClick)) {
		im.drillDown(id, ev);
	}

	if (dataContext.madeFromGeoData) {
		iMapsManager.clearSelected(id);
		return;
	}

	// if admin, we don't trigger the actions
	if (im.bool(data.admin)) {
		return;
	}

	if (dataContext.action === "none") {
		// do nothing
	}
	// open new url
	else if (dataContext.action === "open_url" && dataContext.content !== "") {
		document.location = dataContext.content;
	} else if (
		dataContext.action === "open_url_new" &&
		dataContext.content !== ""
	) {
		window.open(dataContext.content);
	}

	// custom
	else if (dataContext.action && dataContext.action.includes("custom")) {
		customActionName = dataContext.action + "_" + id;
		if (typeof window[customActionName] !== "undefined") {
			window[customActionName](dataContext);
		}
	} else {

		if (typeof window[dataContext.action] !== "undefined") {
			window[dataContext.action](id, dataContext);
		}

	}
};

iMapsManager.zoomToRegion = function (ev, id) {
	var im = this,
		seriesType = im.getTargetSeriesType(ev.target),
		data = im.maps[id].data,
		map = im.maps[id].map,
		zoomCluster = data.clusterMarkers ? parseFloat(data.clusterMarkers.zoomLevel) : 1,
		dataContext;

	// do nothing if we clicked a label
	if (ev.target.isLabels) {
		return;
	}

	dataContext = ev.target.dataItem.dataContext;

	// if it's a marker, handle it differently
	if (seriesType == "MapImage") {
		// if it's a cluster marker, zoom to the max
		if (dataContext.cluster) {

			// if we're far from the max, let's just zoom half
			if ((zoomCluster - parseInt(map.zoomLevel)) > 20) {
				zoomCluster = zoomCluster / 2;
			}

			ev.target.series.chart.zoomToMapObject(
				ev.target,
				zoomCluster
			);
		} else {
			ev.target.series.chart.zoomToMapObject(ev.target);
		}
	} else {
		if (dataContext.id === "asia") {
			ev.target.series.chart.deltaLongitudeOriginal = ev.target.series.chart.deltaLongitude;
			ev.target.series.chart.deltaLongitude = -10;
			ev.target.series.chart.zoomToGeoPoint(
				{
					latitude: 34.076842,
					longitude: 100.693068
				},
				1.7,
				true
			);
		} else {
			if (typeof ev.target.series.chart.deltaLongitudeOriginal !== 'undefined') {
				ev.target.series.chart.deltaLongitude = ev.target.series.chart.deltaLongitude;
			}
			ev.target.series.chart.zoomToMapObject(
				ev.target,
				ev.target.zoomLevel * 2
			);
		}
	}
};

iMapsManager.setupHoverEvents = function (id, ev) {

	var im = this,
		selected = im.maps[id].selected || false,
		dataContext;

	if (ev.target.isLabels) {
		dataContext = ev.target.dataItems.first.dataContext;
	} else {
		dataContext = ev.target.dataItem.dataContext;
	}

	if (dataContext.action && dataContext.action != "none") {
		ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
	}

	if (Array.isArray(selected) && !selected.includes(ev.target)) {
		selected.forEach(function (sel, index) {
			sel.isHover = false;
		});
	}

	if (im.bool(dataContext.triggerClickOnHover)) {
		iMapsManager.select(id, dataContext.id, false);
	}
};

iMapsManager.singleHit = function (id, ev) {
	var im = this,
		selected = im.maps[id].selected || false,
		dataContext;

	if (ev.target.isLabels) {
		dataContext = ev.target.dataItems.first.dataContext;
	} else {
		dataContext = ev.target.dataItem.dataContext;
	}

	if (dataContext.madeFromGeoData) {
		return;
	}

	ev.target.isActive = true;
	ev.target.isHover = true;
	ev.target.setState("active");

	iMapsManager.clearSelected(id, ev.target);
	im.maps[id].selected = [ev.target];
};

iMapsManager.groupHit = function (id, ev) {
	var im = this,
		selected = im.maps[id].selected || false;

	if (ev.target.dataItem.dataContext.madeFromGeoData) {
		return;
	}

	iMapsManager.clearSelected(id);

	selected = [];

	ev.target.parent.mapPolygons.each(function (polygon) {
		if (!polygon.dataItem.dataContext.madeFromGeoData) {
			// toggle active state
			polygon.setState("active");
			//removed to fix bug when hovering groups after clicked
			//polygon.isActive = true;
			polygon.isHover = true;
			selected.push(polygon);
		}
	});

	im.maps[id].selected = selected;
};

iMapsManager.groupHover = function (id, ev) {
	if (ev.target.dataItem.dataContext.madeFromGeoData) {
		return;
	}

	// set mouse hover pointer cursor
	if (ev.target.dataItem.dataContext.action && ev.target.dataItem.dataContext.action != "none") {
		ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
	}

	// hilight all polygons from this group
	ev.target.parent.mapPolygons.each(function (polygon) {
		if (!polygon.dataItem.dataContext.madeFromGeoData) {
			if (!polygon.isActive) {
				polygon.setState("highlight");
			}
		}
	});
};

iMapsManager.groupHoverOut = function (id, ev) {
	if (ev.target.dataItem.dataContext.madeFromGeoData) {
		return;
	}

	ev.target.parent.mapPolygons.each(function (polygon) {
		if (!polygon.isActive) {
			polygon.setState("default");
		}
	});
};

/**
 * Selects a element in the map
 * id - id of the map
 * elID - id of the element to select
 * forceFixedTooltip - if we should force the tooltip to be fixed or not
 */
iMapsManager.select = function (id, elID, forceFixedTooltip, showTooltip) {
	var im = this,
		map = im.maps[id],
		data = im.maps[id].data,
		series = map.series,
		selected = [],
		select,
		group,
		defaultTooltipPosition;

	// Force fixed position?
	if (typeof forceFixedTooltip === 'undefined') {
		forceFixedTooltip = true;
	}

	if (typeof showTooltip === 'undefined') {
		showTooltip = true;
	}

	iMapsManager.clearSelected(id);

	if (Array.isArray(series)) {
		for (var i = 0, len = series.length; i < len; i++) {
			// regionSeries
			if (series[i].mapPolygons) {

				// check if group
				if (elID.includes(',')) {

					//first trigger click
					select = series[i].getPolygonById(elID);
					if (select) {
						select.tooltip = false;
						select.dispatchImmediately("hit");
					}
					//then hilight
					group = elID.split(',');
					group.forEach(function (rxid, indx) {
						select = series[i].getPolygonById(rxid.trim());
						if (select) {
							if (select.dataItem.dataContext.madeFromGeoData) {
								return;
							}
							//the first one, let's trigger the tooltip and the hit
							if (indx === 0 && showTooltip) {
								if (forceFixedTooltip) {
									defaultTooltipPosition = select.tooltipPosition;
									select.tooltipPosition = 'fixed';
									select.isHover = true;
									select.tooltipPosition = defaultTooltipPosition;
								} else {
									select.isHover = true;
								}
							}

							// if we have the active state, use it instead
							if (data.regionActiveState && im.bool(data.regionActiveState.enabled)) {
								select.setState("active");
							} else {
								select.setState("highlight");
							}

							//select.setState("highlight");

							selected.push(select);
						}
					});


				} else {
					select = series[i].getPolygonById(elID);
					if (select) {
						if (forceFixedTooltip) {
							defaultTooltipPosition = select.tooltipPosition;
							select.tooltipPosition = 'fixed';
							select.dispatchImmediately("hit");
							select.tooltipPosition = defaultTooltipPosition;
							selected.push(select);
						} else {
							select.dispatchImmediately("hit");
							selected.push(select);
						}
					}
				}
			}
			// imageSeries
			if (series[i].mapImages) {
				select = series[i].getImageById(elID);
				if (select) {
					if (forceFixedTooltip) {
						defaultTooltipPosition = select.tooltipPosition;
						select.tooltipPosition = 'fixed';
						select.dispatchImmediately("hit");
						select.tooltipPosition = defaultTooltipPosition;
						selected.push(select);
					} else {
						select.dispatchImmediately("hit");
						selected.push(select);
					}
				}
			}
		}
	}
	im.maps[id].selected = selected;
	return select;
};

iMapsManager.setupRangeHeatMap = function (series, id) {
	var im = this,
		data = im.maps[id].data,
		regions = data.regions,
		markers = data.roundMarkers,
		reordered,
		seriesType = im.getTargetSeriesType(series);

	if (seriesType === "MapImageSeries") {

		if (!Array.isArray(data.heatMapMarkers.range) || data.heatMapMarkers.range.length === 0) {
			return;
		}

		// reorder ranges by value
		reordered = data.heatMapMarkers.range.slice(0);
		reordered.sort(function (a, b) {
			if (isNaN(a.rule)) {
				var x = a.rule.toLowerCase();
				var y = b.rule.toLowerCase();
				return x < y ? -1 : x > y ? 1 : 0;
			} else {
				return parseFloat(a.rule) - parseFloat(b.rule);
			}
		});

		if (Array.isArray(markers) && markers.length > 0) {
			markers.forEach(function (entry, index) {

				if (typeof entry[data.heatMapMarkers.source] === 'undefined') {
					return;
				}

				var val = entry[data.heatMapMarkers.source];
				var start;

				if (!isNaN(val)) {
					val = parseFloat(val);
				}

				reordered.forEach(function (ruleData, index) {

					if (isNaN(ruleData.rule)) {
						start = ruleData.rule.trim();
						// if it's not a number
						if (val == start) {
							entry.fill = ruleData.fill;
							entry.radius = parseFloat(ruleData.radius);
						}
					} else {
						start = parseFloat(ruleData.rule);
						// if it's a number
						if (val >= start) {
							entry.fill = ruleData.fill;
							entry.radius = parseFloat(ruleData.radius);
						}
					}
				});
			});
		}


	} else if (seriesType === "MapPolygonSeries") {

		if (!Array.isArray(data.heatMapRegions.range) || data.heatMapRegions.range.length === 0) {
			return;
		}

		// reorder ranges by value
		reordered = data.heatMapRegions.range.slice(0);
		reordered.sort(function (a, b) {
			if (isNaN(a.rule)) {
				var x = a.rule.toLowerCase();
				var y = b.rule.toLowerCase();
				return x < y ? -1 : x > y ? 1 : 0;
			} else {
				return parseFloat(a.rule) - parseFloat(b.rule);
			}
		});

		if (Array.isArray(regions) && regions.length > 0) {
			regions.forEach(function (entry, index) {
				if (typeof entry[data.heatMapRegions.source] === 'undefined') {
					return;
				}

				var val = entry[data.heatMapRegions.source];
				var start;

				if (!isNaN(val)) {
					val = parseFloat(val);
				}

				reordered.forEach(function (ruleData, index) {

					if (isNaN(ruleData.rule)) {
						start = ruleData.rule.trim();
						// if it's a number
						if (val == start) {

							entry.fill = ruleData.fill;
						}
					} else {
						start = parseFloat(ruleData.rule);
						// if it's a number
						if (val >= start) {
							entry.fill = ruleData.fill;
						}
					}
				});
			});
		}
	}
};

iMapsManager.setupHeatMap = function (series, id, data) {
	var im = this,
		map = im.maps[id].map,
		heatLegend,
		minRange,
		maxRange,
		target,
		minProp,
		maxProp,
		propTargets,
		dataSource,
		seriesType = im.getTargetSeriesType(series);

	// setup target
	if (seriesType === "MapImageSeries") {

		if (typeof data.heatMapMarkers.type !== 'undefined' && data.heatMapMarkers.type === 'range') {
			im.setupRangeHeatMap(series, id);
			return;
		}

		target = series.mapImages.template.children.values[0];
		propTargets = ["fill", "radius"];
		dataSource = data.heatMapMarkers;

	} else if (seriesType === "MapPolygonSeries") {

		if (typeof data.heatMapRegions.type !== 'undefined' && data.heatMapRegions.type === 'range') {
			im.setupRangeHeatMap(series, id);
			return;
		}

		target = series.mapPolygons.template;
		propTargets = ["fill"];
		dataSource = data.heatMapRegions;
	} else {
		return;
	}

	// make sure we read data form the correct property
	series.dataFields.value = dataSource.source;

	if (!Array.isArray(propTargets)) {
		propTargets = [propTargets];
	}

	propTargets.map(function (prop) {
		// setup min/max sources
		if (prop === "fill") {
			minProp = dataSource.minColor;
			maxProp = dataSource.maxColor;
		} else if (prop === "radius") {
			minProp = dataSource.minRadius;
			maxProp = dataSource.maxRadius;
		}

		series.heatRules.push({
			property: prop,
			target: target,
			min: minProp,
			max: maxProp,
		});
	});

	if (im.bool(dataSource.legend)) {
		heatLegend = map.createChild(am4maps.HeatLegend);
		heatLegend.series = series;
		heatLegend.align = "right";
		heatLegend.valign = "bottom";
		heatLegend.width = am4core.percent(20);
		heatLegend.marginRight = am4core.percent(4);
		heatLegend.minValue = 0;
		heatLegend.maxValue = 99999999999999;

		// Set up custom heat map legend labels using axis ranges
		minRange = heatLegend.valueAxis.axisRanges.create();
		minRange.value = heatLegend.minValue;
		minRange.label.text = dataSource.minLabel;
		maxRange = heatLegend.valueAxis.axisRanges.create();
		maxRange.value = heatLegend.maxValue;
		maxRange.label.text = dataSource.maxLabel;

		// Blank out internal heat legend value axis labels
		heatLegend.valueAxis.renderer.labels.template.adapter.add(
			"text",
			function () {
				return "";
			}
		);
	}
};

iMapsManager.drillDown = function (id, ev) {
	var im = iMapsManager,
		mapName = iMapsRouter.iso2cleanName(ev.target.dataItem.dataContext.id, id),
		targetID = ev.target.dataItem.dataContext.id,
		allCurrentSeries = iMapsManager.maps[id].series,
		currentRegion,
		baseSeries = iMapsManager.maps[id].baseSeries,
		allBaseSeries = iMapsManager.maps[id].allBaseSeries,
		i,
		len,
		checkSeries = [],
		seriesExists = false;

	console.log('Map Name:', mapName);
	console.log('Available Series:', iMapsManager.maps[id].seriesIndex);

	// check if geofile info exists or return if the id is numeric
	if (!mapName || !isNaN(targetID)) {
		return false;
	}

	if (ev.target.polygon) {

		// what we need to check
		checkSeries.push(mapName);

		// check if series exists for this map
		checkSeries.forEach(function (ser) {
			if (Array.isArray(iMapsManager.maps[id].seriesIndex[ser])) {
				seriesExists = true;
				currentRegion = iMapsManager.maps[id].seriesIndex[ser];
			}
		});


		if (seriesExists) {
			// hide all others except this one and baseSeries
			for (i = 0, len = allCurrentSeries.length; i < len; i++) {
				if (baseSeries === allCurrentSeries[i]) {
					allCurrentSeries[i].opacity = 0.3;
				} else {
					allCurrentSeries[i].hide();
				}
			}
			for (i = 0, len = currentRegion.length; i < len; i++) {
				currentRegion[i].show();
			}

			// is drilling
			iMapsManager.maps[id].isDrilling = true;

			// zoom to region
			if (!ev.zooming) {
				im.zoomToRegion(ev, id);
			}
		} else {
			// if the target is part of current series, do nothing
			if (currentRegion === ev.target.series) {
				iMapsManager.maps[id].isDrilling = false;
				return;
			}
			// if target is base series, show it
			if (ev.target.series === baseSeries) {
				iMapsManager.maps[id].isDrilling = false;
				// hide all except baseSeries
				for (i = 0, len = allCurrentSeries.length; i < len; i++) {
					if (allBaseSeries.includes(allCurrentSeries[i])) {
						allCurrentSeries[i].show();
					} else {
						allCurrentSeries[i].hide();
					}
				}
			}
		}
	}
};

/*HELPERS*/
iMapsManager.getSelected = function (id) {
	var im = this,
		map = im.maps[id],
		selected = map.selected || false,
		multiple = [];
	if (selected) {
		if (Array.isArray(selected)) {
			selected.forEach(function (sel) {
				multiple.push(sel.dataItem.dataContext);
			});
			return multiple;
		}
		return selected.dataItem.dataContext;
	} else {
		return false;
	}
};

iMapsManager.getHovered = function (id) {
	var im = this,
		map = im.maps[id],
		hovered = map.hovered || false,
		multiple = [];
	if (hovered) {
		if (Array.isArray(hovered)) {
			hovered.forEach(function (sel) {
				multiple.push(sel.dataItem.dataContext);
			});
			return multiple;
		}
	} else {
		return false;
	}
};

iMapsManager.getHighlighted = function (id) {
	var im = this,
		map = im.maps[id],
		highlighted = map.highlighted || false,
		multiple = [];
	if (highlighted) {
		if (Array.isArray(highlighted)) {
			highlighted.forEach(function (sel) {
				multiple.push(sel.dataItem.dataContext);
			});
			return multiple;
		}
		return highlighted.dataItem.dataContext;
	} else {
		return false;
	}
};

iMapsManager.clearSelected = function (id, keepThis) {
	var im = this,
		map = im.maps[id],
		selected = map.selected || [];

	// to keep the state of this element
	keepThis = keepThis || false;

	if (Array.isArray(selected) && selected.length > 0) {

		selected.forEach(function (polygon, index) {

			if (polygon !== keepThis) {
				polygon.isHover = false;
				polygon.isActive = false;
				polygon.setState("default");
			}
		});

		selected = [];
	}
	if (!keepThis) {
		map.selected = [];
	} else {
		map.selected = [keepThis];
	}

	return map.selected;

};

iMapsManager.clearHighlighted = function (id) {

	var im = this,
		map = im.maps[id],
		highlighted = map.highlighted || [];

	if (Array.isArray(highlighted) && highlighted.length > 0) {
		highlighted.forEach(function (polygon, index) {
			polygon.isHover = false;
			polygon.isActive = false;
			polygon.setState("default");
		});

		highlighted = [];
	}

	return highlighted;
};

/*
 * setup hover events
 * id - id of the map
 * eID - hovered element ID
 * forcedFixedTooltip - if we should force the tooltip to be fixed or not
 */
iMapsManager.hover = function (id, eID, forceFixedTooltip) {
	var im = this,
		map = im.maps[id],
		data = map.data,
		series = map.series,
		hovered = map.hovered || [],
		hover,
		group,
		defaultTooltipPosition;

	// Force fixed position?
	if (typeof forceFixedTooltip === 'undefined') {
		forceFixedTooltip = true;
	}

	hovered.forEach(function (hov) {
		hov.isHover = false;
		hov.setState("default");
	});

	hovered = [];

	if (Array.isArray(series)) {
		for (var i = 0, len = series.length; i < len; i++) {
			// regionSeries
			if (series[i].mapPolygons) {
				// multiple
				// check if group
				if (eID.includes(',')) {
					// foreach code
					group = eID.split(',');
					group.forEach(function (rxid, indx) {
						// single
						hover = series[i].getPolygonById(rxid.trim());
						if (hover) {
							if (forceFixedTooltip) {
								defaultTooltipPosition = hover.tooltipPosition;
								hover.tooltipPosition = 'fixed';
								hovered.push(hover);
								hover.dispatchImmediately("over");
								hover.isHover = true;
								hover.tooltipPosition = defaultTooltipPosition;
							} else {
								hovered.push(hover);
								hover.dispatchImmediately("over");
								hover.isHover = true;
							}
						}
					});
				} else {

					// single
					hover = series[i].getPolygonById(eID);
					if (hover) {
						if (forceFixedTooltip) {
							defaultTooltipPosition = hover.tooltipPosition;
							hover.tooltipPosition = 'fixed';
							hovered = [hover];
							hover.dispatchImmediately("over");
							hover.isHover = true;
							hover.tooltipPosition = defaultTooltipPosition;
						} else {
							hovered = [hover];
							hover.dispatchImmediately("over");
							hover.isHover = true;
						}
					}
				}
			}
			// imageSeries
			if (series[i].mapImages) {
				hover = series[i].getImageById(eID);
				if (hover) {
					if (forceFixedTooltip) {
						hovered = [hover];
						hover.dispatchImmediately("over");
						hover.isHover = true;
					} else {
						hovered = [hover];
						hover.dispatchImmediately("over");
						hover.isHover = true;
					}
				}
			}
		}
	}
	map.hovered = hovered;
	return hover;
};

iMapsManager.clearHovered = function (id, eID) {
	var im = this,
		map = im.maps[id],
		hovered = map.hovered || false,
		series = map.series,
		hover;

	eID = eID || false;

	if (eID) {
		if (Array.isArray(series)) {
			for (var i = 0, len = series.length; i < len; i++) {
				// regionSeries
				if (series[i].mapPolygons) {
					hover = series[i].getPolygonById(eID);
					if (hover) {
						hover.dispatchImmediately("out");
						hover.isHover = false;
					}
				}
				// imageSeries
				if (series[i].mapImages) {
					hover = series[i].getImageById(eID);
					if (hover) {
						hover.dispatchImmediately("out");
						hover.isHover = false;
					}
				}
			}
		}
	} else {

		if (hovered) {
			hovered.forEach(function (hov) {
				hov.dispatchImmediately("out");
				hov.isHover = false;
			});
			map.hovered = [];
			return true;
		}

	}

	return false;
};

/**
 * id - map ID
 * elID - element to highlight
 */
iMapsManager.highlight = function (id, elID) {

	var im = this,
		map = im.maps[id],
		series = map.series,
		select,
		highlighted = map.highlighted || [],
		group;

	//iMapsManager.clearSelected(id);

	if (Array.isArray(series)) {
		for (var i = 0, len = series.length; i < len; i++) {
			// regionSeries
			if (series[i].mapPolygons) {

				// check if group
				if (elID.includes(',')) {
					group = elID.split(',');
					group.forEach(function (rxid, indx) {
						select = series[i].getPolygonById(rxid.trim());
						if (select) {
							if (select.dataItem.dataContext.madeFromGeoData) {
								return;
							}
							select.setState("highlight");
							highlighted.push(select);
						}
					});
				} else {
					select = series[i].getPolygonById(elID);
					if (select) {
						select.setState("highlight");
						highlighted.push(select);
					}
				}
			}
			// imageSeries
			if (series[i].mapImages) {
				select = series[i].getImageById(elID);
				if (select) {
					select.setState("hightlight");
					highlighted.push(select);
				}
			}
		}
	}
	map.highlighted = highlighted;
	return select;

};

iMapsManager.getTargetSeriesType = function (el) {
	var className = el.className;
	return className;
};

/**
 * Setups clustered series based on coordinate values from data
 */
iMapsManager.setupClusters = function (data, id) {
	var im = this,
		map = im.maps[id],
		series = [],
		markerSeries,
		tempData = {},
		biasLevels = [],
		zoomLevels = [],
		biasSteps = 4,
		i = 0,
		prevBias = parseFloat(data.clusterMarkers.maxBias),
		maxZoomLevel = parseFloat(data.clusterMarkers.zoomLevel) || 20;

	while (i <= biasSteps) {
		biasLevels.push(prevBias);
		prevBias = prevBias / 2;

		zoomLevels.push(maxZoomLevel);
		maxZoomLevel = Math.ceil(maxZoomLevel / 2);

		i++;
	}

	// reverse array to match detail level
	zoomLevels.reverse().pop();
	biasLevels.pop();

	if (Array.isArray(data.roundMarkers)) {
		biasLevels.forEach(function (item, index) {
			series = geocluster(data.roundMarkers, item, data.markerDefaults);

			tempData = Object.assign({}, data);
			tempData.roundMarkers = series;

			markerSeries = im.pushRoundMarkerSeries(id, tempData);

			markerSeries.name = tempData.title || "Map";
			markerSeries.hiddenInLegend = true;
			map.clusterSeries[zoomLevels[index]] = markerSeries;

			if (index === 0) {
				im.maps[id].allBaseSeries.push(markerSeries);
			}
			markerSeries.hidden = true;
		});
	}
	return true;
};

/**
 * Adds a new region Series currently not loaded, adding the script to the body of the page and creating a new series after
 * id - map id to attach series
 * dataContent - object with data that would tipically be a polygon dataContent, like name and id
 * config - config object for the new series being added
 *
 * @return newSeries - the new created series object
 */
iMapsManager.addGeoFileSeries = function (id, dataContext, data) {
	var newSeries,
		geoFiles = iMapsRouter.getGeoFiles(dataContext);
	var scriptPromise = new Promise(function (resolve, reject) {
		var script = document.createElement("script");
		document.body.appendChild(script);
		script.onload = resolve;
		script.onerror = reject;
		script.async = true;
		script.src = geoFiles.src;
	});

	scriptPromise.then(function () {
		var data = {
			title: geoFiles.title,
			map: geoFiles.map,
			regions: [],
			config: data // not working, we changed the config to be at parent level with data
		};

		iMapsManager.maps[id].seriesIndex[geoFiles.map] = [];
		newSeries = iMapsManager.pushRegionSeries(id, data);
		iMapsManager.maps[id].seriesIndex[geoFiles.map].push(newSeries);

		return newSeries;
	});

	return false;
};

iMapsManager.handleInfoBox = function (id) {
	var im = this,
		map = im.maps[id].map,
		events = ["ready", "mappositionchanged", "zoomlevelchanged"],
		container = document.getElementById("map_tech_info"),
		coordinatesc = document.getElementById("map_click_events_coordinates"),
		series = im.maps[id].series;

	if (container) {
		iMapsManager.populateInfo(id, container);

		// zoom, etc
		events.forEach(function (event) {
			map.events.on(
				event,
				function (ev) {
					iMapsManager.populateInfo(id, container);
				},
				this
			);
		});
	}

	if (coordinatesc) {
		map.events.on(
			"hit",
			function (ev) {

				var coordinates = map.svgPointToGeo(ev.svgPoint);
				var lat = Number(coordinates.latitude).toFixed(6);
				var long = Number(coordinates.longitude).toFixed(6);

				// latitude
				var latEl = document.createElement('div');
				var latLabelEl = document.createElement('span');
				var latValueEl = document.createElement('span');
				latValueEl.classList.add('map_clicked_lat');
				latLabelEl.innerHTML = 'LAT: ';
				latValueEl.innerHTML = lat;
				latEl.appendChild(latLabelEl);
				latEl.appendChild(latValueEl);

				// longitude
				var longEl = document.createElement('div');
				var longLabelEl = document.createElement('span');
				var longValueEl = document.createElement('span');
				longValueEl.classList.add('map_clicked_long');
				longLabelEl.innerHTML = 'LON: ';
				longValueEl.innerHTML = long;
				longEl.appendChild(longLabelEl);
				longEl.appendChild(longValueEl);

				coordinatesc.innerHTML = '';
				coordinatesc.appendChild(latEl);
				coordinatesc.appendChild(longEl);


				var event = new CustomEvent("mapPointClicked", { detail: { latitude: lat, longitude: long } });

				document.dispatchEvent(event);

			},
			this
		);
	}
};

iMapsManager.populateInfo = function (id, container) {
	var im = this,
		map = im.maps[id].map,
		info = "";

	info +=
		"Zoom Level: " + parseFloat(Number(map.zoomLevel).toFixed(2)) + "<br>";
	info +=
		"Center Coordinates: <br>" +
		"LAT " +
		Number(map.zoomGeoPoint.latitude).toFixed(6) +
		"<br>" +
		"LONG " +
		Number(map.zoomGeoPoint.longitude).toFixed(6) +
		"<br>";

	container.innerHTML = info;
};

iMapsManager.populateClickInfo = function (data) {
	var container = document.getElementById("map_click_events_info"),
		info = "";

	if (container && data) {
		info += "ID: " + data.id + "<br>";
		if (data.name) {
			info += "Name: " + data.name + "<br>";
		}
		if (data.latitude) {
			info += "LAT: " + Number(data.latitude).toFixed(6) + "<br>";
			info += "LONG: " + Number(data.longitude).toFixed(6) + "<br>";
		}

		if (data.action) {
			info += "Action: " + data.action.replace("igm_", "") + "<br>";
		}

		container.innerHTML = info;
	}
};

iMapsManager.hideAllSeries = function (id) {
	id = parseInt(id);
	if (!id) {
		return;
	}
	var map = iMaps.maps[id];

	for (var index = 0; index < map.series.length; index++) {
		var serie = map.series[index];
		var baseSeries = map.baseRegionSeries;
		if (baseSeries !== serie) {
			serie.hide();
		}
	}
};

iMapsManager.showAllSeries = function (id) {
	id = parseInt(id);
	if (!id) {
		return;
	}
	var map = iMaps.maps[id];

	for (var index = 0; index < map.series.length; index++) {
		var serie = map.series[index];
		serie.show();
	}
};

/** Util function to return boolean value of string */
iMapsManager.bool = function (string) {
	var bool = Number(string) === 0 || string === "false" || typeof string === "undefined" ? false : true;
	return bool;
};

iMapsManager.isJSON = function (str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

/* Closest Polyfill */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var el = this;

		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}
/** Library for elements
 */

iMapsManager.library = {
	icons: {
		goFullIconPath: "m15.78742,5.93715l-3.95414,3.95414l3.95414,3.95414l1.60393,-1.60393q0.32301,-0.34529 0.77969,-0.15594q0.4344,0.18935 0.4344,0.65717l0,4.99002q0,0.2896 -0.21163,0.50123t-0.50123,0.21163l-4.99002,0q-0.46781,0 -0.65717,-0.44554q-0.18935,-0.4344 0.15594,-0.76855l1.60393,-1.60393l-3.95414,-3.95414l-3.95414,3.95414l1.60393,1.60393q0.34529,0.33415 0.15594,0.76855q-0.18935,0.44554 -0.65717,0.44554l-4.99002,0q-0.2896,0 -0.50123,-0.21163t-0.21163,-0.50123l0,-4.99002q0,-0.46781 0.44554,-0.65717q0.4344,-0.18935 0.76855,0.15594l1.60393,1.60393l3.95414,-3.95414l-3.95414,-3.95414l-1.60393,1.60393q-0.21163,0.21163 -0.50123,0.21163q-0.13366,0 -0.26732,-0.05569q-0.44554,-0.18935 -0.44554,-0.65717l0,-4.99002q0,-0.2896 0.21163,-0.50123t0.50123,-0.21163l4.99002,0q0.46781,0 0.65717,0.44554q0.18935,0.4344 -0.15594,0.76855l-1.60393,1.60393l3.95414,3.95414l3.95414,-3.95414l-1.60393,-1.60393q-0.34529,-0.33415 -0.15594,-0.76855q0.18935,-0.44554 0.65717,-0.44554l4.99002,0q0.2896,0 0.50123,0.21163t0.21163,0.50123l0,4.99002q0,0.46781 -0.4344,0.65717q-0.1448,0.05569 -0.27846,0.05569q-0.2896,0 -0.50123,-0.21163l-1.60393,-1.60393z",
		exitFullIconPath: "m10.04411,10.81638l0,5.40556q0,0.31372 -0.22925,0.54297t-0.54297,0.22925t-0.54297,-0.22925l-1.7375,-1.7375l-4.00591,4.00591q-0.12066,0.12066 -0.27752,0.12066t-0.27752,-0.12066l-1.37552,-1.37552q-0.12066,-0.12066 -0.12066,-0.27752t0.12066,-0.27752l4.00591,-4.00591l-1.7375,-1.7375q-0.22925,-0.22925 -0.22925,-0.54297t0.22925,-0.54297t0.54297,-0.22925l5.40556,0q0.31372,0 0.54297,0.22925t0.22925,0.54297zm9.10982,-8.10834q0,0.15686 -0.12066,0.27752l-4.00591,4.00591l1.7375,1.7375q0.22925,0.22925 0.22925,0.54297t-0.22925,0.54297t-0.54297,0.22925l-5.40556,0q-0.31372,0 -0.54297,-0.22925t-0.22925,-0.54297l0,-5.40556q0,-0.31372 0.22925,-0.54297t0.54297,-0.22925t0.54297,0.22925l1.7375,1.7375l4.00591,-4.00591q0.12066,-0.12066 0.27752,-0.12066t0.27752,0.12066l1.37552,1.37552q0.12066,0.12066 0.12066,0.27752z"
	}
};

iMapsManager.handleExternalZoom = function (id) {
	var mapContainer, mapBox, controls, homeBtn, zoomInBtn, zoomOutBtn;
	mapContainer = document.getElementById('map_wrapper_' + id);

	if (!mapContainer) {
		return;
	}

	mapBox = mapContainer.querySelector('.map_box');
	mapContainer.classList.add('map_has_external_controls');

	// home button
	homeBtn = document.createElement('div');
	homeBtn.setAttribute("id", "map_home_buttom_" + id);
	homeBtn.setAttribute("data-map-id", id);
	homeBtn.classList.add('map_home_button');
	homeBtn.innerHTML = '<svg height="20" width="20"><path d="M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8" /></svg>';
	homeBtn.addEventListener('click', function (ev) {
		var id = this.getAttribute('data-map-id');
		iMaps.maps[id].map.goHome();
	});

	// zoom in
	zoomInBtn = document.createElement('div');
	zoomInBtn.setAttribute("id", "map_zoomin_buttom_" + id);
	zoomInBtn.setAttribute("data-map-id", id);
	zoomInBtn.classList.add('map_zoomin_button');
	zoomInBtn.innerHTML = '+';
	zoomInBtn.addEventListener('click', function (ev) {
		var id = this.getAttribute('data-map-id');
		iMaps.maps[id].map.zoomIn();
	});

	// zoom out
	zoomOutBtn = document.createElement('div');
	zoomOutBtn.setAttribute("id", "map_zoomout_buttom_" + id);
	zoomOutBtn.setAttribute("data-map-id", id);
	zoomOutBtn.classList.add('map_zoomout_button');
	zoomOutBtn.innerHTML = '-';
	zoomOutBtn.addEventListener('click', function (ev) {
		var id = this.getAttribute('data-map-id');
		iMaps.maps[id].map.zoomOut();
	});

	// controls container
	controls = document.createElement('div');
	controls.setAttribute("id", "map_controls_" + id);
	controls.classList.add('map_controls');
	controls.appendChild(homeBtn);
	controls.appendChild(zoomInBtn);
	controls.appendChild(zoomOutBtn);



	// add buttons
	mapBox.parentNode.insertBefore(controls, mapBox.nextSibling);

};

iMapsManager.openFullscreen = function (elem) {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) { /* Firefox */
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE/Edge */
		elem.msRequestFullscreen();
	}
};

/* Close fullscreen */
iMapsManager.closeFullScreen = function () {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { /* Firefox */
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE/Edge */
		document.msExitFullscreen();
	}
	iMapsManager.isFullScreen = false;
};

iMapsManager.isFullScreen = false;
