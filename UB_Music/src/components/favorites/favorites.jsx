import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, MoreHorizontal, Music } from 'lucide-react';
import Button from '../ui/Button';

// Datos de ejemplo para las playlists
const samplePlaylists = [
  { id: 1, name: "Mis Favoritos", tracks: 42, cover: "https://placehold.co/600x400" },
  { id: 2, name: "Para Entrenar", tracks: 28, cover: "https://placehold.co/600x400" },
  { id: 3, name: "Clásicos del Rock", tracks: 56, cover: "https://placehold.co/600x400" },
  { id: 4, name: "Chill Vibes", tracks: 35, cover: "https://placehold.co/600x400" },
  { id: 5, name: "Fiesta!", tracks: 63, cover: "https://placehold.co/600x400" },
  { id: 6, name: "Concentración", tracks: 20, cover: "https://placehold.co/600x400" },
];

const FavoritesContainer = styled.div`
  flex: 1;
  padding: 20px;
  color: white;
  background-color: #181818;
`;

const Header = styled.header`
  margin-bottom: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #F8D9C0;
`;

const Subtitle = styled.p`
  color: #aaa;
`;

const PlaylistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const PlaylistCard = styled(motion.div)`
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const PlaylistCover = styled.img`
  width: 100%;
  height: 150px; /* Ajusta el alto para evitar que cubra el texto */
  object-fit: cover;
`;

const PlaylistInfo = styled.div`
  padding: 10px;
  text-align: center;
  color: white;
`;

const PlaylistName = styled.h3`
  font-size: 1.2em;
  margin: 0;
`;

export default function Favorites() {
  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);

  return (
    <FavoritesContainer>
      <Header>
        <Title>Tus Playlists Favoritas</Title>
        <Subtitle>Disfruta de tus colecciones personalizadas</Subtitle>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva Playlist
        </Button>
      </Header>
      
      <PlaylistsGrid>
        {samplePlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            whileHover={{ y: -5 }}
            onHoverStart={() => setHoveredPlaylist(playlist.id)}
            onHoverEnd={() => setHoveredPlaylist(null)}
          >
            <div style={{ position: 'relative' }}>
              <PlaylistCover src={playlist.cover} alt={`Portada de ${playlist.name}`} />
              <AnimatePresence>
                {hoveredPlaylist === playlist.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3">
                      <Play className="h-8 w-8" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <PlaylistInfo>
              <PlaylistName>{playlist.name}</PlaylistName>
              <p>
                <Music className="mr-1 h-4 w-4" /> {playlist.tracks} canciones
              </p>
            </PlaylistInfo>
          </PlaylistCard>
        ))}
      </PlaylistsGrid>
    </FavoritesContainer>
  );
}
