import React, { useEffect, useRef, useCallback } from "react";

const InfiniteScroll = ({ loadMore, hasMore, children }) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasMore) loadMore();
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore]
  );

  return (
    <div className="space-y-6">
      {children}
      {hasMore && (
        <div ref={lastElementRef} className="text-center text-gray-500">
          Loading more posts...
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
