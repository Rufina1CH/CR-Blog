
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { format } from "date-fns";

const getFormattedDate = (dateString) => {
  const parsed = new Date(dateString);
  return isNaN(parsed) ? "Unknown date" : format(parsed, "PPP");
};

const defaultPosts = [
  {
    id: "1",
    title: "Top 5 Skincare Trends That Are Taking Over 2025",
    author: "Ananya",
    createdAt: new Date().toISOString(),
    content:
      "From skin cycling to barrier-repair serums, the beauty industry is leaning toward skin health over harsh treatments. Discover what ingredients are trending and how to personalize your skincare routine for long-term results.",
    tags: ["beauty", "skincare", "glow", "selfcare", "trends", "makeup"],
    image:
      "https://fastly.picsum.photos/id/21/3008/2008.jpg?hmac=T8DSVNvP-QldCew7WD4jj_S3mWwxZPqdF0CNPksSko4",
  },
  {
    id: "2",
    title: "The Rise of Edge Computing in 2025",
    author: "Rohan Mehta",
    createdAt: new Date().toISOString(),
    content:
      "Edge computing is revolutionizing how data is processed, especially with IoT and AI. Instead of relying on centralized cloud servers, edge devices now process data locally, reducing latency and improving speed. This article explores its applications in smart homes, healthcare, and autonomous vehicles.",
    tags: ["technology", "edge computing", "IoT", "AI", "cloud", "innovation"],
    image:
      "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4",
  },
];

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("blogPosts")) || [];
    if (saved.length === 0) {
      localStorage.setItem("blogPosts", JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    } else {
      setPosts(saved);
    }
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto px-4 py-10 gap-6">
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-center text-white mb-10">
          Blog Posts
        </h1>
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden shadow-md bg-white flex flex-col h-full"
              >
                <div className="w-full h-[240px] bg-gray-100 flex justify-center items-center overflow-hidden rounded-t-md">
                  <img
                    src={
                      post.image ||
                      "https://via.placeholder.com/600x300?text=No+Image"
                    }
                    alt={post.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <CardHeader style={{ padding: "0.5rem" }}>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {post.title || "Untitled"}
                  </CardTitle>
                </CardHeader>

                <CardContent style={{ padding: "0.5rem" }}>
                  <p className="text-sm text-gray-500 mb-2">
                    By <strong>{post.author || "Unknown"}</strong> •{" "}
                    {getFormattedDate(post.createdAt)}
                  </p>
                  <p className="text-gray-700 line-clamp-3">
                    {post.content || "No content provided."}
                  </p>
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
                  <Link
                    to={`/post/${post.id}`}
                    className="text-sm font-medium text-purple-700 hover:underline"
                  >
                    Read more →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogList;
