import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../sidebar/Sidebar';

const LayoutContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: #181818;
`;

const ContentContainer = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

export default function MainLayout() {
    return (
        <LayoutContainer>
            <Sidebar />
            <ContentContainer>
                <Outlet /> {/* Esto renderiza el componente de la ruta actual, como Home o Favorites */}
            </ContentContainer>
        </LayoutContainer>
    );
}
