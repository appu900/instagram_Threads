import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";

export default function UserProfileEdit() {
  const [user, setUser] = useRecoilState(userAtom);
  const[updating,setUpdating] = useState(false);
  console.log(user);
  const fileref = useRef(null);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
    bio: user.bio,
  });

  // custom hook to preview image
  const { handleImageChange, imageurl } = usePreviewImage();
  // console.log(imageurl);

  // costume toast to show error
  const showToast = useShowToast();

  // function to handle form submit
  async function handleSubmit(e) {
    
    e.preventDefault();
    setUpdating(true);
    
    try {
      
      // doing fetch request to update user /api/users/update/:id
      const response = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imageurl }),
      });

      const data = await response.json();
      if (data.error) {
        showToast("Error in updating user", data.error, "error");
        return;
      }
      console.log(data.updatedUser);

      // store data to localstorage
      localStorage.setItem("user_info_thread", JSON.stringify(data.updatedUser));

      // set user atom with updated user data
      setUser(data.updatedUser);
      showToast("User updated", "User updated successfully", "success");

    } catch (error) {
      console.log("Error in updating user: ", error.message);
      showToast("Error in updating user", error.message, "error");
    }
    finally{
      setUpdating(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={8}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "xl", sm: "xl" }}>
            Update your profile
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" src={imageurl || user.profilePic}></Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileref.current.click()}>
                  Change profile picture
                </Button>
                <Input
                  onChange={handleImageChange}
                  type="file"
                  display="none"
                  hidden
                  ref={fileref}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              placeholder="tony stark"
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              placeholder="enter bio..."
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
