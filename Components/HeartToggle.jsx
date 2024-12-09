import React, { useContext, useState } from "react";
import "./Heart.css";
import { AuthContext } from "../store/Auth";
const HeartToggle = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const { token } = useContext(AuthContext);
  const toggleHeart = () => {
    setLiked(!liked);
  };

//   const handleLikes = async () => {
//     try {
//       const res = await fetch("http://localhost:2000/likes", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           postId: postId,
//         }),
//       });
//       const data = await res.json();
//       console.log("likes data: ", data);
//       setLikes(data);
//     } catch (error) {
//       console.log("handle like error", error);
//     }
//   };

  const handleClick = () => {
    // handleLikes();
    toggleHeart();
  };

  return (
    <>
      <div className="heart-container " onClick={handleClick}>
        <svg
          className={`heart ${liked ? "liked" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21C12 21 4 14 4 8.5C4 6.015 5.79 4 8.5 4C10.28 4 11.755 5.09 12 6.27C12.245 5.09 13.72 4 15.5 4C18.21 4 20 6.015 20 8.5C20 14 12 21 12 21Z" />
        </svg>
        {/* <p className="mb-0">23 Likes</p> */}
      </div>
    </>
  );
};

export default HeartToggle;
