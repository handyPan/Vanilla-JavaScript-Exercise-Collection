function colorChange(color) {
    const htmlTag = document.getElementsByTagName("*")[0];
    htmlTag.style.cssText = `--theme-orange: orangered;
    --theme-blue: rgb(67, 67, 197);
    --theme-green: darkgreen;
    --theme-black: black;
    --theme-color: var(--theme-${color});`;
}

function addEventListenerForBox() {
    allBox = document.querySelectorAll('.box');
    allBox.forEach(box => {
        box.addEventListener('click', (event) => {
            colorChange(event.target.id);
        });
    });
}

document.addEventListener('DOMContentLoaded', addEventListenerForBox);