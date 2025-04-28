import React, { useEffect, useState } from "react";
import "./css/searchCard.css";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const visiblePageCount = 6;

const SearchCard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketList, setTicketList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const groupSize = visiblePageCount;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);
  const paginationArr = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePreviousGroup = () => {
    if (startPage > 1) {
      setCurrentPage(startPage - 1);
    }
  };

  const handleNextGroup = () => {
    if (endPage < totalPages) {
      setCurrentPage(endPage + 1);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://100.106.99.20:3000/ticket/pageNationg/${currentPage}/6`,
          {
            params: {
              searchQuery: searchQuery,
            },
          }
        );

        const { count, rows } = res.data;
        setTotalPages(Math.ceil(count / 6));
        setTicketList(
          rows.map((item) => ({
            id: item.id,
            name: item.name,
            time: new Date(item.created).toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            }),
            img: `data:image/jpeg;base64,${arrayBufferToBase64(
              item.image.data
            )}`,
            price: item.price.toLocaleString(),
          }))
        );
      } catch (err) {
        console.error("에러 발생:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentPage, searchQuery]);

  return (
    <div className="searchMain">
      <div className="searchBody">
        {loading ? (
          <div className="spinner-border text-dark" role="status"></div>
        ) : (
          <div className="cardBody">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {ticketList.map((ticket, idx) => (
                <div
                  className="col"
                  key={idx}
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <div className="card ticketCard">
                    <img src={ticket.img} className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{ticket.name}</h5>
                      <p className="card-text">{ticket.time}</p>
                      <p className="card-text">{ticket.price}원</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="paginationMain">
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${startPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePreviousGroup}
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
                onClick={handleNextGroup}
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
