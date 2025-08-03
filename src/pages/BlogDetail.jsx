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

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    const allPosts = [...defaultPosts, ...savedPosts];
    const found = allPosts.find((p) => String(p.id) === String(id));
    setPost(found || null);
  }, [id]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center text-red-600 font-semibold">
        Post not found.
        <br />
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      <Card className="p-6 md:p-10 shadow-xl bg-white rounded-xl">
        {post.image ? (
          <div className="w-full mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-[400px] object-cover rounded-lg mx-auto"
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg mb-8 flex items-center justify-center text-gray-400 text-lg">
            No Image
          </div>
        )}

        <CardHeader className="p-0 text-center mb-4">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {post.title}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            By <strong>{post.author || "Unknown"}</strong> •{" "}
            {format(new Date(post.createdAt), "PPP p")}
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="whitespace-pre-wrap text-gray-800 text-base leading-relaxed text-center md:text-left">
            {post.content}
          </div>
        </CardContent>

        <CardFooter className="p-0 mt-6 flex justify-center flex-wrap gap-2">
          {post.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
            >
              #{tag}
            </span>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogDetail;
