const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const closeModal = document.querySelector(".close");

document.querySelectorAll(".product-item").forEach(item => {
    item.addEventListener("click", () => {
        modalTitle.textContent = item.querySelector("h2").textContent;
        modalDesc.textContent = item.querySelector("p").textContent;
        modalPrice.textContent = item.querySelector(".price").textContent;
        modal.classList.remove("hidden");
    });
});

closeModal.onclick = () => {
    modal.classList.add("hidden");
};

window.onclick = (e) => {
    if (e.target == modal) {
        modal.classList.add("hidden");
    }
};