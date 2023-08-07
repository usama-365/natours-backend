export const displayMap = function () {
	const mapElement = document.getElementById("map");

	const locations = JSON.parse(mapElement.dataset.locations);
	const locationsCoordinates = locations.map(location => location.coordinates.reverse());

	let map = L.map("map", { zoomControl: false });

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "© OpenStreetMap",
	}).addTo(map);

	locationsCoordinates.forEach((locationCoordinates, i) => {
		const marker = L.marker(locationCoordinates).addTo(map);
		marker.bindPopup(`Day ${locations[i].day} - ${locations[i].description}`)
			.openPopup();
	});

	const bounds = L.latLngBounds(locationsCoordinates);
	map.fitBounds(bounds);
};
