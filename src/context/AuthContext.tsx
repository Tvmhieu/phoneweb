"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type UserInfo = { id: number; email: string; name: string; role: string } | null;

interface AuthContextType {
  userRole: string | null;
  userInfo: UserInfo;
  login: (user: NonNullable<UserInfo>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) setUserInfo(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      const saved = localStorage.getItem("userInfo");
      const currentRole = saved ? JSON.parse(saved).role : null;
      if (currentRole === "CUSTOMER" || !currentRole) {
        alert("❌  LỖI BẢO MẬT: Phân quyền Không hợp lệ!");
        router.push("/login");
      }
    }
  }, [pathname, router]);

  const login = (user: NonNullable<UserInfo>) => {
    setUserInfo(user);
    localStorage.setItem("userInfo", JSON.stringify(user));
    if (user.role === "CUSTOMER") router.push("/");
    else router.push("/admin");
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  return <AuthContext.Provider value={{ userRole: userInfo?.role || null, userInfo, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải bọc trong AuthProvider");
  return context;
}
