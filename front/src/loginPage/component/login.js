import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // 초기 상태에서 login-show만 보여줌
    document.querySelector(".login-show")?.classList.add("show-log-panel");
  }, []);
  const loginFun = async () => {
    if (!validateName(name)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Name must be at least 5 characters long and contain only letters.",
      });
      return;
    }
    if (!validatePassword(password)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password must be at least 5 characters long and contain letters, numbers, and special characters.",
      });
      return;
    }
    const data = {
      name: name,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://100.106.99.20:3000/user/login",
        data
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "id or password is wrong!",
      });
    }
  };
  function validateName(name) {
    // 최소 5글자 이상, 한글 또는 영문만 허용
    const nameRegex = /^[a-zA-Z가-힣]{5,}$/;
    return nameRegex.test(name);
  }

  function validatePassword(password) {
    // 최소 8자 이상, 영문+숫자+특수문자 포함
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]|\\;:'",.<>/?]).{5,}$/;
    return passwordRegex.test(password);
  }
  const handleModeChange = (mode) => {
    setIsLoginMode(mode === "login");
  };

  const registerFun = () => {
    if (!validateName(name)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Name must be at least 5 characters long and contain only letters.",
      });
      return;
    }
    if (!validatePassword(password)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password must be at least 5 characters long and contain letters, numbers, and special characters.",
      });
      return;
    }
    const data = {
      name: name,
      password: password,
    };
    axios
      .post("http://100.106.99.20:3000/user/createUser", data)
      .then((response) => {
        Swal.fire({
          title: "Succes! please login",
          icon: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred. Please try again later.",
        });
      });
  };
  return (
    <div className="login-page">
      <div className="login-reg-panel">
        <div
          className="login-info-box"
          style={{ display: isLoginMode ? "none" : "block" }}
        >
          <h2>Have an account?</h2>
          <p>Click here to login!</p>
          <label
            id="label-register"
            htmlFor="log-reg-show"
            onClick={() => handleModeChange("login")}
          >
            Login
          </label>
        </div>

        <div
          className="register-info-box"
          style={{ display: isLoginMode ? "block" : "none" }}
        >
          <h2>Don't have an account?</h2>
          <p>Click here to create account!</p>
          <label
            id="label-login"
            htmlFor="log-login-show"
            onClick={() => handleModeChange("register")}
          >
            Register
          </label>
        </div>

        <input
          type="radio"
          name="active-log-panel"
          id="log-reg-show"
          style={{ display: "none" }}
          checked={isLoginMode}
          readOnly
        />
        <input
          type="radio"
          name="active-log-panel"
          id="log-login-show"
          style={{ display: "none" }}
          checked={!isLoginMode}
          readOnly
        />

        <div className={`white-panel ${!isLoginMode ? "right-log" : ""}`}>
          <div className={`login-show ${isLoginMode ? "show-log-panel" : ""}`}>
            <h2>LOGIN</h2>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input type="button" value="Login" onClick={loginFun} />
          </div>
          <div
            className={`register-show ${!isLoginMode ? "show-log-panel" : ""}`}
          >
            <h2>REGISTER</h2>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ul className="login-guidelines">
              <li>
                <span className="dot" /> Name and Password must be at least{" "}
                <strong>5 characters</strong> long
              </li>
              <li>
                <span className="dot" /> Password must include{" "}
                <strong>letters, numbers</strong>, and{" "}
                <strong>special characters</strong>
              </li>
            </ul>
            <input type="button" value="Register" onClick={registerFun} />
          </div>
        </div>
      </div>
    </div>
  );
}
