import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImage from "../hooks/usePreviewImage";
import { BsFillImageFill } from "react-icons/bs";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useRecoilValue(userAtom);
  const [postText, setPostText] = useState("");
  const fileref = useRef(null);

  //   importing hook for image handle
  const { handleImageChange, imageurl } = usePreviewImage();

  //   function for handle text chnage for make a post
  function handleTextChange() {
    console.log("text changed");
  }

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
                500/500
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

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Post
            </Button>
            <Button variant="ghost">Discard</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePost;
