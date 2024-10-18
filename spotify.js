const authEnpoint = 'https://accounts.spotify.com/authorize?'
const clientId = '67b263767c7f43bca959240e5cdfb1d7'
const redirectUri = 'https://localhost:5173'
const scopes = ['user-library-read', 'playlist-read-private']

export const loginEndpoint = `${authEnpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scopes=${scopes.join("%20")}&response_type=token&show_dialog=true`