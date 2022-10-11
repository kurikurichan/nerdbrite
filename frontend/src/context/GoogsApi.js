import React, { createContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useJsApiLoader } from '@react-google-maps/api';
import { getMapKey } from '../store/events';

// hello the purpose of this is to attempt to load the useJsApiLoader in one spot only

export const ApiContext = createContext();

function GoogsApiProvider(props) {

    const dispatch = useDispatch();

    const [ libraries ] = useState(['places']);
    const [ keyLoaded, setKeyLoaded ] = useState(false);

    const mapKey = useSelector(state => state.events.googleKey);

    let { isLoaded, loadError } = useJsApiLoader(typeof mapKey !== 'string' ? {googleMapsApiKey: mapKey,libraries} : null);

    useEffect(() => {
        dispatch(getMapKey()).then(() => setKeyLoaded(true));
    }, [dispatch]);

  return keyLoaded && (
    <ApiContext.Provider value={{ isLoaded, loadError, mapKey }}>
        {props.children}
    </ApiContext.Provider>
  )
}

export default GoogsApiProvider;
