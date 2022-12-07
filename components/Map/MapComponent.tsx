import { TileLayer, MapContainer, Marker } from 'react-leaflet'

const MapComponent = () => {
  return (
    <MapContainer
      id='map'
      className='relative z-0 h-[93vh] overflow-hidden'
      center={[52.520008, 13.404954]}
      zoom={14}
      scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[52.520008, 13.404954]} />
    </MapContainer>
  )
}

export default MapComponent
