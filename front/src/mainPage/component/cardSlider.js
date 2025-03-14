import React, { useRef, useState } from "react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper React components
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./css/cardSlider.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import img from "../images/image.png";
import Ticket from "../class/ticketClass";
console.log(img);
const ticketList = [
  new Ticket(img, "1,670,000", "2시간 30분 남음"),
  new Ticket(img, "1,670,000", "2시간 30분 남음"),
  new Ticket(img, "1,670,000", "2시간 30분 남음"),
  new Ticket(img, "1,670,000", "2시간 30분 남음"),
  new Ticket(img, "1,670,000", "2시간 30분 남음"),
  new Ticket(img, "1,670,000", "2시간 30분 남음"),
  new Ticket(img, "1,670,000", "2시간 30분 남음"),
];
export default function CardSlider() {
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
        className="mySwiper"
      >
        {console.log(ticketList.length > 0)}
        {ticketList.length > 0 ? (
          ticketList.map((ticket, index) => (
            <SwiperSlide>
              <img src={ticket.img} />
              <div className="info-box">
                <div className="price-time">
                  <div className="price">
                    <span className="label">판매금액 </span>
                    <span className="value">{ticket.price}원</span>
                  </div>
                  <div className="time">
                    <span className="label">판매시간 </span>
                    <span className="value">{ticket.time} 남음</span>
                  </div>
                </div>
                <button className="share-button">↩</button>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div class="alert-container">
              <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-circle"> </i>
                현재 판매 중인 표가 존재하지 않습니다!
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
}
