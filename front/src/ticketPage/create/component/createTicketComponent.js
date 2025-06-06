import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import axios from "axios";
import { imageCompFun } from "../../../public/function/imageFun";
import { useNavigate } from "react-router-dom";
import { fetchWithAutoRefresh } from "../../../public/function/tokenFun";

export function CreateTicket() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [startDateTime, setStartDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [when, setWhen] = useState("");
  const [seatRows, setSeatRows] = useState([{ row: "A", seats: 10 }]);

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Only JPEG, PNG, and WEBP formats are allowed.",
        });
        e.target.value = "";
        return;
      }
      setImageFile(file);
    }
  };

  // Handle seat row management
  const getNextRowLabel = () => String.fromCharCode(65 + seatRows.length); // A, B, C...

  const handleSeatChange = (index, value) => {
    const updated = [...seatRows];
    updated[index].seats = parseInt(value) || 0;
    setSeatRows(updated);
  };

  const addRow = (e) => {
    e.preventDefault();
    const nextRow = getNextRowLabel();
    setSeatRows([...seatRows, { row: nextRow, seats: 10 }]);
  };

  const removeRow = (index) => {
    const updated = [...seatRows];
    updated.splice(index, 1);
    setSeatRows(updated);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const compressedImg = await imageCompFun(imageFile);
    formData.append("name", title);
    formData.append("context", content);
    formData.append("startDate", startDateTime);
    formData.append("endDate", endDateTime);
    formData.append("when", when);
    formData.append("price", price);
    formData.append("image", compressedImg);
    formData.append("seatRows", JSON.stringify(seatRows));

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Token is missing!",
        });
        navigate("/login");
        return;
      }

      await fetchWithAutoRefresh(() =>
        axios.post("http://100.106.99.20:3000/ticket/createTicket", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: accessToken,
          },
        })
      );

      Swal.fire({
        icon: "success",
        title: "Ticket created successfully!",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error occurred while creating ticket! Please log in again.",
      }).then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("name");
        navigate("/login");
      });
    }
  };

  return (
    <div className="ticketMain" style={{ marginBottom: "30px" }}>
      <div className="container mt-5">
        <h3 className="mb-4">🎫 Create Ticket</h3>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-secondary text-white fw-semibold">
              Title
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-secondary text-white fw-semibold">
              Content
            </span>
            <textarea
              className="form-control"
              placeholder="Enter ticket content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* When */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-secondary text-white fw-semibold">
              When
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter event date or time"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              required
            />
          </div>

          {/* Price */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-secondary text-white fw-semibold">
              Price
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Enter ticket price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Seat Layout */}
          <div className="container mt-4" style={{ marginBottom: "20px" }}>
            <div className="row flex-nowrap">
              <span
                className="col-auto input-group-text bg-secondary text-white fw-semibold d-flex justify-content-center"
                style={{ width: "90px" }}
              >
                Seat
              </span>

              <div className="col">
                {seatRows.map((rowData, index) => (
                  <div key={rowData.row} className="input-group mb-2">
                    <span className="input-group-text">{rowData.row}</span>
                    <input
                      type="number"
                      className="form-control"
                      value={rowData.seats}
                      min="1"
                      onChange={(e) => handleSeatChange(index, e.target.value)}
                    />
                    <button
                      className="btn btn-danger"
                      onClick={() => removeRow(index)}
                      disabled={seatRows.length === 1}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button className="btn btn-primary mt-2" onClick={addRow}>
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          {/* Seat Layout View */}
          <div className="seat-layout mt-3">
            <button className="seat reserved screen">screen</button>
            <div className="mt-2">
              {seatRows.map(({ row, seats }) => (
                <div
                  key={row}
                  className="seat-row d-flex align-items-center mb-2"
                >
                  <span className="row-label me-2 fw-bold">{row}</span>
                  {Array.from({ length: seats }, (_, col) => {
                    const seatId = row - col + 1;
                    return (
                      <button key={seatId} className="seat mx-1">
                        {col + 1}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* File Upload */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-secondary text-white fw-semibold">
              Upload
            </span>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          {/* StartAt */}
          <div className="input-group mb-3 ">
            <span className="input-group-text bg-secondary text-white fw-semibold">
              StartAt
            </span>
            <input
              type="datetime-local"
              className="form-control"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
            />
          </div>

          {/* EndAt */}
          <div className="input-group mb-4">
            <span className="input-group-text bg-secondary text-white fw-semibold">
              EndAt
            </span>
            <input
              type="datetime-local"
              className="form-control"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
