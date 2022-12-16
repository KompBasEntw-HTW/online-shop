import { TileLayer, MapContainer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet'
import PageLoader from '../General/PageLoader'
import clsx from 'clsx'

const CustomMarker = ({ position, icon }: { position: [number, number]; icon: Icon }) => {
  return <Marker position={position} icon={icon}></Marker>
}

const MapComponent = ({
  centerPosition,
  className
}: {
  centerPosition: [number, number]
  className: string
}) => {
  const CustomIcon = new Icon({
    iconUrl: '/coffee-roastery-location-icon.svg',
    iconSize: [40, 40]
  })

  const mapStyle = clsx('border h-[400px] overflow-hidden rounded-md border-gray-300', className)

  return (
    <MapContainer
      id='map'
      className={mapStyle}
      center={centerPosition}
      zoom={10}
      placeholder={<PageLoader spinnerSize='h-24 w-24' />}
      doubleClickZoom={false}
      boxZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <CustomMarker position={centerPosition} icon={CustomIcon} />
    </MapContainer>
  )
}

export default MapComponent
