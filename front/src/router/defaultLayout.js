import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../public/component/header/header";
import Footer from "../public/component/footer/footer";
import "./default.css";

const DefaultLayout = () => {
  const location = useLocation();
  const wsRef = useRef(null);

  useEffect(() => {
    const isWaitingPage = location.pathname.startsWith("/reserveWaiting");

    if (isWaitingPage) {
      if (!wsRef.current) {
        wsRef.current = new WebSocket("ws://100.106.99.20:8080/ws");
        wsRef.current.onopen = () => console.log("WebSocket connected");
        wsRef.current.onclose = () => console.log("WebSocket disconnected");
        wsRef.current.onerror = (err) => console.error("WebSocket error", err);
        wsRef.current.onmessage = (msg) => console.log("Message:", msg.data);
      }
    } else {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }

    return () => {
      if (wsRef.current && !isWaitingPage) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
