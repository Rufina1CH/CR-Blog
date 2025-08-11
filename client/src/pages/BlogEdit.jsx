import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

useEffect(() => {
  setLoading(true);
  setError(null);

  const token = localStorage.getItem("auth_token");

  fetch(`http://localhost:8000/api/posts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    })
    .then((data) => {
      setPost(data);
      setFormData({
        title: data.title || "",
        content: data.content || "",
        tags: (data.tags || []).join(", "),
      });
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("You must be logged in to update posts.");

      const body = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Post updated!");

      navigate('/myposts');
    } catch (err) {
      toast.error(err.message);

    }
  };

  const handleCancel = () => {
    navigate(-1); // go back to previous page
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Error: {error}
      </div>
    );

  if (!post)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Post not found
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-20 px-5 text-black">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-gray-300 hover:bg-gray-400 h-9 px-4 py-2"
        >
          ← Cancel
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border border-gray-300 rounded px-3 py-2 text-lg font-semibold"
          />
        </CardHeader>

        {/* Optionally show image here if you want */}

        <CardContent>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            placeholder="Content"
          />
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <div className="flex gap-4">
            <Button onClick={handleSave} className="bg-green-600">
              Save
            </Button>
            <Button onClick={handleCancel} className="bg-gray-400">
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogEdit;
