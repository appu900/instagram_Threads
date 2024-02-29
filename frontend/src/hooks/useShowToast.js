import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = useCallback((title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 1000,
      isClosable: true,
      position: "top",
    });
  },[toast]);
  return showToast;
};

export default useShowToast;
