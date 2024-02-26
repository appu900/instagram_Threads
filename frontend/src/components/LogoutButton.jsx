import { Button, useToast } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const LogoutButton = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const toast = useToast();
  const handleLogout = async () => {
    try {
      localStorage.removeItem("user_info_thread");
      const response = await fetch("/api/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);
      if (data.error) {
        console.log(data.error);
        useShowToast("An error occurred", data.error, "error");
        return;
      }
      // if logout is sucessfull the give a toast message : "logout sucessfull"
      setUser(null);
      showToast("Logout Sucessfull", "You have been logged out", "success");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      position={"fixed"}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
