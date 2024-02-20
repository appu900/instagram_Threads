import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";
import {
  Avatar,
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

const UserHeader = () => {
  const toast = useToast();
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
            Mark Zuckku
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>zuck101</Text>
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
          <Avatar
            name="mark zuckku"
            src="./zuck-avatar.webp"
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text>co-founder,exicutive,CEO of Meta,Instagram Platforms.</Text>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>2.3k followers</Text>
          <Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
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
