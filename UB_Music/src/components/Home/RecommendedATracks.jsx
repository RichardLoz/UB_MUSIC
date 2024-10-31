import React from 'react';
import styled from 'styled-components';

const TrackList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const TrackItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #2e2e3e;
    border-radius: 8px;
    color: white;
`;

const TrackInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

export default function RecommendedTracks() {
    const recommendedTracks = [
        { title: "Shape of You", artist: "Ed Sheeran" },
        { title: "Dance Monkey", artist: "Tones and I" },
        { title: "Watermelon Sugar", artist: "Harry Styles" },
        { title: "Levitating", artist: "Dua Lipa" },
    ];

    return (
        <div>
            <h2>Temas Recomendados</h2>
            <TrackList>
                {recommendedTracks.map((track, index) => (
                    <TrackItem key={index}>
                        <TrackInfo>
                            <strong>{track.title}</strong>
                            <span>{track.artist}</span>
                        </TrackInfo>
                        <button>▶️</button>
                    </TrackItem>
                ))}
            </TrackList>
        </div>
    );
}
