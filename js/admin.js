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

let userToDelete = null;

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

  // Charger les utilisateurs Firestore
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.nom || ""}</td>
      <td>${data.prenom || ""}</td>
      <td>${data.email || ""}</td>
      <td>${data.adresse || ""}</td>
      <td>
        <button class="btn danger" data-uid="${docSnap.id}">Supprimer</button>
      </td>
    `;

    usersBody.appendChild(row);
  });

  // Ajouter événements sur les boutons supprimer
  document.querySelectorAll("button[data-uid]").forEach((btn) => {
    btn.addEventListener("click", () => {
      userToDelete = btn.getAttribute("data-uid");
      deleteModal.classList.remove("hidden");
    });
  });
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
