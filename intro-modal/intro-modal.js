document.addEventListener("DOMContentLoaded", () => {
    const closeModalButton = document.getElementById("closeModal");

    closeModalButton.addEventListener("click", () => {
        window.parent.postMessage("closeModal", "*");
    });
});