import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const usersBody = document.getElementById("usersBody");
const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

// conteneur pagination (ajoute dans ton HTML un <div id="usersPagination"></div> après le tableau)
const paginationDiv = document.getElementById("usersPagination");

let userToDelete = null;

// --- Gestion utilisateurs avec pagination ---
let allUsers = [];
let usersPerPage = 4;
let currentIndex = 0;

async function loadUsers() {
  usersBody.innerHTML = "";
  allUsers = [];

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((docSnap) => {
    allUsers.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  // reset index
  currentIndex = 0;
  renderUsers();
}

function renderUsers() {
  // récupérer une tranche de 5
  const slice = allUsers.slice(currentIndex, currentIndex + usersPerPage);

  slice.forEach((data) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.nom || ""}</td>
      <td>${data.prenom || ""}</td>
      <td>${data.email || ""}</td>
      <td>${data.adresse || ""}</td>
      <td style="display: flex; gap: 10px;">
        <button class="btn danger" data-uid="${data.id}">Supprimer</button>
      </td>
    `;
    usersBody.appendChild(row);
  });

  currentIndex += slice.length;

  // gérer le bouton "Voir plus"
  paginationDiv.innerHTML = "";
  if (currentIndex < allUsers.length) {
    const btn = document.createElement("button");
    btn.className = "btn glass-btn";
    btn.textContent = "Voir plus d'utilisateurs";
    btn.addEventListener("click", renderUsers);
    paginationDiv.appendChild(btn);
  }

  // Attacher les events supprimer
  document.querySelectorAll("button[data-uid]").forEach((btn) => {
    btn.addEventListener("click", () => {
      userToDelete = btn.getAttribute("data-uid");
      deleteModal.classList.remove("hidden");
    });
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Vérification stricte de l'admin
  if (user.email !== "admin@bacamaree.fr") {
    alert("Accès refusé !");
    await signOut(auth);
    window.location.href = "index.html";
    return;
  }

  // Charger les utilisateurs
  await loadUsers();
});

cancelDeleteBtn.addEventListener("click", () => {
  userToDelete = null;
  deleteModal.classList.add("hidden");
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (userToDelete) {
    try {
      await deleteDoc(doc(db, "users", userToDelete));
      alert("Utilisateur supprimé !");
      location.reload();
    } catch (error) {
      alert("Erreur lors de la suppression : " + error.message);
    }
  }
  deleteModal.classList.add("hidden");
});

// --- Gestion ajout de news ---
const newsForm = document.getElementById("newsForm");
if (newsForm) {
  newsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("newsTitle").value.trim();
    const content = document.getElementById("newsContent").value.trim();

    if (!title || !content) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await addDoc(collection(db, "news"), {
        title,
        content,
        createdAt: serverTimestamp()
      });
      alert("News publiée avec succès !");
      newsForm.reset();
    } catch (error) {
      alert("Erreur lors de la publication : " + error.message);
    }
  });
}

// --- Charger et afficher les news ---
const newsBody = document.getElementById("newsBody");

async function loadNews() {
  newsBody.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "news"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.title || ""}</td>
      <td>${data.content || ""}</td>
      <td><button class="btn danger" data-newsid="${docSnap.id}">Supprimer</button></td>
    `;

    newsBody.appendChild(row);
  });

  document.querySelectorAll("button[data-newsid]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Voulez-vous vraiment supprimer cette news ?")) {
        try {
          await deleteDoc(doc(db, "news", btn.getAttribute("data-newsid")));
          alert("News supprimée !");
          loadNews();
        } catch (error) {
          alert("Erreur suppression news : " + error.message);
        }
      }
    });
  });
}

// --- Gestion ajout de bacs ---
const bacForm = document.getElementById("bacForm");

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

if (bacForm) {
  bacForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("bacName").value.trim();
    const adresse = document.getElementById("bacAdresse").value.trim();

    if (!name || !adresse) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const coords = await getCoords(adresse);
    if (!coords) {
      alert("Impossible de géocoder l’adresse.");
      return;
    }

    try {
      await addDoc(collection(db, "bacs"), {
        name,
        adresse,
        coords,
        createdAt: serverTimestamp()
      });
      alert("Point ajouté avec succès !");
      bacForm.reset();
    } catch (error) {
      alert("Erreur lors de l’ajout du bac : " + error.message);
    }
  });
}


loadNews();
