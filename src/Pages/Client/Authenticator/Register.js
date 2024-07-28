import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageUploadComponent from '../../../Components/ImageUpload/ImageUpload';

export default function Register() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleCofirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div>
            <div className="container-xxl py-5 bg-dark hero-header mb-5">
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card rounded-3 shadow d-flex flex-row">
                            <div className="col-md-12 p-3">
                                <div className="card-body">
                                    <form>
                                        <h2 className="text-center mb-4">Đăng ký tài khoản thành viên</h2>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="fullname" className="form-label">Họ và Tên</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-user" aria-hidden="true"></i>
                                                        </span>
                                                        <input type="text" className="form-control" id="fullname" placeholder="Nhập họ và tên" required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="email" className="form-label">Email</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                                        </span>
                                                        <input type="email" className="form-control" id="email" placeholder="Nhập Email" required />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="avatar-upload" className="form-label">Ảnh đại diện</label>
                                            <div className="input-group">
                                                <ImageUploadComponent id="avatar-upload" />
                                            </div>
                                        </div>


                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="tel" className="form-label">Số điện thoại</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-phone" aria-hidden="true"></i>
                                                        </span>
                                                        <input type="tel" className="form-control" id="tel" placeholder="Nhập số điện thoại" required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="address" className="form-label">Địa chỉ</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-home" aria-hidden="true"></i>
                                                        </span>
                                                        <input type="text" className="form-control" id="address" placeholder="Nhập địa chỉ" required />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-lock" aria-hidden="true"></i>
                                                        </span>
                                                        <input
                                                            type={passwordVisible ? 'text' : 'password'}
                                                            className="form-control"
                                                            id="newPassword"
                                                            placeholder="Nhập mật khẩu mới"
                                                            required
                                                        />
                                                        <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                                            <i className={passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="confirm-password" className="form-label">Xác nhận mật khẩu</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-lock" aria-hidden="true"></i>
                                                        </span>
                                                        <input
                                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                                            className="form-control"
                                                            id="newPassword"
                                                            placeholder="Nhập mật khẩu xác nhận"
                                                            required
                                                        />
                                                        <span className="input-group-text" onClick={toggleCofirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                                                            <i className={confirmPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-primary btn-block rounded-pill">Đăng ký</button>
                                        </div>

                                        <div className="text-center mt-4">
                                            <Link to="/login" className="link-primary me-3">
                                                <i className="fa-solid fa-arrow-left ms-2"></i> Trở lại
                                            </Link>
                                            <Link to="/Login" className="link-primary">
                                                Bạn đã có tài khoản?
                                                <i className="fa fa-long-arrow-right ms-2" aria-hidden="true"></i>
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
