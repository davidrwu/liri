var action = process.argv[2];
var value = process.argv[3];

var keys = require('./keys.js');

var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotifyKeys);

var params = {
    screen_name: 'Getpetpal',
    count: 20
}

var request = require('request');
var fs = require('fs');

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
        if (!error && response.statusCode == 200) {
            fs.appendFile('terminal.log', ('=============== LOG ENTRY BEGIN ===============\r\n' + Date() + '\r\n \r\nTERMINAL COMMANDS:\r\n$: ' + process.argv + '\r\n \r\nDATA OUTPUT:\r\n'), function(err) {
                if (err) throw err;
            });
            console.log(' ');
            console.log('Last 20 Tweets:')
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
                console.log(' ');
                console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Created on: ' + tweets[i].created_at);
                console.log(' ');
                fs.appendFile('terminal.log', (number + '. Tweet: ' + tweets[i].text + '\r\nCreated at: ' + tweets[i].created_at + ' \r\n'), function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFile('terminal.log', ('=============== LOG ENTRY END ===============\r\n \r\n'), function(err) {
                if (err) throw err;
            });
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
    });
}