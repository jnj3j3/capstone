import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <header className="container-fluid bg-light py-3">
      <div className="row align-items-center">
        <div className="col-2"></div>
        <div className="col-8 d-flex justify-content-between align-items-center">
          <div className="fw-bold fs-4">자릿세</div>
          <div className="input-group w-50">
            <span className="input-group-text">⌕</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for tickets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <a href="/login" className="me-3 text-decoration-none">Login</a>
            <a href="/mypage" className="text-decoration-none">My Page</a>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </header>
  );
};

export default Header;
