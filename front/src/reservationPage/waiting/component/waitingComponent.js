import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const socket = io.connect("http://100.106.99.20:3000");

function QueueStatus({ ticketId }) {
  const [rank, setRank] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("name");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  useEffect(() => {
    if (!userId || !isLoggedIn) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "please login first",
      });
      navigate("/login");
    }
    // 서버에 join-queue 이벤트 전송
    socket.emit("join-queue", { ticketId, userId });

    // 서버로부터 대기열 순위 업데이트 받기
    socket.on("queue-update", (data) => {
      setRank(data.rank);

      if (data.rank > 0 && data.rank <= 10) {
        navigate("/reserve");
      }
    });

    // 컴포넌트 언마운트 시 소켓 연결 종료
    return () => {
      socket.disconnect();
    };
  }, [ticketId, userId, navigate]);

  if (rank === null) return <div>대기열에 참여 중...</div>;
  if (rank === -1) return <div>대기열에서 나갔습니다.</div>;

  return (
    <div>
      <h2>대기 순위: {rank}</h2>
      {rank > 10 ? (
        <p>앞에 {rank - 1}명이 기다리고 있습니다.</p>
      ) : (
        <p>곧 예매 화면으로 이동합니다...</p>
      )}
    </div>
  );
}

export default QueueStatus;
