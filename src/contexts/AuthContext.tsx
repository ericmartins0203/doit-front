import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { api } from "../services/api";
import { ITask } from "./TasksContext";

interface AuthProviderProps {
  children: ReactNode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createDate: string;
  updateDate: string;
  password: string
  tasks: ITask[]
}

interface AuthState {
  accessToken: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  accessToken: string;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>(() => {
    const accessToken = localStorage.getItem("@Doit:AcessToken");
    const user = localStorage.getItem("@Doit:user");

    if (accessToken && user) {
      return { accessToken, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post("/user/login", { email, password });

    const { accessToken, user } = response.data;

    localStorage.setItem("@Doit:AcessToken", accessToken);
    localStorage.setItem("@Doit:user", JSON.stringify(user));

    setData({ accessToken, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@Doit:AcessToken");
    localStorage.removeItem("@Doit:user");

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken: data.accessToken,
        user: data.user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
