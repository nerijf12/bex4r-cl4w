/**
 * File that contains functions to prepare raw data that arrives in a javascript variable.
 * 1) Convert color strings to color objects
 * */

var iMapsModel = {};

iMapsModel.prepareData = function (fullData) {

	if (!fullData) {
		return fullData;
	}

	if (!Array.isArray(fullData)) {
		return fullData;
	}

	fullData.forEach(function (data, index) {
		fullData[index] = iMapsModel.iterateData(data);

		if (
			Array.isArray(fullData[index].overlay) &&
			fullData[index].overlay.length > 0
		) {
			fullData[index].overlay.forEach(function (odata, ind) {

				// if the overlay map is the same as base map, only include the active regions
				if (fullData[index].overlay[ind].map === fullData[index].map) {
					fullData[index].overlay[
						ind
					].include = iMapsModel.prepareOverlayInclude(odata);
				}

				fullData[index].overlay[ind] = iMapsModel.iterateData(odata);
			});
		}
	});

	return fullData;
};

iMapsModel.prepareOverlayInclude = function (data) {
	var includes = data.includes || "";
	if (data.regions) {
		data.regions.forEach(function (region, index) {
			includes += "," + region.id;
		});
	}
	return includes;
};

iMapsModel.iterateData = function (data) {

	// check if there's a custom callback function to prepare the data
	if (typeof igm_custom_filter === 'function') {
		data = igm_custom_filter(data);
	}

	// check if there's a map specific custom callback function
	var mapFunction = 'igm_custom_filter_' + data.id;
	if (typeof window[mapFunction] === 'function') {
		data = window[mapFunction](data);
	}

	// create color objects
	data = iMapsModel.prepareColor(data);
	// convert exclude and includes to array
	data = iMapsModel.prepareExcludeIncludes(data);
	// convert coordinates to int
	data = iMapsModel.coordinatesToInt(data);
	// prepare entries that use defaults
	data = iMapsModel.prepareEntriesData(data);
	// prepare grouped regions
	data = iMapsModel.prepareGroupedRegions(data);
	//extract image source from imageMarkers
	data = iMapsModel.prepareImageFields(data);
	//prepare lines multiGeoLine format
	data = iMapsModel.prepareMultiGeoLine(data);

	return data;
};

iMapsModel.prepareMultiGeoLine = function (data) {
	if (Array.isArray(data.lines) && data.lines.length) {
		data.lines.map(function (line) {
			line.multiGeoLine.map(function (geoLine) {
				Object.assign(geoLine, geoLine.coordinates);
				delete geoLine.coordinates;
			});
		});
	}

	return data;
};

iMapsModel.prepareImageFields = function (data) {
	// image markers
	if (Array.isArray(data.imageMarkers) && data.imageMarkers.length) {
		data.imageMarkers.map(function (marker) {
			if (marker.image) {
				marker.href = marker.image.url;
			}
			return marker;
		});
	}

	return data;
};

iMapsModel.prepareGroupedRegions = function (data) {
	var regions, tempRegion, group;

	// regions
	if (Array.isArray(data.regions) && data.regions.length) {
		data.regions.map(function (region, index) {
			if (region.id && String(region.id).includes(",")) {

				group = [];
				regions = region.id.split(",");
				regions.forEach(function (reg, ix) {
					tempRegion = Object.assign({}, region);
					tempRegion.id = reg.trim();
					tempRegion.originalID = region.id;
					group.push(tempRegion);
				});

				// add group to main data object, but check if it's defined
				if (typeof data.regionGroups === 'undefined') {
					data.regionGroups = [];
				}
				// finally add it to the main data object
				data.regionGroups.push(group);

				// remove this region from the default regions data set
				data.regions.splice(index, -1);

			} else {
				return region;
			}

		});
	}
	return data;
};

iMapsModel.prepareTooltip = function (tooltipContent, options) {

	var maxWidth, isIE11, images, tooltipNode, range, tempDiv;

	if (typeof options === 'undefined' || typeof tooltipContent === 'undefined') {
		return tooltipContent;
	}

	maxWidth = typeof options.maxWidth !== "undefined" && options.maxWidth !== '' ? parseInt(options.maxWidth) : false;
	isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

	// remove html tags for IE
	if (isIE11) {
		return iMapsModel.removeHTMLtags(tooltipContent);
	}

	// check for images
	if (tooltipContent.includes("<img")) {
		// images
		range = document.createRange();
		// Make the parent of the first div in the document becomes the context node
		range.selectNode(document.getElementsByTagName("div").item(0));
		tooltipNode = range.createContextualFragment(tooltipContent);

		images = tooltipNode.querySelectorAll('img');

		if (images.length > 0) {

			images.forEach(function (img) {

				if (img.width !== 0 && img.style.width === '') {
					img.style.width = img.width + 'px';
				}

				if (img.height !== 0 && img.style.height === '') {
					img.style.height = img.height + 'px';
				}

			});

			tempDiv = document.createElement('div');
			tempDiv.appendChild(tooltipNode.cloneNode(true));
			tooltipContent = tempDiv.innerHTML;

		}
	}

	// tooltip
	if (maxWidth && tooltipContent !== '' && !isIE11) {
		tooltipContent = '<div class="imapsInnerTooltip" style="max-width:' + maxWidth + 'px">' + tooltipContent + '</div>';
	}

	return tooltipContent;

};

