import { Speedband } from "@/lib/speedband";
import SpeedbandListItem from "./SpeedbandListItem";
import { LatLng } from "leaflet";
import styles from "./SpeedbandList.module.css";

type SpeedbandListProps = {
  speedbands: Array<Speedband>;
}

export default function SpeedbandList({ speedbands }: SpeedbandListProps) {
  const listItemClicked = (id: LatLng, selectedStatus: boolean) => {
    return !selectedStatus;
  }

  return (
    <div className={styles.speedbandList}>
      <table>
        <tbody>
          <tr>
            <th>Selected</th>
            <th>Coords</th>
            <th>Road</th>
          </tr>
          {speedbands.map(band => {
            return (
              <SpeedbandListItem
                listItemClicked={listItemClicked}
                speedband={band}>
              </SpeedbandListItem>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}