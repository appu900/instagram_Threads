import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Posts from "../components/Posts";

const Userpage = () => {
  const [user, setUser] = useState(null);
  console.log(user);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loding, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  // fetch user data from server by using the url params
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/users/profile/${username}`);
        const data = await response.json();
        console.log(data);
        setUser(data);

        // if we get some error show a toast message and return
        if (data.error) {
          console.log(data.error);
          showToast("Error in fetching user", data.error, "error");
          return;
        }

        // set user state with fetched user data
      } catch (error) {
        showToast("Error in fetching user", error.message, "error");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    const getPost = async () => {
      setFetchingPosts(true);
      try {
        const response = await fetch(`/api/posts/user/posts/${username}`);
        const data = await response.json();
        console.log(data);
        setPosts(data.profilePost);
      } catch (error) {
        showToast("Error in fetching user posts", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getUser();
    getPost();
  }, [username]);

  if (!user && loding) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  console.log(posts);
  // if user is not fetched yet show a loading message
  if (!user && !loding) {
    return <h1>user not found</h1>;
  }
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>no posts to show</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post, index) => (
        <Posts post={post} postedBy={post.postedBy} key={index} />
      ))}
    </>
  );
};

export default Userpage;
