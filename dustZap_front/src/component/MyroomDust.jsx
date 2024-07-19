import styled from "styled-components";

const Room = styled.div`
  font-size: 16px;
`;

export default function MyroomDust(props) {
  return (
    <>
      <Room>미세먼지 농도 {props.dusts}㎍/m³</Room>
    </>
  );
}
