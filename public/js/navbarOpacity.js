const navbar = document.querySelector('nav');

document.addEventListener('scroll', () => {
    if (window.scrollY == 0) {
        navbar.style.opacity = '';
    } else {
        navbar.style.opacity = '0.5';
    }
})

navbar.addEventListener('mouseover', () => {
    navbar.style.opacity = '';
})

navbar.addEventListener('mouseout', () => {
    if (!window.scrollY == 0) {
        navbar.style.opacity = '0.5';
    }
})