import React, { useState } from "react";
import SignupCard from "../components/Signup";
import LoginCard from "../components/Login";
import { useRecoilValue } from "recoil";
import authScreenatom from "../atoms/authAtom";

const Authpage = () => {
  const authScreenState = useRecoilValue(authScreenatom);
  console.log(authScreenState);

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default Authpage;
