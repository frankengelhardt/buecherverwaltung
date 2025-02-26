let books = JSON.parse(localStorage.getItem("books")) || [
    { title: "Harry Potter", category: "Fantasy", cover: "images/harry-potter.jpg", description: "Magisches Abenteuer", price: "15.99€", isbn: "978-3-16-148410-0", favorite: false },
    { title: "Der Hobbit", category: "Fantasy", cover: "images/hobbit.jpg", description: "Reise eines Hobbits", price: "12.99€", isbn: "978-0-261-10221-7", favorite: false },
    { title: "1984", category: "Dystopie", cover: "images/1984.jpg", description: "Überwachungsstaat", price: "9.99€", isbn: "978-0-452-28423-4", favorite: false }
];

let categories = ["Fantasy", "Dystopie", "Roman", "Krimi", "Sachbuch"];

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
            <button onclick="showDetails('${book.title}')">Details</button>
            <button onclick="removeBook('${book.title}')">Löschen</button>
            <button onclick="toggleFavorite('${book.title}')" class="${book.favorite ? 'favorite' : ''}">⭐</button>
            <button onclick="renameBook('${book.title}')">Umbenennen</button>
        `;
        bookList.appendChild(bookItem);
    });
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
    const categorySelect = document.getElementById("bookCategory");
    categorySelect.innerHTML = "";
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function addBook() {
    const title = document.getElementById("bookTitle").value;
    const cover = document.getElementById("bookCover").value || 'https://via.placeholder.com/150';
    const category = document.getElementById("bookCategory").value;
    const description = document.getElementById("bookDescription").value;
    const price = document.getElementById("bookPrice").value;
    const isbn = document.getElementById("bookIsbn").value;

    if (!title || !category || !description || !price || !isbn) {
        alert("Bitte füllen Sie alle Felder aus!");
        return;
    }

    const newBook = { title, cover, category, description, price, isbn, favorite: false };
    books.push(newBook);
    saveBooks();
    loadBooks();
}

function toggleFavorite(title) {
    const book = books.find(book => book.title === title);
    if (book) {
        book.favorite = !book.favorite;
        saveBooks();
        loadBooks();
    }
}

function removeBook(title) {
    // Zeigt das Bestätigungsmodal an
    const confirmModal = document.getElementById('deleteConfirmationModal');
    confirmModal.style.display = 'block';
    
    const confirmButton = document.getElementById('confirmDeleteButton');
    confirmButton.onclick = () => {
        books = books.filter(book => book.title !== title);
        saveBooks();
        loadBooks();
        closeDeleteModal();
    };
}

function closeDeleteModal() {
    const confirmModal = document.getElementById('deleteConfirmationModal');
    confirmModal.style.display = 'none';
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
            loadBooks();
        } else {
            alert("Bitte einen gültigen Titel eingeben!");
        }
    }
}

function toggleDarkMode(saveToLocalStorage = false) {
    const body = document.body;
    body.classList.toggle("dark-mode");

    if (saveToLocalStorage) {
        localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
    }

    const bookItems = document.querySelectorAll('.book-item');
    bookItems.forEach(bookItem => {
        if (body.classList.contains("dark-mode")) {
            bookItem.classList.add("dark-mode");
        } else {
            bookItem.classList.remove("dark-mode");
        }
    });
}
