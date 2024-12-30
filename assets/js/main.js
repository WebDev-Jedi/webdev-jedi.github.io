// 1. Mobile Navbar Toggle
const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.navbar');
menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuBtn.querySelector('i').classList.toggle('bx-x');
});

// 2. Shrink Header on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 3. Swiper Slider Engine Initialization
const worksSwiper = new Swiper('.works-swiper', {
    slidesPerView: 'auto',       // Дозволяє налаштувати кастомну ширину через CSS
    centeredSlides: true,        // Активний слайд завжди по центру
    spaceBetween: 10,            // Відстань між слайдами за замовчуванням
    loop: true,                  // Безкінечний цикл слайдера
    speed: 600,                  // Швидкість перемикання (плавність)
    grabCursor: true,            // Іконка "руки" при наведенні
    navigation: {
        nextEl: '#work-next-arrow',
        prevEl: '#work-prev-arrow',
    },
    breakpoints: {
        // Коли екран >= 900px
        900: {
            spaceBetween: 30
        }
    }
});


// 4. Layout Switcher Logic (Grid / List)
const btnGrid = document.getElementById('btn-grid');
const btnList = document.getElementById('btn-list');
const blogContainer = document.getElementById('blog-container');

btnGrid.addEventListener('click', () => {
    btnGrid.classList.add('active');
    btnList.classList.remove('active');
    blogContainer.classList.remove('list-layout');
    blogContainer.classList.add('grid-layout');
});

btnList.addEventListener('click', () => {
    btnList.classList.add('active');
    btnGrid.classList.remove('active');
    blogContainer.classList.remove('grid-layout');
    blogContainer.classList.add('list-layout');
});

// 5. Scroll Reveal Engine (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');
const observerOptions = { root: null, threshold: 0.12, rootMargin: "0px 0px -40px 0px" };
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
revealElements.forEach(el => revealObserver.observe(el));

// 6. Auto Highlight Nav Active Link on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        const secTop = sec.offsetTop;
        if (pageYOffset >= (secTop - 200)) {
            current = sec.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// 7. Typewriter Engine
const typewriterEl = document.getElementById('typewriter');
const htmlContentToType = "I'm <span>Alex</span>,<br>Full-Stack Developer";

let index = 0;
let isDeleting = false;

const typingSpeed = 90;
const erasingSpeed = 45;
const pauseEnd = 3000;
const pauseStart = 600;

function playTypewriter() {
    if (!isDeleting) {
        if (index < htmlContentToType.length) {
            if (htmlContentToType[index] === '<') {
                let closingBracket = htmlContentToType.indexOf('>', index);
                if (closingBracket !== -1) {
                    index = closingBracket + 1;
                }
            } else {
                index++;
            }
            typewriterEl.innerHTML = htmlContentToType.substring(0, index);
            setTimeout(playTypewriter, typingSpeed);
        } else {
            isDeleting = true;
            setTimeout(playTypewriter, pauseEnd);
        }
    } else {
        if (index > 0) {
            if (htmlContentToType[index - 1] === '>') {
                let openingBracket = htmlContentToType.lastIndexOf('<', index - 1);
                if (openingBracket !== -1) {
                    index = openingBracket;
                }
            } else {
                index--;
            }
            typewriterEl.innerHTML = htmlContentToType.substring(0, index);
            setTimeout(playTypewriter, erasingSpeed);
        } else {
            isDeleting = false;
            setTimeout(playTypewriter, pauseStart);
        }
    }
}

setTimeout(playTypewriter, 400);