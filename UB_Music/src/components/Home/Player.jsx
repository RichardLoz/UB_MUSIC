import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRandom, FaStepBackward, FaPlay, FaPause, FaStepForward, FaSync, FaHeart } from 'react-icons/fa';

const PlayerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1e3a8a, #312e81);
    padding: 20px;
    border-radius: 20px;
    position: relative;
    color: white;
`;

const AlbumCover = styled(motion.div)`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;
`;

const CoverImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const SongInfo = styled.div`
    text-align: center;
    margin-bottom: 15px;
`;

const SongTitle = styled.h2`
    font-size: 1.5em;
    font-weight: bold;
`;

const SongArtist = styled.p`
    font-size: 1em;
    color: #a0aec0;
`;

const ProgressContainer = styled.div`
    width: 100%;
    max-width: 400px;
    margin: 20px 0;
`;

const ProgressBar = styled.div`
    height: 5px;
    background-color: #374151;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
`;

const Progress = styled(motion.div)`
    height: 100%;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    width: ${(props) => props.progress}%;
`;

const Controls = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 400px;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => (props.active ? '#ef4444' : '#9ca3af')};
    font-size: ${(props) => (props.main ? '1.5em' : '1em')};
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: white;
    }
`;

export default function Player() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const currentSong = {
        title: "Visiting Hours",
        artist: "Ed Sheeran",
        cover: "src/assets/images/home/disco.jpg", // Asegúrate de tener esta imagen en tu proyecto
    };

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
            }, 300);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlayPause = () => setIsPlaying(!isPlaying);

    return (
        <PlayerContainer>
            <AlbumCover animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }}>
                <CoverImage src={currentSong.cover} alt="Album cover" />
            </AlbumCover>

            <SongInfo>
                <SongTitle>{currentSong.title}</SongTitle>
                <SongArtist>{currentSong.artist}</SongArtist>
            </SongInfo>

            <ProgressContainer>
                <ProgressBar>
                    <Progress progress={progress} />
                </ProgressBar>
            </ProgressContainer>

            <Controls>
                <IconButton><FaRandom /></IconButton>
                <IconButton><FaStepBackward /></IconButton>
                <IconButton main onClick={togglePlayPause}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </IconButton>
                <IconButton><FaStepForward /></IconButton>
                <IconButton><FaSync /></IconButton>
                <IconButton active={isFavorite} onClick={() => setIsFavorite(!isFavorite)}>
                    <FaHeart />
                </IconButton>
            </Controls>
        </PlayerContainer>
    );
}
