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

export default function Register(props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill all required fields", { position: "top-center" });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    const requestData = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    try {
      const response = await axios.post("http://localhost:8000/register", requestData);

      toast.success(response.data.message || "Registration successful!", {
        position: "top-center",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        (typeof error.response?.data === "string" ? error.response.data : null) ||
        "Registration failed";

      if (
        error.response?.status === 400 &&
        backendMessage.toLowerCase().includes("user already exists")
      ) {
        toast.error("🚫 User already exists. Please try logging in.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (
        error.response?.status === 400 &&
        backendMessage.toLowerCase().includes("email already registered")
      ) {
        toast.error("📧 Email already registered. Try logging in.", {
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
            Create Your <span className="text-yellow-500">CRBlog</span> Account
          </CardTitle>
          <CardDescription className="text-center">
            Please fill the details to register
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="username" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={onChangeForm}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChangeForm}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChangeForm}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChangeForm}
                placeholder="Retype your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black"
            >
              Register
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              onClick={() => props.setPage && props.setPage("login")}
              className="text-yellow-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
