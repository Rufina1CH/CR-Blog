import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function Create() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    author: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("You must be a registered user to post blog", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        setFormData((prev) => ({ ...prev, author: data.username || "" }));
      })
      .catch(() => {
        toast.error("Failed to verify user. Please login again.", {
          position: "top-center",
          autoClose: 3000,
        });
        localStorage.removeItem("auth_token");
        navigate("/login");
      })
      .finally(() => setLoadingUser(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "author") return;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "content" && value.trim() !== "") setError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    const contentWords = formData.content.trim().split(/\s+/).length;
    if (contentWords < 100 || contentWords > 1500) {
      setError("Content must be between 100 and 1500 words.");
      return;
    }

    if (!formData.image) {
      setError("Please upload an image.");
      return;
    }

    setError("");

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("You must be logged in to publish.");
      return;
    }

    const newPost = {
      id: String(Date.now()).slice(0, 10),
      title: formData.title,
      author: formData.author,
      createdAt: new Date().toISOString(),
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: formData.image,
    };

    try {
      const res = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error("Failed to create post.");
      toast.success("Blog published successfully!");
      navigate("/");
    } catch {
      toast.error("Error publishing blog post.");
    }
  };

  if (loadingUser) return null; // or a loader spinner here

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-xl" style={{ padding: "1rem" }}>
        <CardHeader>
          <CardTitle className="text-center text-purple-700">Create Blog</CardTitle>
          <CardDescription className="text-center">
            Fill out the blog post details below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ padding: "0.5rem" }}
              >
                Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="content"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ padding: "0.5rem" }}
              >
                Content
              </label>
              <Textarea
                id="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog content here..."
                required
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="tags"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ padding: "0.5rem" }}
              >
                Tags
              </label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma separated (e.g., tech, react)"
                required
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="author"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ padding: "0.5rem" }}
              >
                Author
              </label>
              <Input
                id="author"
                value={formData.author}
                placeholder="Your name"
                disabled
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="image"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ padding: "0.5rem" }}
              >
                Upload Image
              </label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 max-h-40 object-contain rounded-md border"
                />
              )}
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-600 text-white"
            >
              Publish
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500">
            Ensure your content is appropriate before publishing.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}


