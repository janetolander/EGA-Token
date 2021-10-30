import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";
import {SERVER_MAIN_URL} from '../config'

export const registerUser = (userData, history) => dispatch => {
    axios
        .post(`${SERVER_MAIN_URL}/record/register`, userData)
        // .then(res => history.push("/signin"))
        .then(res => window.location.href = '/signin')
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const loginUser = userData => dispatch => {
    axios
        .post(`${SERVER_MAIN_URL}/record/login`, userData)
        .then(res => {
            console.log('response.data is ', res.data)
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            const decoded = jwt_decode(token);
            setAuthToken(token);
            dispatch(setCurrentUser(decoded));
            
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const setCurrentUser = decoded => {

    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    window.location.href = '/'
};
