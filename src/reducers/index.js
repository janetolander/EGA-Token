import { combineReducers } from "redux";
import authReducer from "./authReducers";
import tokenReducer from "./tokenReducers";
import tokenPriceReducer from "./tokenPriceReducers";
import errorReducer from "./errorReducers";
import authorizeReducers from "./authorizeReducers";
export default combineReducers({
    auth: authReducer,
    token: tokenReducer,
    tokenprice: tokenPriceReducer,
    userauth : authorizeReducers,
    errors: errorReducer
});