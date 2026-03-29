const initialState = {
  products: []
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {

    case "GET_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload
      };

    default:
      return state;
  }
};

export default productReducer;