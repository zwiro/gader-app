const searchbar = document.querySelector('.searchform');

searchbar.addEventListener('submit', e => {
    if (!searchbar.querySelector('input').value) {
        e.preventDefault();
    }
})