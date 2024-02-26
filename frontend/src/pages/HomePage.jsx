import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Link to={"/zuckku"}>
      <Flex w={"full"} justifyContent={"center"}>
        <Button mx={"auto"}>visit profile page</Button>
      </Flex>
    </Link>
  );
};

export default HomePage;
