import { ref, onValue, off } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

export default function Outside() {
  const [air10quality, setAir10Quality] = useState();
  const [air25quality, setAir25Quality] = useState();
  const [sidoName, setSidoName] = useState();

  useEffect(() => {
    const airQualityRef = ref(database, "/air_quality/pm10Value");
    const listener = onValue(airQualityRef, (snapshot) => {
      const ip = snapshot.val();
      setAir10Quality(ip);
    });

    // Clean up the subscription
    return () => off(airQualityRef, listener);
  }, []);

  useEffect(() => {
    const rref = ref(database, "/air_quality/pm25Value");
    const listener = onValue(rref, (snapshot) => {
      const ip = snapshot.val();
      setAir25Quality(ip);
    });

    // Clean up the subscription
    return () => off(rref, listener);
  }, []);

  useEffect(() => {
    const rref = ref(database, "/air_quality/sidoName");
    const listener = onValue(rref, (snapshot) => {
      const ip = snapshot.val();
      setSidoName(ip);
    });

    // Clean up the subscription
    return () => off(rref, listener);
  }, []);

 
  return (
    <>
      <h3>지역 {sidoName}</h3>
      <p>미세먼지 {air10quality}㎍/m³</p>
      <p>초미세먼지 {air25quality}㎍/m³</p>
    </>
  );
}
