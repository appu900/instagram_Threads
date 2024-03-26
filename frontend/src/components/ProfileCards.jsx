import { Avatar, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { RiShareForward2Line } from "react-icons/ri";

const ProfileCards = ({ user }) => {
  console.log(user.followers);
  const navigate = useNavigate();
  const showToast = useShowToast();

  //  ** current loggedin user
  const currentUser = useRecoilValue(userAtom);

  //   ** set data as the loggedin user following that user or not
  const [follwing, setFollwing] = useState(
    user.followers.includes(currentUser?._id)
  );

  console.log(currentUser);
  const [updating, setUpdating] = useState(false);

  //  ** purpose: navigate to user profile page
  function handleNavigate() {
    navigate(`/${user.username}`);
  }

  //  ** purpose user follow and unfollow section
  async function handleFollowUnfollow() {
    // ** if there is not currentuser show a toast error
    // ** u need to login to follow and unfollow
    if (!currentUser) {
      showToast("Error in following user", "login to follow a user", "error");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/users/follow${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        showToast("Error in following user", data.error, "error");
        return;
      }

      //   if we are follwing the user then unfollow the user
      setFollwing(!follwing);

      if (follwing) {
        showToast("Success", `Unfollowed ${user.username}`, "success");
        // user.followers.pop(currentUser?._id);
      } else {
        showToast("Success", `Followed ${user.username}`, "success");
        // user.followers.push(currentUser?._id);
      }
    } catch (error) {
      showToast("Error in following user", error, "error");
    } finally {
      setUpdating(false);
    }
  }
  return (
    <div className="flex items-center justify-between mt-7 cursor-pointer  gap-2">
      <div onClick={handleNavigate} className="flex gap-2 items-start">
        {/* user avatar */}
        <div>
          <Avatar size="sm" src={user.profilePic} />
        </div>

        {/* information part such as username,fullnamne, and followers */}
        <div className="flex flex-col  text-xs text-left">
          <p className="text-sm">@{user.username}</p>
          <p className="text-gray-500">{user.name}</p>
          <p>{user.followers.length}followers</p>
        </div>
      </div>
      {/* follow unfollow button */}
      <div>
        {/* <Button size="sm" onClick={handleFollowUnfollow} isLoading={updating}>
          {follwing ? "Unfollow" : "Follow"}
        </Button> */}
        <Button size="sm" onClick={handleNavigate}>
         <RiShareForward2Line />
        </Button>
      </div>
    </div>
  );
};

export default ProfileCards;
