// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 👉 Mets la même config que dans register.js
const firebaseConfig = {
  apiKey: "AIzaSyDMgaQ0EMWnVnZU_JJNURTUjSgdVf3z10g",
  authDomain: "bacamaree-4ff35.firebaseapp.com",
  projectId: "bacamaree-4ff35",
  storageBucket: "bacamaree-4ff35.firebasestorage.app",
  messagingSenderId: "220585728334",
  appId: "1:220585728334:web:e84644fb36a53ecde4e61f",
  measurementId: "G-GEZ00GYFEM"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gestion du formulaire
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form["email"].value;
  const password = form["password"].value;

  try {
    // Connexion de l'utilisateur
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html"; // redirige vers accueil
  } catch (error) {
    console.error("Erreur login:", error);
    alert("Erreur : " + error.message);
  }
});

// Gérer la navbar (afficher prénom/nom si connecté)
const navActions = document.querySelector(".nav-actions");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      navActions.innerHTML = `<span class="user-name">${data.prenom} ${data.nom}</span>`;
    }
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔒 Redirection spéciale si admin
    if (user.email === "admin@bacamaree.fr") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  } catch (error) {
    alert("Erreur de connexion : " + error.message);
  }
});