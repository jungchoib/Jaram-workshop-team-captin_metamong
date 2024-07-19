import MyroomDust from "./MyroomDust.jsx";
import InsideDustState from "./InsideDustState.jsx";
import styled from "styled-components";

const MyRoom = styled.h2`
  font-size: 24pt;
  margin-bottom: 0;
`

export default function InsideDust({ ...props }) {
  const test = props.Dust;
  const state = props.DustRate;
  return (
    <>
      <MyRoom>현재 내 방 상태는?</MyRoom>
      <InsideDustState dusts={test} face={state} />
      <MyroomDust dusts={state}></MyroomDust>
    </>
  );
}
