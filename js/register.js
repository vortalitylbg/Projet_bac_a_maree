// js/register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } 
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
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const prenom = form["prenom"].value;
  const nom = form["nom"].value;
  const email = form["email"].value;
  const password = form["password"].value;
  const adresse = form["adresse"].value;
  const hasBac = form["hasBac"].checked; // ✅ nouveau

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      prenom,
      nom,
      email,
      adresse,
      hasBac,         // ✅ enregistré dans Firestore
      createdAt: new Date()
    });

    alert("Inscription réussie !");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erreur Firestore:", error);
    alert("Erreur : " + error.message);
  }
});


// Gestion de l'affichage du mot de passe
document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = btn.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "🙈"; // change l'icône
    } else {
      input.type = "password";
      btn.textContent = "👁️";
    }
  });
});
