import {
    GET_TOTAL_INFO,
    TOKEN_ADD,
    TOKEN_UPDATE,
    GET_CURRENT_PRICE
} from "../actions/types";

const initialState = {
    isGetInfo: false,
    tokenprice : {}
};
export default function(state = initialState, action) {
    switch (action.type) {
        case TOKEN_ADD:
            return {
                token: action.payload
            };
        case TOKEN_UPDATE:
            return {
                token: action.payload,
            };
        case GET_TOTAL_INFO:
            return {
                ...state,
                isGetInfo:true,
                token: action.payload,
            };
        case GET_CURRENT_PRICE:
            return {
                ...state,
                tokenprice: action.payload,
            };
        
        default:
            return state;
    }
}
