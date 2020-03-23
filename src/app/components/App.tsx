import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import './map.css';

type MapItems = {
  title: string,
  description: string,
  coordinates: MapLocation
}

type MapLocation = [number, number]

type MapAppViewProps = {
  center?: MapLocation,
  features?: MapLocation
}

type ContentViewProps = {
  locations?: MapItems[]
}

const mockData: MapItems[] = [
  {
    "title": "Brügge Café",
    "description": "Ein sehr schönes Café",
    "coordinates": [9.964037, 53.568269]
  }, {
    "title": "Asia Unique",
    "description": "Bester Imbiss auf der Schanze",
    "coordinates": [9.9655847, 53.5625815]
  }
]

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_KEY
});


export const MapAppController = () => {
  const [mapPosition, setMapPosition] = useState([9.964037, 53.568269] as MapLocation)

  return (
    <>
      <div className='mapView'>
        <MapView center={mapPosition} />
      </div>
      <div className='contentView'>
        <ContentView state={{ mapPosition, setMapPosition }} locations={mockData} />
      </div>
    </>
  )
}

export const ContentView = (props) => {
  const locations = props.locations
  const state = props.state
  const handleClick = (ev, coordinates) => {
    ev.preventDefault()
    state.setMapPosition(coordinates)
  }

  return (
    <>
      {locations.map(l => {
        return (
          <div>
            <h2><a href='x' onClick={(ev) => handleClick(ev, l.coordinates)}>{l.title}</a></h2>
            {l.description}
          </div>
        )
      })}
    </>
  )
}

export const MapView = (props: MapAppViewProps) => {
  const center = props.center
  const features = props.features
  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      center={center}
      zoom={[12]}
      movingMethod="easeTo"
      containerStyle={{
        height: '100%',
        width: '100%'
      }}
    ><Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
        <Feature coordinates={[9.964037, 53.568269]} />
        <Feature coordinates={[9.984638, 53.551576]} />
      </Layer>
    </Map>
  )
}


/*
<div style={{ height: '100%', width: '100%', backgroundColor: '#c3c3c3' }}>
      {JSON.stringify(center)}<br />
      {JSON.stringify(center)}
    </div>
      */