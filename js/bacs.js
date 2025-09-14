// Init map
const map = L.map('map').setView([47.4784, -0.5632], 12); // Centre Angers

// Fond de carte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Points de collecte
const bacs = {
    angersCentre: { coords: [47.4784, -0.5632], name: "Angers - Centre" },
    angersSud:    { coords: [47.4500, -0.5500], name: "Angers - Sud" },
    lacMaine:     { coords: [47.4635, -0.5965], name: "Lac de Maine" },
    parcBalzac:   { coords: [47.4605, -0.5378], name: "Parc Balzac" },
};

// Ajout des marqueurs
Object.keys(bacs).forEach(key => {
    const marker = L.marker(bacs[key].coords).addTo(map);
    marker.bindPopup(`<b>${bacs[key].name}</b>`);
    bacs[key].marker = marker;
});

// Fonction focus
function focusOn(id) {
    const bac = bacs[id];
    if(bac) {
        map.setView(bac.coords, 15);
        bac.marker.openPopup();
    }
}