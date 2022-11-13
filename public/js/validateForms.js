if (document.body.contains(document.querySelector('form'))) {
    const forms = document.querySelectorAll('form:not(.searchform)');
    const form = [...forms].slice(-1)[0]
    const inputs = form.querySelectorAll('input');
    const textarea = form.querySelector('textarea');

    form.addEventListener('submit', e => {
        clearMsg();
        for (let input of inputs) {
            const errorMsg = document.createElement('p');
            errorMsg.innerText = "Field can't be blank!";
            errorMsg.style.color = '#D4D6B9'
            if (!input.value && input.getAttribute('type') !== 'file') {
                input.style.borderColor = 'red';
                input.parentElement.append(errorMsg);
                e.preventDefault();
            }
            if (input.value && input.getAttribute('type') === 'email' && !input.value.includes('@')) {
                errorMsg.innerText = 'Invalid email';
                input.style.borderColor = 'red';
                input.parentElement.append(errorMsg);
                e.preventDefault();
            }
        }
    })

    inputs.forEach(input => {
        input.addEventListener('input', e => {
            if (e.target.value) {
                input.style.borderColor = '';
                if (input.parentElement.lastChild.tagName === 'P') {
                    input.parentElement.lastChild.remove();
                }
            }
        })
    })

    if (form.contains(form.querySelector('textarea'))) {
        form.addEventListener('submit', e => {
            clearMsg();
            const errorMsg = document.createElement('p');
            errorMsg.innerText = "Field can't be blank!";
            if (!textarea.value) {
                textarea.style.borderColor = 'red';
                errorMsg.style.color = '#D4D6B9'
                textarea.parentElement.append(errorMsg);
                e.preventDefault();
            }
        })
        textarea.addEventListener('input', e => {
            if (e.target.value) {
                textarea.style.borderColor = '';
                if (textarea.parentElement.lastChild.tagName === 'P') {
                    textarea.parentElement.lastChild.remove();
                }
            }
        })
    }

    function clearMsg() {
        inputs.forEach(input => {
            if (input.parentElement.lastChild.tagName === 'P') {
                input.parentElement.lastChild.remove();
            }
            if (form.contains(form.querySelector('textarea'))) {
                if (textarea.parentElement.lastChild.tagName === 'P') {
                    textarea.parentElement.lastChild.remove();
                }
            }
        })
    }
}

