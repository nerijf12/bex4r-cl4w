/* ROUTER */

var iMapsRouter = {};

iMapsRouter.getGeoFiles = function (regionClicked) {
	var regionID = regionClicked.id.toString(),
		regionName = regionClicked.name,
		urlappend,
		varappend,
		geoFiles = {},
		continents = [
			"southAmerica",
			"northAmerica",
			"europe",
			"asia",
			"oceania",
			"africa",
			"antarctica"
		];

	// continents
	if (continents.includes(regionID)) {
		urlappend = "region/world/";
		varappend = "_region_world_";
	}

	// us maps
	else if (regionID.includes("US-")) {
		urlappend = "region/usa/";
		varappend = "_region_usa_";
		regionID = regionID.substr(-2).toLowerCase();
	} else {
		urlappend = "";
		varappend = "_";
		regionID = regionName.toLowerCase().replace("united states", "usa");
	}

	geoFiles.src =
		"https://www.amcharts.com/lib/4/geodata/" + urlappend + regionID + "Low.js";
	geoFiles.map = "am4geodata" + varappend + regionID + "Low";
	geoFiles.title = regionName;

	return geoFiles;
};

iMapsRouter.getAllSrc = function () {
	var sources = {},
		paths = {
			main: "../../vendor/geodata",
			usa: "../../vendor/geodata/region/usa",
			world: "../../vendor/geodata/region/world"
		};

	var fs = require("fs");

	Object.keys(paths).forEach(function (item) {
		sources[item] = [];

		fs.readdir(paths[item], function (err, files) {
			files.forEach(function (file) {
				sources[item].push(file);
			});
		});
	});

	return sources;
};

/**
 * get map am4charts variable name based on name value
 */
iMapsRouter.getVarByName = function (variable) {
	if (typeof variable === "undefined") {
		return "am4geodata_worldLow";
	} else if (variable.includes("custom")) {
		return variable;
	}

	variable = variable.replace(/\//g, "_");
	return "am4geodata_" + variable;
};

iMapsRouter.getCleanMapName = function (mapName) {
	if (typeof mapName === "undefined") {
		return false;
	}

	mapName = mapName.replace("Low", "");
	mapName = mapName.replace("High", "");

	return mapName;
};

iMapsRouter.iso2cleanName = function (iso, mapID) {
	var countries = iMapsRouter.getCountries();
	var continents = ['africa', 'antarctiva', 'asia', 'europe', 'northAmerica', 'oceania', 'southAmerica'];
	var tempIso;
	var series = iMapsManager.maps[mapID].seriesIndex;
	var match = false;

	// exceptions
	if ("VA" === iso) {
		return 'vatican'
	}
	else if ("US" === iso) {
		return "usa";
	}
	else if (iso.includes("US-")) {
		return "region/usa/" + iso.replace("US-", "").toLowerCase();
	}
	else if (continents.includes(iso)) {
		return "region/world/" + iso;
	}
	else if ("GB" === iso) {
		tempIso = [
			'uk', 'ukCountries', 'ukCounties'
		];
	}
	else if ("BA" === iso) {
		tempIso = [
			'bosniaHerzegovinaCantons', 'bosniaHerzegovina'
		];
	}
	else if ("IL" === iso) {
		tempIso = [
			'israel', 'israelPalestine'
		];
	}
	else if ("SI" === iso) {
		tempIso = [
			'sloveniaRegions', 'slovenia'
		];
	}

	else if ("IN" === iso) {
		tempIso = [
			'india2019', 'india'
		];
	}

	else if ("FR" === iso) {
		tempIso = [
			'franceDepartments', 'france'
		];
	}

	else if ("PT" === iso) {
		tempIso = [
			'portugal', 'portugalRegions'
		];
	}

	// the rest
	if (Array.isArray(tempIso)) {
		tempIso.forEach(function (item, index) {
			if (series.hasOwnProperty(item)) {
				match = item;
			}
		});
		if (match) {
			return match;
		}
	} else {
		if (countries.hasOwnProperty(iso)) {
			return iMapsRouter.camelize(countries[iso]);
		}
	}

	return false;
};

iMapsRouter.getCountries = function () {
	var rawjson =
		'{"AF":"Afghanistan","AX":"\u00c5land Islands","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua & Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AC":"Ascension Island","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia & Herzegovina","BW":"Botswana","BR":"Brazil","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","IC":"Canary Islands","CV":"Cape Verde","BQ":"Caribbean Netherlands","KY":"Cayman Islands","CF":"Central African Republic","EA":"Ceuta & Melilla","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo - Brazzaville","CD":"Congo - Kinshasa","CK":"Cook Islands","CR":"Costa Rica","CI":"C\u00f4te d\u2019Ivoire","HR":"Croatia","CU":"Cuba","CW":"Cura\u00e7ao","CY":"Cyprus","CZ":"Czechia","DK":"Denmark","DG":"Diego Garcia","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","SZ":"Eswatini","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HN":"Honduras","HK":"Hong Kong SAR China","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","XK":"Kosovo","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macao SAR China","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","KP":"North Korea","MK":"North Macedonia","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestinian Territories","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","XA":"Pseudo-Accents","XB":"Pseudo-Bidi","PR":"Puerto Rico","QA":"Qatar","RE":"R\u00e9union","RO":"Romania","RU":"Russia","RW":"Rwanda","WS":"Samoa","SM":"San Marino","ST":"S\u00e3o Tom\u00e9 & Pr\u00edncipe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia & South Sandwich Islands","KR":"South Korea","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","BL":"St Barth\u00e9lemy","SH":"St Helena","KN":"St Kitts & Nevis","LC":"St Lucia","MF":"St Martin","PM":"St Pierre & Miquelon","VC":"St Vincent & Grenadines","SD":"Sudan","SR":"Suriname","SJ":"Svalbard & Jan Mayen","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad & Tobago","TA":"Tristan da Cunha","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks & Caicos Islands","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UM":"US Outlying Islands","VI":"US Virgin Islands","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","WF":"Wallis & Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"}';

	return JSON.parse(rawjson);
};

iMapsRouter.camelize = function (str) {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index == 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, "");
};
