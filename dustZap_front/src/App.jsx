import styled from "styled-components";
import Outside from "./component/Outside.jsx";
import InsideDust from "./component/InsideDust.jsx";
import "./App.css";
import { DUMMY_DATA } from "./data.js";
import CustomPopup from "./component/Popup.jsx";
import { useState, useEffect } from "react";
import Button from "./component/Button.jsx";
import { ref, onValue, off } from "firebase/database";
import { database } from "./firebase";
import PropTypes from "prop-types";

App.propTypes = {
  Dustset: PropTypes.string,
};

const Wrapper = styled.div`
  font-style: normal;
  background: linear-gradient(white, ${(props) => props.boxColor});
  padding: 0;
`;

function App() {
  const [visibility, setVisibility] = useState(false);

  const popupCloseHandler = (e) => {
    setVisibility(e);
  };

  const [dustRate, setDustRate] = useState("");

  useEffect(() => {
    const airQualityRef = ref(database, "/air_quality/dust");
    const listener = onValue(airQualityRef, (snapshot) => {
      const ip = snapshot.val();
      setDustRate(ip);
    });

    // Clean up the subscription
    return () => off(airQualityRef, listener);
  }, []);

  //const Dustset = 19.2;

  const Dustset = dustRate;

  let selectDust = "";
  if (Dustset <= 30) {
    selectDust = "good";
  } else if (Dustset > 30 && Dustset <= 80) {
    selectDust = "average";
  } else if (Dustset > 80 && Dustset <= 150) {
    selectDust = "bad";
  } else if (Dustset > 150) {
    selectDust = "very_bad";
  }

  return (
    <>
      <Wrapper boxColor={DUMMY_DATA[selectDust].color}>
        <InsideDust Dust={selectDust} DustRate={Dustset}></InsideDust>
        <div className="App">
          <Button onClick={(e) => setVisibility(!visibility)}>
            야외 미세먼지는?
          </Button>
          <CustomPopup
            onClose={popupCloseHandler}
            show={visibility}
            title=" 야외 미세먼지는?"
          >
            <Outside></Outside>
          </CustomPopup>
        </div>
      </Wrapper>
    </>
  );
}

export default App;
