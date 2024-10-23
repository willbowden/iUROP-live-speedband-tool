import { Speedband } from "@/lib/speedband";
import styles from "@/page.module.css";
import SpeedbandListItem from "./SpeedbandListItem";

type SpeedbandListProps = {
  speedbands: Array<Speedband>;
}

export default function SpeedbandList({ speedbands }: SpeedbandListProps) {
  return (
    <div className={styles.speedbandList}>
      <table>
        <thead>
          <th>Selected</th>
          <th>Coords</th>
          <th>Road</th>
        </thead>
        <tbody>
          {speedbands.map(band => {
            return (
              <SpeedbandListItem
                speedband={band}>

              </SpeedbandListItem>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}