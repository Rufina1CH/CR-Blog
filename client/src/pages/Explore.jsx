// import React, { useEffect, useState, useRef, useCallback } from "react";
// import BlogCard from "../components/BlogCard";

// const PAGE_SIZE = 4;

// const Explore = () => {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const loaderRef = useRef(null);

//   const loadMorePosts = useCallback(() => {
//     if (loading || !hasMore) return;

//     setLoading(true);
//     fetch(`http://localhost:8000/api/posts?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (!Array.isArray(data) || data.length === 0) {
//           setHasMore(false);
//         } else {
//           setPosts((prev) => [...prev, ...data]);
//           setPage((prev) => prev + 1);
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setLoading(false);
//       });
//   }, [loading, page, hasMore]);

//   useEffect(() => {
//     loadMorePosts(); // load first page initially
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !loading && hasMore) {
//           loadMorePosts();
//         }
//       },
//       { rootMargin: "100px", threshold: 0 }
//     );

//     const currentLoader = loaderRef.current;
//     if (currentLoader) observer.observe(currentLoader);

//     return () => {
//       if (currentLoader) observer.unobserve(currentLoader);
//     };
//   }, [loadMorePosts, loading, hasMore]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold text-center text-white mb-10">Explore Blogs</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {posts.map((post, index) => (
//           <BlogCard key={`${post.id}-${index}`} post={post} />
//         ))}
//       </div>

//       {/* Loader container: always occupies space, so it’s always visible */}
//       <div
//         ref={loaderRef}
//         className="text-center py-6 mt-8 text-white text-sm font-medium italic opacity-70"
//         style={{ minHeight: "40px" }}
//       >
//         {loading ? (
//           <span className="animate-pulse">Loading more...</span>
//         ) : !hasMore ? (
//           "No more posts"
//         ) : (
//           "Scroll down to load more"
//         )}
//       </div>
//     </div>
//   );
// };

// export default Explore;


import React, { useEffect, useState, useRef, useCallback } from "react";
import BlogCard from "../components/BlogCard";

const PAGE_SIZE = 4;
const MAX_PAGES = 5;
const PAUSE_DURATION_MS = 1500; // 1.5 seconds pause

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    fetch(`http://localhost:8000/api/posts?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);

        // Stop if max pages reached or fewer posts returned
        if (page + 1 >= MAX_PAGES || data.length < PAGE_SIZE) {
          setHasMore(false);
        }

        // Keep loading=true during pause
        setTimeout(() => {
          setLoading(false);
        }, PAUSE_DURATION_MS);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [loading, page, hasMore]);

  useEffect(() => {
    loadMorePosts(); // initial load
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMorePosts();
        }
      },
      { rootMargin: "100px", threshold: 0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loadMorePosts, loading, hasMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-10">Explore Blogs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <BlogCard key={`${post.id}-${index}`} post={post} />
        ))}
      </div>

      <div
        ref={loaderRef}
        className="text-center py-6 mt-8 text-white text-sm font-medium italic opacity-70"
        style={{ minHeight: "40px" }}
      >
        {loading ? (
          <span className="animate-pulse">Loading more...</span>
        ) : !hasMore ? (
          "No more posts"
        ) : (
          "Scroll down to load more"
        )}
      </div>
    </div>
  );
};

export default Explore;
