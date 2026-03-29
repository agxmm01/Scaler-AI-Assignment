export const getProducts = () => async (dispatch) => {
  try {
    const response = await fetch("/api/getProducts");
    const data = await response.json();

    dispatch({
      type: "GET_PRODUCTS_SUCCESS",
      payload: data
    });

  } catch (error) {
    console.error("Error fetching products:", error);
  }
};