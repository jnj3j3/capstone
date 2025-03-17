import React, { useState } from "react";

import Ticket from "../../public/class/ticketClass";
import img from "../../public/images/image.png";
import "./css/searchCard.css";

const ticketList = [
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
];

// 페이지네이션 개수 및 범위 설정
const totalPages = 7;
const visiblePageCount = 5; // 한 번에 보이는 페이지 개수

const SearchCard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 보이는 페이지 범위 계산
  const startPage = Math.max(1, currentPage);
  const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
  const paginationArr = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePrevious = () => {
    if (startPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (endPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="searchMain">
      <div className="searchBody">
        <div className="cardBody">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {ticketList.map((ticket, idx) => (
              <div className="col" key={idx}>
                <div className="card ticketCard">
                  <img src={ticket.img} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">{ticket.name}</h5>
                    <p className="card-text">{ticket.time}</p>
                    <p className="card-text">{ticket.price} 원</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="paginationMain">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${startPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePrevious}
                disabled={startPage === 1}
              >
                &laquo;
              </button>
            </li>

            {paginationArr.map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                endPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={handleNext}
                disabled={endPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SearchCard;
