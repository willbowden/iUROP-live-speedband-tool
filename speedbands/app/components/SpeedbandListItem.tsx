import { Speedband } from "@/lib/speedband"
import { prettyCoords } from "@/util/stringCoordsToLatLng";

type SpeedbandListItemProps = {
  speedband: Speedband;
}

export default function SpeedbandListItem({ speedband }: SpeedbandListItemProps) {
  return (
    <tr>
      <td>No</td>
      <td>{prettyCoords(speedband.id)}</td>
      <td>{speedband.path.label}</td>
    </tr>
  )
}