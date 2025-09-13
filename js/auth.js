// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚙️ Config Firebase (même que login/register)
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

const navActions = document.querySelector(".nav-actions");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // ✅ Cas spécial admin
    if (user.email === "admin@bacamaree.fr") {
      navActions.innerHTML = `
        <span class="admin-badge">Admin</span>
        <button id="logoutBtn" class="btn glass-btn secondary">Déconnexion</button>
      `;
    } else {
      // ✅ Cas utilisateur normal
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        navActions.innerHTML = `
          <span class="user-name">${data.prenom} ${data.nom}</span>
          <button id="logoutBtn" class="btn glass-btn secondary">Déconnexion</button>
        `;
      }
    }

    // Gestion déconnexion
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html"; 
      });
    }
  } else {
    // ✅ Cas non connecté
    navActions.innerHTML = `
      <a href="register.html" class="btn glass-btn">S'inscrire</a>
      <a href="login.html" class="btn glass-btn secondary">Se connecter</a>
    `;
  }
});
