/**
 * Geocluster function. Original:
 * https://github.com/yetzt/node-geocluster
 * and adapted to work with iMaps
 */

function geocluster(elements, bias, defaults) {
	bias = parseFloat(bias);
	if (!(this instanceof geocluster))
		return new geocluster(elements, bias, defaults);
	return this._cluster(elements, bias, defaults);
}

// degrees to radians
geocluster.prototype._toRad = function (number) {
	return (number * Math.PI) / 180;
};

// geodetic distance approximation
geocluster.prototype._dist = function (lat1, lon1, lat2, lon2) {
	var dlat = this._toRad(lat2 - lat1);
	var dlon = this._toRad(lon2 - lon1);
	var a =
		Math.sin(dlat / 2) * Math.sin(dlat / 2) +
		Math.sin(dlon / 2) *
		Math.sin(dlon / 2) *
		Math.cos(this._toRad(lat1)) *
		Math.cos(this._toRad(lat2));
	return (
		Math.round(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371 * 100) /
		100
	);
};

geocluster.prototype._centroid = function (set) {
	var cetroidObj = Object.values(set).reduce(
		function (accumulator, currentValue) {
			return {
				latitude: accumulator.latitude + currentValue.latitude,
				longitude: accumulator.longitude + currentValue.longitude
			};
		},
		{
			latitude: 0,
			longitude: 0
		}
	);

	cetroidObj = Object.values(cetroidObj).map(function (e) {
		return e / Object.keys(set).length;
	});

	return cetroidObj;
};

geocluster.prototype._clean = function (data) {
	return data.map(function (cluster) {
		return [cluster.centroid, cluster.elements];
	});
};

geocluster.prototype._cluster = function (elements, bias, defaults) {
	var self = this,
		cluster_map_collection = [];

	// set bias to 1 on default
	if (typeof bias !== "number" || isNaN(bias)) bias = 1;

	var tot_diff = 0;
	var diffs = [];
	var diff;

	// calculate sum of differences
	for (var i = 1; i < elements.length; i++) {
		diff = self._dist(
			elements[i].latitude,
			elements[i].longitude,
			elements[i - 1].latitude,
			elements[i - 1].longitude
		);
		tot_diff += diff;
		diffs.push(diff);
	}

	// calculate mean diff
	var mean_diff = tot_diff / diffs.length;
	var diff_variance = 0;

	// calculate variance total
	diffs.forEach(function (diff) {
		diff_variance += Math.pow(diff - mean_diff, 2);
	});

	// derive threshold from stdev and bias - modified to allow bias to be more decisive
	var diff_stdev = Math.sqrt(diff_variance / diffs.length);
	var threshold = 10000 * bias;

	var cluster_map = [];

	// generate random initial cluster map
	cluster_map.push({
		centroid: elements[Math.floor(Math.random() * elements.length)],
		elements: [],
		fill: defaults.fill,
		hover: defaults.hover,
		radius: defaults.radius
	});

	// loop elements and distribute them to clusters
	var changing = true;
	while (changing === true) {
		var new_cluster = false;
		var cluster_changed = false;

		// iterate over elements
		elements.forEach(function (e, ei) {
			var closest_dist = Infinity;
			var closest_cluster = null;

			// find closest cluster
			cluster_map.forEach(function (cluster, ci) {
				// distance to cluster
				var dist = self._dist(
					e.latitude,
					e.longitude,
					cluster_map[ci].centroid.latitude,
					cluster_map[ci].centroid.longitude
				);

				if (dist < closest_dist) {
					closest_dist = dist;
					closest_cluster = ci;
				}
			});

			// is the closest distance smaller than the stddev of elements?
			if (closest_dist < threshold || closest_dist === 0) {
				// put element into existing cluster
				cluster_map[closest_cluster].elements.push(e);
			} else {
				// create a new cluster with this element
				cluster_map.push({
					centroid: e,
					elements: [e]
				});

				new_cluster = true;
			}
		});

		// delete empty clusters from cluster_map
		cluster_map = cluster_map.filter(function (cluster) {
			return cluster.elements.length > 0;
		});

		// calculate the clusters centroids and check for change
		cluster_map.forEach(function (cluster, ci) {
			var centroid = self._centroid(cluster.elements);
			changing = false;
			if (
				centroid.latitude !== cluster.centroid.latitude ||
				centroid.longitude !== cluster.centroid.longitude
			) {
				cluster_map[ci].centroid = centroid;
				cluster_changed = true;
			}
		});

		// loop cycle if clusters have changed
		if (!cluster_changed && !new_cluster) {
			changing = false;
		} else {
			// remove all elements from clusters and run again
			if (changing)
				cluster_map = cluster_map.map(function (cluster) {
					cluster.elements = [];
					return cluster;
				});
		}
	}

	cluster_map = cluster_map.map(function (cluster) {

		if (cluster.elements.length === 1) {
			cluster_map_collection.push(cluster.elements[0]);
		} else {

			cluster_map_collection.push({
				id: "",
				label: cluster.elements.length,
				name: "",
				value: cluster.elements.length,
				cluster: true,
				latitude: cluster.centroid[0],
				longitude: cluster.centroid[1],
				elements: cluster.elements,
				content: "",
				fill: defaults.fill,
				hover: defaults.hover,
				radius: defaults.radius,
				action: "",
			});
		}
	});

	// compress result
	return cluster_map_collection;
};
