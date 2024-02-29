import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const Userpage = () => {
  const [user, setUser] = useState(null);
  console.log(user);
  const { username } = useParams();
  const showToast = useShowToast();

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
      }
    };
    getUser();
  }, [username]);

  // if user is not fetched yet show a loading message
  if (!user) {
    return <h1>user not found</h1>;
  }
  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={400}
        postImg="/post1.jpg"
        postTitle="this is first post"
      />
      <UserPost
        likes={200}
        replies={400}
        postImg="/post2.jpg"
        postTitle="this is second post"
      />
      <UserPost
        likes={11200}
        replies={400}
        postImg="/post3.jpg"
        postTitle="this is third post"
      />
      <UserPost likes={11200} replies={400} postTitle="this is third post" />
    </>
  );
};

export default Userpage;
