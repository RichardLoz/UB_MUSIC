import React from 'react';
import styled from 'styled-components';

const ArtistGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    justify-items: center;
`;

const ArtistCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: white;
`;

const ArtistImage = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #555;
    margin-bottom: 10px;
`;

export default function TopArtists() {
    const topArtists = ["Ed Sheeran", "The Weeknd", "Dua Lipa", "Harry Styles", "Tones and I"];

    return (
        <div>
            <h2>Top Artistas</h2>
            <ArtistGrid>
                {topArtists.map((artist, index) => (
                    <ArtistCard key={index}>
                        <ArtistImage />
                        <span>{artist}</span>
                    </ArtistCard>
                ))}
            </ArtistGrid>
        </div>
    );
}
