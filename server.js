const express = require('express')
var arDrone = require('ar-drone');
var colors  = require('colors');
var client  = arDrone.createClient();
var async   = require('async')
var path = require('path');

var app = express();
var server = app.listen(3000);

var io = require('socket.io').listen(server);

var neo4j = require('neo4j');

var creds = {
	username: 'neo4j',
	password: 'henryitunes'
}

var db = new neo4j.GraphDatabase("http://" + creds.username + ":" + creds.password + "@localhost:7474");

app.use(express.static('public'))

var stopDrone = () => {
	client
	.after(1000, function() {
	  this.stop();
	  this.land();
	});
}

var newSpeed = (msg) => {
	console.log(msg)
	db.cypher({
	    query: 'CREATE (node:SPEED {int: {integer}, dur: {duration}, dir: {direction}}) RETURN node',
	    params: {
	        integer : msg.int,
	        duration : msg.dur,
	        direction: msg.dir
	    },
	}, callback);

	function callback(err, results) {
	    if (err) throw err;
	    var result = results[0];
	    if (!result) {
	      console.log('new speed could not be created');
	    } else {
	      console.log("new speed was logged")
	    }
	};
}

var flyDrone = (data) => {

	// client.on('navdata', console.log);

	client.takeoff();

	var int = data.int;
	var dur = data.dur * 1000;
	var dir = data.dir;

	// console.log(int, dur, dir);

	client
	  .after(5000, function() {
	  	console.log("moving forward")
	    this.front(int);
	  })
	  .after(dur, function() {
	    this.stop();
	    this.land();
	  });
	  
}

var findSpeedAndFly = () => {
	db.cypher({
	    query: 'MATCH (node:SPEED) RETURN node',
	}, callback);

	function callback(err, results) {
	    if (err) throw err;
	    var result = results[0];
	    if (!result) {
	      console.log('speed could not found');
	    } else {
	    	var data = results[0].node.properties;

	    	flyDrone(data)
	      //console.log(data)
	    }
	};
}

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('new speed', function (msg) {
    io.sockets.emit('newSpeed', msg);
    console.log("speed:     " + msg.int);
    console.log("duration:  " + msg.dur);
    console.log("direction: " + msg.dir);

    // console.log(msg);

    newSpeed(msg);

	});

	socket.on('fly', function() {
		findSpeedAndFly();
		//console.log('fly')
	})

  socket.on('test', function(msg) {
  	console.log(msg)
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});
