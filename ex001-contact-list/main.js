// regular expression for validation
const strRegex =  /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

// -------------------------------------------------- //
const countryList = document.getElementById('country-list');
const fullscreenDiv = document.getElementById('fullscreen-div');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const modalBtns = document.getElementById('modal-btns');
const form = document.getElementById('modal');
const addrBookList = document.querySelector('#addr-book-list tbody');

// -------------------------------------------------- //
let addrName = firstName = lastName = email = phone = streetAddr = postCode = city = country = labels = "";

// Address Class
class Address {
    constructor(id, addrName, firstName, lastName, email, phone, streetAddr, postCode, city, country, labels) {
        this.id = id;
        this.addrName = addrName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.streetAddr = streetAddr;
        this.postCode = postCode;
        this.city = city;
        this.country = country;
        this.labels = labels;
    }

    static getAddresses() {
        // from local storage
        let addresses;
        if(localStorage.getItem('addresses') == null) {
            addresses = [];
        } else {
            addresses = JSON.parse(localStorage.getItem('addresses'));
        }
        return addresses;
    }

    static addAddress(address) {
        console.log(address);
        const addresses = Address.getAddresses();
        addresses.push(address);
        localStorage.setItem('addresses', JSON.stringify(addresses));
    }

    static deleteAddress(id) {
        const addresses = Address.getAddresses();
        console.log(addresses);
        addresses.forEach((address, index) => {
            if(address.id == id) {
                addresses.splice(index, 1);
            }
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        form.reset();
        UI.closeModal();
        addrBookList.innerHTML = "";
        UI.showAddressList();
    }

    static updateAddress(addressItem) {
        const addresses = Address.getAddresses();
        addresses.forEach(address => {
            if(address.id == addressItem.id) {
                address.addrName = addressItem.addrName;
                address.firstName = addressItem.firstName;
                address.lastName = addressItem.lastName;
                address.email = addressItem.email;
                address.phone = addressItem.phone;
                address.streetAddr = addressItem.streetAddr;
                address.postCode = addressItem.postCode;
                address.city = addressItem.city;
                address.country = addressItem.country;
                address.labels = addressItem.labels;
            }
        });
        localStorage.setItem("addresses", JSON.stringify(addresses));
        addrBookList.innerHTML = "";
        UI.showAddressList();
    }
}

// UI Class
class UI {
    static showAddressList() {
        const addresses = Address.getAddresses();
        addresses.forEach(address => UI.addToAddressList(address));
    }

    static addToAddressList(address) {
        const tableRow = document.createElement('tr');
        tableRow.setAttribute('data-id', address.id);
        tableRow.innerHTML = `
            <td>${address.id}</td>
            <td>
                <span class="addressing-name">
                    ${address.addrName}
                </span>
                <br>
                <span class="address">
                    ${address.streetAddr} ${address.postCode} ${address.city} ${address.country}
                </span>
            </td>
            <td><span>${address.labels}</span></td>
            <td>${address.firstName + " " + address.lastName}</td>
            <td>${address.phone}</td>
        `;
        addrBookList.appendChild(tableRow);
    }

    static showModal() {
        modal.style.display = "block";
        fullscreenDiv.style.display = "block";
    }    

    static closeModal() {
        modal.style.display = "none";
        fullscreenDiv.style.display = "none";
    }

    static showModalData(id) {
        const addresses = Address.getAddresses();
        addresses.forEach(address => {
            form.addr_name.value = address.addrName;
            form.first_name.value = address.firstName;
            form.last_name.value = address.lastName;
            form.email.value = address.email;
            form.phone.value = address.phone;
            form.street_addr.value = address.streetAddr;
            form.postal_code.value = address.postCode;
            form.city.value = address.city;
            form.country.value = address.country;
            form.labels.value = address.labels;
            document.getElementById('modal-title').innerHTML = "Change Address Details";
            document.getElementById('modal-btns').innerHTML = `
                <button type="submit" id="update-btn" data-id="${id}">Update</button>
                <button type="button" id="delete-btn" data-id="${id}">Delete</button>
            `;
        });
    }
}

// DOM content loaded
window.addEventListener('DOMContentLoaded', () => {
    loadJson(); // loading country list
    loadEventListeners();
    UI.showAddressList();
});

// load countries list
function loadJson() {
    fetch('countries.json')
    .then(response => response.json())
    .then(data => {
        let html = "";
        console.log(data);
        data.forEach(country => {
            html += `<option>${country.country}</option>`;
        });
        countryList.innerHTML = html;
    })
}

// load event listeners
function loadEventListeners() {
    // show add item modal
    addBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('modal-title').innerHTML = "Add Address";
        UI.showModal();
        document.getElementById('modal-btns').innerHTML = `
            <button type="submit" id="save-btn">Save</button>
        `;
    });

    // close add item modal
    closeBtn.addEventListener('click', UI.closeModal);

