// It's convention to include all `require`’s at the top of 
// files to communicate to other developers what is relied
// upon for the module. However, if there is a good reason
// to require a module further down (lets say for a dynamic
// import) then it’s fine to break with convention
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
// It appears your `keys.js` file was missing. You may 
// have forgot to check them in with git. This is the 
// prime reason your app failed to run. Everything else
// looked good for the most part.
var keys = require('./keys.js');

// Similarly, instantiate your main classes/modules toward
// the top of the file. Generally, files should read like
// a newspaper meaning things that are relied upon by other
// things go below the things that rely upon them
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

var action = process.argv[2];
var value = process.argv[3];

var params = {
    screen_name: 'Getpetpal',
    count: 10
}


switch (action) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThisSong();
        break;
    case 'movie-this':
        movieThis();
        break;
    case 'do-what-it-says':
        doWhatever();
        break;
     default:
        console.log("That is not a valid action.");
}

//EDIT
function myTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        for (i = 0; i < tweets.length; i++) {
            var number = i + 1;
            console.log([i + 1] + '. ' + tweets[i].text);
            console.log('Created on: ' + tweets[i].created_at);
        }
    });
} // end myTweets function

function spotifyThisSong () {
	spotify.search({ type: "track", query: value }, function(err, results) {
  		if (err) {
    		return console.log("Error occurred: " + err);
  		}
		console.log("Artist Name: "+results.tracks.items[0].artists[0].name);
        console.log("Song Name: "+results.tracks.items[0].name);
        console.log("Spotify URL: "+results.tracks.items[0].artists[0].external_urls.spotify);
        console.log("Album Name: "+results.tracks.items[0].album.name);
        
});
}

function movieThis(){
    // use the request app to send a request to the OMDB api
    request("http://www.omdbapi.com/?t="+value+"&apikey=40e9cece", function (error, response, body) {
        // if there is no error and a status of 200
        if (!error && response.statusCode == 200) {
           
            body = JSON.parse(body);

            console.log("Title: "+body.Title);
            console.log("Year: "+body.Year);
            console.log("IMDB Rating: "+body.imdbRating);
            console.log("Rotten Tomatoes Rating: "+body.tomatoUserRating);
            console.log("Country: "+body.Country);
            console.log("Language: "+body.Language);
            console.log("Plot: "+body.Plot);
            console.log("Actors: "+body.Actors);
        } else {
            console.log("Error: "+error);
            append("Error: "+error+"\n");

        }
    })
}

function doWhatever(){
    // use Node file system to get and read the file
    fs.readFile("random.txt", "utf8", function(err,data){
        // split the info on the file at the comma
        var array = data.split(',');
        // create new variables with the array data
        var fileAction = array[0];
        var fileData = array[1];
        // run the main function again with the data from the file.
        // doit(fileAction,fileData);
        spotify.search({ type: "track", query: array[1] }, function(err, results) {
        
        if (err) {
            return console.log("Error occurred: " + err);
        }
        
        console.log("Artist Name: "+results.tracks.items[0].artists[0].name);
        console.log("Song Name: "+results.tracks.items[0].name);
        console.log("Spotify URL: "+results.tracks.items[0].artists[0].external_urls.spotify);
        console.log("Album Name: "+results.tracks.items[0].album.name);
        
        });
    });
}