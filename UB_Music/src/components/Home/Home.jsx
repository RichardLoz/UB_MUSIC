import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { Container, Row, Col, Card, Spinner, ListGroup, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
    const [albums, setAlbums] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loadingAlbumImages, setLoadingAlbumImages] = useState({});
    const [playingSong, setPlayingSong] = useState(null);
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [showPlaylists, setShowPlaylists] = useState({});
    const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
    const [playlistSongs, setPlaylistSongs] = useState([]); 
    const [playlistName, setPlaylistName] = useState(''); // Estado para el nombre de la playlist
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const playlistRef = useRef(null); 

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (user) {
            const fetchAlbums = async () => {
                const albumsCollection = collection(db, 'albumes');
                const albumsSnapshot = await getDocs(albumsCollection);
                const albumsList = await Promise.all(
                    albumsSnapshot.docs.map(async (doc) => {
                        const albumData = doc.data();
                        const portadaUrl = await getDownloadURL(ref(storage, albumData.portada));
                        return { id: doc.id, ...albumData, portada: portadaUrl };
                    })
                );
                setAlbums(albumsList);
                setLoadingImages(false);
            };

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

            fetchAlbums();
            fetchPlaylists();
        }
    }, [user]);

    // Agregar event listener para cerrar la lista al hacer clic afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (playlistRef.current && !playlistRef.current.contains(event.target)) {
                setShowPlaylists({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleImageLoad = (albumId) => {
        setLoadingAlbumImages((prev) => ({ ...prev, [albumId]: false }));
    };

    const handleAlbumClick = async (albumId) => {
        if (selectedAlbum === albumId) {
            setSelectedAlbum(null);
            setSongs([]);
        } else {
            setSelectedAlbum(albumId);
            const songsCollection = collection(db, `albumes/${albumId}/canciones`);
            const songsSnapshot = await getDocs(songsCollection);
            const songsList = songsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const sortedSongs = songsList.sort((a, b) => a.orden - b.orden);
            setSongs(sortedSongs);
        }
    };

    const handleSongClick = (song) => {
        if (playingSong === song.ruta) {
            setPlayingSong(null);
        } else {
            setPlayingSong(song.ruta);
        }
    };

    const handleAddSongToPlaylist = (song) => {
        const currentPlaylistVisibility = showPlaylists[song.id] || false;
        setShowPlaylists({ ...showPlaylists, [song.id]: !currentPlaylistVisibility });
    };

    const handleAddToSelectedPlaylist = async (playlistId, song) => {
        const { nombre, duracion, ruta } = song;
        const songData = {
            nombre,
            duracion,
            ruta,
            orden: 0,
        };
        const songsCollection = collection(db, `playlists/${playlistId}/canciones`);
        await addDoc(songsCollection, songData);
        setShowPlaylists({ ...showPlaylists, [song.id]: false });
    };

    const handlePlaylistClick = async (playlistId) => {
        if (selectedPlaylist === playlistId) {
            setSelectedPlaylist(null);
            setPlaylistSongs([]);
        } else {
            setSelectedPlaylist(playlistId);
            const songsCollection = collection(db, `playlists/${playlistId}/canciones`);
            const songsSnapshot = await getDocs(songsCollection);
            const songsList = songsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPlaylistSongs(songsList);
        }
    };

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
        <Container>
            <h1 className="my-4">Álbumes</h1>
            {loadingImages && (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            )}
            <Row>
                {albums.map((album) => (
                    <Col key={album.id} md={4} className="mb-4">
                        <Card>
                            {loadingAlbumImages[album.id] !== false && (
                                <div className="text-center">
                                    <Spinner animation="border" role="status" />
                                </div>
                            )}
                            <Card.Img
                                variant="top"
                                src={album.portada}
                                alt={album.nombre}
                                onLoad={() => handleImageLoad(album.id)}
                                style={{ display: loadingAlbumImages[album.id] === false ? 'block' : 'none' }}
                                onClick={() => handleAlbumClick(album.id)}
                            />
                            {loadingAlbumImages[album.id] === false && (
                                <Card.Body>
                                    <Card.Title>{album.nombre}</Card.Title>
                                    <Card.Text>
                                        Artista: {album.artista}<br />
                                        Género: {album.genero}<br />
                                        Fecha de Lanzamiento: {album.fechaLanzamiento.toDate().toLocaleDateString()}
                                    </Card.Text>
                                </Card.Body>
                            )}
                        </Card>
                        {selectedAlbum === album.id && (
                            <ListGroup className="mt-3">
                                {songs.map((song) => (
                                    <ListGroup.Item key={song.id} className="d-flex justify-content-between align-items-center position-relative">
                                        <span>
                                            <strong onClick={() => handleSongClick(song)} style={{ cursor: 'pointer' }}>
                                                {song.orden}.{song.nombre}
                                            </strong> - {song.duracion}
                                        </span>
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                            onClick={() => handleAddSongToPlaylist(song)}
                                            title="Agregar a playlist"
                                        />
                                        {showPlaylists[song.id] && (
                                            <div ref={playlistRef} className="playlist-list" style={{
                                                position: 'absolute',
                                                left: '100%',
                                                top: '0',
                                                backgroundColor: '#fff',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                zIndex: '1000',
                                                width: '200px',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                            }}>
                                                <ListGroup>
                                                    {playlists.map(playlist => (
                                                        <ListGroup.Item key={playlist.id}>
                                                            <Button
                                                                variant="link"
                                                                onClick={() => handleAddToSelectedPlaylist(playlist.id, song)}
                                                            >
                                                                {playlist.nombre}
                                                            </Button>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </div>
                                        )}
                                        {playingSong === song.ruta && <audio src={song.ruta} controls autoPlay />}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                ))}
            </Row>

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

            <h1 className="my-4">Playlists</h1>
            {loadingPlaylists && (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            )}
            <ListGroup>
                {playlists.map((playlist) => (
                    <ListGroup.Item
                        key={playlist.id}
                        onClick={() => handlePlaylistClick(playlist.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        {playlist.nombre}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            {selectedPlaylist && (
                <ListGroup className="mt-3">
                    {playlistSongs.map((song) => (
                        <ListGroup.Item key={song.id} className="d-flex justify-content-between align-items-center">
                            <span>
                                <strong onClick={() => handleSongClick(song)} style={{ cursor: 'pointer' }}>
                                    {song.nombre}
                                </strong> - {song.duracion}
                            </span>
                            {playingSong === song.ruta && <audio src={song.ruta} controls autoPlay />}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

        </Container>
    );
}
