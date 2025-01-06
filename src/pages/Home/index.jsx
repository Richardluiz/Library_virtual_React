import "./style.css";
import img from "../img/Livros.avif";
import img2 from "../img/Fav.png";
import ShelfContext, { ContextShelf } from "../../context/ContextShelf";
import { findAll } from "../../services/Api";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const { selectedShelves, SelectShelf, setSelectedShelves } =
    useContext(ContextShelf);
  const [favoriteBooks, setFavoriteBooks] = useState([]); // Novo estado para favoritos
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await findAll();
        setBooks(data);

        const storedShelves = localStorage.getItem("selectedShelves");
        const initialShelves = storedShelves ? JSON.parse(storedShelves) : {};

        data.forEach((book) => {
          if (!initialShelves[book.id]) {
            initialShelves[book.id] = "QUERO LER";
          }
        });

        setSelectedShelves(initialShelves);
        localStorage.setItem("selectedShelves", JSON.stringify(initialShelves));
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
      const storedFavorites = localStorage.getItem("favoriteBooks");
      if (storedFavorites) {
        setFavoriteBooks(JSON.parse(storedFavorites));
      }
    };

    fetchBooks();
  }, [setSelectedShelves]);

  useEffect(() => {
    if (books.length > 0 && Object.keys(selectedShelves).length === 0) {
      const initialShelves = {};
      books.forEach((book) => {
        initialShelves[book.id] = "QUERO LER";
      });
      localStorage.setItem("selectedShelves", JSON.stringify(initialShelves));
    }
  }, [books, selectedShelves]);

  const booksOnShelf = (shelfName) => {
    return books.filter((book) => selectedShelves[book.id] === shelfName);
  };

  const toggleFavorites = () => {
    setShowFavorites((prevState) => !prevState); // Melhor prática: usar função de callback
  };

  const addOrRemoveFavorite = (book) => {
    const isFavorite = favoriteBooks.some((favBook) => favBook.id === book.id);
    if (isFavorite) {
      setFavoriteBooks(
        favoriteBooks.filter((favBook) => favBook.id !== book.id)
      );
    } else {
      setFavoriteBooks([...favoriteBooks, book]);
    }

    localStorage.setItem("favoriteBooks", JSON.stringify(favoriteBooks));
  };

  return (
    <>
      <div className="navbar-container">
        <nav>
          <img src={img} alt="Icone livro" />
          <ul className="navbar-items">
            <li>
              <Link to="/search">Página de busca</Link>
            </li>

            <div className="favorites-container" onClick={toggleFavorites}>
              <img src={img2} alt="Favoritos" />
              <span className="arrow-down">▼</span>
              {showFavorites && (
                <ul className="favorites-list">
                  {favoriteBooks.length === 0 && <li>(Vazio)</li>}{" "}
                  {favoriteBooks.map((book) => (
                    <li key={book.id}>
                      <img src={book.imageLinks?.thumbnail} alt={book.title} />
                      <span>{book.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ul>
        </nav>
      </div>

      <div className="main-banner">
        <h1>Bookverse</h1>
        <p>
          Seu universo de livros digitais. Explore, descubra e mergulhe em
          infinitas histórias.
        </p>
      </div>
      <main className="estantes-container">
        {["JÁ LIDO", "QUERO LER", "ESTOU LENDO"].map((shelfName) => (
          <div
            key={shelfName}
            className={`estante ${shelfName.toLowerCase().replace(" ", "-")}`}
          >
            <h2>{shelfName}</h2>
            <ul>
              {booksOnShelf(shelfName).map((book) => (
                <li key={book.id}>
                  {book.imageLinks && book.imageLinks.thumbnail && (
                    <img src={book.imageLinks.thumbnail} alt={book.title} />
                  )}
                  <h3>{book.title}</h3>
                  <SelectShelf
                    bookId={book.id}
                    currentShelf={selectedShelves[book.id]}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      <footer>
        <p>© Todos os direitos reservados. [2024]</p>
        <nav>
          <ul>
            <li>
              <a href="#">Sobre nós</a>
            </li>
            <li>
              <a href="#">Contato</a>
            </li>
            <li>
              <a href="#">Política de privacidade</a>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}

export default Home;
