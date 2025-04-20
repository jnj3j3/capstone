import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `http://100.106.99.20:3000/ticket/getTicket/${id}`
        );

        const { image, ...rest } = response.data;

        let imageSrc = "";
        if (image?.data) {
          const uint8Array = new Uint8Array(image.data);
          const blob = new Blob([uint8Array], { type: "image/jpeg" });
          imageSrc = URL.createObjectURL(blob);
        }

        setTicket({ ...rest, image: imageSrc });
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!ticket)
    return (
      <div className="text-center mt-5">티켓 정보를 불러오지 못했습니다.</div>
    );

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4 mb-3">
          <img
            src={ticket.image}
            alt="포스터"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-8">
          <h3 className="mb-4">뮤지컬 &lt;{ticket.name}&gt;</h3>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th scope="row" style={{ width: "150px" }}>
                  공연시간
                </th>
                <td>
                  {new Date(ticket.when).toLocaleDateString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}
                </td>
              </tr>
              <tr>
                <th scope="row">예메기간</th>
                <td>
                  {new Date(ticket.startDate).toLocaleDateString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}{" "}
                  ~{" "}
                  {new Date(ticket.endDate).toLocaleDateString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}
                </td>
              </tr>
              <tr>
                <th scope="row">공연내용</th>
                <td>{ticket.context}</td>
              </tr>
              <tr>
                <th scope="row">가격</th>
                <td>{ticket.price.toLocaleString()}원</td>
              </tr>
            </tbody>
          </table>

          <div className="d-grid gap-2 mt-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/reservation")}
            >
              예매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;
