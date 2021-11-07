import {
     GET_CURRENT_AUTHORIZE
} from "../actions/types";

const initialState = {
    userauth : {}
};
export default function(state = initialState, action) {
    switch (action.type) {
        
        case GET_CURRENT_AUTHORIZE:
            return {
                ...state,
                userauth: action.payload,
            };
        
        default:
            return state;
    }
}