iMapsModel.removeHTMLtags = function (str) {

	if ((str === null) || (str === ''))
		return false;
	else
		str = str.toString();
	return str.replace(/<[^>]*>/g, '');
};

iMapsModel.prepareEntriesData = function (data) {

	if (data.heatMapMarkers && data.heatMapMarkers.enabled === "1") {
		data.heatMapMarkers.minRadius = parseInt(data.heatMapMarkers.minRadius);
		data.heatMapMarkers.maxRadius = parseInt(data.heatMapMarkers.maxRadius);
	}

	var mapID = data.id;

	// regions
	if (Array.isArray(data.regions) && data.regions.length) {

		data.regions.map(function (region) {
			if (
				typeof region.useDefaults === "undefined" ||
				region.useDefaults === "1"
			) {
				Object.assign(region, data.regionDefaults);
			}


			if (data.heatMapRegions && data.heatMapRegions.enabled === "1") {

				// if it includes a reference with dot notation
				if (data.heatMapRegions.source.includes('.')) {
					region.heatMapRegionRef = data.heatMapRegions.source.split('.').reduce(function (obj, i) {
						if (obj[i]) {
							return obj[i];
						}
						return 0;
					}, region);
				}

				delete region.fill;
			}

			// default action
			if (region.action === "default") {
				region.action = data.regionDefaults.action;
			}

			// border hover - currently doesn't exist
			if (
				typeof data.visual.borderColorHover !== "undefined" &&
				data.visual.borderColorHover !== data.visual.borderColor
			) {
				region.borderColorHover = data.visual.borderColorHover;
			}

			// border width on hover - currently doesn't exist
			if (
				typeof data.visual.borderWidthHover !== "undefined" &&
				data.visual.borderWidthHover !== data.visual.borderWidth
			) {
				region.borderWidthHover = data.visual.borderWidthHover;
			}

			region.tooltipContent = iMapsModel.prepareTooltip(region.tooltipContent, data.tooltip);
			region.mapID = mapID;

			return region;
		});

		// heatmap with dot notation
		// if it includes a reference with dot notation
		if (data.heatMapRegions && data.heatMapRegions.source.includes('.')) {
			data.heatMapRegions.source = 'heatMapRegionRef';
		}
	}

	// round markers
	if (Array.isArray(data.roundMarkers) && data.roundMarkers.length) {
		data.roundMarkers.map(function (marker) {
			if (
				typeof marker.useDefaults === "undefined" ||
				marker.useDefaults === "1"
			) {
				Object.assign(marker, data.markerDefaults);
			}

			if (marker.coordinates) {
				marker.latitude = marker.coordinates.latitude;
				marker.longitude = marker.coordinates.longitude;
				//Object.assign(marker, marker.coordinates);
				//delete marker.coordinates;
			}

			// set name to be id
			marker.name = marker.id;

			if (data.heatMapMarkers && data.heatMapMarkers.enabled === "1") {
				if (!isNaN(marker.value)) {
					marker.value = parseFloat(marker.value);
				}

				// if it includes a reference with dot notation
				if (data.heatMapMarkers.source.includes('.')) {
					marker.heatMapMarkerRef = data.heatMapMarkers.source.split('.').reduce(function (obj, i) {
						if (obj[i]) {
							return obj[i];
						}
						return 0;
					}, marker);
				}

				delete marker.fill;
				delete marker.radius;
			}

			// default action
			if (marker.action === "default") {
				marker.action = data.markerDefaults.action;
			}

			marker.tooltipContent = iMapsModel.prepareTooltip(marker.tooltipContent, data.tooltip);
			marker.mapID = mapID;

			return marker;
		});

		// heatmap with dot notation
		// if it includes a reference with dot notation
		if (data.heatMapMarkers && data.heatMapMarkers.source.includes('.')) {
			data.heatMapMarkers.source = 'heatMapMarkerRef';
		}
	}

	// icon markers
	if (Array.isArray(data.iconMarkers) && data.iconMarkers.length) {
		data.iconMarkers.map(function (marker) {
			if (
				typeof marker.useDefaults === "undefined" ||
				marker.useDefaults === "1"
			) {
				Object.assign(marker, data.iconMarkerDefaults);
			}
			if (marker.coordinates) {
				marker.latitude = marker.coordinates.latitude;
				marker.longitude = marker.coordinates.longitude;
				//Object.assign(marker, marker.coordinates);
				//delete marker.coordinates;
			}

			// set name to be id
			marker.name = marker.id;

			// default action
			if (marker.action === "default") {
				marker.action = data.iconMarkerDefaults.action;
			}

			marker.tooltipContent = iMapsModel.prepareTooltip(marker.tooltipContent, data.tooltip);
			marker.mapID = mapID;

			return marker;
		});
	}

	// image markers

	if (Array.isArray(data.imageMarkers) && data.imageMarkers.length) {
		data.imageMarkers.map(function (marker) {
			if (
				typeof marker.useDefaults === "undefined" ||
				marker.useDefaults === "1"
			) {
				Object.assign(marker, data.imageMarkerDefaults);
			}
			if (marker.coordinates) {
				marker.latitude = marker.coordinates.latitude;
				marker.longitude = marker.coordinates.longitude;
				//Object.assign(marker, marker.coordinates);
				//delete marker.coordinates;
			}

			// set name to be id
			marker.name = marker.id;

			if (marker.action === "default") {
				marker.action = data.imageMarkerDefaults.action;
			}
			marker.tooltipContent = iMapsModel.prepareTooltip(marker.tooltipContent, data.tooltip);
			marker.mapID = mapID;

			return marker;

		});
	}

	// labels
	if (Array.isArray(data.labels) && data.labels.length) {
		data.labels.map(function (label) {

			if (typeof label.size !== 'undefined') {
				label.fontSize = label.size;
			}

			if (
				typeof label.useDefaults === "undefined" ||
				label.useDefaults === "1"
			) {
				Object.assign(label, data.labelDefaults);
				Object.assign(label, data.labelPosition);
			}

			if (label.coordinates) {
				Object.assign(label, label.coordinates);
				delete label.coordinates;
			}

			if (label.action === "default") {
				label.action = data.labelDefaults.action;
			}

			label.tooltipContent = iMapsModel.prepareTooltip(label.tooltipContent, data.tooltip);
			label.mapID = mapID;

			return label;
		});
	}

	// lines
	if (Array.isArray(data.lines) && data.lines.length) {
		data.lines.map(function (line) {
			if (typeof line.useDefaults === "undefined" || line.useDefaults === "1") {
				Object.assign(line, data.lineDefaults);
			}
			line.curvature = parseFloat(line.curvature);
			return line;
		});
	}

	return data;
};

