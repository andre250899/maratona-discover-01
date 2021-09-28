let Modal = {
    open() {
        document.querySelector('#modal-background')
        .classList
        .add('active')
    },

    close() {
        document.querySelector('#modal-background')
        .classList
        .remove('active')
    }
}

