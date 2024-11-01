import React, { useState, useEffect, useRef } from 'react';
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
    cursor: pointer;
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

export default function Player({ currentSong, isPlaying, setIsPlaying }) {
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(new Audio(currentSong?.url));

    // Solo cambia el audio cuando cambia `currentSong`
    useEffect(() => {
        if (currentSong?.url) {
            audioRef.current.src = currentSong.url;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentSong]); // Eliminamos `isPlaying` de esta dependencia

    // Maneja el progreso y play/pausa sin reiniciar la canción
    useEffect(() => {
        const audio = audioRef.current;
        const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);

        if (isPlaying) {
            audio.play();
            audio.addEventListener('timeupdate', updateProgress);
        } else {
            audio.pause();
        }

        return () => audio.removeEventListener('timeupdate', updateProgress);
    }, [isPlaying]);

    const togglePlayPause = () => setIsPlaying(!isPlaying);

    const handleProgressBarClick = (event) => {
        const progressBar = event.target;
        const clickPositionX = event.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.offsetWidth;
        const clickRatio = clickPositionX / progressBarWidth;
        const newTime = audioRef.current.duration * clickRatio;
        audioRef.current.currentTime = newTime;
        setProgress(clickRatio * 100);
    };

    return (
        <PlayerContainer>
            <AlbumCover animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ repeat: Infinity, duration: 5 }}>
                <CoverImage src={currentSong?.cover || 'default_cover.jpg'} alt="Album cover" />
            </AlbumCover>
            <SongInfo>
                <SongTitle>{currentSong?.title || 'Selecciona una canción'}</SongTitle>
                <SongArtist>{currentSong?.artist || ''}</SongArtist>
            </SongInfo>
            <ProgressContainer>
                <ProgressBar onClick={handleProgressBarClick}>
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
                <IconButton><FaHeart /></IconButton>
            </Controls>
        </PlayerContainer>
    );
}
