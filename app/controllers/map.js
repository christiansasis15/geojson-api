const axios = require("axios");
const qs = require("qs");
const turf = require("@turf/turf");
const { keys } = require("../config");

const CATALOG_URL =
	"https://services.sentinel-hub.com/api/v1/catalog/1.0.0/search";

async function getToken() {
	const data = qs.stringify({
		client_id: keys.CLIENT_ID,
		client_secret: keys.CLIENT_SECRET,
		grant_type: "client_credentials",
	});

	const response = await axios.post(
		"https://services.sentinel-hub.com/oauth/token",
		data,
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}
	);

	return response.data.access_token;
}

async function fetchWithRetry(url, body, token, retries = 3) {
	try {
		const res = await axios.post(url, body, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			timeout: 10000,
		});
		return res.data;
	} catch (err) {
		if (retries > 0 && err.response?.status === 503) {
			console.log("Retrying Sentinel Hub (503)...");
			await new Promise((r) => setTimeout(r, 2000));
			return fetchWithRetry(url, token, retries - 1);
		}
		throw err;
	}
}

async function fetchSentinel(token, query) {
	const url = CATALOG_URL;
	const body = {
		bbox: query.bbox.split(","),
		collections: [query.type],
		limit: 100,
		datetime: query.datetime,
	};
	const data = await fetchWithRetry(url, body, token);
	return data.features || [];
}

exports.getFeatures = async (req, res) => {
	try {
		const token = await getToken();
		const scenes = await fetchSentinel(token, req.query);

		res.json(scenes);
	} catch (err) {
		res.status(500).json({
			message: "Failed to fetch features",
			error: err.response?.data || err.message,
		});
	}
};

// single data
async function fetchMetric(token, id, type) {
	const url = CATALOG_URL;
	const body = {
		collections: [type],
		ids: [id],
	};
	const data = await fetchWithRetry(url, body, token);
	const feature = data.features[0];
	const area = turf.area(data.features[0]?.geometry);

	return {
		id: feature?.id,
		bbox: feature?.bbox,
		area_m2: area,
		instrument: feature?.properties.instruments,
		platform: feature?.properties.platform,
		datetime: feature?.properties.datetime,
	};
}

exports.getMetrics = async (req, res) => {
	try {
		const token = await getToken();
		const metrics = await fetchMetric(token, req.params.id, req.query.type);

		res.json(metrics);
	} catch (err) {
		res.status(500).json({
			message: "Failed to fetch feature.",
			error: err.response?.data || err.message,
		});
	}
};
