import React, { useState, useEffect } from 'react';

function ImageFetcher() {
  const [imageUrl, setImageUrl] = useState(null);

  const fetchCatImage = () => {
    const apiEndpoint = 'https://api.thecatapi.com/v1/images/search';

    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        // The Cat API returns an array with an 'url' property in each object
        setImageUrl(data[0].url);
      })
      .catch(error => {
        console.error("Error fetching cat image:", error);
      });
  };

  useEffect(() => {
    fetchCatImage();
  }, []); 

  return (
    <div>
      <img 
          src={imageUrl} 
          alt="Random Cat" 
          style={{ height: '300px', width: '70%', margin: '10px', objectFit: 'cover'}} 
          onClick={fetchCatImage}  // Refresh the cat image when clicked
        /> 
    </div>
  );
}

export default ImageFetcher;
