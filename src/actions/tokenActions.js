import axios from "axios";
import {
    GET_ERRORS,
    TOKEN_ADD,
    TOKEN_UPDATE,
    GET_TOTAL_INFO,
    GET_CURRENT_PRICE
} from "./types";

import {SERVER_MAIN_URL} from '../config'

export const addToken = (tokenData) => dispatch => {
    axios
        .post(`${SERVER_MAIN_URL}/record/tokenAdd`, tokenData)
        .then(res =>{
            dispatch({
                type: TOKEN_ADD,
                payload: res,
            });
            window.location.href = '/tokens'
        }
            
        ).catch(err =>{
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
            alert('Token has some problems. So, you failed to save your token.')
        }
        
    );
};


export const updateToken = (tokenData) => dispatch => {
    axios
        .post(`${SERVER_MAIN_URL}/record/tokenUpdate`, tokenData)
        .then(res =>
            dispatch({
                type: TOKEN_UPDATE,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

export const getTotalInfo = () => dispatch => {
    axios
        .get(`${SERVER_MAIN_URL}/gettotalbalance`)
        .then(res =>
            dispatch({
                type: GET_TOTAL_INFO,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

