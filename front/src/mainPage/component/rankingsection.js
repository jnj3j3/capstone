import React, { useState } from "react";
import "./css/rankingSection.css";
import Ticket from "../../public/class/ticketClass";
import img from "../../public/images/image.png";
// const periods = ["일간", "주간", "월간", "연간"];

const ticketList = [
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
  new Ticket("알라딘", img, "1,670,000", "2025-03-16 ~ 2025-03-25"),
];
const RankingSection = () => {
  // const [selectedCategory, setSelectedCategory] = useState("뮤지컬");
  // const [selectedPeriod, setSelectedPeriod] = useState("일간");

  return (
    <div className="ranking-section">
      <div className="ranking-header">
        <h2>TICKET RANKING</h2>
      </div>
      {/* 랭킹 슬라이더 */}
      <div className="ranking-slider">
        {ticketList.map((show, idx) => (
          <div className="ranking-card">
            <div className="image-container">
              <img src={show.img} alt={show.name} />
              <span className="rank-number">{idx + 1}</span>
            </div>
            <h3 className="rank-explain">{show.name}</h3>
            <p className="rank-explain">{show.time}</p>
          </div>
        ))}
      </div>

      {/* 기간 필터
      <div className="period-filter">
        {periods.map((period) => (
          <button
            key={period}
            className={period === selectedPeriod ? "active" : ""}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default RankingSection;
