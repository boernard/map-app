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
  const [readMapCenter, setReadMapCenter] = useState([9.96403, 53.56826] as MapLocation)

  return (
    <>
      <div className='mapView'>
        <MapView mapCenter={mapCenter} setMapCenter={setMapCenter} readMapCenter={readMapCenter} setReadMapCenter={setReadMapCenter} locations={mockData} />
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
            <h3><a href='x' onClick={(ev) => handleClick(ev, l.coordinates)}>{l.title}</a></h3>
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

const MapView = React.memo((props: any) => {
  const mapCenter = props.mapCenter
  const setMapCenter = props.setMapCenter
  const setReadMapCenter = props.setReadMapCenter
  const readMapCenter = props.readMapCenter
  const locations = props.locations
  const [zoom, setZoom] = useState([12] as [number])

  const equalizedMapCenter = [...mapCenter].map(i => Number(i.toFixed(5)))

  useEffect(() => {
    if (!_.isEqual(equalizedMapCenter, readMapCenter)) {
      setMapCenter(readMapCenter)
    }
  }, [readMapCenter])

  const handleMoveEnd = (map: mapboxgl.Map) => {
    console.log("handleMoveEnd")
    setReadMapCenter(map.getCenter().toArray().map(i => Number(i.toFixed(5))))
    setZoom([map.getZoom()])
  }

  return (
    <Map
      style="mapbox://styles/mapbox/streets-v9"
      center={mapCenter}
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
})

export { MapView, ContentView, MapAppController }