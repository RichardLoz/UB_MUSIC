import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaClock } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { Spinner } from 'react-bootstrap';

const AlbumsContainer = styled.div`
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
    gap: 10px;
    padding-bottom: 10px;
`;

const TrackCard = styled.div`
    background-color: #444;
    border-radius: 10px;
    width: 120px;
    height: 120px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
`;

const CoverImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const TrackInfo = styled.div`
    text-align: center;
    margin-top: 8px;
    color: white;
`;

const TrackTitle = styled.h3`
    font-size: 0.9em;
    font-weight: bold;
    margin: 5px 0 0 0;
`;

const TrackArtist = styled.p`
    color: #aaa;
    font-size: 0.8em;
    margin: 0;
`;

const SongList = styled.div`
    margin-top: 20px;
`;

const SongItem = styled.div`
    padding: 5px 0;
    color: white;
    border-bottom: 1px solid #555;
    cursor: pointer;
`;

export default function RecentTracks({ setCurrentSong, setIsPlaying }) {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchAlbums = async () => {
            const albumsCollection = collection(db, 'albumes');
            const albumsSnapshot = await getDocs(albumsCollection);
            const albumsList = await Promise.all(
                albumsSnapshot.docs.map(async (doc) => {
                    const albumData = doc.data();
                    const coverUrl = await getDownloadURL(ref(storage, albumData.portada));
                    return { id: doc.id, title: albumData.nombre, artist: albumData.artista, cover: coverUrl };
                })
            );
            setAlbums(albumsList);
            setLoading(false);
        };
        
        fetchAlbums();
    }, []);

    const handleAlbumClick = async (albumId) => {
        const songsCollection = collection(db, `albumes/${albumId}/canciones`);
        const songsSnapshot = await getDocs(songsCollection);
        const songsList = songsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSongs(songsList);
        setSelectedAlbum(albumId);
    };

    const handleSongClick = (song) => {
        setCurrentSong({
            title: song.nombre,
            artist: song.artista || '',
            cover: albums.find((album) => album.id === selectedAlbum)?.cover,
            url: song.ruta,
        });
        setIsPlaying(true); // Activa la reproducción
    };

    return (
        <AlbumsContainer>
            <Header>
                <Title>
                    <FaClock style={{ marginRight: '8px' }} />
                    Álbumes Recientes
                </Title>
            </Header>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            ) : (
                <TrackCarousel>
                    {albums.map((album) => (
                        <TrackCard key={album.id} onClick={() => handleAlbumClick(album.id)}>
                            <CoverImage src={album.cover} alt={`${album.title} cover`} />
                            <TrackInfo>
                                <TrackTitle>{album.title}</TrackTitle>
                                <TrackArtist>{album.artist}</TrackArtist>
                            </TrackInfo>
                        </TrackCard>
                    ))}
                </TrackCarousel>
            )}
            {selectedAlbum && (
                <SongList>
                    <h3>Canciones</h3>
                    {songs.map((song) => (
                        <SongItem key={song.id} onClick={() => handleSongClick(song)}>
                            {song.orden}. {song.nombre} - {song.duracion}
                        </SongItem>
                    ))}
                </SongList>
            )}
        </AlbumsContainer>
    );
}
