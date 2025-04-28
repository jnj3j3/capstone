import React, { useRef, useState, useEffect, use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import Ticket from "../../public/class/ticketClass";
import "./css/myCard.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchWithAutoRefresh } from "../../public/function/tokenFun";
import { deleteAccount, cancelReserve } from "./myCartdFun";
import { Buffer } from "buffer";
import { useAuth } from "../../public/function/authContext";
const MyCard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [ticketList, setTicketList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoggedIn } = useAuth();
  const deleteAccountHandler = async () => {
    const isConfirmed = await deleteAccount();
    if (isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account deleted successfully.",
      }).then(() => {
        setIsLoggedIn(false);
        navigate("/login");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete account.",
      });
    }
  };
  const cancelReserveHandler = async (reserveId) => {
    const isConfirmed = await cancelReserve(reserveId);
    if (isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ticket canceled successfully.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to cancel ticket.",
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!userName || isLoggedIn == "false") {
        localStorage.removeItem("name");
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User not found! Please log in first.",
        }).then(() => {
          navigate("/login");
        });
        return;
      }

      try {
        const response = await fetchWithAutoRefresh(() =>
          axios.get("http://100.106.99.20:3000/reserve/getReserveList", {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            },
          })
        );

        if (!response || !response.data) {
          navigate("/login");
          return;
        }

        const ticketList = response.data.map((ticket) => {
          const imageBuffer = ticket.TicketSeat.Ticket.image?.data;
          let img = "";
          if (imageBuffer) {
            const base64Image = Buffer.from(imageBuffer).toString("base64");
            img = `data:image/jpeg;base64,${base64Image}`;
          }
          const startDt = new Date(ticket.TicketSeat.Ticket.startDate);
          const endDt = new Date(ticket.TicketSeat.Ticket.endDate);
          const when = new Date(ticket.TicketSeat.Ticket.when);
          const whenDate = when.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });
          const startDate = startDt.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });
          const endDate = endDt.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });
          return new Ticket(
            ticket.TicketSeat.Ticket.id,
            ticket.TicketSeat.Ticket.name,
            ticket.TicketSeat.seatNumber,
            img,
            startDate,
            endDate,
            ticket.TicketSeat.Ticket.price,
            whenDate
          );
        });
        setTicketList(ticketList);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch ticket data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cardMain">
      <div className="card">
        <h5 className="card-header">User Info</h5>
        <div className="card-body cardBodyInfo">
          <h5 className="card-title userName">{userName}</h5>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={deleteAccountHandler}
          >
            Delete Account
          </button>
        </div>
        <ul className="list-group listGroupInfo">
          <h5 className="card-title">Ticket wallet</h5>
          <li className="list-group-item" style={{ height: "100%" }}>
            {isLoading ? (
              <div className="ranking-card">
                <div className="spinner-border text-dark" role="status"></div>
              </div>
            ) : ticketList.length > 0 ? (
              <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper ticketWallet"
              >
                {ticketList.map((ticket, idx) => (
                  <SwiperSlide className="swiperSlider ticketWallet" key={idx}>
                    <div className="card ticketCard">
                      <img
                        src={ticket.img}
                        className="card-img-top"
                        alt="..."
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                      />
                      <div className="card-body ticketCardBody">
                        <h3 className="card-title">{ticket.name}</h3>
                        <div className="walletInfo">{ticket.when}</div>
                        <div className="walletInfo">
                          seatNumber :{" "}
                          <span className="seatHighlight">{ticket.seat}</span>
                        </div>
                        <div className="walletInfo">
                          {ticket.price.toLocaleString()}원
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => cancelReserveHandler(ticket.id)}
                        >
                          Cancel Ticket
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="noTicketBody">
                <div className="custom-alert-container">
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle"> </i>
                    현재 보유한 티켓이 없습니다!
                  </div>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyCard;
