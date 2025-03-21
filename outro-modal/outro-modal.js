document.addEventListener("DOMContentLoaded", () => {
    const closeModalButton = document.getElementById("closeModal");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const modalOverlay = document.getElementById("modalOverlay");

    let timeLeft = 15 * 60;
    let timerInterval = null;
    const installAppButton = document.getElementById("installAppButton");

    installAppButton.addEventListener("click", () => {
        window.parent.postMessage("installAppButton", "*");
    })

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            clearInterval(timerInterval);
        }
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    timerInterval = setInterval(updateTimer, 1000);
                } else {
                    if (timerInterval) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                    }
                }
            });
        },
        {
            threshold: 0.5,
        }
    );

    observer.observe(modalOverlay);
});