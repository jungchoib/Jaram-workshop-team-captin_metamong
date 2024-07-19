import { DUMMY_DATA } from "../data.js";
import styled from "styled-components";
import { ref, onValue, off } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

export default function InsideDustState(props) {
  let selectDust = props.dusts;
  let tabContent = "test";

  const Face = styled.div`
    font-size: 120px;
    margin-bottom: 0;
  `;

  const DustResult = styled.h1`
    font-size: 48px;
    margin: 0;
    font-weight: bold;
    color: ${DUMMY_DATA[selectDust].fontcolor};
  `;

  const Detail = styled.p`
    font-size: 20px;
    margin: 10px;
  `;

  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const airQualityRef = ref(database, "/air_quality/analysis");
    const listener = onValue(airQualityRef, (snapshot) => {
      const ip = snapshot.val();
      setAnalysis(ip);
    });

    // Clean up the subscription
    return () => off(airQualityRef, listener);
  }, []);

  if (selectDust) {
    tabContent = (
      <div>
        <Face>{DUMMY_DATA[selectDust].face}</Face>
        <DustResult>{DUMMY_DATA[selectDust].dust}</DustResult>
        <Detail>{analysis}</Detail>
        <Detail>{DUMMY_DATA[selectDust].description}</Detail>
      </div>
    );
  }

  return (
    <>
      <div>{tabContent}</div>
    </>
  );
}
