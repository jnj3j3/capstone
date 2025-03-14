import React, { useState } from "react";
import "./css/rankingSection.css";
import image from "../images/image.png"; // 테스트용 이미지

const periods = ["일간", "주간", "월간", "연간"];

const rankingData = [
  { rank: 1, title: "뮤지컬 <모리스>", date: "2025.03.07 - 2025.05.25", image },
  { rank: 2, title: "뮤지컬 <배니싱>", date: "2025.02.04 - 2025.05.25", image },
  { rank: 3, title: "뮤지컬 <폴>", date: "2025.02.07 - 2025.03.30", image },
  {
    rank: 4,
    title: "뮤지컬 <미아 파밀리아>",
    date: "2024.12.19 - 2025.03.23",
    image,
  },
  {
    rank: 5,
    title: "뮤지컬 <퍼스트 맨>",
    date: "2025.01.10 - 2025.03.30",
    image,
  },
];

const RankingSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("뮤지컬");
  const [selectedPeriod, setSelectedPeriod] = useState("일간");

  return (
    <div className="ranking-section">
      <div className="ranking-header">
        <h2>TICKET RANKING</h2>
      </div>
      {/* 랭킹 슬라이더 */}
      <div className="ranking-slider">
        {rankingData.map((show) => (
          <div className="ranking-card">
            <div className="image-container">
              <img src={show.image} alt={show.title} />
              <span className="rank-number">{show.rank}</span>
            </div>
            <h3 className="rank-explain">{show.title}</h3>
            <p className="rank-explain">{show.date}</p>
          </div>
        ))}
      </div>

      {/* 기간 필터 */}
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
      </div>
    </div>
  );
};

export default RankingSection;
