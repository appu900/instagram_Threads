import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useParams } from "react-router-dom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState(null);
  console.log(user);
  const showToast = useShowToast();
  const { postId } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();

        if (data.error) {
          showToast("Error in fetching post", data.error, "error");
          return;
        }
        // console.log("this is the post data", data);
        setPost(data);
      } catch (error) {
        showToast("Error in fetching post", error.message, "error");
      }
    };
    getPost();
  }, [postId]);

  console.log(post);

  if (!post) return null;

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
        <Spinner />
      </Flex>
    );
  }
  console.log(user);
  console.log(post);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar name="mark zuckku" src={user.user.profilePic} size={"md"} />
          <Flex>
            <Text fontsize={"sm"}>{user.user.username}</Text>
            <Image
              src={"/verified.png"}
              alt={"verified"}
              w={"15px"}
              h={"15px"}
              ml={4}
            />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontStyle={"sm"} color={"gray.light"}>
            1h
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>{post.title}</Text>
      {post.image && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post.image} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>
      {/* <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {post.likes.length} likes
        </Text>
      </Flex> */}
      <Divider my={4} />
      <Flex>
        <GetTheApplication />
      </Flex>
      <Divider my={4} />
      {
        post.replies.map((replay)=>(
          <Comment
           key={replay._id}
           reply={replay}
          />
        ))
      }
      {/* <Comment
        likes={100}
        comment={"this sounds nice"}
        createdAt={"9d"}
        userAvatar={"https://bit.ly/dan-abramov"}
      /> */}
    </>
  );
};

export default PostPage;

const GetTheApplication = () => {
  return (
    <Flex w={"full"} justifyContent={"space-between"}>
      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"2xl"}>👋</Text>
        <Text color={"gray.light"}>
          Get the app to like and replay and post
        </Text>
      </Flex>
      <Button>Get</Button>
    </Flex>
  );
};
