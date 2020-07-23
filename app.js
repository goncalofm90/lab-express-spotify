//------------------------
//DOT ENV CONFIG
//------------------------
require('dotenv').config();
//------------------------
//APP REQUIREMENTS
//------------------------
const express = require('express');
const hbs = require('hbs');
//------------------------------------------
// require spotify-web-api-node package here:
//------------------------------------------
const SpotifyWebApi = require('spotify-web-api-node');
//----------------------------------
// setting the spotify-api goes here:
//----------------------------------
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
//------------------------
// Retrieve an access token
//------------------------
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body.access_token))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
//------------------------
//APP SET & USE
//------------------------
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//------------------------
// APP ROUTES
//------------------------
app.get('/', (req, res)=> { 
  res.render('index')
});

app.get('/artist-search', (req, res)=> { 
  const artist = req.query.artist;
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', { artists: data.body.artists.items } );
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi. getArtistAlbums(artistId)
  .then(function(data) {
      console.log('Artist albums', data.body.items);
      res.render('albums', { albums : data.body.items } );
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi. getAlbumTracks(albumId)
  .then(function(data) {
      console.log('Artist tracks', data.body.items);
      res.render('tracks', { tracks : data.body.items } );
    },
    function(err) {
      console.error(err);
    }
  );
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
