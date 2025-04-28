import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/seat.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { fetchWithAutoRefresh } from "../../../public/function/tokenFun";
const Seat = () => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [reservedSeats, setReservedSeats] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await axios.get(
          "http://100.106.99.20:3000/ticket/ticketSeat/16"
        );
        const data = res.data;
        if (data.image && data.image.data) {
          const base64String = btoa(
            new Uint8Array(data.image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          data.image = `data:image/jpeg;base64,${base64String}`;
        }

        if (data.when)
          data.when = new Date(data.when).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });
        setTicket(data);

        const reserved = new Set(
          data.ticketSeats
            .filter((seat) => seat.state !== "available")
            .map((seat) => seat.seatNumber)
        );
        setReservedSeats(reserved);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, []);

  const toggleSeat = (seatNumber) => {
    if (reservedSeats.has(seatNumber)) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatNumber);
      if (!isSelected && prev.length >= 3) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Up to 3 seats can be reserved",
        });
        return prev;
      }
      if (isSelected) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };
  const handleConfirm = async () => {
    console.log("aaaaaaaaaaaaaaaaa");
    if (selectedSeats.length === 0) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Token is missing!",
      });
      navigate("/login");
      return;
    }
    try {
      const res = await fetchWithAutoRefresh(() =>
        axios.post(
          "http://100.106.99.20:3000/reserve/reserveTicket/16",
          { seatNumber: selectedSeats },
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });
      navigate("/");
      return;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error occurred while reserving ticket! Please log in again.",
      }).then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("name");
        navigate("/login");
      });
    }
  };
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!ticket) {
    return (
      <div className="text-center mt-5">티켓 정보를 불러오지 못했습니다.</div>
    );
  }

  const seatRows = {};
  ticket.ticketSeats.forEach((seat) => {
    const row = seat.seatNumber.charAt(0);
    if (!seatRows[row]) seatRows[row] = [];
    seatRows[row].push(seat);
  });

  Object.values(seatRows).forEach((seats) => {
    seats.sort((a, b) => {
      const numA = parseInt(a.seatNumber.slice(1));
      const numB = parseInt(b.seatNumber.slice(1));
      return numA - numB;
    });
  });

  return (
    <div className="seatMain">
      <div className="reservationBanner">Reservation</div>

      <div className="row w-100 seatBody">
        <div className="col-2 d-flex justify-content-center align-items-start">
          <div className="seatTicket d-flex justify-content-center align-items-center">
            <div className="card ticketCard">
              <img src={ticket.image} className="card-img-top" alt="ticket" />
              <div className="card-body text-center">
                <h5 className="card-title">{ticket.name}</h5>
                <p className="card-text">{ticket.when}</p>
                <p className="card-text">{ticket.price.toLocaleString()} 원</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-8 d-flex align-items-center">
          <div className="seat-container">
            <div className="seat-width">
              <div className="seat-layout">
                <button className="seat reserved screen">SCREEN</button>
                {Object.entries(seatRows).map(([row, seats]) => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>
                    {seats.map((seat) => {
                      const isSelected = selectedSeats.includes(
                        seat.seatNumber
                      );
                      const isReserved = reservedSeats.has(seat.seatNumber);
                      return (
                        <button
                          key={seat.id}
                          className={`seat ${isSelected ? "selected" : ""} ${
                            isReserved ? "reserved" : ""
                          }`}
                          onClick={() => toggleSeat(seat.seatNumber)}
                          disabled={isReserved}
                        >
                          {seat.seatNumber.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="seat-info">
              <h3>Selected Seat</h3>
              <p>Up to 3 seats can be reserved</p>
              {selectedSeats.length === 0 ? (
                <p>Select your seats</p>
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
                onClick={handleConfirm}
              >
                confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seat;
