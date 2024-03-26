import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [posts, setPosts] = useState([]);
  const [loding, setLoding] = useState(false);

  const navigate = useNavigate();

  // ** function to check image url is working or not
  async function checkImage(url) {
    const res = await fetch(url);
    const buff = await res.blob();
    return buff.type.startsWith("image/");
  }

  // ** function to fetch posts from server
  const fetchPosts = async () => {
    setLoding(true);
    try {
      const response = await fetch("/api/posts/feed/explore");
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.log("Error in fetching posts: ", error.message);
    } finally {
      setLoding(false);
    }
  };

  function handleNavigate() {
    navigate("/post");
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="w-full h-screen">
      {loding && <h1 className="text-center mt-24">Loading...</h1>}
      {/* when user click on the image it will redirect to the post page */}
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
