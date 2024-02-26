import { useToast } from "@chakra-ui/react";
import React from "react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 9000,
      isClosable: true,
      position: "top",
    });
  };
  return showToast;
};

export default useShowToast;
