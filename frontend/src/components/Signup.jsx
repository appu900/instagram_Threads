

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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import authScreenatom from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";


export default function SignupCard() {
  const toast = useToast();  
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreenState = useSetRecoilState(authScreenatom);
  const setUser = useRecoilState(userAtom);
  const showToast = useShowToast();
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const handleSignup = async () => {
    try {
      console.log(inputs)
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      console.log(data);
      if(data.error){
        toast({
          title: "An error occurred.",
          description: data.error,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        return;
      }
    //   if we hava a user save this user to our localstorage
     localStorage.setItem("user_info_thread",JSON.stringify(data))
     setUser(data);
     showToast("Signup Sucessfull", "You have been signed up", "success");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={5} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
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
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={inputs.name}
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                    type="text"
                  />
                </FormControl>
              </Box>
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
              <FormLabel>Email address</FormLabel>
              <Input
                value={inputs.email}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                type="email"
              />
            </FormControl>
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
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link
                  onClick={() => setAuthScreenState("login")}
                  color={"blue.400"}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
