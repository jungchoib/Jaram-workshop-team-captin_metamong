import styled from "styled-components";

const Button = styled.button`
  margin-top: 24px;
  margin-bottom: 40px;
  font-weight: bold;
  padding: 20;
  background-color: #d9d9d9;
  font-size: 20px;
  padding: 10px 30px;
  text-align: center;
  border-radius: 16px;
  border: 0.1rem solid slategrey;
  text-align: center;

  &:hover {
    background-color: darkgrey;
  }

  &:focus {
    background-color: darkgrey;
    box-shadow: 0 4px 2px 0 rgba(0, 0, 0, 0.24),
      0 10px 10px 0 rgba(0, 0, 0, 0.19);
  }
`;

export default Button;
