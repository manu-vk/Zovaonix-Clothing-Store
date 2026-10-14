import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const API_USER = "https://zovaonix-backend.onrender.com/api/user/login";

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const loginUser = async (email, password) => {
    try {
      // console.log("Sending:", { email, password });

      const res = await axios.post(API_USER, {
        email: email.trim(),
        password: password
      });
      console.log("Login response:", res.data);
      console.log("JWT token:", res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setToken(res.data.token);

      if (res.data.user.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
    }
  };


  return (
    <AuthContext.Provider value={{ loginUser, token }}>
      {children}
    </AuthContext.Provider>
  );
};