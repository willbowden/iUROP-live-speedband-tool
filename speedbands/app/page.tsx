import { useMemo } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return (
    <>
      
      <Map position={[1.28960592759792, 103.84835955306676]} zoom={12} className={styles.mapContainer} />
    </>
  );
}
