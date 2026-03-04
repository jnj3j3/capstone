// K6 실행 스크립트
// docker run --rm -i --network host \
//   -e K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write \
//   grafana/k6 run --out experimental-prometheus-rw - < k6Test.js

import http from "k6/http";
import ws from "k6/ws";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 9000 },
    { duration: "2m", target: 9000 },
    { duration: "1m", target: 0 },
  ],
};

const BASE_URL = "http://100.106.99.20:3000";
const WS_URL = "ws://100.106.99.20:3000";

export default function () {
  const loginPayload = JSON.stringify({
    name: "register",
    password: "register123!",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const loginRes = http.post(`${BASE_URL}/user/login`, loginPayload, params);

  const loginCheck = check(loginRes, {
    "login success": (r) => r.status === 200,
  });

  if (!loginCheck) {
    console.error(`Login Failed: ${loginRes.status} ${loginRes.body}`);
    return;
  }

  const token = loginRes.json().accessToken;
  const userId = loginRes.json().name || `user_${__VU}`;
  const url = `${WS_URL}/socket.io/?EIO=4&transport=websocket&token=${token}`;

  const res = ws.connect(url, null, function (socket) {
    socket.on("open", () => {
      socket.send("40");
      const payload = JSON.stringify([
        "join-queue",
        { ticketId: 1, userId: userId },
      ]);
      socket.send(`42${payload}`);

      console.log(`[VU ${__VU}] 로그인 성공 및 대기열 진입 완료`);
    });

    socket.on("message", (message) => {
      // 42["queue-update", {"rank": 5}] 형태의 메시지 파싱
      if (message.startsWith("42")) {
        const data = JSON.parse(message.substring(2));
        const eventName = data[0];
        const eventData = data[1];

        if (eventName === "queue-update") {
          const rank = eventData.rank;
          console.log(`[VU ${__VU}] 현재 대기 순위: ${rank}`);

          // 순위가 10위권 이내면 성공으로 간주하고 연결 종료 (예약 페이지 이동 시뮬레이션)
          if (rank > 0 && rank <= 10) {
            check(rank, { "reached top 10": (r) => r <= 10 });
            socket.close();
          }
        }
      }
    });

    socket.on("error", (e) =>
      console.error(`[VU ${__VU}] 소켓 에러: ${e.error()}`),
    );

    // 1분 이상 대기 시 강제 종료 (타임아웃)
    socket.setTimeout(() => socket.close(), 60000);
  });

  check(res, { "websocket connected": (r) => r && r.status === 101 });
}
