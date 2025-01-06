export async function findAll() {
  const requestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer 12121342",
    },
  };
  const httpResponse = await fetch(
    "https://api-books-dot-api-samples-423102.uc.r.appspot.com/api/books",
    requestInit
  );
  if (httpResponse.ok) {
    return await httpResponse.json();
  } else {
    throw new Error(
      "Não foi possivel obter os livros. Favor entre em contato com o suporte"
    );
  }
}
