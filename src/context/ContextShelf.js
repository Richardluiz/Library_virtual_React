import { createContext, useState, useEffect } from "react";

export const ContextShelf = createContext();

export const ShelfProvider = ({ children }) => {
  const [selectedShelves, setSelectedShelves] = useState({});

  useEffect(() => {
    const storedShelves = localStorage.getItem("selectedShelves");

    try {
      setSelectedShelves(storedShelves ? JSON.parse(storedShelves) : {});
    } catch (error) {
      console.error("Erro ao carregar as estantes do localStorage:", error);
      // Limpar o localStorage se os dados estiverem corrompidos
      localStorage.removeItem("selectedShelves");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedShelves", JSON.stringify(selectedShelves));
  }, [selectedShelves]);

  const updateShelf = (bookId, shelf) => {
    setSelectedShelves((prevShelves) => ({
      ...prevShelves,
      [bookId]: shelf,
    }));
  };

  useEffect(() => {
    // Este useEffect agora só é usado para salvar no localStorage
    localStorage.setItem("selectedShelves", JSON.stringify(selectedShelves));
  }, [selectedShelves]);

  const SelectShelf = ({ bookId, currentShelf }) => {
    // Remova onShelfChange das props
    const handleChange = (event) => {
      updateShelf(bookId, event.target.value); // Chame updateShelf diretamente
    };

    return (
      <select value={currentShelf} onChange={handleChange}>
        <option value="QUERO LER">Quero Ler</option>
        <option value="ESTOU LENDO">Estou Lendo</option>
        <option value="JÁ LIDO">Já Lido</option>
      </select>
    );
  };

  return (
    <ContextShelf.Provider
      value={{ selectedShelves, SelectShelf, updateShelf }}
    >
      {children}
    </ContextShelf.Provider>
  );
};
