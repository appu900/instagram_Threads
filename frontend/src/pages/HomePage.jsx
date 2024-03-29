import { Button, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import Posts from "../components/Posts";

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [loding, setLoding] = useState(false);
  
  // fetching feed data from server 
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoding(true);
      try {
        const response = await fetch("/api/posts/feed");
        const data = await response.json();
        console.log("feed data", data);

        // handle the error
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // if there is no error set the data to setPosts function
        setPosts(data);
      } catch (error) {
        console.log("error in fetching feed data", error);
        showToast("Error", error, "error");
      } finally {
        setLoding(false);
      }
    };

    getFeedPosts();
  }, []);
  return (
    <>
      {loding && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {/* if user  dont follow any one */}
      {!loding && posts.length === 0 && (
        <div>
          <h1 className="text-xl text-center mt-10">follow some people to show posts</h1>
          <div className="flex justify-center mt-5">
            <Link to="/search">
              <Button colorScheme="blue">Explore people</Button>
            </Link>
          </div>
        </div>
      )}

      {/* if we have posts */}
      {posts.map((post, index) => (
        <Posts post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
