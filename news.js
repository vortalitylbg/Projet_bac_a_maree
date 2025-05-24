const newsData = [
    {
        titre: "Installation de bac à marée dans les Pays de la Loire !",
        date: "2025-12-20",
        description: "De nouveaux bacs à marée ont été installées dans les Pays de la Loire, cliquez pour plus de détails."
    },
    {
        titre: "Nouvelle collecte",
        date: "2025-12-09",
        description: "Ce samedi 21 Décembre, à partir de 9h, nous collecterons les déchets dans la forêt de Brissac. Venez nombreux !"
    },
    {
        titre: "C'est un test !",
        date: "2025-11-15",
        description: "C'est un test donc ceci ne sert à rien."
    }
];

// Trier les news par date décroissante
newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

const container = document.getElementById("news-container");

newsData.forEach(news => {
    const div = document.createElement("div");
    div.className = "news-item";
    div.innerHTML = `
        <h3>${news.titre}</h3>
        <div class="date">${new Date(news.date).toLocaleDateString()}</div>
        <p>${news.description}</p>
    `;
    container.appendChild(div);
});
