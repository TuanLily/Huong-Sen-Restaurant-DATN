import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetailBySlug } from "../../Actions/BlogDetailActions";
import { Link, useParams } from "react-router-dom";
import { fetchBlog } from "../../Actions/BlogActions";
import unidecode from "unidecode";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Components/Client/Spinner";
import {
  addCommentBlog,
  fetchCommentBlog,
} from "../../Actions/CommentBlogActions";
import { jwtDecode as jwt_decode } from "jwt-decode";

const DetailBlog = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blogDetailState = useSelector((state) => state.blog_detail);
  const blogState = useSelector((state) => state.blog);
  const commentState = useSelector((state) => state.comment_blog);

  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newComment, setNewComment] = useState({
    content: "",
    blog_id: "",
    user_id: "",
  });
  const [filteredComments, setFilteredComments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      const userIdFromToken = decodedToken.id;
      setUserId(userIdFromToken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchBlogDetailBySlug(slug));
    dispatch(fetchBlog());
    dispatch(fetchCommentBlog());
  }, [dispatch, slug]);

  useEffect(() => {
    if (userId) {
      setNewComment((prevComment) => ({
        ...prevComment,
        user_id: userId,
      }));
    }
  }, [userId]);

  useEffect(() => {
    if (blogDetailState.blogDetail) {
      setNewComment((prevComment) => ({
        ...prevComment,
        blog_id: blogDetailState.blogDetail.id,
      }));
    }
  }, [blogDetailState.blogDetail]);

  useEffect(() => {
    const comments = commentState.commentBlog.filter(
      (comment) => comment.blog_id === blogDetailState.blogDetail?.id
    );
    setFilteredComments(comments);
  }, [commentState.commentBlog, blogDetailState.blogDetail]);

  const createSlug = (title) => {
    return unidecode(title)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleBlogClick = (title) => {
    const slug = createSlug(title);
    window.scrollTo(0, 0);
    navigate(`/blog-detail/${slug}.html`);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors

    // Kiểm tra nội dung bình luận
    if (!newComment.content.trim()) {
      setErrors({ content: "Nội dung bình luận không được để trống!" });
      return;
    }

    const commentData = {
      blog_id: newComment.blog_id,
      user_id: newComment.user_id,
      content: newComment.content,
    };

    // Gửi bình luận mới
    dispatch(addCommentBlog(commentData))
      .then(() => {
        // Thêm bình luận vào state để hiển thị ngay
        const newCommentEntry = {
          ...commentData,
          created_at: new Date().toISOString(),
          fullname: "Tên Người Dùng", // Thay thế bằng tên người dùng đã đăng nhập nếu có
          avatar: "URL Avatar", // Thay thế bằng URL của avatar người dùng nếu có
        };

        // Cập nhật danh sách bình luận
        setFilteredComments((prevComments) => [...prevComments, newCommentEntry]);
        setNewComment((prevComment) => ({ ...prevComment, content: "" })); // Reset nội dung bình luận
      })
      .catch((error) => {
        console.error("Lỗi khi thêm bình luận:", error);
        // Có thể thêm thông báo lỗi nếu cần
      });
  };

  return (
    <div>
      {/* Blog Detail UI */}
      <div className="container-fluid p-0 py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Chi Tiết Blog
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/blog">Bài viết & mẹo hay</Link>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Chi Tiết Bài Viết
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {blogDetailState.loading ? (
        <Spinner />
      ) : blogDetailState.error ? (
        <div>Error: {blogDetailState.error}</div>
      ) : blogDetailState.blogDetail ? (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-9">
              <div className="mb-5">
                <h1 className="display-4 mb-4">
                  {blogDetailState.blogDetail.title}
                </h1>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Ngày đăng:{" "}
                  {new Date(
                    blogDetailState.blogDetail.created_at
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  - Tác giả: {blogDetailState.blogDetail.author}
                </p>
              </div>
              <div className="mb-4 text-center">
                <img
                  src={blogDetailState.blogDetail.poster}
                  className="img-fluid"
                  alt={blogDetailState.blogDetail.title}
                  style={{
                    maxHeight: "500px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              </div>
              <div
                className="mb-5 blog-content"
                dangerouslySetInnerHTML={{
                  __html: blogDetailState.blogDetail.content,
                }}
              />
            </div>
          </div>

          {/* Phần bình luận của khách hàng */}
          <div className="container mt-5">
            <h3 className="text-center mb-4">Bình Luận</h3>
            <div className="comment-card" style={{ backgroundColor: "#fff" }}>
              <div className="card-body">
                {/* Hiển thị danh sách bình luận */}
                <div className="mb-4">
                  {filteredComments.length > 0 ? (
                    filteredComments.map((comment, index) => (
                      <div className="media mb-4" key={index}>
                        <div className="media-body">
                          <h6 className="mt-0 d-flex align-items-center">
                            <img
                              src={
                                comment.avatar && comment.avatar.startsWith("http")
                                  ? comment.avatar
                                  : "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-256x256-q0fen40c.png" // Hình ảnh mặc định
                              }
                              alt={comment.fullname}
                              className="comment-avatar"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                            />
                            {comment.fullname}
                          </h6>
                          <p>{comment.content}</p>
                          <small className="text-muted">
                            {new Date(comment.created_at).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có bình luận nào!</p>
                  )}
                </div>

                {/* Form gửi bình luận */}
                {isLoggedIn && (
                  <form onSubmit={handleCommentSubmit}>
                    <div className="form-group">
                      <textarea
                        className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                        rows="3"
                        placeholder="Nhập bình luận..."
                        value={newComment.content}
                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                      />
                      {errors.content && <div className="invalid-feedback ">{errors.content}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                      Gửi Bình Luận
                    </button>
                  </form>
                )}
                {!isLoggedIn && (
                  <p className="text-muted">Bạn cần đăng nhập để bình luận!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DetailBlog;
