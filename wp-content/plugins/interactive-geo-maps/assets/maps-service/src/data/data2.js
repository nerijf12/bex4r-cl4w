/**
 * Main JSON object of data for the map
 */
var iMapsData = [
  {
    id: 1,
    container: "map",
    title: "hello-world",
    map: "am4geodata_usaTerritoriesLow",
    include: null,
    config: {
      projection: "AlbersUsa",
      zoom: true,
      smallMap: true,
      zoomLevel: 1,
      zoomOnClick: false,
      background: "#ffffff",
      backgroundOpacity: 0,
      tooltip: {
        fixed: false,
        background: "#ffffff",
        color: "#000000",
        interactionsEnabled: true,
        cornerRadius: 20
      }
    },
    exclude: ["AQ"],
    zoom: true,
    smallMap: false,
    zoomLevel: 1,
    zoomOnClick: true,
    homeGeoPoint: {
      latitude: 52,
      longitude: 11
    },
    background: "#ffffff",
    backgroundOpacity: 0,
    inactiveColor: "#cccccc",
    regions: [
      {
        id: "US-CA",
        tooltip: "United States<br><strong>Hello!</strong>",
        fill: "#6699cc",
        hover: "#660000",
        content: "https://cmoreira.net/",
        action: "open_url"
      },
      {
        id: "US-FL",
        tooltip: "France",
        fill: "red",
        hover: "#f5f5f5",
        content: "https://google.com/",
        action: "open_url"
      }
    ],
    markers: [
      {
        latitude: 64.200844,
        longitude: -149.493668,
        tooltip: "Alaska",
        color: "#6699cc",
        size: 8,
        content: "https://cmoreira.net/",
        action: "open_url"
      },
      {
        latitude: 19.896767,
        longitude: -155.582779,
        tooltip: "New York",
        color: "#660099",
        size: 4,
        content: "https://cmoreira.net/",
        action: "open_url"
      }
    ]
  }
];
