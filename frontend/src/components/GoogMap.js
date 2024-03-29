import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function GoogMap({ mapKey, center }) {

    const [ libraries ] = useState(['places']);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: mapKey,
        libraries// ,
        // ...otherOptions
    });

    if (loadError) return <div>Map cannot be loaded right now, sorry.</div>

    return isLoaded && (
        <div className="map">
            <GoogleMap
                mapContainerStyle={{ display: "absolute", height: "400px", width: "400px"}}
                zoom={16}
                center={center}
                options={{
                    mapTypeControl: false,
                    fullscreenControl: false
                }}
            >
                <Marker
                    position={center}
                />
            </GoogleMap>
        </div>
    )
}
