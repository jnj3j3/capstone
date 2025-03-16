import React from "react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./css/cardSlider.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import img from "../../public/images/image.png";

const ticketList = [
  { title: "알라딘", img: img, price: "1,670,000", time: "2시간 30분 남음" },
  { title: "알라딘", img: img, price: "1,670,000", time: "2시간 30분 남음" },
  { title: "알라딘", img: img, price: "1,670,000", time: "2시간 30분 남음" },
  { title: "알라딘", img: img, price: "1,670,000", time: "2시간 30분 남음" },
  { title: "알라딘", img: img, price: "1,670,000", time: "2시간 30분 남음" },
  { title: "알라딘", img: img, price: "1,670,000", time: "2시간 30분 남음" },
  { title: "알라딘", img: img, price: "1,670,000", time: "2시간 30분 남음" },
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
        className="custom-swiper" // ✅ Swiper에 고유 클래스명 적용
      >
        {ticketList.length > 0 ? (
          ticketList.map((ticket, index) => (
            <SwiperSlide key={index} className="custom-swiper-slide">
              {" "}
              {/* ✅ 고유 클래스명 적용 */}
              <img src={ticket.img} alt="티켓 이미지" />
              <div className="custom-info-box">
                {" "}
                {/* ✅ 고유 클래스명 적용 */}
                <div className="custom-price-time">
                  <div className="custom-price">
                    <span className="custom-label">판매금액 </span>
                    <span className="custom-value">{ticket.price}원</span>
                  </div>
                  <div className="custom-time">
                    <span className="custom-label">판매시간 </span>
                    <span className="custom-value">{ticket.time} 남음</span>
                  </div>
                </div>
                <button className="custom-share-button">↩</button>
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
