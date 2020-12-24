/**
 * Main app file.  Initializes app components.
 */

/**
 * The main app object.
 *
 */
var iMaps = {};

/**
 * Initializes the interactiveMaps app
 *
 */
iMaps.init = function () {
	am4core.ready(function () {
		var data;

		am4core.options.autoSetClassName = true;
		am4core.options.classNamePrefix = "imaps";
		am4core.options.commercialLicense = true;
		am4core.options.queue = true;
		//am4core.options.queue = true;

		if (
			typeof iMapsData.options !== "undefined" &&
			typeof iMapsData.options.lazyLoad !== "undefined" &&
			iMapsData.options.lazyLoad === "1"
		) {
			am4core.options.onlyShowOnViewport = true;
		}

		// animated
		if (
			typeof iMapsData.options !== "undefined" &&
			typeof iMapsData.options.animations !== "undefined" &&
			iMapsData.options.animations === "1"
		) {
			am4core.useTheme(am4themes_animated);
		}

		data = iMapsModel.prepareData(iMapsData.data);
		data.forEach(function (data, index) {
			if (index.disabled) {
				return;
			}

			iMapsManager.init(index);
		});

		iMaps.maps = iMapsManager.maps;
	});
};


iMaps.loadScript = function (url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onreadystatechange = callback;
	script.onload = callback;
	document.head.appendChild(script);
};

iMaps.loadScripts = function (urls, callback) {

	var loadedCount = 0;
	var multiCallback = function () {
		loadedCount++;
		if (loadedCount >= urls.length) {
			callback.call(this, arguments);
		}
	};

	urls.forEach(function (url, index) {
		iMaps.loadScript(url, multiCallback);
	});
};

if (typeof iMapsData.async !== 'undefined' && Array.isArray(iMapsData.async) && iMapsData.async.length > 0) {

	// we need to load the core file first
	iMaps.loadScript(iMapsData.async[0], function () {
		// then we load the rest - shift() removes the first entry
		iMapsData.async.shift();
		iMaps.loadScripts(iMapsData.async, function () {
			iMaps.init();
		});

	});

} else {
	iMaps.init();
}


