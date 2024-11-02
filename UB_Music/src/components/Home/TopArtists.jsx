import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, Modal, ListGroup } from 'react-bootstrap';

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

export default function UserPlaylists() {
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [playlistName, setPlaylistName] = useState('');
    const [showModal, setShowModal] = useState(false);

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

    return (
        <PlaylistContainer>
            <h2>Tus Playlists</h2>
            {loadingPlaylists ? (
                <p>Cargando playlists...</p>
            ) : (
                <ListGroup>
                    {playlists.map((playlist) => (
                        <StyledListGroupItem key={playlist.id}>
                            {playlist.nombre}
                        </StyledListGroupItem>
                    ))}
                </ListGroup>
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