import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import {formatDistanceToNow} from "date-fns";

const Posts = ({ post, postedBy }) => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  console.log(user);

  //   fetch the user who posted the post
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/users/profile/id/" + postedBy);
        const data = await response.json();
        console.log("user data", data);

        // if we get some error handle the error
        if (data.error) {
          console.log("error in getting user data", data.error);
          showToast("Error", data.error, "error");
          return;
        }

        // if there is no error set the user data to the state
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getUser();
  }, [postedBy]);

  if (user === null) {
    return null;
  }
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.name}
            src={user.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                name="Dan Abrahmov"
                src={post.replies[0].profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                name="Dan Abrahmov"
                src={post.replies[1].profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size={"xs"}
                name="Dan Abrahmov"
                src={post.replies[2].profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
                fontSize={"sm"}
                fontWeight={"bold"}
              >
                {user.name}
              </Text>
              <Image
                src={"./verified.png"}
                alt={"verified"}
                w={"15px"}
                h={"15px"}
                ml={1}
              />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })} 
              </Text>
            
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.title}</Text>
          {/* here we have to paste the copied post */}
          {post.image && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.image} w={"full"} />
              {/* post image in the up */}
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked} />
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {post.replies.length} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {post.likes.length} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Posts;
