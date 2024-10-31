import React from 'react';
import styled from 'styled-components';
import Sidebar from '../sidebar/Sidebar';
import RecentTracks from './RecentTracks';
import RecommendedTracks from './RecommendedATracks';
import Player from './Player';
import TopArtists from './TopArtists';

const HomeContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: #181818;
`;

const MainContent = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto;
    gap: 20px;
    padding: 20px;
`;

const Section = styled.div`
    background-color: #1e1e2f;
    padding: 20px;
    border-radius: 10px;
    color: white;
`;

export default function Home() {
    return (
        <HomeContainer>
            <Sidebar />
            <MainContent>
                <Section style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
                    <Player />
                </Section>
                <Section style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
                    <RecommendedTracks />
                </Section>
                <Section style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
                    <RecentTracks />
                </Section>
                <Section style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
                    <TopArtists />
                </Section>
            </MainContent>
        </HomeContainer>
    );
}