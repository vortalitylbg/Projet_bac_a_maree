// ---------- Firebase ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMgaQ0EMWnVnZU_JJNURTUjSgdVf3z10g",
  authDomain: "bacamaree-4ff35.firebaseapp.com",
  projectId: "bacamaree-4ff35",
  storageBucket: "bacamaree-4ff35.firebasestorage.app",
  messagingSenderId: "220585728334",
  appId: "1:220585728334:web:e84644fb36a53ecde4e61f",
  measurementId: "G-GEZ00GYFEM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------- Carte Leaflet ----------
const map = L.map("map").setView([47.4784, -0.5632], 12); // Centre Angers

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

// ---------- Bacs fixes ----------
const bacsFixes = {
  angersCentre: { coords: [47.4784, -0.5632], name: "Angers - Centre" },
  angersSud:    { coords: [47.4500, -0.5500], name: "Angers - Sud" },
  lacMaine:     { coords: [47.4635, -0.5965], name: "Lac de Maine" },
  parcBalzac:   { coords: [47.4605, -0.5378], name: "Parc Balzac" },
};

Object.keys(bacsFixes).forEach(key => {
  const marker = L.marker(bacsFixes[key].coords).addTo(map);
  marker.bindPopup(`<b>${bacsFixes[key].name}</b>`);
  bacsFixes[key].marker = marker;
});

// Permettre à d’autres scripts (ex: page points) de centrer sur un bac
window.focusOn = function(id) {
  const bac = bacsFixes[id];
  if (bac) {
    map.setView(bac.coords, 15);
    bac.marker.openPopup();
  }
};

// ---------- Fonction géocodage ----------
async function getCoords(adresse) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (err) {
    console.error("Erreur géocodage:", err);
  }
  return null;
}

// ---------- Bacs ajoutés par les utilisateurs ----------
async function loadUserBacs() {
  const querySnapshot = await getDocs(collection(db, "users"));
  for (const docSnap of querySnapshot.docs) {
    const user = docSnap.data();
    if (user.hasBac && user.adresse) {
      const coords = await getCoords(user.adresse);
      if (coords) {
        const marker = L.marker(coords).addTo(map);
        marker.bindPopup(`<b>${user.prenom} ${user.nom}</b><br>${user.adresse}`);
      }
    }
  }
}

// ---------- Bacs ajoutés par les admins ----------
async function loadAdminBacs() {
  const querySnapshot = await getDocs(collection(db, "bacs"));
  querySnapshot.forEach((docSnap) => {
    const bac = docSnap.data();
    if (bac.coords) {
      const marker = L.marker(bac.coords).addTo(map);
      marker.bindPopup(`<b>${bac.name}</b><br>${bac.adresse}`);
    }
  });
}

// ---------- Charger toutes les sources ----------
async function initBacs() {
  await loadUserBacs();
  await loadAdminBacs();
}

initBacs();
