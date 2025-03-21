document.addEventListener("DOMContentLoaded", () => {

    const introIframe = document.getElementById("modalIframe");
    if (introIframe) {
        introIframe.style.display = "block";
    }

    const outroIframe = document.getElementById("outro-modalIframe");
    if (outroIframe) {
        outroIframe.style.display = "none";
        document.querySelector(".outro-modal").style.pointerEvents = "none"; 
    }

    window.addEventListener("message", (event) => {
        if (event.data === "closeModal" && introIframe) {
            introIframe.style.display = "none";
            document.querySelector(".intro-modal").style.pointerEvents = "none"; 
        }
        if (event.data === "installAppButton" && introIframe) {
            window.open("https://www.google.com","_self")
        }
    });

    let spinsLeft = 3;
    const freeSpinsLabel = document.getElementById("freeSpins");
    const spinButton = document.getElementById("spin");
    const images1 = [
        "../images/item-2.png", "../images/item-16.png", "../images/item-12.png", "../images/item-14.png",
        "../images/item-6.png", "../images/item-15.png", "../images/item-1.png", "../images/item-9.png", 
        "../images/item-3.png", "../images/item-10.png", "../images/item-4.png", "../images/item-5.png", 
        "../images/item-7.png", "../images/item-11.png", "../images/item-13.png", "../images/item-8.png",
    ];
    const images2 = [
        "../images/item-1.png", "../images/item-13.png", "../images/item-16.png", "../images/item-8.png",
        "../images/item-15.png", "../images/item-3.png", "../images/item-5.png", "../images/item-7.png", 
        "../images/item-6.png", "../images/item-5.png", "../images/item-2.png", "../images/item-5.png", 
        "../images/item-13.png", "../images/item-9.png", "../images/item-14.png", "../images/item-10.png",
    ];
    const images3 = [
        "../images/item-3.png", "../images/item-9.png", "../images/item-13.png", "../images/item-7.png",
        "../images/item-15.png", "../images/item-10.png", "../images/item-6.png", "../images/item-12.png", 
        "../images/item-8.png", "../images/item-14.png", "../images/item-9.png", "../images/item-1.png", 
        "../images/item-11.png", "../images/item-16.png", "../images/item-2.png", "../images/item-13.png",
    ];

    const reel1 = new InfiniteReel(document.getElementById("inner-reel1"), images1, 0);
    const reel2 = new InfiniteReel(document.getElementById("inner-reel2"), images2, 3);
    const reel3 = new InfiniteReel(document.getElementById("inner-reel3"), images3, 0);

    spinButton.addEventListener("click", () => {
        const items = [];
        switch (spinsLeft) {
            case 3:
                items.push(13, 11, 3);
                break;
            case 2:
                items.push(10, 8, 8);
                break;
            case 1:
                items.push(3, 7, 5);
                break;
        }

        spinsLeft--;
        spinButton.classList.add("disabled");
        freeSpinsLabel.textContent = `FREE SPINS: ${spinsLeft}`;

        let completedAnimations = 0;

        const checkCompletion = () => {
            completedAnimations++;
            if (completedAnimations === 3) {
                spinButton.classList.remove("disabled"); 
                if (spinsLeft === 0) {
                    animateTargetItems(items);
                    spinButton.classList.add("disabled");
                    setTimeout(() => {
                        outroIframe.style.display = "block";
                        document.querySelector(".outro-modal").style.pointerEvents = "auto"; 
                    }, 2000)
                }

            }
        };

        reel1.spinTo(items[0], checkCompletion);
        setTimeout(() => reel2.spinTo(items[1], checkCompletion), 200);
        setTimeout(() => reel3.spinTo(items[2], checkCompletion), 400);
    });

    const animateTargetItems = (items) => {
        const reels = [reel1, reel2, reel3];
        reels.forEach((reel, index) => {
            const targetIndex = items[index];
            const targetImage = reel.imageElements[targetIndex + 1];

            targetImage.classList.add("smooth-pulsing-item");

            setTimeout(() => {
                targetImage.style.transform = "scale(1)";
                targetImage.style.filter = "none";
            }, 1000);
        });
    };
});

class InfiniteReel {
    constructor(reelElement, images, initialIndex = 0) {
        this.reel = reelElement;
        this.images = images;
        this.imageCount = images.length;
        this.visibleCount = 3; 
        this.imageHeight = 100 / this.visibleCount;
        this.currentIndex = initialIndex;
        this.isAnimating = false;
        this.imageElements = [];
        
        this.setupReel();
        this.setPosition(this.currentIndex, false);
    }

    setupReel() {
        this.reel.innerHTML = '';
        for (let i = 0; i < this.imageCount * 4; i++) {
            const img = document.createElement('img');
            img.src = this.images[i % this.imageCount];
            img.style.height = `${this.imageHeight}%`;
            this.reel.appendChild(img);
            this.imageElements.push(img);
        }
    }

    setPosition(index, animate = true, callback) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        const targetOffset = -(index * this.imageHeight);
        
        if (animate) {
            this.reel.style.transition = 'transform 0.5s ease-in-out';
        } else {
            this.reel.style.transition = 'none';
        }
        
        this.reel.style.transform = `translateY(${targetOffset}%)`;
        
        setTimeout(() => {
            if (index >= this.imageCount) {
                this.reel.style.transition = 'none';
                this.currentIndex = index % this.imageCount;
                this.reel.style.transform = `translateY(-${this.currentIndex * this.imageHeight}%)`;
            }
            this.isAnimating = false;
            if (callback) callback();
        }, animate ? 500 : 0);
    }

    spinTo(targetIndex, callback) {
        if (this.isAnimating) return;

        let steps = targetIndex - this.currentIndex;
        if (steps < 0) {
            steps += this.imageCount;
        }

        const totalDistance = steps + this.imageCount;

        this.setPosition(this.currentIndex + totalDistance, true, callback);
    }
}