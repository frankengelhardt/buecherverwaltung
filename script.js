let books = JSON.parse(localStorage.getItem("books")) || [
    { title: "Harry Potter und der Stein der Weißen", category: "Fantasy", cover: "images/harry-potter.jpg", description: "Magisches Abenteuer", price: "15.99€", isbn: "978-3-16-148410-0", favorite: false, available: true },
    { title: "Der Hobbit", category: "Fantasy", cover: "images/hobbit.jpg", description: "Reise eines Hobbits", price: "12.99€", isbn: "978-0-261-10221-7", favorite: false, available: true },
    { title: "1984", category: "Dystopie", cover: "images/1984.jpg", description: "Überwachungsstaat", price: "9.99€", isbn: "978-0-452-28423-4", favorite: false, available: true }
];

let categories = ["Fantasy", "Dystopie", "Roman", "Krimi", "Sachbuch"];
let filters = {
    category: "",
    availability: "",
    favorites: ""
};

window.onload = function () {
    loadCategories();
    loadBooks();
    if (localStorage.getItem("darkMode") === "true") {
        toggleDarkMode(true);
    }
};

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

function loadBooks(filteredBooks = books) {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    if (filteredBooks.length === 0) {
        const noBooksMessage = document.createElement('p');
        noBooksMessage.textContent = "Keine Bücher gefunden.";
        bookList.appendChild(noBooksMessage);
        return;
    }

    filteredBooks.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-item");

        if (document.body.classList.contains("dark-mode")) {
            bookItem.classList.add("dark-mode");
        }

        bookItem.innerHTML = `
            <img src="${book.cover || 'https://via.placeholder.com/150'}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>${book.category}</strong></p>
            <p>Status: <span class="status-indicator ${book.available ? 'available' : 'unavailable'}"></span></p>
            <button onclick="showDetails('${book.title}')">Details</button>
            <button onclick="toggleAvailability('${book.title}')" class="status-button">Status wechseln</button>
            <button onclick="removeBook('${book.title}')">Löschen</button>
            <button onclick="toggleFavorite('${book.title}')" class="${book.favorite ? 'favorite' : ''}">⭐</button>
            <button onclick="renameBook('${book.title}')">Umbenennen</button>
        `;
        bookList.appendChild(bookItem);
    });
}

function toggleAvailability(title) {
    const book = books.find(book => book.title === title);
    if (book) {
        book.available = !book.available;
        saveBooks();
        filterBooks();
    }
}

function filterBooks() {
    const category = document.getElementById("filterCategory").value;
    const availability = document.getElementById("filterAvailability").value;
    const favorites = document.getElementById("filterFavorites").value;

    filters.category = category;
    filters.availability = availability === "" ? "" : availability;
    filters.favorites = favorites === "" ? "" : favorites;

    let filteredBooks = books;

    // Filter nach Kategorie
    if (filters.category !== "") {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
    }

    // Filter nach Verfügbarkeit
    if (filters.availability !== "") {
        filteredBooks = filteredBooks.filter(book => book.available.toString() === filters.availability);
    }

    // Filter nach Favoriten
    if (filters.favorites !== "") {
        filteredBooks = filteredBooks.filter(book => book.favorite.toString() === filters.favorites);
    }

    loadBooks(filteredBooks);
}

function searchBooks() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchValue) ||
        book.category.toLowerCase().includes(searchValue)
    );
    loadBooks(filteredBooks);
}

function loadCategories() {
    const categorySelect = document.getElementById("filterCategory");
    const addBookCategorySelect = document.getElementById("bookCategory");
    categorySelect.innerHTML = '<option value="">Alle Kategorien</option>';
    addBookCategorySelect.innerHTML = '<option value="">Bitte wählen</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);

        const addOption = document.createElement("option");
        addOption.value = category;
        addOption.textContent = category;
        addBookCategorySelect.appendChild(addOption);
    });
}

function validateIsbn(isbn) {
    const cleanedIsbn = isbn.replace(/-/g, '');
    const isbnPattern = /^(97(8|9))?\d{9}(\d|X)$/;
    return isbnPattern.test(cleanedIsbn);
}

function addBook() {
    const title = document.getElementById("bookTitle").value.trim();
    const coverFile = document.getElementById("bookCoverFile").files[0];
    const coverUrlInput = document.getElementById("bookCover").value.trim();
    let cover = coverFile ? URL.createObjectURL(coverFile) : coverUrlInput || 'https://via.placeholder.com/150';

    const category = document.getElementById("bookCategory").value.trim();
    const description = document.getElementById("bookDescription").value.trim();
    const price = document.getElementById("bookPrice").value.trim();
    const isbn = document.getElementById("bookIsbn").value.trim();

    // Überprüfe, ob die Felder ausgefüllt sind und der Preis gültig ist
    if (!title || !category || !description || !price || isNaN(price) || parseFloat(price) <= 0 || !isbn || !validateIsbn(isbn)) {
        alert("Bitte füllen Sie alle Felder korrekt aus!");
        return;
    }

    // Neues Buch hinzufügen
    const newBook = { title, cover, category, description, price, isbn, available: true, favorite: false };
    books.push(newBook);
    saveBooks();
    loadBooks();
    resetForm();  // Formular zurücksetzen
}

function resetForm() {
    // Formular zurücksetzen
    document.getElementById("bookForm").reset();
    // Datei-Eingabefeld zurücksetzen
    document.getElementById("bookCoverFile").value = '';
}

function toggleFavorite(title) {
    const book = books.find(book => book.title === title);
    if (book) {
        book.favorite = !book.favorite;
        saveBooks();
        filterBooks();
    }
}

function removeBook(title) {
    const confirmModal = document.getElementById('deleteConfirmationModal');
    confirmModal.style.display = 'block';

    document.getElementById('confirmDeleteButton').onclick = () => {
        books = books.filter(book => book.title !== title);
        saveBooks();
        filterBooks();
        closeDeleteModal();
    };
}

function closeDeleteModal() {
    document.getElementById('deleteConfirmationModal').style.display = 'none';
}

function showDetails(title) {
    const book = books.find(book => book.title === title);
    if (book) {
        document.getElementById("modalTitle").textContent = book.title;
        document.getElementById("modalCategory").textContent = `Kategorie: ${book.category}`;
        document.getElementById("modalDescription").textContent = `Beschreibung: ${book.description}`;
        document.getElementById("modalPrice").textContent = `Preis: ${book.price}`;
        document.getElementById("modalIsbn").textContent = `ISBN: ${book.isbn}`;

        document.getElementById("bookDetailModal").style.display = "block";
    }
}

function closeModal() {
    document.getElementById("bookDetailModal").style.display = "none";
}

function renameBook(title) {
    const book = books.find(book => book.title === title);

    if (book) {
        const newTitle = prompt("Neuen Titel für das Buch eingeben:", book.title);
        if (newTitle && newTitle.trim() !== "") {
            book.title = newTitle.trim();
            saveBooks();
            filterBooks();
        } else {
            alert("Bitte einen gültigen Titel eingeben!");
        }
    }
}

function toggleDarkMode(saveToLocalStorage = false) {
    document.body.classList.toggle("dark-mode");

    if (saveToLocalStorage) {
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    }
}

