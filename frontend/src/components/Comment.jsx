import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const Comment = ({ reply }) => {
  console.log(reply);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex w={"full"} gap={1} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} align={"center"}>
            <Text fontSize={"small"} fontWeight={"bold"}>
              {reply.username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{"1hr"}</Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>{reply.text}</Text>
          {/* <Actions liked={liked} setLiked={setLiked} /> */}
          {/* <Text fontSize={"sm"} color={"gray.light"}>
            {likes + (liked ? 1 : 0)} likes
          </Text> */}
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
