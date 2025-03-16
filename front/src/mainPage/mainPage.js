import React from "react";
import CardSlider from "./component/cardSlider";
import RankingSection from "./component/rankingsection";
import "./mainPage.css";
function MainPage() {
  return (
    <div className="main-page">
      <CardSlider />
      <RankingSection />
    </div>
  );
}

export default MainPage;
