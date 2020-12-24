/**
 * Main JSON object of data for the map
 */
var iMapsData = [
	{
		id: 10,
		container: "map",
		title: "hello-world",
		map: "am4geodata_continentsLow",
		config: {
			autoLabels: false,
			projection: "Miller",

			zoom: {
				controls: true,
				controlsAlign: "left",
				controlsValign: "bottom",
				doubleHitZoom: true,
				draggable: true,
				wheelable: false,
				smallMap: false,
				zoomLevel: 1,
				zoomOnClick: true,
				drillDownOnClick: true
			},
			inactiveColor: "#ccc",
			activeColor: "#0984e3",
			hoverColor: "red",
			inactiveHoverColor: "red",
			backgroundColor: "#fff",
			backgroundOpacity: 0.4,

			tooltip: {
				fixed: false,
				backgroundColor: "#ffffff",
				color: "#000000",
				interactionsEnabled: true,
				cornerRadius: 20,
				template: "{name}"
			}
		},
		grid: {
			color: "#6699cc",
			opacity: 0.08,
			fitExtent: false
		},
		projectionBackgroundColor: "#f5f5f5",
		projectionBackgroundOpacity: 0.5,

		include: null,
		exclude: ["antarctica"],
		regions: [],
		roundMarkers: [],
		imageMarkers: [],
		iconMarkers: [],
		labels: [],
		lines: [],
		overlay: [
			{
				id: 3,
				title: "Europe",
				map: "am4geodata_region_world_europeLow",
				config: {
					activeColor: "green", // need it for legend
					hoverColor: "red",
					inactiveColor: "#ccc",
					tooltip: {
						fixed: false,
						backgroundColor: "#ffffff",
						color: "#000000",
						interactionsEnabled: true,
						cornerRadius: 20,
						template: "{tooltipContent}"
					}
					//groupHover: true
				},
				regions: [
					{
						id: "PT",
						tooltipContent: "Angola!",
						fill: "#6699cc",
						hoverColor: "#660099",
						content: "https://california.com/",
						action: "open_url"
					},
					{
						id: "ES",
						tooltipContent: "Camarões",
						fill: "#6699cc",
						hoverColor: "#660099",
						content: "https://california.com/",
						action: "open_url"
					}
				],
				roundMarkers: [
					{
						tooltipContent: "Dublin",
						latitude: 53.3441,
						longitude: -6.2675,
						hoverColor: "#6699CC"
					},
					{
						tooltipContent: "Rome",
						latitude: 41.8955,
						longitude: 12.4823
					},
					{
						tooltipContent: "Riga",
						latitude: 56.9465,
						longitude: 24.1049
					},
					{
						tooltipContent: "Vaduz",
						latitude: 47.1411,
						longitude: 9.5215
					},
					{
						tooltipContent: "Vilnius",
						latitude: 54.6896,
						longitude: 25.2799
					},
					{
						tooltipContent: "Luxembourg",
						latitude: 49.61,
						longitude: 6.1296
					}
				],
				lines: [],
				labels: [],
				exclude: []
				//include: ["AO", "CM"] // must be build dynamically
			},
			{
				id: 4,
				title: "North America",
				map: "am4geodata_region_world_northAmericaLow",
				config: {
					activeColor: "green", // need it for legend
					hoverColor: "red",
					inactiveColor: "#ccc",
					tooltip: {
						fixed: false,
						backgroundColor: "#ffffff",
						color: "#000000",
						interactionsEnabled: true,
						cornerRadius: 20,
						template: "{tooltipContent}"
					}
					//groupHover: true
				},
				regions: [
					{
						id: "US",
						tooltipContent: "Angola!",
						fill: "#6699cc",
						hoverColor: "#660099",
						content: "https://california.com/",
						action: "open_url"
					},
					{
						id: "CA",
						tooltipContent: "Camarões",
						fill: "#6699cc",
						hoverColor: "#660099",
						content: "https://california.com/",
						action: "open_url"
					}
				],
				roundMarkers: [],
				lines: [],
				labels: [],
				exclude: []
				//include: ["AO", "CM"] // must be build dynamically
			},
			{
				id: 4,
				title: "US Map",
				map: "am4geodata_usaLow",
				config: {
					activeColor: "green", // need it for legend
					hoverColor: "red",
					inactiveColor: "#ccc",
					tooltip: {
						fixed: false,
						backgroundColor: "#ffffff",
						color: "#000000",
						interactionsEnabled: true,
						cornerRadius: 20,
						template: "{tooltipContent}"
					}
					//groupHover: true
				},
				regions: [
					{
						id: "US-CA",
						tooltipContent: "California",
						fill: "#6699cc",
						hoverColor: "#660099",
						content: "https://california.com/",
						action: "open_url"
					},
					{
						id: "US-TX",
						tooltipContent: "Camarões",
						fill: "#6699cc",
						hoverColor: "#660099",
						content: "https://california.com/",
						action: "open_url"
					}
				],
				roundMarkers: [],
				lines: [],
				labels: [],
				exclude: []
				//include: ["AO", "CM"] // must be build dynamically
			}
		]
	}
];
