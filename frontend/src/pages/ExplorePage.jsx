import React, { useEffect, useState } from "react";

const ExplorePage = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [posts, setPosts] = useState([]);

  // ** function to check image url is working or not
  async function checkImage(url) {
    const res = await fetch(url);
    const buff = await res.blob();
    return buff.type.startsWith("image/");
  }

  // ** function to fetch posts from server
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/feed/explore");
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.log("Error in fetching posts: ", error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="w-full h-screen">
      <div className="grid grid-cols-3 gap-2">
        {posts?.map((item) => (
          <div className="cursor-pointer">
            <img
              src={item.image}
              alt="image"
              className="w-full h-52 object-cover "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
