import React, { useEffect, useState } from "react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Buffer } from "buffer";
import axios from "axios";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./css/cardSlider.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
export default function CardSlider() {
  const navigate = useNavigate();
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTicketList = async () => {
      try {
        const response = await axios.get(
          "http://100.106.99.20:3000/ticket/pageNationg/1/5"
        );
        if (response.data == "Ticket not found") {
          setTicketList([]);
          return;
        }
        const modified = response.data.rows.map((item) => {
          const imageBuffer = item.image?.data;
          let imageSrc = "";

          if (imageBuffer) {
            const base64Image = Buffer.from(imageBuffer).toString("base64");
            imageSrc = `data:image/jpeg;base64,${base64Image}`;
          }
          const startDt = new Date(item.startDate);
          const endDt = new Date(item.endDate);
          return {
            ...item,
            image: imageSrc,
            startDate: startDt.toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            }),
            endDate: endDt.toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            }),
          };
        });
        setTicketList(modified);
      } catch (error) {
        console.error("Error fetching ticket list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketList();
  }, []);
  return (
    <>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="custom-swiper"
      >
        {loading ? (
          <SwiperSlide className="custom-swiper-slide loading">
            <div className="spinner-border text-dark" role="status"></div>
          </SwiperSlide>
        ) : ticketList.length > 0 ? (
          ticketList.map((ticket, index) => (
            <SwiperSlide
              key={index}
              className="custom-swiper-slide"
              onClick={() => navigate(`/ticket/${ticket.id}`)}
            >
              <img src={ticket.image} alt="티켓 이미지" />
              <div className="custom-info-box">
                <div className="custom-price-time">
                  <div className="custom-price">
                    <span className="custom-label">name </span>
                    <span className="custom-value">{ticket.name}</span>
                  </div>
                  <div className="custom-time">
                    <span className="custom-label">endAt </span>
                    <span className="custom-value">{ticket.endDate}</span>
                  </div>
                </div>
                <button className="custom-share-button">
                  <i className="bi bi-box-arrow-in-left"></i>
                </button>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="custom-swiper-slide">
            <div className="custom-alert-container">
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-circle"> </i>
                현재 판매 중인 표가 존재하지 않습니다!
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
}
