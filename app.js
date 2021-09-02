const form = document.querySelector("#book-form");
const tableBody = document.querySelector("#book-list");

// Clase para crear un libro con sus atributos
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//  Fin de la clase Book
// =====================

// Clase para darle forma al UI
class UI {
  // Método para agregar un libro al UI
  addBook(libro) {
    // Creamos una fila para la tabla
    const row = document.createElement("tr");

    // Insertamos dentro de la fila los datos correspondientes
    row.innerHTML = `
        <td>${libro.title}</td>
        <td>${libro.author}</td>
        <td>${libro.isbn}</td>
        <td><a class="delete" href="#" style="text-decoration: none;" >X</a></td>`;

    // Agregamos esa fila a la tabla
    tableBody.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector(".container");
    // Get form
    const form = document.querySelector("#book-form");
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(event) {
    if (event.target.className == "delete") {
      event.target.parentElement.parentElement.remove();
    }
  }

  cleanBooks() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}
// Fin de la clase UI
// =====================

// LocalStorage
class BookStorage {
  /**
   *
   * @returns Arreglo con los libros del LS.
   */
  static getBooks() {
    if (!localStorage.length) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem("libros"));
    }
  }

  /**
   *
   * @param {Book} libro Libro que será agregado al LS.
   */
  static addBook(libro) {
    const elemento = BookStorage.getBooks();
    elemento.push(libro);
    localStorage.setItem("libros", JSON.stringify(elemento));
  }

  static displayBooks() {
    const ui = new UI();
    const libros = BookStorage.getBooks();

    libros.forEach((libro) => {
      ui.addBook(libro);
    });
  }

  static deleteBooks(isbn) {
    const libros = BookStorage.getBooks();

    libros.forEach((libro, index) => {
      if (libro.isbn === isbn) {
        libros.splice(index, 1);
      }
    });
    localStorage.setItem("libros", JSON.stringify(libros));
  }
}
// Fin de la clase BookStorage
// =====================

document.addEventListener("DOMContentLoaded", BookStorage.displayBooks);

form.addEventListener("submit", (event) => {
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  const ui = new UI();

  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Por favor rellena los campos", "error");
  } else {
    const libro = new Book(title, author, isbn);
    ui.addBook(libro);
    ui.cleanBooks();
    BookStorage.addBook(libro);
    ui.showAlert("Libro agregado satisfactoriamente 😉", "success");
  }

  event.preventDefault();
});

tableBody.addEventListener("click", (event) => {
  const ui = new UI();
  ui.deleteBook(event);
  ui.showAlert("Libro eliminado 😉", "success");
  try {
    BookStorage.deleteBooks(
      event.target.parentElement.previousElementSibling.textContent
    );
  } catch (error) {}
});
