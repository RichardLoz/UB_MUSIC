import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const PlaylistContainer = styled.div`
    padding: 20px;
    background-color: #1e1e2f;
    border-radius: 10px;
    color: white;
`;

const StyledListGroupItem = styled(ListGroup.Item)`
    background-color: #2a2a3b !important;
    color: white !important;
    margin-bottom: 10px;
    border: none;
    border-radius: 5px;
    padding: 15px;
`;

const PlaylistActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    color: #ff4d4d;
    cursor: pointer;
    font-size: 1.2em;

    &:hover {
        color: #ff1a1a;
    }
`;

export default function UserPlaylists({ setCurrentSong, setIsPlaying }) {
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [playlistName, setPlaylistName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loadingSongs, setLoadingSongs] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchPlaylists = async () => {
                const playlistsCollection = collection(db, 'playlists');
                const playlistsQuery = query(
                    playlistsCollection,
                    where('idUsuario', '==', user.uid)
                );
                const playlistsSnapshot = await getDocs(playlistsQuery);
                const playlistsList = playlistsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPlaylists(playlistsList);
                setLoadingPlaylists(false);
            };

            fetchPlaylists();
        }
    }, [user]);

    const handleCreatePlaylist = async () => {
        if (playlistName.trim() === '') {
            alert('Por favor, introduce un nombre para la playlist.');
            return;
        }

        try {
            const playlistsCollection = collection(db, 'playlists');
            await addDoc(playlistsCollection, {
                nombre: playlistName,
                idUsuario: user.uid,
                emailUsuario: user.email,
                timestamp: new Date(),
            });
            setPlaylistName('');
            setShowModal(false);
            alert('Playlist creada con éxito');
            // Refetch playlists after creating a new one
            const playlistsQuery = query(
                playlistsCollection,
                where('idUsuario', '==', user.uid)
            );
            const playlistsSnapshot = await getDocs(playlistsQuery);
            const playlistsList = playlistsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPlaylists(playlistsList);
        } catch (error) {
            console.error('Error al crear la playlist: ', error);
            alert('Error al crear la playlist. Inténtalo de nuevo más tarde.');
        }
    };

    const handlePlaylistClick = async (playlistId) => {
        setLoadingSongs(true);
        const songsCollection = collection(db, `playlists/${playlistId}/canciones`);
        const songsSnapshot = await getDocs(songsCollection);
        const songsList = songsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSongs(songsList);
        setSelectedPlaylist(playlistId);
        setLoadingSongs(false);
    };

    const handleSongClick = (song) => {
        setCurrentSong({
            title: song.nombre,
            artist: song.artista || '',
            cover: song.portada || '', // Ahora incluimos la portada en el objeto de la canción
            url: song.ruta,
        });
        setIsPlaying(true);
    };

    const handleDeleteSong = async (songId) => {
        try {
            // Utilizando la referencia correcta al documento de la canción
            const songDocRef = doc(db, `playlists/${selectedPlaylist}/canciones`, songId);
            await deleteDoc(songDocRef);

            // Actualizar la lista de canciones localmente para reflejar la eliminación
            setSongs(songs.filter((song) => song.id !== songId));
            alert('Canción eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar la canción:', error);
            alert('Hubo un error al eliminar la canción. Por favor intenta de nuevo.');
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        try {
            const playlistDoc = doc(db, `playlists/${playlistId}`);
            await deleteDoc(playlistDoc);
            setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
            if (selectedPlaylist === playlistId) {
                setSelectedPlaylist(null);
                setSongs([]);
            }
            alert('Playlist eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar la playlist:', error);
            alert('Hubo un error al eliminar la playlist. Por favor intenta de nuevo.');
        }
    };

    return (
        <PlaylistContainer>
            <h2>Tus Playlists</h2>
            {loadingPlaylists ? (
                <p>Cargando playlists...</p>
            ) : (
                <ListGroup>
                    {playlists.map((playlist) => (
                        <StyledListGroupItem key={playlist.id}>
                            <PlaylistActions>
                                <span onClick={() => handlePlaylistClick(playlist.id)} style={{ cursor: 'pointer' }}>
                                    {playlist.nombre}
                                </span>
                                <IconButton onClick={() => handleDeletePlaylist(playlist.id)} title="Eliminar Playlist">
                                    <FaTrash />
                                </IconButton>
                            </PlaylistActions>
                        </StyledListGroupItem>
                    ))}
                </ListGroup>
            )}

            {selectedPlaylist && (
                <div>
                    <h3>Canciones en la Playlist</h3>
                    {loadingSongs ? (
                        <p>Cargando canciones...</p>
                    ) : (
                        <ListGroup>
                            {songs.map((song) => (
                                <StyledListGroupItem key={song.id}>
                                    <PlaylistActions>
                                        <span onClick={() => handleSongClick(song)} style={{ cursor: 'pointer' }}>
                                            {song.nombre} - {song.duracion}
                                        </span>
                                        <IconButton onClick={() => handleDeleteSong(song.id)} title="Eliminar Canción">
                                            <FaTrash />
                                        </IconButton>
                                    </PlaylistActions>
                                </StyledListGroupItem>
                            ))}
                        </ListGroup>
                    )}
                </div>
            )}

            <Button variant="primary" onClick={() => setShowModal(true)} className="mt-4">
                Crear Playlist
            </Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input 
                        type="text" 
                        value={playlistName} 
                        onChange={(e) => setPlaylistName(e.target.value)} 
                        placeholder="Nombre de la playlist" 
                        className="form-control" 
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={handleCreatePlaylist}>Crear Playlist</Button>
                </Modal.Footer>
            </Modal>
        </PlaylistContainer>
    );
}
