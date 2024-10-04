import React, { useEffect, useState } from 'react';
import { db, storage } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { Container, Row, Col, Card, Spinner, ListGroup } from 'react-bootstrap';

export default function Home() {
    const [albums, setAlbums] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loadingAlbumImages, setLoadingAlbumImages] = useState({});
    const [playingSong, setPlayingSong] = useState(null); // Estado para la canción en reproducción

    useEffect(() => {
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

        fetchAlbums();
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
            setSongs(songsList);
        }
    };

    const handleSongClick = (song) => {
        if (playingSong === song.ruta) {
            setPlayingSong(null); // Si ya se está reproduciendo, pausar
        } else {
            setPlayingSong(song.ruta); // Establecer la canción a reproducir
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
                                    <ListGroup.Item key={song.id}>
                                        <strong onClick={() => handleSongClick(song)} style={{ cursor: 'pointer' }}>{song.nombre}</strong> - {song.duracion} - {song.genero}
                                        <br />
                                        Popularidad: {song.popularidad}
                                        <br />
                                        {playingSong === song.ruta && (
                                            <audio controls autoPlay>
                                                <source src={song.ruta} type="audio/mpeg" />
                                                Tu navegador no soporta el elemento de audio.
                                            </audio>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
