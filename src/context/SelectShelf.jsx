import React from "react";

const SelectShelf = ({ bookId, currentShelf, onShelfChange }) => {
  const handleChange = (event) => {
    onShelfChange(bookId, event.target.value);
  };

  return (
    <select value={currentShelf} onChange={handleChange}>
      <option value="QUERO LER">Quero Ler</option>
      <option value="ESTOU LENDO">Estou Lendo</option>
      <option value="JÁ LIDO">Já Lido</option>
    </select>
  );
};

export default SelectShelf;
