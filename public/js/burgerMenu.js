const nav = document.querySelector('nav');
const navLinks = nav.querySelectorAll('li');

function createSideMenu() {
    const burgerMenu = document.createElement('img');
    burgerMenu.src = '/images/bars-solid.svg';
    burgerMenu.setAttribute('id', 'burger-menu');
    nav.append(burgerMenu);
    burgerMenu.addEventListener('click', showSideMenu);
}

createSideMenu();

function showSideMenu() {
    if (!document.body.contains(document.querySelector('.side-menu'))) {
        const sideMenu = document.createElement('div');
        sideMenu.classList.add('side-menu');
        navLinks.forEach(li => sideMenu.append(li));
        document.body.append(sideMenu);
        sideMenu.style.top = `${scrollY + 80}px`;
        document.body.classList.add('stop-scrolling');
    } else {
        navLinks.forEach(li => nav.querySelector('ul').append(li));
        document.querySelector('.side-menu').classList.add('side-menu-hiding');
        setTimeout(() => {
            document.querySelector('.side-menu').remove();
        }, 200)
        document.body.classList.remove('stop-scrolling');
    }
}
