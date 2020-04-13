import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as _ from 'lodash'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import './map.css';

type MapItems = {
  id: number,
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
    "id": 1,
    "title": "Brügge Café",
    "description": "Ein sehr schönes Café",
    "coordinates": [9.964037, 53.568269]
  }, {
    "id": 2,
    "title": "Asia Unique",
    "description": "Bester Imbiss auf der Schanze",
    "coordinates": [9.9655847, 53.5625815]
  }
]

const MapAppController = () => {
  const [mapCenter, setMapCenter] = useState([9.96403, 53.56826] as MapLocation)
  const [readMapCenter, setReadCenter] = useState([9.96403, 53.56826] as MapLocation)

  useEffect(() => {
    if (!_.isEqual(readMapCenter, mapCenter)) {
      setMapCenter(readMapCenter)
    }
  }, [readMapCenter])

  return (
    <>
      <div className='mapView'>
        <MapView center={mapCenter} readCenter={readMapCenter} setReadCenter={setReadCenter} locations={mockData} />
      </div>
      <div className='contentView'>
        <ContentView setMapCenter={setMapCenter} locations={mockData} />
      </div>
    </>
  )
}

const ContentView = (props) => {
  const locations = props.locations
  const setMapCenter = props.setMapCenter
  const handleClick = (ev, coordinates) => {
    ev.preventDefault()
    setMapCenter(coordinates)
  }

  return (
    <div>
      {locations.map(l => {
        return (
          <div key={l.id}>
            <h2><a href='x' onClick={(ev) => handleClick(ev, l.coordinates)}>{l.title}</a></h2>
            {l.description}
          </div>
        )
      })}
    </div>
  )
}

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_KEY
})

const MapView = (props: any) => {
  const center = props.center
  const setReadCenter = props.setReadCenter
  const locations = props.locations
  const [zoom, setZoom] = useState([12] as [number])

  const handleMoveEnd = useCallback(_.debounce((map: mapboxgl.Map) => {
    console.log("zoooom")
    setReadCenter(map.getCenter().toArray().map(i => Number(i.toFixed(5))))
    setZoom([map.getZoom()])
  }, 500), [])

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      center={center}
      zoom={zoom}
      movingMethod="easeTo"
      onMoveEnd={map => handleMoveEnd(map)}
      containerStyle={{
        height: '100%',
        width: '100%'
      }}
    ><Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
        {locations.map(i => {
          return (<Feature coordinates={i.coordinates} />)
        })}

      </Layer>
    </Map>
  )
}

export { MapView, ContentView, MapAppController }