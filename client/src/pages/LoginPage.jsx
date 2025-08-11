import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Login(props) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields", { position: "top-center" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/login", loginForm);
      const { token, detail } = res.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("email", loginForm.email);

      if (props.onLogin) props.onLogin(loginForm.email);

      // Dispatch custom event so Header updates immediately
      window.dispatchEvent(new Event("storageChange"));

      toast.success(detail || "✅ Login successful!", {
        position: "top-center",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/create");
      }, 1500);
    } catch (err) {
      const backendMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Login failed";

      if (
        err.response?.status === 401 &&
        backendMessage.toLowerCase().includes("invalid credentials")
      ) {
        toast.error("🚫 Invalid email or password", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(backendMessage, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-sm" style={{ padding: "1rem" }}>
        <CardHeader>
          <CardTitle className="text-center">
            Welcome to <span className="text-yellow-500">CRBlog</span>
          </CardTitle>
          <CardDescription className="text-center">
            Please login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium select-none">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={onChangeForm}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium select-none">
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                value={loginForm.password}
                onChange={onChangeForm}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              onClick={() => props.setPage && props.setPage("register")}
              className="text-yellow-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

