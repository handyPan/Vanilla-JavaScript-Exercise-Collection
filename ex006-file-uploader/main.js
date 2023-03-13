// links
const allLinks = document.querySelectorAll('.link');

function changeStylesheetRule(stylesheet, selector, property, value) {
    // Make the strings lowercase
    selector = selector.toLowerCase();
    property = property.toLowerCase();
    value = value.toLowerCase();
    
    // Change it if it exists
    for(var i = 0; i < stylesheet.cssRules.length; i++) {
        var rule = stylesheet.cssRules[i];
        if(rule.selectorText === selector) {
            rule.style[property] = value;
            return;
        }
    }
  
    // Add it if it does not
    stylesheet.insertRule(selector + " { " + property + ": " + value + "; }", 0);
}

const showLink = (linkId) => {
    allLinks.forEach(link => {
        if (link.textContent == linkId) {
            if (!link.classList.contains('active')) {
                link.classList.add('active');
            }
        } else {
            if (link.classList.contains('active')) {
                link.classList.remove('active');
            }
        }
    });
}

const showDiv = (divId) => {
    if (divId == 'ex3') {
        document.getElementById('body').style.background = '#5256ad';
        changeStylesheetRule(document.styleSheets[1], ".link", "color", "#fff");
    } else if (divId == 'ex4') {
        document.getElementById('body').style.background = '#6990f2';
        changeStylesheetRule(document.styleSheets[1], ".link", "color", "#fff");
    } else {
        document.getElementById('body').style.background = '#dfe3f2';
        changeStylesheetRule(document.styleSheets[1], ".link", "color", "#555");
    }
    document.querySelectorAll('.ex').forEach(ex => ex.style.display = 'none');
    document.getElementById(divId).style.display = 'block';
};

allLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showLink(event.target.textContent);
        showDiv(event.target.textContent);
    });
});

// after loading
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.link')[0].classList.add('active');
    document.getElementById('ex1').style.display = 'block';
    // for adding event listeners for ex3
    addEventListenerForEx3();
});

// ex1

const imageInputEx1 = document.querySelector("#image-input-ex1");
var uploadedImage = "";

imageInputEx1.addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        uploadedImage = reader.result;
        document.querySelector("#image-display-ex1").style.backgroundImage = `url(${uploadedImage})`;
    });
    reader.readAsDataURL(this.files[0]);
});

// ex2

var imgBox = document.getElementById("imgBox");
var textBox = document.getElementById("textBox");
var imageInputEx2 = document.querySelector("#image-input-ex2");

textBox.onkeyup = textBox.onkeypress = function() {
    document.getElementById('prevText').innerHTML = this.value;
};

imageInputEx2.addEventListener('change', function(event) {
    imgBox.style.backgroundImage = "url(" + URL.createObjectURL(event.target.files[0]) + ")";
});

// ex3

let dragDropAreaEx3 = document.querySelector('.drag-drop-area-ex3');
let dragDropHeaderEx3 = document.getElementById('header-ex3');
let buttonEx3 = dragDropAreaEx3.querySelector('button');
let inputEx3 = dragDropAreaEx3.querySelector('input');
let fileEx3;

// select the file again
function selectAgain() {
    // restore the elements before selection
    dragDropAreaEx3.innerHTML = `
        <div class="icon-ex3"><i class="fas fa-cloud-upload-alt"></i></div>
        <div id="header-ex3">Drag & Drop to Upload File</div>
        <span>or</span>
        <button>Browse File</button>
        <input type="file" hidden>
    `;
    dragDropAreaEx3 = document.querySelector('.drag-drop-area-ex3');
    dragDropHeaderEx3 = document.getElementById('header-ex3');
    buttonEx3 = dragDropAreaEx3.querySelector('button');
    inputEx3 = dragDropAreaEx3.querySelector('input');
    addEventListenerForEx3();
}

// show the file
function showFileEx3() {
    let fileType = fileEx3.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let imgTag = `
                <img src="${fileURL}" alt="image">
                <button id="select-again">Select Again</button>
                `; 
            dragDropAreaEx3.innerHTML = imgTag;
            // add event to the button
            document.getElementById('select-again').addEventListener('click', selectAgain);
        };
        fileReader.readAsDataURL(fileEx3);
    } else {
        alert("This is not an image file!");
        dragDropAreaEx3.classList.remove('active');
        dragDropHeaderEx3.textContent = "Drag & Drop to Upload File";
    }
}

