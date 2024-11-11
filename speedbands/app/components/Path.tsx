import { PathObj } from "@/lib/speedband";
import { Polyline, Tooltip } from "react-leaflet";

type PathProps = {
  onClick: () => void;
  path: PathObj;
  opacity: number;
}

export default function MapPath({ onClick, path, opacity }: PathProps) {
  const lineOptions = {
    color: path.color,
    weight: path.weight,
  }

  const positions = [
    path.start, path.end
  ];

  return (
    <Polyline
      pathOptions={lineOptions}
      positions={positions}
      opacity={opacity}
      eventHandlers={{
        click: () => { onClick() }
      }}>
      <Tooltip>
        {path.label}
      </Tooltip>
    </Polyline>
  )
}