    // add an address
    modalBtns.addEventListener('click', (event) => {
        event.preventDefault();
        if(event.target.id == "save-btn") {
            // console.log("yes");
            let isFormValid = getFormData();
            console.log(isFormValid);
            if(!isFormValid) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errMsg');
                    }, 1500);
                });
            } else {
                let allItem = Address.getAddresses();
                console.log(allItem);
                let lastItemId = (allItem.length > 0) ? allItem[allItem.length - 1].id : 0;
                lastItemId++;
                const addressItem = new Address(lastItemId, addrName, firstName, lastName, email, phone, streetAddr, postCode, city, country, labels);
                Address.addAddress(addressItem);
                UI.closeModal();
                UI.addToAddressList(addressItem);
                form.reset();
            }
        }
    });

    // table row items
    addrBookList.addEventListener('click', (event) => {
        UI.showModal();
        let trElement;
        if(event.target.parentElement.tagName == "TD") {
            trElement = event.target.parentElement.parentElement;
        }
        if(event.target.parentElement.tagName == "TR") {
            trElement = event.target.parentElement;
        }
        let viewId = trElement.dataset.id;
        UI.showModalData(viewId);
    });

    // delete an address item
    modalBtns.addEventListener('click', (event) => {
        if (event.target.id == 'delete-btn') {
            Address.deleteAddress(event.target.dataset.id);
        }
    });

    // update an address item
    modalBtns.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.id == 'update-btn') {
            let id = event.target.dataset.id;
            let isFormValid = getFormData();
            if(!isFormValid) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errMsg');
                    }, 1500);
                });
            } else {
                const addressItem = new Address(id, addrName, firstName, lastName, email, phone, streetAddr, postCode, city, country, labels);
                Address.updateAddress(addressItem);
                UI.closeModal();
                form.reset();
            }
        }
    });
}

// get form data
function getFormData() {
    let inputValidStatus = [];
    // console.log(form.addr_name.value, form.first_name.value, form.last_name.value, form.email.value, form.phone.value, form.street_addr.value, form.postal_code.value, form.city.value, form.country.value, form.labels.value);
    // console.log(form.addr_name.classList.contains("errMsg"));
    if(!strRegex.test(form.addr_name.value) || form.addr_name.value.trim().length == 0) {
        addErrMsg(form.addr_name);
        inputValidStatus[0] = false;
    } else {
        addrName = form.addr_name.value;
        delErrMsg(form.addr_name);
        inputValidStatus[0] = true;
    }
    if(!strRegex.test(form.first_name.value) || form.first_name.value.trim().length == 0) {
        addErrMsg(form.first_name);
        inputValidStatus[1] = false;
    } else {
        firstName = form.first_name.value;
        delErrMsg(form.first_name);
        inputValidStatus[1] = true;
    }
    if(!strRegex.test(form.last_name.value) || form.last_name.value.trim().length == 0) {
        addErrMsg(form.last_name);
        inputValidStatus[2] = false;
    } else {
        lastName = form.last_name.value;
        delErrMsg(form.last_name);
        inputValidStatus[2] = true;
    }
    if(!emailRegex.test(form.email.value)) {
        addErrMsg(form.email);
        inputValidStatus[3] = false;
    } else {
        email = form.email.value;
        delErrMsg(form.email);
        inputValidStatus[3] = true;
    }
    if(!phoneRegex.test(form.phone.value)) {
        addErrMsg(form.phone);
        inputValidStatus[4] = false;
    } else {
        phone = form.phone.value;
        delErrMsg(form.phone);
        inputValidStatus[4] = true;
    }
    if(!(form.street_addr.value.trim().length > 0)) {
        addErrMsg(form.street_addr);
        inputValidStatus[5] = false;
    } else {
        streetAddr = form.street_addr.value;
        delErrMsg(form.street_addr);
        inputValidStatus[5] = true;
    }
    if(!digitRegex.test(form.postal_code.value)) {
        addErrMsg(form.postal_code);
        inputValidStatus[6] = false;
    } else {
        postCode = form.postal_code.value;
        delErrMsg(form.postal_code);
        inputValidStatus[6] = true;
    }
    if(!strRegex.test(form.city.value) || form.city.value.trim().length == 0) {
        addErrMsg(form.city);
        inputValidStatus[7] = false;
    } else {
        city = form.city.value;
        delErrMsg(form.city);
        inputValidStatus[7] = true;
    }
    country = form.country.value;
    labels = form.labels.value;
    console.log(addrName, firstName, lastName, email, phone, streetAddr, postCode, city);
    return inputValidStatus.includes(false) ? false : true;
}

function addErrMsg(inputBox) {
    inputBox.classList.add('errMsg');
}

function delErrMsg(inputBox) {
    if (inputBox.classList.contains("errMsg")) {
        inputBox.classList.remove('errMsg');
    }
}