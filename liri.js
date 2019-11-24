require("dotenv").config();

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");


function search() {

    inquirer.prompt([
        {
            type:"lists",
            message:"What command would you like to run?",
            choices:[
                "concert-this",
                "spotify-this-song",
                "movie-this",
                "do-what-it-says"
            ],
            name:"command"
        } ])
        .then(function(data){
            switch(data.command){
                case "concert-this":
                    concertInfo();
                break;
                case "spotify-this-song":
                    songInfo();
                break;
                case "movie-this":
                    movieInfo();
                break;
                case "do-what-it-says":
                    dowhatitsays();
                break; 
                default: console.log("choose an appropriate option!")
            }
        })
   
}


function startOver(){
    inquirer
    .prompt([
        {
            type:"confirm",
            message:"Would you like to search again?",
            name:"confirm",
            default: true 
        }
    ])

    .then(function(data){
        if (data.confirm){
            search();
        } else 
        console.log("Fine! Goodbye!");

    })
}

search();

//concert searching functing 
function concertInfo(){
    inquirer
      .prompt([
        {
          type: "input",
          message: "What artist would you like to search for?",
          name: "artist"
        }
      ])
      .then(function(data) {
        if (data.artist === "") data.artist = "incubus";
                var url="https://rest.bandsintown.com/artists/" + data.artist +
                "/events?app_id=codingbootcamp"
        axios
          .get(url
          )
          .then(function(data) {
            if (!data) {
              console.log("not currently touring...");
              startOver();
            } else {
              let concerts = data.data;
  
              for (let i = 0; i < concerts.length; i++) {
                console.log(`---------------------------------\nThe concert venue: ${concerts[i].venue.name}\n The concert location: ${concerts[i].venue.city} \n The concert date/time: ${concerts[i].datetime}`);
              }
            }
            startOver();
          })
          .catch(function(error) {
            console.log(`!!!!!!!!!!!!!!!!!!!!\n${error}\n!!!!!!!!!!!!!!!!!!!!!!!!`)
          });
      }); 
    }

//song searching function 
    function songInfo(){
        inquirer
        .prompt([
          {
            type: "input",
            message: "What song would you like to search for?",
            name: "song"
          }
        ])
        .then(function(data) {
          let song = data.song;
    
          if (song === "") song = "Lean on";
    
          const spotify = new Spotify(keys.spotify);
    
          spotify
            .search({ type: "track", query: song, limit: 5 })
    
            .then(function(data) {
              let song = data.tracks.items;
    
              for (let i = 0; i < song.length; i++) {
                let theSong = song[i];
    
                console.log(`Artist(s): ${theSong.artists[0].name}\n Song Name : ${theSong.name} \nAlbum: ${theSong.album.name}\nPreview Link: ${theSong.preview_url}`);
              }
              startOver();
           
            })
            .catch(function(error) {
              console.log(`!!!!!!!!!ERROR!!!!!!!!!!!!\n${error}\n!!!!!!!!!!!!ERROR`);
       
            });
        });
    }



    //Movie function search 
    function movieInfo() {
        inquirer
    .prompt([
      {
        type: "input",
        message: "What movie would you like to search for?",
        name: "movie"
      }
    ])
    .then(function(data) {
      if (data.movie === "") data.movie = "home alone";
            var URL= "http://www.omdbapi.com/?apikey=trilogy&t=" + data.movie 
      axios
        .get(URL)
        .then(function(data) {
          let movie = data.data;

          console.log(`Movie: ${movie.Title} \nYear: ${movie.Year}\n Rating: ${movie.Ratings[0].Value}\nRotten Tomato Rating: ${movie.Ratings[1].Value}\n Produced in: ${movie.Country}\nLanguage(s): ${movie.Language}\nMovie Plot: ${movie.Plot}\nMovie Actors: ${movie.Actors}`);

          startOver();
        })
        .catch(function(error) {
          console.log(
            `!!!!!!!!!ERRORRRRRR!!!!!!!!!\n${error}\n!!!!!ERRROORRRR!!!!!!!!!!!!`);
        });
    }); 
} 

// "random.txt" file
function dowhatitsays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(`!!!!!!!!!!!!!!!!!!!\n${error} \n!!!!!!!!!!!!`);
    } else {
  
      data = data.split(", ");
      console.log(data);
      startOver();

    }
  });

    }

    