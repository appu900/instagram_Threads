import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { color } from "framer-motion";
import React from "react";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"center"} mt={6} mb={12}>
      <Image
        cursor={"pointer"}
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        alt="logo"
        onClick={toggleColorMode}
      />
    </Flex>
  );
};

export default Header;
