import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import authScreenatom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import { BsShopWindow } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

export default function LoginCard() {
  
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreenState = useSetRecoilState(authScreenatom);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  //   state for login data ie: username and password
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  //   function to handle login
  const handlelogin = async () => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();
      console.log(data);

      // if there is an error in response display a toast message
      if (data.error) {
        showToast("An error occurred", data.error, "error");
        return;
      }

      // if there is no error in response then set the user info in localstorage and user atom
      localStorage.setItem("user_info_thread", JSON.stringify(data));
      setUser(data);
      // window.location.reload();
      // navigate("/");
      showToast("Login Sucessfull", "You have been logged in", "success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={5} px={0}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign In
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>User Name</FormLabel>
                  <Input
                    value={inputs.username}
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                    type="text"
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handlelogin}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account ?{" "}
                <Link
                  onClick={() => setAuthScreenState("signup")}
                  color={"blue.400"}
                >
                  sign-up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
