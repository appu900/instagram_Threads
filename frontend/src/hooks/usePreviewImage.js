import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
  const [imageurl, setImageUrl] = useState("");
  const showToast = useShowToast();

  //   function to handle image change
  function handleImageChange(e) {
    const file = e.target.files[0];

    // check if file is an image
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };

      reader.readAsDataURL(file); // it will conevert to base 64 string
    } else {
      showToast("Invalid file type", "please select an image file", "error");
    }
  }
  console.log(imageurl);
  return { handleImageChange, imageurl };
};

export default usePreviewImage;
