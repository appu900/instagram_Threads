import React, { useState } from "react";
import { FaInstagram } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useStatStyles,
  useToast,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  console.log(user);
  const toast = useToast();
  const showToast = useShowToast();
  const[updating,setUpdating] = useState(false);

  // this is curretly logged in user
  const currentUser = useRecoilValue(userAtom);
  console.log("this is current user :",currentUser);

  // set the data as we are following the person or not
  const [following, setFollwing] = useState(
    user.user.followers.includes(currentUser._id)
  );

  // function to follow the user
  const handleFollowAndUnFollowTheUser = async () => {

    // if the user is not logged in then show a toast message and return
    if(!currentUser){
      showToast("Error in following user", "login to follow a user", "error");
      return;
    }

    
    setUpdating(true);

    // if the user is logged in then follow the user
    try {
      const response = await fetch(`/api/users/follow/${user.user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        showToast("Error in following user", data.error, "error");
        return;
      }

      // if we are following the user then unfollow the user
      setFollwing(!following);

      // show the follwers count of the user 
      // eventual consistency coz accordinhg to backend logic we aree removing the user from the followers array
      // but for fast response we are simulating the data in out frontend

      if(following){
        showToast("Unfollowed", `You have unfollowed ${user.user.name}`, "success");
        user.user.followers.pop(currentUser._id);
      }
      else{
        showToast("Followed", `You have followed ${user.user.name}`, "success");
        user.user.followers.push(currentUser._id);
      }


    } catch (error) {
      showToast("Error in following user", error.message, "error");
    }
    finally{
      setUpdating(false);
    }
  };

  const copyURL = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        description: "url copied to clipboard",
        status: "success",
        position: "top-bottom",
        isClosable: true,
      });
    });
  };
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.user.username}</Text>
            <Text
              p={1}
              borderRadius={"full"}
              bg={"gray.dark"}
              color={"gray.light"}
              fontSize={"xs"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.user.profilePic ? (
            <Avatar
              name="mark zuckku"
              src={user.user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          ) : (
            <Avatar
              name="mark zuckku"
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.user.bio}</Text>

      {/* if the current user id === user.id then show the edit profile option */}
      {currentUser._id === user.user._id && (
        <RouterLink to="/update">
          <Button size={"sm"}>Edit profile</Button>
        </RouterLink>
      )}

      {/* or else show the follow or unfollow option as we are seeing that profile as a guest or as a user */}
      {currentUser._id !== user.user._id && (
        <Button onClick={handleFollowAndUnFollowTheUser} size={"sm"} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>
            {user.user.followers.length} followers
          </Text>
          <Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex gap={2}>
          <Box className="icon-container">
            <FaInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    copy the url
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* for navigating betwwen thraed and replied */}

      <Flex w={"full"} gap={1}>
        <Flex
          flex={1}
          cursor={"pointer"}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
        >
          <Text cursor={"pointer"} fontWeight={"bold"}>
            Threads
          </Text>
        </Flex>
        <Flex
          flex={1}
          cursor={"pointer"}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          pb={3}
          color={"gray.light"}
        >
          <Text cursor={"pointer"} fontWeight={"bold"}>
            Replies
          </Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
