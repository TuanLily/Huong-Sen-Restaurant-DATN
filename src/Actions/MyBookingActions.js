export const FETCH_RESERVATIONS_REQUEST = 'FETCH_RESERVATIONS_REQUEST';
export const FETCH_RESERVATIONS_SUCCESS = 'FETCH_RESERVATIONS_SUCCESS';
export const FETCH_RESERVATIONS_FAILURE = 'FETCH_RESERVATIONS_FAILURE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

import { API_DATA, API_ENDPOINT } from "../Config/Client/APIs";
import http from "../Utils/Http";

export const fetchReservationsRequest = () => ({
    type: FETCH_RESERVATIONS_REQUEST
});

export const fetchReservationsSuccess = (results, totalCount, totalPages, currentPage) => ({
    type: FETCH_RESERVATIONS_SUCCESS,
    payload: {
        results,
        totalCount,
        totalPages,
        currentPage
    }
});

export const fetchReservationsFailure = error => ({
    type: FETCH_RESERVATIONS_FAILURE,
    payload: error
});

export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page
});

// Lấy dữ liệu
export const fetchReservations = (user_id , fullname = '', tel = '', email = '', status = '', page = 1, pageSize = 10) => {
    return dispatch => {
        dispatch(fetchReservationsRequest());
        const url = new URL(`${API_ENDPOINT}${API_DATA.reservations_client}${API_DATA.myBooking}/${user_id}`);

        // Thêm tham số tìm kiếm nếu có
        if (fullname) {
            url.searchParams.append('searchName', fullname);
        }
        if (tel) {
            url.searchParams.append('searchPhone', tel);
        }
        if (email) {
            url.searchParams.append('searchEmail', email);
        }
        if (status) {
            url.searchParams.append('status', status);
        }
        // Thêm tham số phân trang
        url.searchParams.append('page', page);
        url.searchParams.append('pageSize', pageSize);

        http.get(url.toString())
            .then(response => {
                const { results, totalCount, totalPages, currentPage } = response.data;
                // Dispatch action để cập nhật dữ liệu
                dispatch(fetchReservationsSuccess(results, totalCount, totalPages, currentPage));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchReservationsFailure(errorMsg));
            });
    };
};

// Lấy reservations theo ID
export const fetchReservationsID = (id) => {
    return dispatch => {
        dispatch(fetchReservationsRequest());

        const url = new URL(`${API_ENDPOINT}${API_DATA.reservations_client}/${id}`);

        http.get(url.toString())
            .then(response => {
                const { results, totalCount, totalPages, currentPage } = response.data;
                // Dispatch action để cập nhật dữ liệu
                dispatch(fetchReservationsSuccess(results, totalCount, totalPages, currentPage));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchReservationsFailure(errorMsg));
            });
    };
};

// Cập nhật trạng thái
export const updateReservations = (id, data, user_id, fullname = '', tel = '', email = '', status = '', page = 1, pageSize = 10) => {
    return (dispatch) => {
        dispatch(fetchReservationsRequest());
        http.patch(`${API_ENDPOINT}${API_DATA.reservations_client}/${id}`, data)
            .then((response) => {
                dispatch(fetchReservations(user_id, fullname, tel, email, status, page, pageSize));
            })
            .catch((error) => {
                dispatch(fetchReservationsFailure(error.message));
            });
    };
};