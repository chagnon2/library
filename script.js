let myLibrary = [];
const main = document.querySelector(`div[class="main"]`)
const newBook = document.querySelector(`div[class="newBook"]`);
const signIn = document.querySelector(`div[class="sign-in"]`);
const popup = document.querySelector(`div[class="popup"]`);
const popupSignIn = document.querySelector(`div[class="popup-sign-in"]`);
const okButton = document.querySelector(`input[value="Ok"]`);
const cancelButton = document.querySelector(`input[value="Cancel"]`);

function Book(title,author,pages,read,key) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.key = key;

    this.defineReadString = function () {
        let stringRead = "";
        if (this.read == true || this.read == "true") {stringRead = 'already read';} 
        else {stringRead = 'not read yet';}
        return stringRead;
    }

    this.appendDomElement = function () {
        const divBook = document.createElement('div');
        divBook.classList.add("book");
        const miniHeader = document.createElement('div');
        miniHeader.classList.add('miniHeader');
        const pType = document.createElement('p');
        pType.classList.add("type");
        pType.textContent = "Book";
        const pRead = document.createElement('p');
        pRead.classList.add("read");
        pRead.textContent = this.defineReadString();
        miniHeader.appendChild(pType);
        miniHeader.appendChild(pRead);
        divBook.appendChild(miniHeader);
        const pTitle = document.createElement('p');
        pTitle.classList.add("title");
        pTitle.textContent = `${this.title}`
        divBook.appendChild(pTitle);
        const pAuthor = document.createElement('p');
        pAuthor.classList.add("author");
        pAuthor.textContent = `by ${this.author}.`
        divBook.appendChild(pAuthor);
        const pPages = document.createElement('p');
        pPages.classList.add("pages");
        pPages.textContent = `${this.pages} page(s).`
        divBook.appendChild(pPages);
        const pDelete = document.createElement('p');
        pDelete.classList.add("delete");
        pDelete.textContent = `Delete`;
        pDelete.addEventListener("click", () =>{
            var user = firebase.auth().currentUser;
            if (user) {
                firebase.database().ref("/" + user.uid + "/" + myLibrary[myLibrary.indexOf(this)].key).remove();
            }
            myLibrary.splice(myLibrary.indexOf(this),1);
            main.innerHTML = "";
            printBooks(myLibrary);
        });
        divBook.appendChild(pDelete);
        const pReadStatusChanger = document.createElement('p');
        pReadStatusChanger.classList.add("readStatusChanger");
        pReadStatusChanger.textContent = "Change read status";
        pReadStatusChanger.addEventListener("click", () =>{
            if (myLibrary[myLibrary.indexOf(this)].read == true || myLibrary[myLibrary.indexOf(this)].read == "true") {
                myLibrary[myLibrary.indexOf(this)].read = false;
                var user = firebase.auth().currentUser;
                if (user) {
                    var updates = {};
                    updates["/" + user.uid + "/" + myLibrary[myLibrary.indexOf(this)].key + "/read/"] = "false";
                    firebase.database().ref().update(updates);
                }
            }
            else {
                myLibrary[myLibrary.indexOf(this)].read = true;
                var user = firebase.auth().currentUser;
                if (user) {
                    var updates = {};
                    updates["/" + user.uid + "/" + myLibrary[myLibrary.indexOf(this)].key + "/read/"] = "true";
                    firebase.database().ref().update(updates);
                }
            }
            main.innerHTML = "";
            printBooks(myLibrary);
        });
        divBook.appendChild(pReadStatusChanger);
        main.appendChild(divBook);
    }
    
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function printBooks (myLibrary) {
    myLibrary.forEach(book => {
        book.appendDomElement();
    })
}

signIn.addEventListener("click", () => {
    var user = firebase.auth().currentUser;

    if (user) {
        firebase.auth().signOut().then(function() {
            myLibrary = [];
            addBookToLibrary(mathMPSI);
            addBookToLibrary(mathMP);
            addBookToLibrary(OrauxXEns);
            addBookToLibrary(DragonBallTome1);
            main.innerHTML = "";
            printBooks(myLibrary);
        }).catch(function(error) {
        });
    } else {
        popupSignIn.classList.remove("animationOut");
        popupSignIn.classList.add("animation");
    }
});

newBook.addEventListener("click", () => {
    popup.classList.remove("animationOut");
    popup.classList.add("animation");
});

cancelButton.addEventListener("click", () => {
    popup.classList.remove("animation");
    popup.classList.add("animationOut");
});

okButton.addEventListener("click", () => {
    popup.classList.remove('animation');
    popup.classList.add("animationOut");
    const inputTitle = document.querySelector(`input[name="title"]`).value;
    const inputAuthor = document.querySelector(`input[name="author"]`).value;
    const inputPages = document.querySelector(`input[name="pages"]`).value;
    let inputReadStatus = "";
    if (document.getElementById('read').checked) {
        inputReadStatus = document.getElementById('read').value;
    } else {
        inputReadStatus = document.getElementById('notRead').value;
    }
    if (inputReadStatus == "" || inputTitle == "" || inputAuthor == "" || inputPages == "") {
        alert("Vous devez remplir tous les champs");
    } else {
        var user = firebase.auth().currentUser;
        if (user) {
            var newBookKey = firebase.database().ref().child("/" + user.uid + "/").push().key;
            var updates = {};
            updates["/" + user.uid + "/" + newBookKey] = {
                author: inputAuthor,
                pages: inputPages,
                read: inputReadStatus,
                title: inputTitle
            };
            firebase.database().ref().update(updates);
        }
        addBookToLibrary(new Book (inputTitle,inputAuthor,inputPages,inputReadStatus,newBookKey));
        main.innerHTML = "";
        printBooks(myLibrary);   
    }
});



const mathMPSI = new Book ("Maths MPSI", "Nicolas Nguyen", "800", true,"");
const mathMP = new Book ("Maths MP/MP*", "Ivan Gozard", "768", false,"");
const OrauxXEns = new Book ("Oraux X/ENS", "Eric Amar", "408", true,"");
const DragonBallTome1 = new Book ("Dragon Ball Tome 1 : Sangoku", "Akira Toryama", "100", true,"");

addBookToLibrary(mathMPSI);
addBookToLibrary(mathMP);
addBookToLibrary(OrauxXEns);
addBookToLibrary(DragonBallTome1);

printBooks(myLibrary);

