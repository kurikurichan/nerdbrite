import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function GoogMap({ mapKey, center }) {

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: mapKey,
        libraries: ['places']// ,
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
