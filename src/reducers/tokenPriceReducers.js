import {
     GET_CURRENT_PRICE
} from "../actions/types";

const initialState = {
    isTokenPrice:false,
    tokenprice : {}
};
export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_CURRENT_PRICE:
            return {
                ...state,
                isTokenPrice:true,
                tokenprice: action.payload,
            };
        
        default:
            return state;
    }
}
