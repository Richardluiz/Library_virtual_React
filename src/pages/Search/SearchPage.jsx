import "./search.css";
import img from "../img/Livros.avif";
import imgFavorito from "../img/Fav.png";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { findAll } from "../../services/Api";
import { ContextShelf } from "../../context/ContextShelf"; // Or the correct relative/absolute path

function SearchPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showSynopsis, setShowSynopsis] = useState({});
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const { selectedShelves, updateShelf } = useContext(ContextShelf);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await findAll();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const storedFavorites = localStorage.getItem("favoriteBooks");
    if (storedFavorites) {
      setFavoriteBooks(JSON.parse(storedFavorites));
    }

    fetchBooks();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const toggleSynopsis = (bookId) => {
    setShowSynopsis((prevSynopsis) => ({
      ...prevSynopsis,
      [bookId]: !prevSynopsis[bookId],
    }));
  };

  const handleShelfClick = (bookId, shelf) => {
    updateShelf(bookId, shelf);
  };

  const addOrRemoveFavorite = (book) => {
    // Função movida para fora de handleShelfClick
    const isFavorite = favoriteBooks.some((favBook) => favBook.id === book.id);
    const updatedFavorites = isFavorite
      ? favoriteBooks.filter((favBook) => favBook.id !== book.id)
      : [...favoriteBooks, book];

    setFavoriteBooks(updatedFavorites);
    localStorage.setItem("favoriteBooks", JSON.stringify(updatedFavorites));
  };
  const bookList = searchTerm === "" ? books : filteredBooks;

  return (
    <>
      <div className="navbar-container">
        <nav>
          <img src={img} alt="Icone livro" />
          <ul className="navbar-items">
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main">
        <input
          type="search"
          name="livros"
          id="search-input"
          placeholder="Pesquise por um livro"
          onChange={handleSearchChange}
          className="centered-input"
        />

        <ul>
          {bookList.map((book) => (
            <li key={book.id}>
              <img
                src={imgFavorito}
                alt="Favoritar"
                className={`favorite-icon ${
                  favoriteBooks.some((fav) => fav.id === book.id)
                    ? "favorited"
                    : ""
                }`}
                onClick={() => addOrRemoveFavorite(book)}
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
              />
              <h2>{book.title}</h2>
              <p>Autores: {book.authors?.join(", ") || "N/A"}</p>{" "}
              {book.imageLinks?.thumbnail && (
                <img src={book.imageLinks.thumbnail} alt={book.title} />
              )}
              <button onClick={() => toggleSynopsis(book.id)}>Sinopse</button>
              <div className="shelf-buttons">
                {["QUERO LER", "JÁ LIDO", "ESTOU LENDO"].map((shelf) => (
                  <button
                    key={shelf}
                    className={
                      selectedShelves[book.id] === shelf ? "selected" : ""
                    }
                    onClick={() => handleShelfClick(book.id, shelf)}
                  >
                    {shelf}
                  </button>
                ))}
              </div>
              {book.description && showSynopsis[book.id] && (
                <p>{book.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SearchPage;
