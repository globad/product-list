import React, { useState, useEffect, useRef } from "react";
import "./zoom-image.css";

function ZoomImage({ images, title, thumbnail }) {
  const imagesCount = images && Array.isArray(images) ? images.length : 0;
  const isActive = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const onMouseEnter = (event) => {
    setIsVisible(true);
    isActive.current = true;
  };

  const onMouseLeave = (event) => {
    setIsVisible(false);
    isActive.current = false;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isActive.current) {
        return;
      }
      setCurrentImage((prevState) => {
        if (imagesCount && prevState < imagesCount - 1) {
          return prevState + 1;
        } else {
          return 0;
        }
      });
    }, 1500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="zoom-image-container"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img className="product-thumbnail" src={thumbnail} alt={title}></img>
      <div className="zoomed-image-wrapper">
        {imagesCount ? (
          images.map((image, index) => {
            return (
              <img
                key={index}
                className="zoomed-image"
                style={{
                  display:
                    currentImage === index && isVisible ? "block" : "none"
                }}
                src={image}
                alt={title}
              ></img>
            );
          })
        ) : (
          <img className="zoomed-image" src={thumbnail} alt={title}></img>
        )}
      </div>
    </div>
  );
}

export default ZoomImage;
