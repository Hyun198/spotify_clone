import './App.css';
import { useEffect, useState } from 'react'
import axios from 'axios'
function App() {

  const CLIENT_ID = "28e364844a4848e3905c1f15953abfd0"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [topArtist, setTopArtist] = useState(null)
  const [artists, setArtists] = useState([])
  const [tracks, setTracks] = useState([])
  const [albums, setAlbums] = useState([])
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [lyrics, setLyrics] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("token", token)
      setToken(token)
    }

    setToken(token)
  }, [])



  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const getTracks = async (artistId) => {
    const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    const tracks = data.tracks;
    setTracks(tracks);
  }

  const getAlbums = async (artistId) => {
    const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
      headers: {
        Authorization: `Bearer ${token}`
      },

    });
    const albums = data.items;
    setAlbums(albums);
  }

  const searchArtists = async (e) => {
    e.preventDefault()

    const searchTerm = searchKey.trim()

    if (!searchTerm) {
      alert("검색어를 입력하세요.");
      return;
    }
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchTerm,
        type: "artist",
        limit: 10
      }
    })
    const topArtist = data.artists.items[0];
    console.log(topArtist);
    setTopArtist(topArtist)
    setArtists(data.artists.items)

    if (topArtist) {
      await getTracks(topArtist.id);
      await getAlbums(topArtist.id);
    }

  }

  const getTrackLyrics = async (trackId) => {

    try {
      const response = await axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=781f8227f5629e301e16f7a624420189`);

      console.log(response);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }

  }

  const handleTrackSelect = async (track) => {
    console.log(track.id);
    getTrackLyrics(track.id);
  }

  const renderArtists = () => {
    const limitedArtists = artists.slice(0, 8);

    return limitedArtists.map(artist => (
      <div className="artist" key={artist.id}>
        {artist.images.length ? <img className="artist_imgs" src={artist.images[0].url} alt={artist.name} /> : <div>No images</div>}
        {artist.name}
      </div>
    ))
  }


  return (
    <>
      <div className="App">
        <h1 className='title'>Spotify Clone</h1>
        <header className="header_container">
          {token ?
            <form className="search_box" onSubmit={searchArtists}>
              <span className="material-symbols-outlined">
                search
              </span>
              <input className="search-input" type="text" placeholder='노래, 앨범, 아티스트' onChange={e => setSearchKey(e.target.value)} />
              <button className="search-btn" type={"submit"}>Search</button>
            </form>
            : <h2>Please login</h2>
          }
          {!token ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
            : <button className="btn-logout" onClick={logout}>logout</button>}
        </header>
        <main className="main_container">
          {topArtist && (
            <div className='top-artist'>
              {topArtist.images.length ? <img className="topArtist_imgs" src={topArtist.images[0].url} alt={topArtist.name} /> : <div>No images</div>}

              <h2>{topArtist.name}</h2>
              <p className='followers'>팔로워 수: {topArtist.followers.total}</p>
              <div className='top-artist-info'>
                {topArtist.genres.map(genre => (
                  <p className='genre'>{genre}</p>
                ))}
              </div>

            </div>
          )}
          <div className="top-tracks" style={{ display: token ? 'block' : 'none' }}>
            <h2>Top Tracks</h2>
            {tracks.slice(0, 7).map(track => (
              <div className="track" key={track.id} >
                <img className="track_imgs" src={track.album.images[0].url} alt={track.name} onClick={() => handleTrackSelect(track)} />
                <div className='track-info'>
                  <h2>{track.name}</h2>
                </div>
              </div>
            ))}
          </div>
        </main>


        <section className='albums'>
          {albums.map(album => (
            <div key={album.id}>
              {album.images.length ? <img className="albums_image" src={album.images[0].url} alt={album.name} /> : <div>No images</div>}
              <h3>{album.name}</h3>
            </div>
          ))}
        </section>



        <div className="artists" style={{ display: token ? 'flex' : 'none' }}>
          {renderArtists()}
        </div>


      </div>

    </>
  );
}

export default App;
