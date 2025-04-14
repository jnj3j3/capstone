import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import User from "../../public/class/user";
import Ticket from "../../public/class/ticketClass";
import img from "../../public/images/image.png";
import "./css/myCard.css";

const ticketList = [
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
];

const MyCard = () => {
  const [userInfo, setUserInfo] = useState(new User("ju", "2025-03-16"));

  return (
    <div className="cardMain">
      <div className="card">
        <h5 className="card-header">User Info</h5>
        <div className="card-body cardBodyInfo">
          <h5 className="card-title">{userInfo.name}</h5>
          <p className="card-text cardTextInfo">{userInfo.created}</p>
          <button type="button" className="btn btn-primary btn-sm">
            계정 삭제
          </button>
        </div>
        <ul className="list-group listGroupInfo">
          <li className="list-group-item">
            <h5 className="card-title">Ticket wallet</h5>
          </li>
          <li className="list-group-item">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper ticketWallet"
            >
              {ticketList.map((ticket, idx) => (
                <SwiperSlide className="swiperSlider ticketWallet" key={idx}>
                  <div className="card ticketCard">
                    <img src={ticket.img} className="card-img-top" alt="..." />
                    <div className="card-body ticketCardBody">
                      <h3 className="card-title">{ticket.name}</h3>
                      <div className="walletInfo">{ticket.time}</div>
                      <div className="walletInfo">{ticket.price}원</div>
                      <button type="button" className="btn btn-primary btn-sm">
                        티켓 취소
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyCard;
