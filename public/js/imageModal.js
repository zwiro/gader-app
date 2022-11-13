const images = document.querySelectorAll('#post-image');

images.forEach(image => {
    image.addEventListener('click', showModal);
})

function showModal() {
    const nav = document.querySelector('nav');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const fullsizeImage = document.createElement('img');
    fullsizeImage.src = this.src;
    document.body.append(modal);
    modal.append(fullsizeImage);
    modal.style.top = `${scrollY}px`;
    document.body.classList.add('stop-scrolling');
    nav.style.opacity = 0;
    modal.addEventListener('click', () => {
        modal.remove();
        document.body.classList.remove('stop-scrolling');
        nav.style.opacity = '';
    }, true)
}

images.forEach(image => {
    image.addEventListener('click', (e) => {
        e.stopPropagation();
    })
})
