import React from 'react'

import './Loading.css';
import loadingGif from './stargif.gif';


export default function Loading() {
  return (
    <div className="loading-wrapper">

        <img src={loadingGif} id="loadgif" alt="shooting star gif for loading" />
        <p id="loadtext" className="fadeout">Loading...</p>

    </div>
  )
}
