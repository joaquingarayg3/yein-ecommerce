const apiURL = "https://fakestoreapi.com/products";

export const getAllProducts = async () => {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

export const getOneProductById = async (id) => {
  try {
    const res = await fetch(`${apiURL}/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return null;
  }
};
