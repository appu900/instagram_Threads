import { Button, Container } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Userpage from "./pages/Userpage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Authpage from "./pages/Authpage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./components/LogoutButton";

const App = () => {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user != null ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={user == null ? <Authpage /> : <Navigate to="/" />}
        />
        <Route path="/:username" element={<Userpage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>

      {user !== null && <LogoutButton />}
    </Container>
  );
};

export default App;