function addEventListenerForEx3() {
    // click on the button will also click the input
    buttonEx3.addEventListener('click', () => {
        inputEx3.click();
    });
    inputEx3.addEventListener('change', function() {
        fileEx3 = this.files[0];
        dragDropAreaEx3.classList.add('active');
        showFileEx3();
    });

    // when drag file over the drop area
    dragDropAreaEx3.addEventListener('dragover', (event) => {
        event.preventDefault();
        dragDropAreaEx3.classList.add('active');
        dragDropHeaderEx3.textContent = "Release to Upload File";
    });

    // when drag file and leave the drop area
    dragDropAreaEx3.addEventListener('dragleave', () => {
        dragDropAreaEx3.classList.remove('active');
        dragDropHeaderEx3.textContent = "Drag & Drop to Upload File";
    });

    // when drop file on the drop area
    dragDropAreaEx3.addEventListener('drop', (event) => {
        event.preventDefault();
        fileEx3 = event.dataTransfer.files[0];
        showFileEx3();
    });
}

// ex4

let formEx4 = document.querySelector('.wrapper-ex4 form');
let inputEx4 = document.querySelector('.file-input-ex4');
let progressAreaEx4 = document.querySelector('.progress-area-ex4');
let uploadedAreaEx4 = document.querySelector('.uploaded-area-ex4');
let fileEx4;

formEx4.addEventListener('click', () => {
    inputEx4.click();
});

function uploadFileEx4(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/upload-ex4.php");
    xhr.upload.addEventListener("progress", ({loaded, total}) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        let fileTotal = Math.floor(total / 1000);
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
        let progressHTML = `
            <li class="row">
                <i class="fas fa-file-alt"></i>
                <div class="content">
                    <div class="details">
                        <span class="name">${name} • Uploading</span>
                        <span class="percent">${fileLoaded}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${fileLoaded}%"></div>
                    </div>
                </div>
            </li>`;
        uploadedAreaEx4.classList.add("onprogress");
        progressAreaEx4.innerHTML = progressHTML;
        if (loaded == total) {
            progressAreaEx4.innerHTML = "";
            let uploadedHTML = `
                <li class="row">
                    <div class="content upload">
                        <i class="fas fa-file-alt"></i>
                        <div class="details">
                            <span class="name">${name} • Uploaded</span>
                            <span class="size">${fileSize}</span>
                        </div>
                    </div>
                    <i class="fas fa-check"></i>
                </li>`;
                uploadedAreaEx4.classList.remove("onprogress");
                uploadedAreaEx4.insertAdjacentHTML("afterbegin", uploadedHTML);
        }
    });
    let data = new FormData(formEx4);
    xhr.send(data);
}

inputEx4.addEventListener('change', ({target}) => {
    fileEx4 = target.files[0];
    if (fileEx4) {
        let fileName = fileEx4.name;
        if (fileName.length >= 12) {
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadFileEx4(fileName);
    }
});

// ex5

const formEx5 = document.getElementById("form-ex5");
const inputEx5 = document.getElementById("file-input-ex5");

formEx5.addEventListener('submit', e => {
    e.preventDefault();
    const endPoint = "php/upload-ex5.php";
    const formData = new FormData();
    formData.append("file-input-ex5", inputEx5.files[0]);
    fetch(endPoint, {
        method: "post",
        body: formData
    }).catch(console.error);
});

// ex6

const inputEx6 = document.getElementById("file-input-ex6");
const btnUploadEx6 = document.getElementById("upload-button-ex6");

btnUploadEx6.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData();
    for (const file of inputEx6.files) {
        formData.append("file-input-ex6[]", file);
    }
    // for (const [key, value] of formData) {
    //     console.log(`Key: ${key}`);
    //     console.log(`Value: ${value}`);
    // }
    fetch("php/upload-ex6.php", {
        method: "post",
        body: formData
    }).catch(console.error);
});

// ex7

const inputEx7 = document.querySelector("#files-ex7");

