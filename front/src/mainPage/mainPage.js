import React from "react";
import Header from "../public/component/header/header";
import CardSlider from "./component/cardSlider";
import RankingSection from "./component/rankingsection";
import Footer from "../public/component/footer/footer";
import "./mainPage.css";
function MainPage() {
  return (
    <div className="main-page">
      <Header />
      <CardSlider />
      <RankingSection />
      <Footer />
    </div>
  );
}

export default MainPage;
