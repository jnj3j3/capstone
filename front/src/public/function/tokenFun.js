import axios from "axios";
import Swal from "sweetalert2";

export async function checkToken() {
  const token = localStorage.getItem("accessToken");
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    return false;
  }
  try {
    const response = fetchWithAutoRefresh(
      await axios.get("http://100.106.99.20:3000/user/checkToken")
    );
    if (!response) throw new Error("refresh Token expired");
    localStorage.setItem("name", response.data.name);
    return true;
  } catch (error) {
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");

    return false;
  }
}
export async function fetchWithAutoRefresh(fetchFunction) {
  try {
    const response = await fetchFunction();
    return response;
  } catch (error) {
    const { response } = error;

    if (
      response &&
      response.status === 401 &&
      response.data?.error === "Token expired"
    ) {
      const refreshed = await refreshToken();

      if (!refreshed) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please log in again!",
        });
        return null;
      }

      try {
        const retryResponse = await fetchFunction();
        return retryResponse;
      } catch (retryError) {
        Swal.fire({
          icon: "error",
          title: "Retry failed",
          text: "Please try again later.",
        });
        return null;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
      });
      return null;
    }
  }
}
