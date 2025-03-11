// Die Bücher werden entweder aus dem localStorage geladen oder mit Standardwerten initialisiert
let books = JSON.parse(localStorage.getItem("books")) || [
    { title: "Harry Potter und der Stein der Weißen", category: "Fantasy", cover: "images/harry-potter.jpg", description: "Magisches Abenteuer", price: "15.99€", isbn: "978-3-16-148410-0", favorite: false, available: true },
    { title: "Der Hobbit", category: "Fantasy", cover: "images/hobbit.jpg", description: "Reise eines Hobbits", price: "12.99€", isbn: "978-0-261-10221-7", favorite: false, available: true },
    { title: "1984", category: "Dystopie", cover: "images/1984.jpg", description: "Überwachungsstaat", price: "9.99€", isbn: "978-0-452-28423-4", favorite: false, available: true }
];

// Mögliche Kategorien, die für die Bücher verwendet werden können
let categories = ["Fantasy", "Dystopie", "Roman", "Krimi", "Sachbuch"];

// Filterobjekt für die Kategorien, Verfügbarkeit und Favoriten
let filters = {
    category: "",
    availability: "",
    favorites: ""
};

// Diese Funktion wird aufgerufen, wenn die Seite geladen wird
window.onload = function () {
    loadCategories(); // Lade Kategorien für das Filtermenü
    loadBooks(); // Lade Bücher in die Anzeige
    if (localStorage.getItem("darkMode") === "true") {
        toggleDarkMode(true); // Falls Dark Mode aktiv ist, setzen
    }
    document.getElementById('confirmDeleteButton').addEventListener('click', deleteBook); // Event-Listener für Löschbestätigung
};

// Speichert die Bücher in den localStorage
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Diese Funktion lädt und zeigt die Bücher an
function loadBooks(filteredBooks = books) {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = ""; // Leere die Buchliste

    if (filteredBooks.length === 0) {
        bookList.innerHTML = "<p>Keine Bücher gefunden.</p>";
        return;
    }

    // Durchläuft alle Bücher und zeigt sie an
    filteredBooks.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-item");

        if (document.body.classList.contains("dark-mode")) {
            bookItem.classList.add("dark-mode");
        }

        bookItem.innerHTML = `
            <img src="${book.cover}" alt="Cover von ${book.title}">
            <h3>${book.title}</h3>
			<p><strong>${book.category}</strong></p>
            <p>Status: <span class="status-indicator ${book.available ? 'available' : 'unavailable'}"></span></p>
            <button onclick="showDetails('${book.title}')">Details</button>
            <button onclick="toggleAvailability('${book.title}')" class="status-button">Status wechseln</button>
            <button onclick="toggleFavorite('${book.title}')" class="${book.favorite ? 'favorite' : ''}">⭐</button>
			<button onclick="renameBook('${book.title}')">Umbenennen</button>
            <button onclick="showDeleteConfirmationModal('${book.title}')">Löschen</button>
        `;
        bookList.appendChild(bookItem);
    });
}

// Zeigt die Details eines Buches in einem Modal an
function showDetails(title) {
    const book = books.find(book => book.title === title);
    if (book) {
        document.getElementById("modalTitle").textContent = book.title;
        document.getElementById("modalCategory").textContent = "Kategorie: " + book.category;
        document.getElementById("modalDescription").textContent = book.description;
        document.getElementById("modalPrice").textContent = "Preis: " + book.price;
        document.getElementById("modalIsbn").textContent = "ISBN: " + book.isbn;
        document.getElementById("bookDetailModal").style.display = "block";
    }
}

// Schließt das Detail-Modal
function closeModal() {
    document.getElementById("bookDetailModal").style.display = "none";
}

// Diese Funktion wird aufgerufen, um den Titel eines Buches zu ändern
function renameBook(title) {
    const book = books.find(book => book.title === title);

    if (book) {
        const newTitle = prompt("Neuen Titel für das Buch eingeben:", book.title);
        if (newTitle && newTitle.trim() !== "") {
            book.title = newTitle.trim();
            saveBooks();
			loadBooks();
            filterBooks();
        } else {
            alert("Bitte einen gültigen Titel eingeben!");
        }
    }
}

