import axios from "axios";
import {
    GET_ERRORS,
    GET_CURRENT_PRICE
} from "./types";

import {SERVER_MAIN_URL} from '../config'

export const getCurrentPrice = () => dispatch => {
    axios
        .get(`${SERVER_MAIN_URL}/egaprice`)
        .then(res =>
            axios
                .get(`${SERVER_MAIN_URL}/tokenprice`)
                .then(result => {
                    let payloadObject = {
                        prices : res.data,
                        addingValue : result.data
                    }

                    dispatch({
                        type: GET_CURRENT_PRICE,
                        payload: payloadObject,
                    })
                })
                .catch(error => 
                    dispatch({
                        type: GET_ERRORS,
                        payload: error.response.data
                    })
                )
            
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
