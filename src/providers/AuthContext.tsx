import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/user/queries";
import { MutateOptions } from "react-query";
import { LoginRequest } from "../schema/login.schema";
import { message } from "antd";

interface AuthContextProps {
  loggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggingUser: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    () => !!localStorage.getItem("bookRental")
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);

  const { mutate: loginUser, isLoading: isLoggingUser } = useLogin();

  const login: any = (
    username: LoginRequest,
    password: MutateOptions<any, unknown, LoginRequest, unknown> | undefined
  ) => {
    loginUser(
      { username, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("bookRental", data);

          setLoggedIn(true);
          message.success(`Login Sucessfull`);
        },
        onError: (errorMsg) => {
          message.error(`Login Failed ${errorMsg}`);
        },
      }
    );
  };

  // var islogging = null;

  // isLoggingUser ? islogging : !islogging;

  const logout = () => {
    localStorage.removeItem("bookRental");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("refreshToken");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, isLoggingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
