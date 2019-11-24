console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
