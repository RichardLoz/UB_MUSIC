import React from 'react';
import { IconContext } from 'react-icons';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const ButtonContainer = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #F8D9C0;
    margin-top: 20px;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease;
    &:hover {
        color: #fff;
        transform: scale(1.05);
    }
    &.active {
        color: #fff;
    }
`;

const ButtonTitle = styled.p`
    margin-top: 5px;
    font-size: 0.9em;
`;

export default function SidebarButton({ to, icon, title }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <ButtonContainer to={to} className={isActive ? 'active' : ''}>
            <IconContext.Provider value={{ size: '24px' }}>
                {icon}
            </IconContext.Provider>
            <ButtonTitle>{title}</ButtonTitle>
        </ButtonContainer>
    );
}
