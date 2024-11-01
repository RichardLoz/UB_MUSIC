import React, { useState } from 'react';
import styled from 'styled-components';
import RecentTracks from './RecentTracks';
import RecommendedTracks from './RecommendedATracks';
import Player from './Player';
import TopArtists from './TopArtists';
import SearchBar from './SearchBar';

const MainContent = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto;
    gap: 20px;
    padding: 15px;
    background-color: #181818;
    overflow-y: auto;
`;

const HeaderSection = styled.div`
    grid-column: 1 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Section = styled.div`
    background-color: #1e1e2f;
    padding: 10px;
    border-radius: 10px;
    color: white;
`;

export default function Home() {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false); // Define isPlaying y setIsPlaying aquí

    return (
        <MainContent>
            <HeaderSection>
                <SearchBar onSearch={(query) => console.log("Buscando:", query)} />
            </HeaderSection>
            <Section style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
                {/* Pasamos currentSong, isPlaying y setIsPlaying al Player */}
                <Player currentSong={currentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
            </Section>
            <Section style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
                <RecommendedTracks />
            </Section>
            <Section style={{ gridColumn: '1 / 2', gridRow: '3 / 4' }}>
                {/* Pasamos setCurrentSong y setIsPlaying a RecentTracks */}
                <RecentTracks setCurrentSong={setCurrentSong} setIsPlaying={setIsPlaying} />
            </Section>
            <Section style={{ gridColumn: '2 / 3', gridRow: '3 / 4' }}>
                <TopArtists />
            </Section>
        </MainContent>
    );
}