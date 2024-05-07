import React, { useState, useEffect } from "react";
import "../App.css";
import InfiniteScroll from "react-infinite-scroll-component";
const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleLike = (postId) => {
    console.log(`Liked post ${postId}`);
    alert(`Liked the post`);
  };

  const handleSave = (postId) => {
    console.log(`Saved post ${postId}`);
    alert(`Saved the post to collection`);
  };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

  return (
    <div>
      <h1 className="text-center h1-font">Post List</h1>

      <InfiniteScroll
        dataLength={posts.length}
        next={() => fetchPosts()}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more posts to load</p>}
      >
      <div className="post-list">
        <div className="post-cards">
          {posts.map((post) => (
            <div className="post-card" key={post.id}>
              <h2 className="card-title">{post.title}</h2>
              <p>{post.body}</p>
              <div className="button-container">
                <button
                  className="btn btn-danger mb-2"
                  onClick={() => handleLike(post.id)}
                >
                  Like
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => handleSave(post.id)}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </InfiniteScroll>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default PostList;
