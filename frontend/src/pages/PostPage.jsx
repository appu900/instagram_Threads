import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar name="mark zuckku" src="/zuck-avatar.webp" size={"md"} />
          <Flex>
            <Text fontsize={"sm"}>markzuccku</Text>
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
      <Text my={3}>lets talk about threads</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src="/post1.jpg" w={"full"} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          10 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex>
        <GetTheApplication />
      </Flex>
      <Divider my={4} />
      <Comment
        likes={100}
        comment={"this sounds nice"}
        createdAt={"9d"}
        userAvatar={"https://bit.ly/dan-abramov"}
      />
      <Comment
        likes={4100}
        comment={"nice actually"}
        createdAt={"4d"}
        userAvatar={"https://bit.ly/dan-abramov"}
      />
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