// Umschalten der Verfügbarkeit eines Buches
function toggleAvailability(title) {
    const book = books.find(book => book.title === title);
    if (book) {
        book.available = !book.available;
        saveBooks();
        filterBooks(); // Anwenden der aktuellen Filter nach der Änderung
    }
}

// Filtert die Bücher nach Kategorie, Verfügbarkeit und Favoriten
function filterBooks() {
    const category = document.getElementById("filterCategory").value;
    const availability = document.getElementById("filterAvailability").value;
    const favorites = document.getElementById("filterFavorites").value;

    filters.category = category;
    filters.availability = availability === "" ? "" : availability;
    filters.favorites = favorites === "" ? "" : favorites;

    let filteredBooks = books;

    if (filters.category !== "") {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
    }

    if (filters.availability !== "") {
        filteredBooks = filteredBooks.filter(book => book.available.toString() === filters.availability);
    }

    if (filters.favorites !== "") {
        filteredBooks = filteredBooks.filter(book => book.favorite.toString() === filters.favorites);
    }

    loadBooks(filteredBooks);
}

// Sucht nach Büchern basierend auf dem eingegebenen Text
function searchBooks() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const filteredBooks = books.filter(book => 
		book.title.toLowerCase().includes(searchValue) || 
		book.category.toLowerCase().includes(searchValue)
	);
    loadBooks(filteredBooks);
}

// Lädt die Kategorien in die Dropdown-Menüs
function loadCategories() {
    const categorySelect = document.getElementById("filterCategory");
    const addBookCategorySelect = document.getElementById("bookCategory");

    categorySelect.innerHTML = '<option value="">Alle Kategorien</option>';
    addBookCategorySelect.innerHTML = '<option value="">Wähle eine Kategorie</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option.cloneNode(true));
        addBookCategorySelect.appendChild(option);
    });
}

// Überprüft, ob eine ISBN gültig ist
function validateIsbn(isbn) {
    const cleanedIsbn = isbn.replace(/-/g, '');
    const isbnPattern = /^(97(8|9))?\d{9}(\d|X)$/;
    return isbnPattern.test(cleanedIsbn);
}

// Fügt ein neues Buch hinzu
function addBook() {
    const title = document.getElementById("bookTitle").value.trim();
    const coverFile = document.getElementById("bookCoverFile").files[0];
    const coverUrlInput = document.getElementById("bookCover").value.trim();

    let cover = coverFile ? URL.createObjectURL(coverFile) : coverUrlInput || 'https://via.placeholder.com/150';
    const category = document.getElementById("bookCategory").value.trim();
    const description = document.getElementById("bookDescription").value.trim();
    const price = document.getElementById("bookPrice").value.trim();
    const isbn = document.getElementById("bookIsbn").value.trim();

    if (!title || !category || !description || !price || isNaN(price) || parseFloat(price) <= 0 || !isbn || !validateIsbn(isbn)) {
        alert("Bitte füllen Sie alle Felder korrekt aus.");
        return;
    }

    const newBook = {
        title: title,
        cover: cover,
        category: category,
        description: description,
        price: price + "€",
        isbn: isbn,
        favorite: false,
        available: true
    };

    books.push(newBook);
    saveBooks();
    filterBooks();
    document.getElementById("bookForm").reset();
}

// Zeigt das Bestätigungsmodal für das Löschen eines Buches
function showDeleteConfirmationModal(title) {
    bookToDelete = title;
    document.getElementById("deleteConfirmationModal").style.display = "block";
}

// Löscht das gewählte Buch
function deleteBook() {
    books = books.filter(book => book.title !== bookToDelete);
    saveBooks();
    filterBooks();
    closeDeleteConfirmationModal();
}

// Schließt das Löschmodal
function closeDeleteConfirmationModal() {
    document.getElementById("deleteConfirmationModal").style.display = "none";
}

// Schaltet den Dark Mode ein/aus
function toggleDarkMode(override) {
    const darkMode = override !== undefined ? override : !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
    loadBooks();
}

// Ändert den Favoritenstatus eines Buches
function toggleFavorite(title) {
    const book = books.find(book => book.title === title);
    if (book) {
        book.favorite = !book.favorite;
        saveBooks();
        filterBooks();
    }
}
