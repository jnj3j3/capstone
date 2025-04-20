import axios from "axios";
import Swal from "sweetalert2";
import { fetchWithAutoRefresh } from "../../public/function/tokenFun";

export async function deleteAccount() {
  try {
    const { value: password, isConfirmed } = await Swal.fire({
      title: "Delete Account",
      input: "password",
      inputLabel: "Enter your password to delete your account",
      inputPlaceholder: "Password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
    });

    if (!isConfirmed || !password) return false;

    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const response = await fetchWithAutoRefresh(() =>
      axios.delete("http://100.106.99.20:3000/user/deleteUser", {
        headers: {
          Authorization: token,
        },
        data: {
          password,
        },
      })
    );

    if (response?.status === 200) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}
export async function cancelReserve(reserveId) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const response = await fetchWithAutoRefresh(() =>
      axios.delete(
        `http://100.106.99.20:3000/reserve/cancelReserve/${reserveId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
    );

    return response?.status === 200;
  } catch (error) {
    return false;
  }
}
