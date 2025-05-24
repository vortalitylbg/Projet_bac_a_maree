const bacs = [
    { nom: "Bac plage Anjou", lat: 47.50, lng: -0.51 },
    { nom: "Bac centre-ville", lat: 47.49, lng: -0.52 },
    { nom: "Bac parc Sud", lat: 47.48, lng: -0.50 }
];

const map = L.map('map').setView([47.498, -0.502], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

function displayBacs(filteredBacs) {
    const list = document.getElementById("bac-list");
    list.innerHTML = "";
    filteredBacs.forEach(bac => {
        const li = document.createElement("li");
        li.textContent = bac.nom;
        li.onclick = () => {
            map.setView([bac.lat, bac.lng], 16);
            L.marker([bac.lat, bac.lng]).addTo(map).bindPopup(bac.nom).openPopup();
        };
        list.appendChild(li);
    });
}

document.getElementById("search").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = bacs.filter(bac => bac.nom.toLowerCase().includes(term));
    displayBacs(filtered);
});

displayBacs(bacs);
