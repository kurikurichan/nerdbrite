export const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
};

export const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapKey,
    libraries// ,
    // ...otherOptions
  });
