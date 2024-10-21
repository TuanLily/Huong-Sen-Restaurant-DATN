import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchReservations, updateReservations, setCurrentPage } from '../../Actions/MyBookingActions';
import DialogConfirm from '../../Components/Dialog/Dialog';
import CustomPagination from '../../Components/Pagination/CustomPagination';
import SpinnerSink from '../../Components/Client/SniperSink';
import { SuccessAlert } from '../../Components/Alert/Alert';
import { jwtDecode as jwt_decode } from 'jwt-decode';

export default function MyBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [nameSearch, setNameSearch] = useState('');

  const handleNameSearch = (event) => {
    setNameSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const [emailSearch, setEmailSearch] = useState('');

  const handleEmailSearch = (event) => {
    setEmailSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const [phoneSearch, setPhoneSearch] = useState('');

  const handlePhoneSearch = (event) => {
    setPhoneSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const [statusSearch, setStatusSearch] = useState('');

  const handleStatusSearch = (event) => {
    setStatusSearch(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const reservationState = useSelector(state => state.my_booking);

  const query = new URLSearchParams(location.search);
  const urlPage = parseInt(query.get('page')) || 1;

  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Lấy accessToken từ localStorage và decode ra user_id
  const getUserIdFromToken = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.id; // Trả về user_id từ token
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const userIdFromToken = getUserIdFromToken();
    if (userIdFromToken) {
      dispatch(fetchReservations(userIdFromToken , nameSearch , phoneSearch , emailSearch , statusSearch , urlPage, reservationState.pageSize));
    }
  }, [dispatch, urlPage, reservationState.pageSize, nameSearch, phoneSearch, emailSearch, statusSearch]);

  useEffect(() => {
    navigate(`?page=${reservationState.currentPage}`);
  }, [reservationState.currentPage, navigate]);

  const handleClickOpen = (id) => {
    setSelectedReservation(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  const handleSuccessClose = () => {
    setOpenSuccess(false);
  };

  const handleUpdateStatus = async (st) => {
    const userIdFromToken = getUserIdFromToken();
    if (selectedReservation && userIdFromToken) {
      try {
        await dispatch(updateReservations(selectedReservation, {status: st}, userIdFromToken, nameSearch, phoneSearch, emailSearch, statusSearch, urlPage, reservationState.pageSize));
        handleClose();
        setOpenSuccess(true); // Hiển thị thông báo thành công
      } catch (error) {
        console.error("Error update reservations:", error);
      }
    }
  };

  const handleDetail = (id) => {
    navigate(`detail/${id}`);
  };

  const formatCurrency = (value) => {
    return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
  };

  const handlePageChange = (page) => {
    navigate(`?page=${page}`); // Cập nhật URL với page
    const userIdFromToken = getUserIdFromToken();
    if (userIdFromToken) {
      dispatch(setCurrentPage(page)); // Cập nhật trang hiện tại trong state
      dispatch(fetchReservations(userIdFromToken , nameSearch , phoneSearch , emailSearch , statusSearch , page, reservationState.pageSize));
    }
  };

  const statusMapping = {
    1: { text: 'Chờ thanh toán cọc', class: 'badge bg-warning' },    
    2: { text: 'Hết hạn thanh toán cọc', class: 'badge bg-info' },
    3: { text: 'Đã thanh toán cọc', class: 'badge bg-primary' },     
    0: { text: 'Hủy đơn', class: 'badge bg-danger' },             
    4: { text: 'Chờ thanh toán toàn bộ đơn', class: 'badge bg-success' },
    5: { text: 'Hoàn thành đơn', class: 'badge bg-secondary' }       
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="py-5 bg-dark hero-header mb-3">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
              Lịch sử đặt bàn
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
            <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item text-white active" aria-current="page">
                Lịch sử
            </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Search Filters */}
      <div className="container mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row g-3">  
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Tìm theo tên" value={nameSearch} onChange={handleNameSearch} />
              </div>               
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Tìm theo email" value={emailSearch} onChange={handleEmailSearch} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Tìm theo số điện thoại" value={phoneSearch} onChange={handlePhoneSearch} />
              </div>
              <div className="col-md-3">
                <select className="form-control mr-2" value={statusSearch} onChange={handleStatusSearch}>
                  <option value="">Trạng thái</option>
                  <option value="0">Đã hủy</option>
                  <option value="1">Chờ thanh toán cọc</option>
                  <option value="2">Hết hạn thanh toán cọc</option>
                  <option value="3">Đã thanh toán cọc</option>
                  <option value="4">Chờ thanh toán toàn bộ đơn</option>
                  <option value="5">Hoàn thành đơn</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="container">
        {reservationState.loading && (
          <div><SpinnerSink/></div>
        )}
        {!getUserIdFromToken() ? (
          <div className="text-center">Bạn chưa đăng nhập!</div>
          ) : (
          <>
            {!reservationState.loading && reservationState.reservation.length === 0 && (
              <div className='text-center'>Không tìm thấy danh sách nào!</div>
            )}
            {reservationState.reservation && reservationState.reservation.map((booking, index) => {
              const statusInfo = statusMapping[booking.status] || { text: 'Không xác định', class: 'badge-secondary' };
              return (
                <div className="card mb-3 shadow-sm" key={booking.id}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{booking.fullname}</span>
                    <span className={`badge ${statusInfo.class} fs-6`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8 col-sm-12 d-flex flex-wrap" style={{ gap: '10px' }}>
                        <div style={{ flex: '1 1 30%' }}>
                          <p className="mb-2">
                            <strong>Email:</strong> {booking.email}
                          </p>
                          <p className="mb-2">
                            <strong>Mã hóa đơn:</strong> {booking.reservation_code ? booking.reservation_code : 'Chưa rõ'}
                          </p>
                        </div>
                        <div style={{ flex: '1 1 30%' }}>
                          <p className="mb-2">
                            <strong>Số điện thoại:</strong> {booking.tel}
                          </p>
                          <p className="mb-2">
                            <strong>Số người:</strong> {booking.party_size}
                          </p>
                        </div>
                        <div style={{ flex: '1 1 30%' }}>
                          <p className="mb-2">
                            <strong>Ngày đặt:</strong> {booking.created_at.substring(0, 10)}
                          </p>
                          <p className="mb-2">
                            <strong>Số bàn:</strong> {booking.tableName ? booking.tableName : 'Chưa có'}
                          </p>
                        </div>
                      </div>

                      {/* Payment Info and Action Button */}
                      <div className="col-md-4 col-sm-12 text-md-end text-left mt-3 mt-md-0">
                        <p className="mb-2">
                          <strong>Số tiền còn lại:</strong> {formatCurrency(booking.total_amount ? booking.deposit ? booking.total_amount - booking.deposit : booking.total_amount : 0)}
                        </p>
                        <div>
                          {(statusInfo.text == 'Chờ thanh toán cọc' || statusInfo.text == 'Hết hạn thanh toán cọc') && (
                            <button className="btn btn-outline-secondary btn-sm mt-2 me-2" onClick={() => handleClickOpen(booking.id)} style={{ padding: '0.25rem 0.75rem' }}>
                              Hủy Đơn
                            </button>
                          )}
                          <button className="btn btn-outline-success btn-sm mt-2" onClick={() => handleDetail(booking.id)} style={{ padding: '0.25rem 0.75rem' }}>
                            Xem chi tiết
                          </button>
                          {(statusInfo.text === 'Chờ thanh toán cọc') && (
                            <button className="btn btn-primary btn-sm mt-2 ms-2" style={{ padding: '0.25rem 0.75rem' }}>
                              Thanh toán
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
      <div className='my-2'>
        <CustomPagination
          count={reservationState.totalPages} // Tổng số trang
          currentPageSelector={state => state.my_booking.currentPage} // Selector để lấy trang hiện tại
          fetchAction={(page, pageSize) => fetchReservations(getUserIdFromToken() , nameSearch , phoneSearch , emailSearch , statusSearch , page , pageSize)} // Hàm fetch dữ liệu
          onPageChange={handlePageChange} 
        />
      </div>
      <SuccessAlert open={openSuccess} onClose={handleSuccessClose} message="Thao tác thành công!" />
      <DialogConfirm open={open} onClose={handleClose} onConfirm={() => handleUpdateStatus(0)} />
    </div>
  );
}
