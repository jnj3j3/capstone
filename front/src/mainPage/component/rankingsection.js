import React, { useState, useEffect } from "react";
import "./css/rankingSection.css";
import axios from "axios";
import { Buffer } from "buffer";
// const periods = ["일간", "주간", "월간", "연간"];

const RankingSection = () => {
  // const [selectedCategory, setSelectedCategory] = useState("뮤지컬");
  // const [selectedPeriod, setSelectedPeriod] = useState("일간");
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(
          "http://100.106.99.20:3000/ranking/getRanking"
        );
        const modified = res.data.map((item) => {
          const imageBuffer = item.ticket.image?.data;
          let imageSrc = "";
          if (imageBuffer) {
            const base64Image = Buffer.from(imageBuffer).toString("base64");
            imageSrc = `data:image/jpeg;base64,${base64Image}`;
          }
          const startDt = new Date(item.ticket.startDate);
          const endDt = new Date(item.ticket.endDate);
          const startDate = startDt.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });
          const endDate = endDt.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });
          return {
            ...item,
            ticket: {
              ...item.ticket,
              image: imageSrc,
              startDate: startDate,
              endDate: endDate,
            },
          };
        });

        setTicketList(modified);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);
  return (
    <div className="ranking-section">
      <div className="ranking-header">
        <h2>TICKET RANKING</h2>
      </div>
      {/* 랭킹 슬라이더 */}
      <div className="ranking-slider">
        {loading ? (
          <div className="ranking-card">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        ) : (
          ticketList.map((show, idx) => (
            <div className="ranking-card" key={idx}>
              <div className="image-container">
                <img src={show.ticket.image} alt={show.ticket.name} />
                <span className="rank-number">{idx + 1}</span>
              </div>
              <h3 className="rank-title">{show.ticket.name}</h3>
              <p className="rank-explain">
                {show.ticket.startDate} ~ {show.ticket.endDate}
              </p>
            </div>
          ))
        )}
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
