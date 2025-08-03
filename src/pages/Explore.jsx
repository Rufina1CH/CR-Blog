import React, { useEffect, useState, useRef, useCallback } from "react";
import BlogCard from "../components/BlogCard";

const basePosts = Array.from({ length: 10 }).map((_, i) => ({
  title: `Post Title ${i + 1}`,
  author: `Author ${i + 1}`,
  createdAt: new Date(Date.now() - i * 10000000).toISOString(),
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod ex id nulla bibendum.",
  tags: ["tag1", "tag2"],
  image:
    i % 2 === 0
      ? "https://via.placeholder.com/600x300?text=Dog"
      : "https://via.placeholder.com/600x300?text=Mountain",
}));

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const loaderRef = useRef(null);

  const loadMorePosts = useCallback(() => {
    const newPosts = basePosts.map((post) => ({
      ...post,
      id: generateUniqueId(), // always unique
    }));
    setPosts((prev) => [...prev, ...newPosts]);
  }, []);

  useEffect(() => {
    loadMorePosts(); // load initial posts
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMorePosts();
      },
      { threshold: 1 }
    );
    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [loadMorePosts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-10">
        Explore Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <div ref={loaderRef} className="text-center py-10 text-white">
        Loading more...
      </div>
    </div>
  );
};

export default Explore;
