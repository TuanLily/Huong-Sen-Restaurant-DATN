import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromotion } from "../../Actions/PromotionActions";
import { addNewReservation } from "../../Actions/ReservationActions";
import { addNewReservationDetail } from "../../Actions/Reservation_detailActions";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export default function Pay() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const promotions = useSelector((state) => state.promotion.promotion);

  const [customerInfo, setCustomerInfo] = useState({
    fullname: "",
    email: "",
    tel: "",
    reservation_date: "",
    party_size: "",
    note: "",
    status: 1,
  });

  const [selectedProducts, setSelectedProducts] = useState({});
  const [voucherCode, setVoucherCode] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  

  useEffect(() => {
    const savedCustomerInfo = localStorage.getItem("customerInfo");
    if (savedCustomerInfo) {
      setCustomerInfo(JSON.parse(savedCustomerInfo));
    }

    const savedProducts = localStorage.getItem("selectedProducts");
    if (savedProducts) {
      setSelectedProducts(JSON.parse(savedProducts));
    }

    setOrderId(generateOrderId());
    setTableNumber(assignTable(customerInfo.party_size));
  }, [customerInfo.party_size]);

  useEffect(() => {
    dispatch(fetchPromotion());
  }, [dispatch]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatTime = (datetime) => {
    return new Date(datetime).toLocaleString("vi-VN");
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedProducts).reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const generateOrderId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `HS-${randomNumber}`;
  };

  const calculateFinalTotal = (total) => {
    const discountAmount = (total * discount) / 100;
    const tax = total * 0.1;
    return {
      discountedTotal: total - discountAmount,
      finalTotal: total - discountAmount + tax,
    };
  };

  const assignTable = (party_size) => {
    if (party_size <= 2) {
      return "02";
    } else if (party_size <= 4) {
      return "04";
    } else {
      return "Bàn tiệc";
    }
  };

  const total_amount = calculateTotalPrice();
  const { discountedTotal, finalTotal } = calculateFinalTotal(total_amount);

  const applyVoucher = (codeToApply) => {
    const promotion = promotions.find(
      (promo) =>
        promo.code_name.toLowerCase() === codeToApply.toLowerCase() &&
        promo.quantity > 0 &&
        new Date(promo.valid_to) >= new Date()
    );

    if (promotion) {
      setDiscount(promotion.discount);
      setSelectedPromotion(promotion.id);
      // Lưu id của khuyến mãi
      if (voucherCode) {
        setSelectedPromotion("");
      }
    } else {
      setDiscount(0);
      alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handlePromotionSelect = (selectedCode) => {
    setSelectedPromotion(selectedCode);
    if (selectedCode) {
      applyVoucher(selectedCode);
      setVoucherCode("");
    } else {
      setSelectedPromotion(""); // Đặt lại id nếu không có khuyến mãi được chọn
    }
  };

  const validPromotions = promotions.filter(
    (promo) => new Date(promo.valid_to) >= new Date() && promo.quantity > 0
  );

  const handleCompleteBooking = async () => {
    try {
      // Tính toán tiền cọc (30% của tổng giá tiền)
      const depositAmount = finalTotal * 0.3;
  
      // Tạo dữ liệu đơn hàng để gửi lên server
      const orderData = {
        ...customerInfo,
        total_amount: finalTotal,
        discount,
        promotion_id: selectedPromotion || null,
        deposit: depositAmount, // Thêm tiền cọc vào dữ liệu
      };
  
      // Gửi dữ liệu đặt bàn lên server
      const reservation = await dispatch(addNewReservation(orderData));
  
      // Gửi chi tiết đơn đặt hàng
      await Promise.all(
        Object.values(selectedProducts).map((product) => {
          const reservationDetail = {
            reservation_id: reservation.id,
            product_id: product.id,
            quantity: product.quantity,
            price: product.price,
          };
          return dispatch(addNewReservationDetail(reservationDetail));
        })
      );
  
      // Sau khi gửi dữ liệu thành công, xóa dữ liệu trong localStorage
      localStorage.clear(); // Hoặc xóa các key cụ thể như localStorage.removeItem('selectedProducts');
  
      // Tạo yêu cầu thanh toán MOMO
      const momoResponse = await axios.post('http://localhost:6969/api/public/payment', {
        reservationId: reservation.id,
        amount: depositAmount, // Gửi tiền cọc để thanh toán
      });
  
      if (momoResponse.data && momoResponse.data.payUrl) {
        // Điều hướng người dùng đến URL thanh toán MOMO
        window.location.href = momoResponse.data.payUrl;
      }
  
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng, vui lòng thử lại.");
    }
  };
  
  

  return (
    <div>
      {/* Page Header */}
      <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Đặt bàn online
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <a href="/">Trang chủ</a>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Đặt bàn
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Customer and Order Details */}
      <div
        className="container-xxl py-5 px-0 wow fadeInUp mx-auto"
        data-wow-delay="0.1s"
        style={{ maxWidth: "1200px" }}
      >
        <div className="row justify-content-center">
          {/* Customer Information */}
          <div className="col-md-6">
            <div className="p-4 bg-white shadow-sm mb-3">
              <h2 className="text-warning fw-bold ff-secondary">
                Thông tin khách hàng
              </h2>
              <p className="mb-0 fw-bold">Họ tên: {customerInfo.fullname}</p>
              <p className="mb-0 fw-bold">Email: {customerInfo.email}</p>
              <p className="mb-0 fw-bold">Số điện thoại: {customerInfo.tel}</p>
            </div>
          </div>

          {/* Order Information */}
          <div className="col-md-6">
            <div className="p-4 bg-white shadow-sm mb-3">
              <h2 className="text-warning fw-bold ff-secondary">
                Thông tin đơn đặt bàn
              </h2>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <p className="mb-0 fw-bold">Mã đơn: {orderId}</p>
                <p className="mb-0 fw-bold text-end">
                  Thời gian dùng bữa:{" "}
                  {formatTime(customerInfo.reservation_date)}
                </p>
              </div>
              <p className="mb-0 fw-bold">Bàn số: {tableNumber}</p>
              <p className="mb-0 fw-bold">
                Số người: {customerInfo.party_size} người
              </p>
            </div>
          </div>
        </div>

        {/* Selected Products */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h5 className="text-warning fw-bold mb-3">
              Đơn hàng ({Object.keys(selectedProducts).length} sản phẩm)
            </h5>
            <hr />
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              {Object.values(selectedProducts).map((product) => (
                <div key={product.id} className="bg-white shadow-sm mb-2 p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          product.image ||
                          "../../Assets/Client/Images/placeholder.png"
                        }
                        alt={product.name}
                        className="me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      <div className="d-flex flex-column">
                        <span className="fw-bold">{product.name}</span>
                        <div className="d-flex align-items-center mt-1">
                          <span
                            className="badge bg-warning rounded-circle"
                            style={{ marginRight: "8px" }}
                          >
                            {product.quantity}
                          </span>
                          <span style={{ color: "#ff9f1a" }}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-4">
            <div className="bg-white shadow-sm p-4">
              <h5 className="text-warning fw-bold">Tóm tắt đơn hàng</h5>
              {/* Input for manual voucher code */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã giảm giá"
                  aria-label="Voucher Code"
                  aria-describedby="apply-voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => applyVoucher(voucherCode)}
                >
                  Áp dụng
                </button>
              </div>
              {/* Dropdown select for available promotions */}
              <div className="mb-3">
                {validPromotions.length > 0 ? (
                  <select
                    className="form-select"
                    value={selectedPromotion}
                    onChange={(e) => handlePromotionSelect(e.target.value)}
                  >
                    <option value="">Chọn mã khuyến mãi</option>
                    {validPromotions.map((promotion) => (
                      <option key={promotion.id} value={promotion.code_name}>
                        {promotion.code_name} ({promotion.discount}%)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>Không có khuyến mãi hiện tại.</p>
                )}
              </div>
              {/* Order total */}
              <div className="d-flex justify-content-between align-items-center">
                <span>Tổng tiền:</span>
                <span>{formatPrice(total_amount)}</span>
              </div>
              {/* Discount */}
              <div className="d-flex justify-content-between align-items-center">
                <span>Giảm giá:</span>
                <span>{formatPrice(total_amount * (discount / 100))}</span>
              </div>
              {/* Tax */}
              <div className="d-flex justify-content-between align-items-center">
                <span>Thuế:</span>
                <span>{formatPrice(total_amount * 0.1)}</span>
              </div>
              <hr />
              {/* Payment Method */}
              <label className="d-flex justify-content-between fw-bold">
                Phương thức thanh toán
              </label>
              <input type="radio" name="payment-method" /> Thanh toán 30% hóa
              đơn <br />
              <hr />
              <input type="radio" name="payment-method" /> Thanh toán chuyển
              khoản <br />
              <hr />
              {/* Final total */}
              <div className="d-flex justify-content-between align-items-center">
                <span>Tổng thanh toán:</span>
                <span className="fw-bold">{formatPrice(finalTotal)}</span>
              </div>
              {/* Buttons for confirmation and going back */}
              <div className="d-flex justify-content-between mt-3">
                <NavLink to="/order" className="w-30">
                  <button className="btn btn-secondary w-100">Trở lại</button>
                </NavLink>
                <button
                  className="btn btn-primary w-70"
                  onClick={handleCompleteBooking}
                >
                  Xác nhận đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
