import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import * as _ from 'lodash'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
import './map.css'

type MapItem = {
  id: number
  title: string
  description: string
  coordinates: MapLocation
  category?: string
  isActive: boolean
}

type MapLocation = [number, number]

type MapAppViewProps = {
  center?: MapLocation
  features?: MapLocation
}

type ContentViewProps = {
  locations?: MapItem[]
}

type CardProps = {
  onClick?: React.MouseEventHandler
  children: object
  className: string
}

type MapViewProps = {
  activeLocationId: number
  setActiveLocationId: React.Dispatch<React.SetStateAction<Number>>
  mapCenter: MapLocation
  setMapCenter: React.Dispatch<React.SetStateAction<MapLocation>>
  setReadMapCenter: React.Dispatch<React.SetStateAction<MapLocation>>
  readMapCenter: MapLocation
  locations: MapItem[]
  setFeatureClicked: React.Dispatch<React.SetStateAction<Boolean>>
}

const mockData: MapItem[] = [
  {
    id: 1,
    title: 'Brügge Café',
    description:
      'Cozy little small café that serves very tasty sandwiches of dark bread. You can enjoy some good breakfast in the morning sun outside.',
    coordinates: [9.964037, 53.568269],
    category: 'Café',
    isActive: false,
  },
  {
    id: 2,
    title: 'Asia Unique',
    description:
      'Definitely not the most inspiring interior but really tasty chicken curry (#42) and a really nice owner.',
    coordinates: [9.9655847, 53.5625815],
    category: 'Quick Food',
    isActive: false,
  },
  {
    id: 3,
    title: 'Momo Ramen',
    description:
      'Enjoy hot Ramen in many different flavors in a stylish interior. This place is always packed so make sure to book a table in advance.',
    coordinates: [9.9628198, 53.5666469],
    category: 'Restaurant',
    isActive: false,
  },
  {
    id: 4,
    title: 'Grilly Idol',
    description: 'Simply the best burger in town. They also have places outside.',
    coordinates: [9.962166, 53.55239],
    category: 'Restaurant',
    isActive: false,
  },
]

function MapAppController() {
  const [mapCenter, setMapCenter] = useState([9.96403, 53.56826] as MapLocation)
  const [readMapCenter, setReadMapCenter] = useState([9.96403, 53.56826] as MapLocation)
  const [activeLocationId, setActiveLocationId] = useState(-1)
  const [featureClicked, setFeatureClicked] = useState(false)

  return (
    <>
      <div className='mapWrapper'>
        <div className='mapView'>
          <MapView
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
            readMapCenter={readMapCenter}
            setReadMapCenter={setReadMapCenter}
            locations={mockData}
            activeLocationId={activeLocationId}
            setActiveLocationId={setActiveLocationId}
            setFeatureClicked={setFeatureClicked}
          />
        </div>
      </div>
      <ContentView
        setMapCenter={setMapCenter}
        locations={mockData}
        activeLocationId={activeLocationId}
        setActiveLocationId={setActiveLocationId}
        setFeatureClicked={setFeatureClicked}
        featureClicked={featureClicked}
      />
    </>
  )
}

function Card(props: CardProps) {
  const { children, onClick, className } = props
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

function LocationCardContent(props) {
  const data: MapItem = props.data
  return (
    <div>
      <div className='header'>
        <span className='title'>{data.title}</span>
        <span className='category'>{data.category}</span>
      </div>
      <p>{data.description}</p>
    </div>
  )
}

function ContentView(props) {
  const {
    locations,
    setMapCenter,
    activeLocationId,
    setActiveLocationId,
    featureClicked,
    setFeatureClicked,
  } = props

  const refs = locations.reduce((acc, value) => {
    acc[value.id] = React.createRef()
    return acc
  }, {})

  const contentViewRef = useRef(null)

  const handleClick = (ev, id, coordinates) => {
    ev.preventDefault()
    setMapCenter(coordinates)
    setActiveLocationId(id)
  }

  useEffect(() => {
    if (featureClicked) {
      const scrollToPosition = refs[activeLocationId].current.offsetTop - 15
      console.log(refs[activeLocationId].current.offsetTop)
      contentViewRef.current.scrollTo({
        behavior: 'smooth',
        top: scrollToPosition,
      })
      setFeatureClicked(false)
    }
  }, [featureClicked])

  return (
    <div className='contentView' ref={contentViewRef}>
      {locations.map((location) => {
        let className = ''
        if (activeLocationId === location.id) {
          className = 'active'
        }
        return (
          <div
            ref={refs[location.id]}
            key={location.id}
            onClick={(ev) => handleClick(ev, location.id, location.coordinates)}
          >
            <Card className={className}>
              <LocationCardContent data={location}></LocationCardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_KEY,
  dragRotate: false,
  pitchWithRotate: false,
})

const MapView = React.memo((props: MapViewProps) => {
  const {
    activeLocationId,
    setActiveLocationId,
    mapCenter,
    setMapCenter,
    setReadMapCenter,
    readMapCenter,
    locations,
    setFeatureClicked,
  } = props

  const [zoom, setZoom] = useState([12] as [number])
  const equalizedMapCenter = [...mapCenter].map((i) => Number(i.toFixed(5)))

  useEffect(() => {
    // only update mapCenter when map has moved
    if (!_.isEqual(equalizedMapCenter, readMapCenter)) {
      setMapCenter(readMapCenter)
    }
  }, [readMapCenter])

  const handleMoveEnd = (map: mapboxgl.Map) => {
    setReadMapCenter(
      map
        .getCenter()
        .toArray()
        .map((i) => Number(i.toFixed(5))) as [number, number]
    )
    setZoom([map.getZoom()])
  }

  const handleClickOnFeature = (id) => {
    setActiveLocationId(id)
    setFeatureClicked(true)
  }

  const getFeatureIcon = (id: number) => {
    if (id === activeLocationId) {
      return 'b_default_active_marker'
    } else {
      return 'b_default_marker'
    }
  }

  return (
    <Map
      style='mapbox://styles/boernard/ck98t26iu025b1ilhqfkqw13j/draft'
      center={mapCenter}
      zoom={zoom}
      movingMethod='easeTo'
      onMoveEnd={(map) => handleMoveEnd(map)}
      containerStyle={{
        height: '100%',
        width: '100%',
      }}
    >
      <Layer
        type='symbol'
        id='marker'
        layout={{ 'icon-image': ['get', 'icon'], 'icon-allow-overlap': true }}
      >
        {locations.map((i) => (
          <Feature
            key={i.id}
            coordinates={i.coordinates}
            onClick={() => handleClickOnFeature(i.id)}
            properties={{ icon: getFeatureIcon(i.id), id: i.id }}
          />
        ))}
      </Layer>
    </Map>
  )
})

export { MapView, ContentView, MapAppController }
