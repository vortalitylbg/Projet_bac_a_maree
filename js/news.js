import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const newsWrapper = document.getElementById("newsWrapper");

async function loadNews() {
  const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  newsWrapper.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const date = data.createdAt?.toDate().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }) || "Date inconnue";

    const article = document.createElement("article");
    article.classList.add("news-card", "glass");
    article.innerHTML = `
      <div class="news-header">
        <span class="news-date">${date}</span>
      </div>
      <h2>${data.title}</h2>
      <p>${data.content}</p>
    `;
    newsWrapper.appendChild(article);
  });
}

loadNews();
