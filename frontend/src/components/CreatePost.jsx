import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImage from "../hooks/usePreviewImage";
import { BsFillImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";

const CreatePost = () => {
  const MAX_CHAR = 500;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useRecoilValue(userAtom);
  console.log(currentUser);
  const [postText, setPostText] = useState("");
  const [remainingChars, setRemainingChars] = useState(MAX_CHAR);
  const [uploadingPost, setUploadingPost] = useState(false);
  const showToast = useShowToast();
  const fileref = useRef(null);

  //   importing hook for image handle
  const { handleImageChange, imageurl, setImageUrl } = usePreviewImage();

  //  purpose :  function for handle text chnage for make a post
  function handleTextChange(e) {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChars(0);
    } else {
      setPostText(inputText);
      setRemainingChars(MAX_CHAR - inputText.length);
    }
  }

  //   purpose : function to handle create post
  const handleCreatePost = async () => {
    // if the post text is empty then show a toast message and return
    if (!postText) {
      showToast("Error in creating post", "post text cannot be empty", "error");
      return;
    }

    setUploadingPost(true);

    try {
      const response = await fetch(`/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: currentUser._id,
          title: postText,
          image: imageurl,
        }),
      });

      //   get the data in json format
      const data = await response.json();

      //   if there is an error show the error as a toast message
      if (data.error) {
        console.log(data.error);
        showToast("Error in creating post", data.error, "error");
        return;
      }

      //   if post is created successfully then show a success message
      showToast("Post created", "Post created successfully", "success");

      //   close the modal
      onClose();
      setPostText("");
      setImageUrl("");
      
    } catch (error) {
      console.log("Error in creating post", error);
    } finally {
      setUploadingPost(false);
    }
  };

  return (
    <div>
      <Button
        position={"fixed"}
        bottom={"10px"}
        right={"10px"}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        create a post
      </Button>
      <Modal
        bg={useColorModeValue("gray.300", "gray.dark")}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent className="bg-red-900">
          <ModalHeader>start a thread</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                value={postText}
                onChange={handleTextChange}
                placeholder={`${currentUser.name} start a thread`}
              ></Textarea>
              <Text
                m={"1"}
                color={"gray.300"}
                fontSize={"xs"}
                textAlign={"right"}
              >
                {remainingChars}/500
              </Text>
              <Input
                onChange={handleImageChange}
                type="file"
                display="none"
                hidden
                ref={fileref}
              ></Input>

              {/* useref sectuih for image  */}
              <BsFillImageFill
                size={16}
                onClick={() => fileref.current.click()}
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                }}
              />
            </FormControl>

            {/* if we have a image or user select a image to upload then we will show this
            image preview section ??
            */}

            {imageurl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imageurl} w={"full"}></Image>
                <CloseButton
                  bg={"gray.800"}
                  position={"absolute"}
                  right={2}
                  top={2}
                  onClick={() => setImageUrl("")}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={uploadingPost}
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePost;
