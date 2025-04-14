import axios from "axios";
import Swal from "sweetalert2";
export async function checkToken() {
  const token = localStorage.getItem("accessToken");
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Token is missing!",
    });
    return false;
  }
  try {
    const response = await axios.get(
      "http://100.106.99.20:3000/user/checkToken"
    );
    localStorage.setItem("name", response.data.name);
    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Token is invalid!",
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
    axios.defaults.headers.common["Authorization"] = null;
    return false;
  }
}
export async function refreshToken() {
  const accesToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Refresh token is missing!",
    });
    return false;
  }
  try {
    axios.defaults.headers.common["refresh"] = refreshToken;
    axios.defaults.headers.common["authorization"] = accesToken;
    const response = await axios.get(
      "http://100.106.99.20:3000/user/refreshToken"
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Refresh token is invalid! Please log in again.",
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");

    return false;
  }
}
