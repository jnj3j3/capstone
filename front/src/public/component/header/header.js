import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../function/authContext";
const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };
  const searchTickets = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };
  return (
    <header className="container-fluid bg-light py-3">
      <div className="row align-items-center">
        <div className="col-2"></div>
        <div className="col-8 d-flex justify-content-between align-items-center">
          <div className="fw-bold fs-4" onClick={goHome}>
            자릿세
          </div>
          <div className="input-group w-50">
            <span className="input-group-text">⌕</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for tickets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={searchTickets}
            />
          </div>
          <div>
            {isLoggedIn ? (
              <a className="me-3 text-decoration-none" onClick={logout}>
                Logout
              </a>
            ) : (
              <a href="/login" className="me-3 text-decoration-none">
                Login
              </a>
            )}
            <a href="/mypage" className="text-decoration-none">
              My Page
            </a>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </header>
  );
};

export default Header;
