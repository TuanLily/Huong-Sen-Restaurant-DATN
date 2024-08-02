import axios from "axios";

export const FETCH_PRODUCT_REQUEST = 'FETCH_PRODUCT_REQUEST';
export const FETCH_PRODUCT_SUCCESS = 'FETCH_PRODUCT_SUCCESS';
export const FETCH_PRODUCT_FAILURE = 'FETCH_PRODUCT_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";

export const fetchProductRequest = () => ({
    type: FETCH_PRODUCT_REQUEST
});

export const fetchProductSuccess = product => ({
    type: FETCH_PRODUCT_SUCCESS,
    payload: product
});

export const fetchProductFailure = error => ({
    type: FETCH_PRODUCT_FAILURE,
    payload: error
});

export const fetchProduct = () => {
    return dispatch => {
        dispatch(fetchProductRequest());
        axios.get(`${API_ENDPOINT}/${API_DATA.product}`)
            .then(response => {
                const product = response.data.results;
                dispatch(fetchProductSuccess(product));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchProductFailure(errorMsg));
            });
    };
};