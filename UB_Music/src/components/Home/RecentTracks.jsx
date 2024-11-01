import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaClock } from 'react-icons/fa';

const recentTracks = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", cover: "src/assets/images/profile/profile.jpg" },
    { id: 2, title: "Shape of You", artist: "Ed Sheeran", cover: "src/assets/images/profile/profile.jpg" },
    { id: 3, title: "Dance Monkey", artist: "Tones and I", cover: "src/assets/images/profile/profile.jpg" },
    { id: 4, title: "Watermelon Sugar", artist: "Harry Styles", cover: "src/assets/images/profile/profile.jpg" },
    { id: 5, title: "Levitating", artist: "Dua Lipa", cover: "src/assets/images/profile/profile.jpg" },
    { id: 6, title: "Stay", artist: "The Kid LAROI & Justin Bieber", cover: "src/assets/images/profile/profile.jpg" },
    { id: 7, title: "Watermelon Sugar", artist: "Harry Styles", cover: "src/assets/images/profile/profile.jpg" },
];

const RecentTracksContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    background: linear-gradient(135deg, #333, #222);
    border-radius: 10px;
    color: white;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const Title = styled.h2`
    display: flex;
    align-items: center;
    font-size: 1.5em;
`;

const TrackCarousel = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding-bottom: 10px;
    scroll-behavior: smooth;
    
    &::-webkit-scrollbar {
        height: 8px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius: 4px;
    }
`;

const TrackCard = styled(motion.div)`
    background-color: #444;
    border-radius: 10px;
    min-width: 150px;
    overflow: hidden;
    position: relative;
`;

const CoverImage = styled.img`
    width: 30%;
    height: 30%;
    object-fit: cover;
`;

const TrackInfo = styled.div`
    padding: 10px;
    color: white;
`;

const TrackTitle = styled.h3`
    font-size: 1em;
    font-weight: bold;
`;

const TrackArtist = styled.p`
    color: #aaa;
    font-size: 0.9em;
`;

const PlayOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    pointer-events: none; /* Asegura que no bloquee interacciones con otros elementos */
`;

export default function RecentTracks() {
    const [hoveredTrack, setHoveredTrack] = useState(null);

    return (
        <RecentTracksContainer>
            <Header>
                <Title>
                    <FaClock style={{ marginRight: '8px' }} />
                    Últimos temas escuchados
                </Title>
            </Header>
            <TrackCarousel>
                {recentTracks.map((track) => (
                    <TrackCard
                        key={track.id}
                        whileHover={{ scale: 1.05 }}
                        onHoverStart={() => setHoveredTrack(track.id)}
                        onHoverEnd={() => setHoveredTrack(null)}
                    >
                        <CoverImage src={track.cover} alt={`${track.title} cover`} />
                        {hoveredTrack === track.id && (
                            <PlayOverlay>
                                <FaPlay color="white" size={24} />
                            </PlayOverlay>
                        )}
                        <TrackInfo>
                            <TrackTitle>{track.title}</TrackTitle>
                            <TrackArtist>{track.artist}</TrackArtist>
                        </TrackInfo>
                    </TrackCard>
                ))}
            </TrackCarousel>
        </RecentTracksContainer>
    );
}