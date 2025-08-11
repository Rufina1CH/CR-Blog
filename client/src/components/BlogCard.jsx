
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { format } from "date-fns";

const getFormattedDate = (dateString) => {
  const parsed = new Date(dateString);
  return isNaN(parsed) ? "Unknown date" : format(parsed, "PPP");
};

const BlogCard = ({ post }) => (
  <Card className="overflow-hidden shadow-md bg-white flex flex-col h-full">
    <div className="w-full h-[240px] bg-gray-100 flex justify-center items-center overflow-hidden rounded-t-md">
      <img
        src={post.image}
        alt={post.title}
        className="max-w-full max-h-full object-contain"
      />
    </div>

    <CardHeader style={{ padding: "0.5rem" }}>
      <CardTitle className="text-xl font-bold text-gray-900">
        {post.title}
      </CardTitle>
    </CardHeader>

    <CardContent style={{ padding: "0.5rem" }}>
      <p className="text-sm text-gray-500 mb-2">
        By <strong>{post.author}</strong> • {getFormattedDate(post.createdAt)}
      </p>
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
      <Link
        to={`/post/${post.id}`}
        className="text-sm font-medium text-purple-700 hover:underline"
      >
        Read more →
      </Link>
    </CardFooter>
  </Card>
);

export default BlogCard;
