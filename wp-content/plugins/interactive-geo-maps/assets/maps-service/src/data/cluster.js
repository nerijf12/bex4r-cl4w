/**
 * Main JSON object of data for the map
 */
var iMapsData = [
	{
		id: 10,
		container: "map",
		title: "hello-world",
		map: "am4geodata_worldLow",
		config: {
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
				maxZoomLevel: 20,
				zoomOnClick: true
			},
			highlightGroups: true,
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
				template: "{title}"
			},
			heatmap: {
				minColor: "#111111",
				maxColor: "#888888",
				min: 10,
				max: 20,
				source: "value",
				propTarget: ["fill", "radius"]
			},
			clusterMarkers: {
				zoomLevel: 14,
				maxBias: 0.5
			}
		},
		include: null,
		exclude: ["AQ"],
		regions: [],
		roundMarkers: [
			{
				title: "Vienna",
				value: 58,
				latitude: 48.2092,
				longitude: 16.3728
			},
			{
				title: "Minsk",
				value: 58,
				latitude: 53.9678,
				longitude: 27.5766
			},
			{
				title: "Brussels",
				value: 58,
				latitude: 50.8371,
				longitude: 4.3676
			},
			{
				title: "Sarajevo",
				value: 58,
				latitude: 43.8608,
				longitude: 18.4214
			},
			{
				title: "Sofia",
				value: 58,
				latitude: 42.7105,
				longitude: 23.3238
			},
			{
				title: "Zagreb",
				value: 58,
				latitude: 45.815,
				longitude: 15.9785
			},
			{
				title: "Pristina",
				value: 58,
				latitude: 42.666667,
				longitude: 21.166667
			},
			{
				title: "Prague",
				value: 68,
				latitude: 50.0878,
				longitude: 14.4205
			},
			{
				title: "Copenhagen",
				value: 58,
				latitude: 55.6763,
				longitude: 12.5681
			},
			{
				title: "Tallinn",
				value: 58,
				latitude: 59.4389,
				longitude: 24.7545
			},
			{
				title: "Helsinki",
				value: 58,
				latitude: 60.1699,
				longitude: 24.9384
			},
			{
				title: "Paris",
				value: 58,
				latitude: 48.8567,
				longitude: 2.351
			},
			{
				title: "Berlin",
				value: 58,
				latitude: 52.5235,
				longitude: 13.4115
			},
			{
				title: "Athens",
				value: 58,
				latitude: 37.9792,
				longitude: 23.7166
			},
			{
				title: "Budapest",
				value: 58,
				latitude: 47.4984,
				longitude: 19.0408
			},
			{
				title: "Reykjavik",
				value: 58,
				latitude: 64.1353,
				longitude: -21.8952
			},
			{
				title: "Dublin",
				value: 58,
				latitude: 53.3441,
				longitude: -6.2675
			},
			{
				title: "Rome",
				value: 98,
				latitude: 41.8955,
				longitude: 12.4823
			},
			{
				title: "Riga",
				value: 58,
				latitude: 56.9465,
				longitude: 24.1049
			},
			{
				title: "Vaduz",
				value: 58,
				latitude: 47.1411,
				longitude: 9.5215
			},
			{
				title: "Vilnius",
				value: 58,
				latitude: 54.6896,
				longitude: 25.2799
			},
			{
				title: "Luxembourg",
				value: 58,
				latitude: 49.61,
				longitude: 6.1296
			},
			{
				title: "Skopje",
				value: 58,
				latitude: 42.0024,
				longitude: 21.4361
			},
			{
				title: "Valletta",
				value: 58,
				latitude: 35.9042,
				longitude: 14.5189
			},
			{
				title: "Chisinau",
				value: 58,
				latitude: 47.0167,
				longitude: 28.8497
			},
			{
				title: "Monaco",
				value: 58,
				latitude: 43.7325,
				longitude: 7.4189
			},
			{
				title: "Podgorica",
				value: 58,
				latitude: 42.4602,
				longitude: 19.2595
			},
			{
				title: "Amsterdam",
				value: 58,
				latitude: 52.3738,
				longitude: 4.891
			},
			{
				title: "Oslo",
				value: 58,
				latitude: 59.9138,
				longitude: 10.7387
			},
			{
				title: "Warsaw",
				value: 58,
				latitude: 52.2297,
				longitude: 21.0122
			},
			{
				title: "Lisbon",
				value: 38,
				latitude: 38.7072,
				longitude: -9.1355
			},
			{
				title: "Bucharest",
				value: 58,
				latitude: 44.4479,
				longitude: 26.0979
			},
			{
				title: "Moscow",
				value: 58,
				latitude: 55.7558,
				longitude: 37.6176
			},
			{
				title: "San Marino",
				value: 58,
				latitude: 43.9424,
				longitude: 12.4578
			},
			{
				title: "Belgrade",
				value: 58,
				latitude: 44.8048,
				longitude: 20.4781
			},
			{
				title: "Bratislava",
				value: 58,
				latitude: 48.2116,
				longitude: 17.1547
			},
			{
				title: "Ljubljana",
				value: 58,
				latitude: 46.0514,
				longitude: 14.506
			},
			{
				title: "Madrid",
				value: 28,
				latitude: 40.4167,
				longitude: -3.7033
			},
			{
				title: "Stockholm",
				value: 58,
				latitude: 59.3328,
				longitude: 18.0645
			},
			{
				title: "Bern",
				value: 58,
				latitude: 46.948,
				longitude: 7.4481
			},
			{
				title: "Kiev",
				value: 68,
				latitude: 50.4422,
				longitude: 30.5367
			},
			{
				title: "London",
				value: 88,
				latitude: 51.5002,
				longitude: -0.1262
			},
			{
				title: "Gibraltar",
				value: 58,
				latitude: 36.1377,
				longitude: -5.3453
			},
			{
				title: "Saint Peter Port",
				value: 58,
				latitude: 49.466,
				longitude: -2.5522
			},
			{
				title: "Douglas",
				value: 58,
				latitude: 54.167,
				longitude: -4.4821
			},
			{
				title: "Saint Helier",
				value: 58,
				latitude: 49.1919,
				longitude: -2.1071
			},
			{
				title: "Longyearbyen",
				value: 58,
				latitude: 78.2186,
				longitude: 15.6488
			},
			{
				title: "Kabul",
				value: 58,
				latitude: 34.5155,
				longitude: 69.1952
			},
			{
				title: "Yerevan",
				value: 58,
				latitude: 40.1596,
				longitude: 44.509
			},
			{
				title: "Baku",
				value: 58,
				latitude: 40.3834,
				longitude: 49.8932
			},
			{
				title: "Manama",
				value: 58,
				latitude: 26.1921,
				longitude: 50.5354
			},
			{
				title: "Dhaka",
				value: 58,
				latitude: 23.7106,
				longitude: 90.3978
			},
			{
				title: "Thimphu",
				value: 58,
				latitude: 27.4405,
				longitude: 89.673
			},
			{
				title: "Bandar Seri Begawan",
				value: 58,
				latitude: 4.9431,
				longitude: 114.9425
			},
			{
				title: "Phnom Penh",
				value: 58,
				latitude: 11.5434,
				longitude: 104.8984
			},
			{
				title: "Peking",
				value: 58,
				latitude: 39.9056,
				longitude: 116.3958
			},
			{
				title: "Nicosia",
				value: 58,
				latitude: 35.1676,
				longitude: 33.3736
			},
			{
				title: "T'bilisi",
				value: 58,
				latitude: 41.701,
				longitude: 44.793
			},
			{
				title: "New Delhi",
				value: 58,
				latitude: 28.6353,
				longitude: 77.225
			},
			{
				title: "Jakarta",
				value: 58,
				latitude: -6.1862,
				longitude: 106.8063
			},
			{
				title: "Teheran",
				value: 58,
				latitude: 35.7061,
				longitude: 51.4358
			},
			{
				title: "Baghdad",
				value: 58,
				latitude: 33.3157,
				longitude: 44.3922
			},
			{
				title: "Jerusalem",
				value: 58,
				latitude: 31.76,
				longitude: 35.17
			},
			{
				title: "Tokyo",
				value: 58,
				latitude: 35.6785,
				longitude: 139.6823
			},
			{
				title: "Amman",
				value: 58,
				latitude: 31.9394,
				longitude: 35.9349
			},
			{
				title: "Astana",
				value: 58,
				latitude: 51.1796,
				longitude: 71.4475
			},
			{
				title: "Kuwait",
				value: 58,
				latitude: 29.3721,
				longitude: 47.9824
			},
			{
				title: "Bishkek",
				value: 58,
				latitude: 42.8679,
				longitude: 74.5984
			},
			{
				title: "Vientiane",
				value: 58,
				latitude: 17.9689,
				longitude: 102.6137
			},
			{
				title: "Beyrouth / Beirut",
				value: 58,
				latitude: 33.8872,
				longitude: 35.5134
			},
			{
				title: "Kuala Lumpur",
				value: 58,
				latitude: 3.1502,
				longitude: 101.7077
			},
			{
				title: "Ulan Bator",
				value: 58,
				latitude: 47.9138,
				longitude: 106.922
			},
			{
				title: "Pyinmana",
				value: 58,
				latitude: 19.7378,
				longitude: 96.2083
			},
			{
				title: "Kathmandu",
				value: 58,
				latitude: 27.7058,
				longitude: 85.3157
			},
			{
				title: "Muscat",
				value: 58,
				latitude: 23.6086,
				longitude: 58.5922
			},
			{
				title: "Islamabad",
				value: 58,
				latitude: 33.6751,
				longitude: 73.0946
			},
			{
				title: "Manila",
				value: 58,
				latitude: 14.579,
				longitude: 120.9726
			},
			{
				title: "Doha",
				value: 58,
				latitude: 25.2948,
				longitude: 51.5082
			},
			{
				title: "Riyadh",
				value: 58,
				latitude: 24.6748,
				longitude: 46.6977
			},
			{
				title: "Singapore",
				value: 58,
				latitude: 1.2894,
				longitude: 103.85
			},
			{
				title: "Seoul",
				value: 58,
				latitude: 37.5139,
				longitude: 126.9828
			},
			{
				title: "Colombo",
				value: 58,
				latitude: 6.9155,
				longitude: 79.8572
			},
			{
				title: "Damascus",
				value: 58,
				latitude: 33.5158,
				longitude: 36.2939
			},
			{
				title: "Taipei",
				value: 58,
				latitude: 25.0338,
				longitude: 121.5645
			},
			{
				title: "Dushanbe",
				value: 58,
				latitude: 38.5737,
				longitude: 68.7738
			},
			{
				title: "Bangkok",
				value: 58,
				latitude: 13.7573,
				longitude: 100.502
			},
			{
				title: "Dili",
				value: 58,
				latitude: -8.5662,
				longitude: 125.588
			},
			{
				title: "Ankara",
				value: 58,
				latitude: 39.9439,
				longitude: 32.856
			},
			{
				title: "Ashgabat",
				value: 58,
				latitude: 37.9509,
				longitude: 58.3794
			},
			{
				title: "Abu Dhabi",
				value: 58,
				latitude: 24.4764,
				longitude: 54.3705
			},
			{
				title: "Tashkent",
				value: 58,
				latitude: 41.3193,
				longitude: 69.2481
			},
			{
				title: "Hanoi",
				value: 58,
				latitude: 21.0341,
				longitude: 105.8372
			},
			{
				title: "Sanaa",
				value: 58,
				latitude: 15.3556,
				longitude: 44.2081
			},
			{
				title: "Buenos Aires",
				value: 58,
				latitude: -34.6118,
				longitude: -58.4173
			},
			{
				title: "Bridgetown",
				value: 58,
				latitude: 13.0935,
				longitude: -59.6105
			},
			{
				title: "Belmopan",
				value: 58,
				latitude: 17.2534,
				longitude: -88.7713
			},
			{
				title: "Sucre",
				value: 58,
				latitude: -19.0421,
				longitude: -65.2559
			},
			{
				title: "Brasilia",
				value: 58,
				latitude: -15.7801,
				longitude: -47.9292
			},
			{
				title: "Ottawa",
				value: 58,
				latitude: 45.4235,
				longitude: -75.6979
			},
			{
				title: "Santiago",
				value: 58,
				latitude: -33.4691,
				longitude: -70.642
			},
			{
				title: "Bogota",
				value: 58,
				latitude: 4.6473,
				longitude: -74.0962
			},
			{
				title: "San Jose",
				value: 58,
				latitude: 9.9402,
				longitude: -84.1002
			},
			{
				title: "Havana",
				value: 58,
				latitude: 23.1333,
				longitude: -82.3667
			},
			{
				title: "Roseau",
				value: 58,
				latitude: 15.2976,
				longitude: -61.39
			},
			{
				title: "Santo Domingo",
				value: 58,
				latitude: 18.479,
				longitude: -69.8908
			},
			{
				title: "Quito",
				value: 58,
				latitude: -0.2295,
				longitude: -78.5243
			},
			{
				title: "San Salvador",
				value: 58,
				latitude: 13.7034,
				longitude: -89.2073
			},
			{
				title: "Guatemala",
				value: 58,
				latitude: 14.6248,
				longitude: -90.5328
			},
			{
				title: "Ciudad de Mexico",
				value: 58,
				latitude: 19.4271,
				longitude: -99.1276
			},
			{
				title: "Managua",
				value: 58,
				latitude: 12.1475,
				longitude: -86.2734
			},
			{
				title: "Panama",
				value: 58,
				latitude: 8.9943,
				longitude: -79.5188
			},
			{
				title: "Asuncion",
				value: 58,
				latitude: -25.3005,
				longitude: -57.6362
			},
			{
				title: "Lima",
				value: 58,
				latitude: -12.0931,
				longitude: -77.0465
			},
			{
				title: "Castries",
				value: 58,
				latitude: 13.9972,
				longitude: -60.0018
			},
			{
				title: "Paramaribo",
				value: 58,
				latitude: 5.8232,
				longitude: -55.1679
			},
			{
				title: "Washington D.C.",
				value: 108,
				latitude: 38.8921,
				longitude: -77.0241
			},
			{
				title: "Montevideo",
				value: 58,
				latitude: -34.8941,
				longitude: -56.0675
			},
			{
				title: "Caracas",
				value: 58,
				latitude: 10.4961,
				longitude: -66.8983
			},
			{
				title: "Oranjestad",
				value: 58,
				latitude: 12.5246,
				longitude: -70.0265
			},
			{
				title: "Cayenne",
				value: 58,
				latitude: 4.9346,
				longitude: -52.3303
			},
			{
				title: "Plymouth",
				value: 58,
				latitude: 16.6802,
				longitude: -62.2014
			},
			{
				title: "San Juan",
				value: 58,
				latitude: 18.45,
				longitude: -66.0667
			},
			{
				title: "Algiers",
				value: 58,
				latitude: 36.7755,
				longitude: 3.0597
			},
			{
				title: "Luanda",
				value: 58,
				latitude: -8.8159,
				longitude: 13.2306
			},
			{
				title: "Porto-Novo",
				value: 58,
				latitude: 6.4779,
				longitude: 2.6323
			},
			{
				title: "Gaborone",
				value: 58,
				latitude: -24.657,
				longitude: 25.9089
			},
			{
				title: "Ouagadougou",
				value: 58,
				latitude: 12.3569,
				longitude: -1.5352
			},
			{
				title: "Bujumbura",
				value: 58,
				latitude: -3.3818,
				longitude: 29.3622
			},
			{
				title: "Yaounde",
				value: 58,
				latitude: 3.8612,
				longitude: 11.5217
			},
			{
				title: "Bangui",
				value: 58,
				latitude: 4.3621,
				longitude: 18.5873
			},
			{
				title: "Brazzaville",
				value: 58,
				latitude: -4.2767,
				longitude: 15.2662
			},
			{
				title: "Kinshasa",
				value: 58,
				latitude: -4.3369,
				longitude: 15.3271
			},
			{
				title: "Yamoussoukro",
				value: 58,
				latitude: 6.8067,
				longitude: -5.2728
			},
			{
				title: "Djibouti",
				value: 58,
				latitude: 11.5806,
				longitude: 43.1425
			},
			{
				title: "Cairo",
				value: 58,
				latitude: 30.0571,
				longitude: 31.2272
			},
			{
				title: "Asmara",
				value: 58,
				latitude: 15.3315,
				longitude: 38.9183
			},
			{
				title: "Addis Abeba",
				value: 58,
				latitude: 9.0084,
				longitude: 38.7575
			},
			{
				title: "Libreville",
				value: 58,
				latitude: 0.3858,
				longitude: 9.4496
			},
			{
				title: "Banjul",
				value: 58,
				latitude: 13.4399,
				longitude: -16.6775
			},
			{
				title: "Accra",
				value: 58,
				latitude: 5.5401,
				longitude: -0.2074
			},
			{
				title: "Conakry",
				value: 58,
				latitude: 9.537,
				longitude: -13.6785
			},
			{
				title: "Bissau",
				value: 88,
				latitude: 11.8598,
				longitude: -15.5875
			},
			{
				title: "Nairobi",
				value: 48,
				latitude: -1.2762,
				longitude: 36.7965
			},
			{
				title: "Maseru",
				value: 58,
				latitude: -29.2976,
				longitude: 27.4854
			},
			{
				title: "Monrovia",
				value: 58,
				latitude: 6.3106,
				longitude: -10.8047
			},
			{
				title: "Tripoli",
				value: 58,
				latitude: 32.883,
				longitude: 13.1897
			},
			{
				title: "Antananarivo",
				value: 58,
				latitude: -18.9201,
				longitude: 47.5237
			},
			{
				title: "Lilongwe",
				value: 58,
				latitude: -13.9899,
				longitude: 33.7703
			},
			{
				title: "Bamako",
				value: 58,
				latitude: 12.653,
				longitude: -7.9864
			},
			{
				title: "Nouakchott",
				value: 58,
				latitude: 18.0669,
				longitude: -15.99
			},
			{
				title: "Port Louis",
				value: 58,
				latitude: -20.1654,
				longitude: 57.4896
			},
			{
				title: "Rabat",
				value: 58,
				latitude: 33.9905,
				longitude: -6.8704
			},
			{
				title: "Maputo",
				value: 58,
				latitude: -25.9686,
				longitude: 32.5804
			},
			{
				title: "Windhoek",
				value: 58,
				latitude: -22.5749,
				longitude: 17.0805
			},
			{
				title: "Niamey",
				value: 58,
				latitude: 13.5164,
				longitude: 2.1157
			},
			{
				title: "Abuja",
				value: 58,
				latitude: 9.058,
				longitude: 7.4891
			},
			{
				title: "Kigali",
				value: 58,
				latitude: -1.9441,
				longitude: 30.0619
			},
			{
				title: "Dakar",
				value: 58,
				latitude: 14.6953,
				longitude: -17.4439
			},
			{
				title: "Freetown",
				value: 58,
				latitude: 8.4697,
				longitude: -13.2659
			},
			{
				title: "Mogadishu",
				value: 58,
				latitude: 2.0411,
				longitude: 45.3426
			},
			{
				title: "Pretoria",
				value: 58,
				latitude: -25.7463,
				longitude: 28.1876
			},
			{
				title: "Mbabane",
				value: 58,
				latitude: -26.3186,
				longitude: 31.141
			},
			{
				title: "Dodoma",
				value: 58,
				latitude: -6.167,
				longitude: 35.7497
			},
			{
				title: "Lome",
				value: 58,
				latitude: 6.1228,
				longitude: 1.2255
			},
			{
				title: "Tunis",
				value: 18,
				latitude: 36.8117,
				longitude: 10.1761
			}
		],
		imageMarkers: [],
		iconMarkers: [],
		labels: [],
		lines: [],
		overlay: []
	}
];
