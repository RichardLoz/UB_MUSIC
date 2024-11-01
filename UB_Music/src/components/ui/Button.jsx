import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #1db954;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1ed760;
  }

  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

export default function Button({ children, onClick, disabled = false }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}
