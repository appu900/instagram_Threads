import React from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const Userpage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={1200} replies={400} postImg="/post1.jpg" postTitle="this is first post" />
      <UserPost likes={200} replies={400} postImg="/post2.jpg" postTitle="this is second post" />
      <UserPost likes={11200} replies={400} postImg="/post3.jpg" postTitle="this is third post" />
      <UserPost likes={11200} replies={400}  postTitle="this is third post" />

     

      
    </>
  );
};

export default Userpage;