inputEx7.addEventListener("change", (e) => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        const files = e.target.files;
        console.log(files);
        const output = document.querySelector("#result-ex7");

        for(let i=0;i<files.length;i++) {
            if(!files[i].type.match("image")) continue;
            const picReader = new FileReader();
            picReader.addEventListener("load", function(e) {
                const picFile = e.target;
                const div = document.createElement("div");
                div.innerHTML = `<img class="thumbnail-ex7" src="${picFile.result}" title="${picFile.name}"/>`;
                output.appendChild(div);
            });
            picReader.readAsDataURL(files[i]);
        }
    } else {
        alert("The browser does not support the File API");
    }
});

// ex8

let filesEx8 = [];
let buttonEx8 = document.querySelector('.top-ex8 button');
let formEx8 = document.getElementById('drag-over-ex8');
let containerEx8 = document.querySelector('.container-ex8');
let textEx8 = document.querySelector('.inner-ex8');
let browseEx8 = document.querySelector('.select-ex8');
let inputEx8 = document.querySelector('.files-ex8');

const delImage = index => {
    filesEx8.splice(index, 1);
    showImagesEx8();
};

const showImagesEx8 = () => {
    let images = '';
    filesEx8.forEach((e, i) => {
        images += `<div class="image-ex8">
                <img src="${URL.createObjectURL(e)}" alt="image">
                <span class="delete-image-btn-ex8" data-id="${i}">&times;</span>
                <!-- <span onclick="delImage(${i})">&times;</span> -->
            </div>`;
    });
    containerEx8.innerHTML = images;
    const allDeleteImageBtnEx8 = document.querySelectorAll('.delete-image-btn-ex8');
    allDeleteImageBtnEx8.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            delImage(event.target.dataset.id);
        });
    });
};

browseEx8.addEventListener('click', () => inputEx8.click());
inputEx8.addEventListener('change', () => {
    let files = inputEx8.files;
    for(let i=0;i<files.length;i++) {
        if (filesEx8.every(e => e.name != files[i].name)) {
            filesEx8.push(files[i]);
        }
    }

    formEx8.reset();
    showImagesEx8();
});

// drag and drop

formEx8.addEventListener('dragover', e => {
    e.preventDefault();
    formEx8.classList.add('drag-over-ex8');
    textEx8.innerHTML = 'Drop images here';
});

formEx8.addEventListener('dragleave', e => {
    e.preventDefault();
    formEx8.classList.remove('drag-over-ex8');
    textEx8.innerHTML = `Drag & drop image here or<span class="select-ex8">Browse</span>`;
});

formEx8.addEventListener('drop', e => {
    e.preventDefault();
    formEx8.classList.remove('drag-over-ex8');
    textEx8.innerHTML = `Drag & drop image here or<span class="select-ex8">Browse</span>`;
    let files = e.dataTransfer.files;
    for(let i=0;i<files.length;i++) {
        if (filesEx8.every(e => e.name != files[i].name)) {
            filesEx8.push(files[i]);
        }
    }
    formEx8.reset();
    showImagesEx8();
    document.querySelector('.select-ex8').addEventListener('click', () => inputEx8.click());
});

// to be completed - upload files
buttonEx8.addEventListener('click', () => {
    let form = new FormData();
});

// ex9
const uploadFormEx9 = document.getElementById('upload-form-ex9');
const inputEx9 = document.getElementById('file-input-ex9');
const progressBarFill = document.querySelector('#ex9 > #progress-bar > .progress-bar-fill')
const progressBarText = progressBarFill.querySelector('.progress-bar-text');

uploadFormEx9.addEventListener('submit', uploadFileEx9);

function uploadFileEx9(event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/upload-ex9.php");
    xhr.upload.addEventListener("progress", event => {
        let percent = event.lengthComputable ? (event.loaded / event.total) * 100: 0;
        progressBarFill.style.width = percent.toFixed(2) + "%";
        progressBarText.textContent = percent.toFixed(2) + "%";
    });
    let data = new FormData(uploadFormEx9)
    xhr.send(data);
    console.log(data);
}

// ex10
const inputEx10 = document.getElementById('file-input-ex10');
const btnUploadEx10 = document.getElementById('upload-button-ex10');

btnUploadEx10.addEventListener('click', function() {
    const xhr = new XMLHttpRequest();
    const data = new FormData();
    for (const file of inputEx10.files) {
        data.append("file-input-ex10[]", file);
    }
    xhr.open("POST", "php/upload-ex10.php");
    xhr.send(data);
});



