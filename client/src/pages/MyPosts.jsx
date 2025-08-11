

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { format } from "date-fns";

const getFormattedDate = (dateString) => {
  const parsed = new Date(dateString);
  return isNaN(parsed) ? "Unknown date" : format(parsed, "PPP");
};

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/api/myposts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch your posts");
      const data = await res.json();

      const normalizedPosts = data.map((post) => ({
        postid: post.postid,
        title: post.title || "Untitled",
        author: post.author || "Unknown",
        createdAt: post.createdAt || null,
        content: post.content || "No content provided.",
        tags: Array.isArray(post.tags)
          ? post.tags
          : post.tags
          ? post.tags.split(",").map((t) => t.trim())
          : [],
        image: post.image || null,
      }));

      setPosts(normalizedPosts);
      setError("");
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postid) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("You must be logged in to delete posts.");

      const res = await fetch(`http://localhost:8000/api/posts/${postid}/delete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchMyPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (postid) => {
    navigate(`/post/${postid}/edit`);
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (posts.length === 0)
    return <p className="text-center text-gray-400">No posts found.Create a Blog!!</p>;

  return (
    <div className="flex max-w-7xl mx-auto px-4 py-10 gap-6">
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-center text-white mb-10">
          My Posts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Card
              key={post.postid}
              className="overflow-hidden shadow-md bg-white flex flex-col h-full"
            >
              <div className="w-full h-[240px] bg-gray-100 flex justify-center items-center overflow-hidden rounded-t-md">
                <img
                  src={
                    post.image
                      ? post.image.startsWith("data:image")
                        ? post.image
                        : `data:image/png;base64,${post.image}`
                      : "https://placehold.co/600x300?text=No+Image"
                  }
                  alt={post.title}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x300?text=No+Image";
                  }}
                />
              </div>

              <CardHeader style={{ padding: "0.5rem" }}>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  By <strong>{post.author}</strong> •{" "}
                  {post.createdAt ? getFormattedDate(post.createdAt) : "Unknown date"}
                </p>
              </CardHeader>

              <CardContent style={{ padding: "0.5rem" }}>
                <p className="text-gray-700 line-clamp-3">{post.content}</p>
              </CardContent>

              <CardFooter
                className="flex justify-between items-center mt-auto"
                style={{ padding: "0.5rem" }}
              >
                <div className="flex flex-wrap gap-1">
                  {(post.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div>
                  <Button
                    onClick={() => handleEditClick(post.postid)}
                    className="mr-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.postid)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyPosts;