iMapsModel.prepareExcludeIncludes = function (data) {


	if (typeof data.onlyIncludeActive !== 'undefined' && parseInt(data.onlyIncludeActive) === 1) {
		data.include = [];
		data.exclude = [];

		if (data.regions) {
			data.regions.forEach(function (region, index) {
				data.include.push(region.id);
			});
		}

		return data;
	}

	if (
		data.exclude &&
		typeof data.exclude === "string" &&
		data.exclude.trim().length
	) {
		data.exclude = data.exclude.split(",").map(function (item) {
			return item.trim();
		});
	}

	if (data.include && data.include.length) {
		data.include = data.include.split(",").map(function (item) {
			return item.trim();
		});
	}

	return data;
};

iMapsModel.coordinatesToInt = function (data) {
	var convertCoordinates = function (key, obj) {
		obj[key].latitude = Number(obj[key].latitude);
		obj[key].longitude = Number(obj[key].longitude);
	},
		iterateObj = function (Obj) {
			if (typeof Obj !== "object" || Obj === null) {
				return;
			}
			Object.keys(Obj).map(function (key, index) {
				if (typeof Obj[key] === "object") {
					if (key === "coordinates" || key === "homeGeoPoint") {
						convertCoordinates(key, Obj);
					} else {
						iterateObj(Obj[key]);
					}
				}
			});
		};

	iterateObj(data);
	return data;
};

iMapsModel.prepareColor = function (data) {
	// prepare color fields
	var colorFields = [
		"inactiveColor",
		"activeColor",
		"hoverColor",
		"hover",
		"inactiveHoverColor",
		"backgroundColor",
		"color",
		"minColor",
		"maxColor",
		"fill",
		"projectionBackgroundColor",
		"borderColor",
		"borderColorHover"
	],
		checkColor = function (key, obj) {
			if (colorFields.includes(key)) {
				if (obj[key] === "transparent") {
					obj[key] = am4core.color("#f00", 0);
				} else {
					obj[key] = am4core.color(obj[key]);
				}
			}
		},
		iterateObj = function (Obj) {
			if (typeof Obj !== "object" || Obj === null) {
				return;
			}
			Object.keys(Obj).map(function (key, index) {
				if (typeof Obj[key] === "object") {
					iterateObj(Obj[key]);
				} else {
					checkColor(key, Obj);
				}
			});
		};

	iterateObj(data);

	return data;
};

/**
 * Retrives object with region codes and names from geojson
 */
iMapsModel.extractCodes = function (data) {
	var obj = {};
	for (var i = 0; i < data.features.length; i++) {
		obj[data.features[i].properties.id] = data.features[i].properties.name;
	}
	return obj;
};
