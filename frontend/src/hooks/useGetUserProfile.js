import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";



const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username} = useParams();  
  const showToast = useShowToast();  
  useEffect(()=>{
     const getUser = async() =>{
        try {
            const response = await fetch(`/api/users/profile/${username}`);
            const data = await response.json();
            if(data.error){
                showToast("Error in fetching user", data.error, "error");
                return;
            }
            setUser(data);
        } catch (error) {
            showToast("Error in fetching user", error.message, "error");
        }finally{
            setLoading(false);  
        }
     }
     getUser();
  },[username])

  return {user, loading};
};

export default useGetUserProfile;
