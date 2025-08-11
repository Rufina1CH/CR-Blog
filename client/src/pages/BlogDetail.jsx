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
import { format } from "date-fns";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("You must be logged in to view this post.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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

  const formattedDate = post.createdat
    ? format(new Date(post.createdat), "MMMM dd, yyyy")
    : "Unknown date";

  return (
    <div className="max-w-7xl mx-auto py-20 px-5 text-black">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2"
          style={{ color: "black" }}
        >
          ← Back
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Written by: {post.author}
          </p>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </CardHeader>

        <img
          src={post.image || "https://placehold.co/600x300?text=No+Image"}
          alt={post.title}
          className="w-full max-h-[400px] object-cover rounded-md mb-6"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x300?text=No+Image";
          }}
        />

        <CardContent className="text-black-300">{post.content}</CardContent>

        <CardFooter className="space-x-4">
          {(post.tags || []).map((tag) => (
            <Button key={tag} variant="outline" size="sm">
              #{tag}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogDetail;
