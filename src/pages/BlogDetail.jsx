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
import { basePosts } from "../data/posts";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = basePosts.find((p) => p.id === id);
    setPost(foundPost);
  }, [id]);

  if (!post)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-20 px-5 text-white">
      {/* Back button at the top */}
      <div className="mb-6">
        <Button onClick={() => navigate(-1)}>← Back</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">Written by: {post.author}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(post.createdAt), "MMMM dd, yyyy")}
          </p>
        </CardHeader>

        {/* Post image */}
        <img
          src={post.image}
          alt={post.title}
          className="w-full max-h-[400px] object-cover rounded-md mb-6"
        />

        <CardContent className="text-gray-300">{post.content}</CardContent>

        <CardFooter className="space-x-4">
          {post.tags.map((tag) => (
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
