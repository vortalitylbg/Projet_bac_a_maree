// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";


// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBilfD057AzebJJhFisH13Z-XTguy80BIU",
    authDomain: "bac-a-maree.firebaseapp.com",
    projectId: "bac-a-maree",
    storageBucket: "bac-a-maree.appspot.com",
    messagingSenderId: "296995054994",
    appId: "1:296995054994:web:737f844aaeac20b48dcd4b",
    measurementId: "G-QYPWM80R9K"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Écouteur sur le formulaire
const form = document.getElementById("register-form");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = "welcome.html";
        })
        .catch((error) => {
            alert("Erreur : " + error.message);
        });
});
