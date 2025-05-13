// App.js
import React from "react";
import { AuthProvider } from "./public/function/authContext";
import Router from "./router/routes";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
