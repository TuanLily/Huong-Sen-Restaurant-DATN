import { combineReducers } from "redux";
import authReducer from "./AuthReducers";
import productCategoryReducer from "./ProductCategoryReducers";
import productReducer from "./ProductReducers";

const rootReducer = combineReducers({
    auth: authReducer,
    product: productReducer,
    product_category: productCategoryReducer
});

export default rootReducer;