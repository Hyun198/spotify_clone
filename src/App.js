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
  const [topArtist, setTopArtist] = useState(null)
  const [artists, setArtists] = useState([])

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
    const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    console.log(1);
    console.log(data);
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
    const topArtist = data.artists.items[0];
    setTopArtist(topArtist)
    setArtists(data.artists.items)

    if (topArtist) {
      await getTracks(topArtist.id);
    }

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
            <form onSubmit={searchArtists}>
              <input className="search_box" type="text" placeholder='노래, 앨범, 아티스트 검색' onChange={e => setSearchKey(e.target.value)} />
              <button type={"submit"}>Search</button>
            </form>
            : <h2>Please login</h2>
          }
          {!token ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
            : <button className="btn-logout" onClick={logout}>logout</button>}


        </header>
        {topArtist && (
          <div className='top-artist'>
            {topArtist.images.length ? <img className="artist_imgs" src={topArtist.images[0].url} alt={topArtist.name} /> : <div>No images</div>}
            <h2>{topArtist.name}</h2>
          </div>
        )}

        <h3>아티스트</h3>
        <div className="artists">
          {renderArtists()}
        </div>
      </div>

    </>
  );
}

export default App;
