import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaClock, FaHeart } from 'react-icons/fa';
import { collection, onSnapshot, query, where, addDoc, getDocs } from 'firebase/firestore';
import { db, storage, auth } from '../../firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { Spinner, ListGroup, Button, Modal } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';

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
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export default function RecentTracks({ setCurrentSong, setIsPlaying }) {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, []);

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

    useEffect(() => {
        if (user) {
            const playlistsCollection = collection(db, 'playlists');
            const playlistsQuery = query(
                playlistsCollection,
                where('idUsuario', '==', user.uid)
            );

            // Escuchar los cambios en tiempo real en las playlists
            const unsubscribe = onSnapshot(playlistsQuery, (snapshot) => {
                const playlistsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPlaylists(playlistsList);
                setLoadingPlaylists(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

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
        setIsPlaying(true);
    };

    const handleHeartClick = (song) => {
        setSelectedSong(song);
        setShowModal(true);
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            // Referencia a la colección de canciones de la playlist
            const songsCollection = collection(db, `playlists/${playlistId}/canciones`);
            // Comprobamos si la canción ya existe en la playlist
            const songsQuery = query(songsCollection, where('id', '==', selectedSong.id));
            const songsSnapshot = await getDocs(songsQuery);

            if (!songsSnapshot.empty) {
                alert('Esta canción ya está en la playlist seleccionada.');
                return;
            }

            // Obtenemos la portada del álbum
            const album = albums.find((album) => album.id === selectedAlbum);
            const portadaUrl = album ? album.cover : '';

            // Agregamos toda la estructura de datos de la canción seleccionada junto con la portada
            const songData = {
                ...selectedSong,
                portada: portadaUrl,
            };

            await addDoc(songsCollection, songData);
            setShowModal(false);
            alert('Canción agregada a la playlist exitosamente');
        } catch (error) {
            console.error('Error al agregar la canción a la playlist:', error);
            alert('Hubo un error al agregar la canción. Por favor intenta de nuevo.');
        }
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
                        <SongItem key={song.id}>
                            <div onClick={() => handleSongClick(song)}>
                                {song.orden}. {song.nombre} - {song.duracion}
                            </div>
                            <FaHeart
                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                                title="Agregar a favoritos"
                                onClick={() => handleHeartClick(song)}
                            />
                        </SongItem>
                    ))}
                </SongList>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar a Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingPlaylists ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Cargando playlists...</span>
                        </Spinner>
                    ) : (
                        <ListGroup>
                            {playlists.map((playlist) => (
                                <ListGroup.Item key={playlist.id}>
                                    <Button
                                        variant="link"
                                        onClick={() => handleAddToPlaylist(playlist.id)}
                                    >
                                        {playlist.nombre}
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </AlbumsContainer>
    );
}
