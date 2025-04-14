import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 로그인 상태 불러오기
  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn");
    if (stored === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // 로그인 상태가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
