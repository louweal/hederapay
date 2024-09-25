export const setVisibleAccountId = function setVisibleAccountId(pairedAccount) {
    let pairedAccountDisplays = document.querySelectorAll('.hederapay-paired-account');
    [...pairedAccountDisplays].forEach((pairedAccountDisplay) => {
        if (pairedAccount) {
            pairedAccountDisplay.innerHTML = pairedAccount;
            pairedAccountDisplay.style.display = 'inline';
        } else {
            pairedAccountDisplay.innerHTML = '';
            pairedAccountDisplay.style.display = 'none';
        }
    });
};
