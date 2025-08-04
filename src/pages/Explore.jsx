
import React, { useEffect, useState, useRef, useCallback } from "react";
import BlogCard from "../components/BlogCard";
import { basePosts } from "../data/posts";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  // Load posts with delay
  const loadMorePosts = useCallback(() => {
    if (loading) return; // prevent multiple calls

    setLoading(true);

    setTimeout(() => {
      setPosts((prev) => [...prev, ...basePosts]);
      setLoading(false);
    }, 1000); // 1 second delay simulating loading
  }, [loading]);

  // Initial load
  useEffect(() => {
    loadMorePosts();
  }, []);

  // Intersection observer to trigger loading more posts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loadMorePosts, loading]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-10">
        Explore Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <BlogCard key={`${post.id}-${index}`} post={post} />
        ))}
      </div>
      <div ref={loaderRef} className="text-center py-10 text-white">
        {loading ? "Loading more..." : "Scroll down to load more"}
      </div>
    </div>
  );
};

export default Explore;
