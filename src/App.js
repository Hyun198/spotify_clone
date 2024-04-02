import './App.css';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { render } from '@testing-library/react';
function App() {

  const CLIENT_ID = "28e364844a4848e3905c1f15953abfd0"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])

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

  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist",
        limit: 10
      }
    })
    setArtists(data.artists.items)

  }

  const searchAlbums = async (artistId) => {
    const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10
      },
    })

    setAlbums(data.items)

  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id} onClick={() => searchAlbums(artist.id)}>
        {artist.images.length ? <img src={artist.images[0].url} alt={artist.name} /> : <div>No images</div>}
        {artist.name}
      </div>
    ))
  }

  const renderAlbums = () => {
    return artists.map(albums => (
      <div key={albums.id}>
        {albums.albums.items.map(album => (
          <div key={album.id}>
            {album.images.length ? <img src={album.images[0].url} alt={album.name} /> : <div>No images</div>}
            {album.name}
          </div>
        ))
        }
      </div>
    ))
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Spotify React</h1>
          {!token ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
            : <button onClick={logout}>logout</button>}

          {token ?
            <form onSubmit={searchArtists}>
              <input type="text" onChange={e => setSearchKey(e.target.value)} />
              <button type={"submit"}>Search</button>
            </form>
            : <h2>Please login</h2>
          }

          {renderArtists()}
          { }

        </header>
      </div>

    </>
  );
}

export default App;
