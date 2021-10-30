import { combineReducers } from "redux";
import authReducer from "./authReducers";
import tokenReducer from "./tokenReducers";
import tokenPriceReducer from "./tokenPriceReducers";
import errorReducer from "./errorReducers";
export default combineReducers({
    auth: authReducer,
    token: tokenReducer,
    tokenprice: tokenPriceReducer,
    errors: errorReducer
});