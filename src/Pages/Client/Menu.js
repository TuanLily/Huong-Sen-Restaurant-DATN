import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductCategory } from '../../Actions/ProductCategoryActions';
import { fetchProduct } from '../../Actions/ProductActions';

export default function Menu() {
  const dispatch = useDispatch();
  const productCategoryState = useSelector(state => state.product_category);
  const productState = useSelector(state => state.product);

  useEffect(() => {
    dispatch(fetchProductCategory());
    dispatch(fetchProduct());
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const listProduct = (category_id) => {
    return productState.product.filter(product => product.categories_id === category_id);
  };

  
  return (
    <div>
      <div className="container-xxl py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Thực Đơn</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item"><a href="#">Trang Chủ</a></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Thực Đơn</li>
            </ol>
          </nav>
        </div>
      </div>

      {productCategoryState.loading && (
        <div>Loading...</div> 
      )}
      {!productCategoryState.loading && productCategoryState.product_category.length === 0 && (
        <div>No categories found.</div> 
      )}
      {productCategoryState.error && (
        <div>Error: {productCategoryState.error}</div> 
      )}
      {productCategoryState.product_category && productCategoryState.product_category.map((item, index) => {
        const productsInCategory = listProduct(item.id);
        if (productsInCategory.length == 0) return null;
        return (
          <div className="container-xxl py-5" key={item.id}>
            <div className="container">
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                <h1 className="mb-5">{item.name}</h1>
              </div>

              <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
                <div className="tab-content">
                  <div id="tab-1" className="tab-pane fade show p-0 active">
                    <div className="row g-4">
                      {productsInCategory.map((product) => (
                        <div className="col-lg-6" key={product.id}>
                          <div className="d-flex align-items-center">
                            <img className="flex-shrink-0 img-fluid rounded" src={product.image} alt="" style={{ width: "80px" }} />
                            <div className="w-100 d-flex flex-column text-start ps-4">
                              <h5 className="d-flex justify-content-between border-bottom pb-2">
                                <span>{product.name}</span>
                                <span className="text-primary">{formatPrice(product.sale_price)}</span>
                              </h5>
                              <div className="d-flex justify-content-between">
                                <small className="fst-italic">{product.description}</small>
                                <span className="text-danger text-decoration-line-through">{formatPrice(product.price)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
