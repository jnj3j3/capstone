import { Outlet } from "react-router-dom";
import Header from "../public/component/header/header"; // 헤더 컴포넌트
import Footer from "../public/component/footer/footer"; // 푸터 컴포넌트
import "./default.css";
const DefaultLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/*페이지가 렌더링되는 위치 */}
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
