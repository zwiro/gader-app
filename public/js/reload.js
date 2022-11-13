const likeBtn = document.querySelectorAll('#like-button');

document.addEventListener('beforeunload', () => {
    localStorage.setItem('scrollPosition', scrollY);
})

document.addEventListener('DOMContentLoaded', () => {
    localStorage.getItem('scrollPosition');
})

likeBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(() => {
            window.location.reload();
        }, 500)
    })
})
