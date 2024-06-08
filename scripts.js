document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");
    const progressBar = document.querySelector("#progress-bar span");

    const options = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");

                navLinks.forEach(link => {
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            } else {
                entry.target.classList.remove("active");
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressWidth = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progressWidth + "%";
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            document.querySelector("header").classList.add("scrolled");
        } else {
            document.querySelector("header").classList.remove("scrolled");
        }
    });

    document.querySelectorAll('.profile-pic, .hobbies-img, .about-overlay, .hobbies-overlay').forEach(element => {
        element.addEventListener('click', function() {
            const img = this.tagName === 'IMG' ? this : this.previousElementSibling;
            openModal(img);
        });
    });

    document.querySelector('.close').addEventListener('click', closeModal);
});

function openModal(img) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    modal.style.display = "block";
    modalImg.src = img.src;
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}
