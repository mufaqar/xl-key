export default class HideModal  {
    hideModal = () => {
        // get modal backdrops
        const modalsBackdrops = document.getElementsByClassName('modal-backdrop');

        // remove every modal backdrop
        for(let i=0; i<modalsBackdrops.length; i++) {
            modalsBackdrops[i].parentNode.removeChild(modalsBackdrops[i]);
            document.body.removeChild(modalsBackdrops[i]);
        }

        // get modals
        const modals = document.getElementsByClassName('modal');

        // on every modal change state like in hidden modal
        for(let i=0; i<modals.length; i++) {
            modals[i].classList.remove('show');
            modals[i].setAttribute('aria-hidden', 'true');
            modals[i].setAttribute('style', 'display: none');
        }
    };
}