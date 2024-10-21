import { useMemo } from "react";
import Map from "@/components/Map";
import dynamic from "next/dynamic";

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return (
    <div>
      <Map />
    </div>
  );
}
