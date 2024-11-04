import { Speedband } from "@/lib/speedband"
import { prettyCoords } from "@/util/stringCoordsToLatLng";
import { LatLng } from "leaflet";
import { useState } from "react";
import styles from "@/page.module.css";

type SpeedbandListItemProps = {
  listItemClicked: (id: LatLng, selectedStatus: boolean) => boolean;
  speedband: Speedband;
}

export default function SpeedbandListItem({ listItemClicked, speedband }: SpeedbandListItemProps) {
  const [selected, setSelected] = useState<boolean>(false);

  const onClick = () => {
    setSelected(listItemClicked(speedband.id, selected));
  }

  return (
    <tr onClick={onClick}>
      <td className={styles.checkboxContainer}>
        <input
          type="checkbox"
          onClick={onClick}
          value="selected"
          name="speedband"
          checked={selected} />
      </td>
      <td>{prettyCoords(speedband.id)}</td>
      <td>{speedband.path.label}</td>
    </tr>
  )
}