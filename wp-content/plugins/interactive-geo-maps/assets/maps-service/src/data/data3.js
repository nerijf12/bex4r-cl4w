/**
 * Main JSON object of data for the map
 */
var iMapsData = [
	{
		id: 10,
		container: "map",
		title: "hello-world",
		map: "am4geodata_worldLow",

		//autoLabels: true,
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
			zoomOnClick: true
			/*homeGeoPoint: {
			latitude: 52,
			longitude: 11
		},*/
		},
		highlightGroups: true, // not done yet?
		inactiveColor: "#cccccc",
		activeColor: "#0984e3",
		backgroundColor: "#ffffff",
		backgroundOpacity: 0,
		tooltip: {
			fixed: true,
			backgroundColor: "#ffffff",
			color: "#000000",
			interactionsEnabled: true,
			cornerRadius: 20,
			template: "{tooltipContent}"
		},
		include: null,
		exclude: ["AQ"],
		regions: [
			{
				id: "RU",
				tooltipContent: "United States<br><strong>Hello!</strong>",
				fill: "#6699cc",
				hover: am4core.color("#660000"),
				content: "https://cmoreira.net/",
				action: "open_url",
				value: 20
			},
			{
				id: "FR",
				tooltipContent: "",
				fill: "red",
				hover: am4core.color("#660000"),
				content: "https://google.com/",
				action: "open_url",
				value: 1
			}
		],
		roundMarkers: [
			{
				id: "Paris",
				latitude: 48.856614,
				longitude: 2.352222,
				tooltipContent: "Paris",
				fill: "#6699cc",
				hover: am4core.color("#660000"),
				size: 8,
				content: "https://cmoreira.net/",
				action: "open_url",
				path:
					"M9 9l-5 1v1l4 3a2286 2286 0 0 0-1 6l5-3a14908 14908 0 0 0 5 2l-1-5 4-3v-1l-5-1-3-5-3 5z"
			}
		],
		imageMarkers: [
			{
				id: "Vanvouver",
				latitude: 49.282729,
				longitude: -123.120738,
				tooltipContent: "Vancouver",
				width: 40,
				height: 40,
				horizontalCenter: "middle",
				verticalCenter: "middle",
				content: "https://cmoreira.net/",
				action: "open_url",
				src:
					"https://site.je/app/img/nucleo-social-icons/svg/social-1_logo-facebook.svg"
			}
		],
		iconMarkers: [
			{
				id: "NewYork",
				latitude: 40.712775,
				longitude: -74.005973,
				tooltipContent: "New York",
				fill: "#660099",
				hover: am4core.color("#660000"),
				width: 55,
				height: 55,
				value: 50,
				horizontalCenter: "middle",
				verticalCenter: "middle",
				content: "https://cmoreira.net/",
				action: "open_url",
				path:
					"M9 9l-5 1v1l4 3a2286 2286 0 0 0-1 6l5-3a14908 14908 0 0 0 5 2l-1-5 4-3v-1l-5-1-3-5-3 5z"
			}
		],
		labels: [
			{
				latitude: 35.86166,
				longitude: 104.195396,
				tooltipContent: "China",
				color: "#000000",
				size: 18,
				content: "https://cmoreira.net/",
				action: "open_url"
			}
		],
		lines: [
			{
				stroke: "#6699cc",
				strokeDash: 0,
				strokeWidth: 3,
				shortestDistance: true,
				multiGeoLine: [
					[
						{
							latitude: 48.856614,
							longitude: 2.352222
						},
						{
							latitude: 40.712775,
							longitude: -74.005973
						},
						{
							latitude: 49.282729,
							longitude: -123.120738
						}
					]
				]
			},
			{
				stroke: "red",
				strokeDash: 2,
				strokeWidth: 6,
				shortestDistance: false,
				multiGeoLine: [
					[
						{
							latitude: 49.282729,
							longitude: -123.120738
						},
						{
							latitude: 30.267153,
							longitude: -97.743057
						}
					]
				]
			}
		],

		overlay: [
			{
				id: 2,
				title: "us map",
				map: "am4geodata_usaLow",
				activeColor: "#d63031", // need it for legend
				hoverColor: "red",
				//groupHover: true
				//autoLabels: true
				regions: [
					{
						id: "US-CA",
						tooltipContent:
							"United States<br><strong>Hello California!</strong>",
						fill: "#6699cc",
						hover: am4core.color("#660000"),
						content: "https://california.com/",
						action: "open_url"
					},
					{
						id: "US-TX",
						tooltipContent:
							"United States<br><strong>Hello California!</strong>",
						fill: "#6699cc",
						hover: am4core.color("#660000"),
						content: "https://california.com/",
						action: "open_url"
					}
				],
				roundMarkers: [
					{
						latitude: 30.267153,
						longitude: -97.743057,
						tooltipContent: "Austin",
						fill: "#6699cc",
						size: 8,
						content: "https://nyc.net/",
						action: "open_url"
					}
				],
				lines: [],
				labels: [],
				exclude: ["US-FL"]
			},
			{
				id: 3,
				title: "Africa countries",
				map: "am4geodata_worldLow",
				config: {
					activeColor: "green", // need it for legend
					hoverColor: "red"
					//groupHover: true
				},
				regions: [
					{
						id: "AO",
						tooltipContent: "Angola!",
						fill: "#6699cc",
						hover: am4core.color("#660099"),
						content: "https://california.com/",
						action: "open_url"
					},
					{
						id: "CM",
						tooltipContent: "Camarões",
						fill: "#6699cc",
						hover: am4core.color("#660099"),
						content: "https://california.com/",
						action: "open_url"
					}
				],
				roundMarkers: [],
				lines: [],
				labels: [],
				exclude: [],
				include: ["AO", "CM"] // must be build dynamically
			}
		]
	}
];
