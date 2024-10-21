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
      <Map position={[1.28960592759792, 103.84835955306676]} zoom={12}/>
    </div>
  );
}
