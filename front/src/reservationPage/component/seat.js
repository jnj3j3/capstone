import React, { useState } from "react";
import img from "../../public/images/image.png";
import "./css/seat.css";
const seatRows = [
  { row: "A", seats: 8 },
  { row: "B", seats: 10 },
  { row: "C", seats: 12 },
  { row: "D", seats: 12 },
  { row: "E", seats: 12 },
];

const reservedSeats = new Set(["B-3", "C-5", "D-7"]); // 이미 예약된 좌석
const Seat = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  // 좌석 선택/해제 기능
  const toggleSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    if (reservedSeats.has(seatId)) return; // 예약된 좌석은 선택 불가

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };
  return (
    <div className="seatMain">
      <div className="reservationBanner">좌석 예약석</div>
      <div className="row seatBody">
        <div className="col-2">
          <div className="seatTicket">
            <div className="card ticketCard">
              <img src={img} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">알라딘</h5>
                <p className="card-text">2025-03-16 ~ 2025-03-25</p>
                <p className="card-text">1,670,000 원</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-10">
          <div className="seat-container">
            <div className="seat-width">
              <div className="seat-layout">
                <button className="seat  reserved screen">screen</button>
                {seatRows.map(({ row, seats }) => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>
                    {Array.from({ length: seats }, (_, col) => {
                      const seatId = `${row}-${col + 1}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isReserved = reservedSeats.has(seatId);

                      return (
                        <button
                          key={seatId}
                          className={`seat ${isSelected ? "selected" : ""} ${
                            isReserved ? "reserved" : ""
                          }`}
                          onClick={() => toggleSeat(row, col + 1)}
                          disabled={isReserved}
                        >
                          {col + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="seat-info">
              <h3>선택한 좌석</h3>
              {selectedSeats.length === 0 ? (
                <p>좌석을 선택하세요</p>
              ) : (
                <ul>
                  {selectedSeats.map((seat) => (
                    <li key={seat}>{seat}</li>
                  ))}
                </ul>
              )}
              <button
                className="confirm-button"
                disabled={selectedSeats.length === 0}
              >
                좌석 선택 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seat;
