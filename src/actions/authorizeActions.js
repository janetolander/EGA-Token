import axios from "axios";
import {
    GET_ERRORS,
    GET_CURRENT_AUTHORIZE
} from "./types";

import {SERVER_MAIN_URL} from '../config'

export const getCurrentAuthorize = (userID) => dispatch => {
    axios
        .get(`${SERVER_MAIN_URL}/adminauth/${userID}`)
        .then(res =>
            dispatch({
                type: GET_CURRENT_AUTHORIZE,
                payload: res,
            })   
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
