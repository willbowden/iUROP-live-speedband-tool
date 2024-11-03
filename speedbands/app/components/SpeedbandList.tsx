import { Speedband } from "@/lib/speedband";
import styles from "@/page.module.css";
import SpeedbandListItem from "./SpeedbandListItem";
import { LatLng } from "leaflet";

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