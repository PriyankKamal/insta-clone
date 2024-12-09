import React, { useContext, useEffect, useState, lazy, Suspense } from "react";

import "./ExplorePost.css";
// import ExploreDynamic from "./ExploreDynamic";
const ExploreDynamic = lazy(() => import("./ExploreDynamic"));

import { AuthContext } from "../store/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPanorama } from "@fortawesome/free-solid-svg-icons";

import { LazyLoadImage } from "react-lazy-load-image-component";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
// import { Box } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from "@mui/material/CircularProgress";

const ExplorePosts = () => {
  const [explImages, setExplImages] = useState([]);
  const { token } = useContext(AuthContext);
  // const [toggle,setToogle] = useState(true)
  const [loader, setLoader] = useState(true);

  const fetchImages = async () => {
    try {
      setLoader(true);
      const resExplore = await fetch("http://localhost:2000/allposts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const expdata = await resExplore.json();
      // console.log(expdata);
      setExplImages(expdata);
      if (resExplore.ok) {
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      }
    } catch (error) {
      console.log("fetch images explore error", error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  // const [isDynamicVisible, setIsDynamicVisible] = useState(false);

  const imageClicking = (key) => {
    setSelectedImage(key);
  };

  const [showModel, setShowModal] = useState(false);

  const closeModal = () => {
    return setShowModal(false);
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isExtraSmallScreen = useMediaQuery('(max-width:400px)');

  let cols;
  if (isExtraSmallScreen) {
    cols = 1;
  } else if (isSmallScreen) {
    cols = 2;
  } else {
    cols = 3;
  }
  
  function srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  return (
    <>
      {
        // toggle &&(

        <div className=" explotre-container">
          {loader && (
            <div className="loadimg-expl">
   
              <CircularProgress />
            </div>
          )}


          <div
            className="explore-card "
           
          >
           

            
              <ImageList variant="masonry" cols={cols} gap={8} sx={{position:"unset"}}>
                {explImages.map((item) => (
                  <ImageListItem sx={{position:"unset"}} key={item._id} onClick={() => setShowModal(true)}>
                    <img
                      srcSet={`${item.photo}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.photo}?w=248&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                      onClick={() => {
                        imageClicking(item);
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            {/* </Box> */}
 
            {showModel && (
           
              <Suspense fallback={<div>Loading...</div>}>
                <ExploreDynamic
                  imageKey={selectedImage}
                  closeModal={closeModal}
                />
              </Suspense>
            )}
          </div>
        </div>
        // )
      }
    </>
  );
};

export default ExplorePosts;
