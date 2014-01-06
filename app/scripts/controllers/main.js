'use strict';

angular.module('gouchstudioApp')
  .controller('MainCtrl', function ($scope) {

    $scope.genres = [
	    "Rock", "Funk", "Death Metal", "Black Metal", "Metal", "Classical", "Ambiance",
	    "Orchestra", "Folk", "Medieval"
	];

	$scope.bands = [
	    { name: "Outsider", image: "outsider_small.png", color: "#992222"},
	    { name: "Slap That Frog", image: "slapthatfrog_small.png", color: "#559955"},
	    { name: "Tilt", image: "tilt_small.png", color: "#555599"},
	    { name: "Guillaume Gouchon", image: "gg_small.png", color: "#777777"}
	];

    $scope.songs = [
  		{ title: "A prelude to Horror", genres: [4, 2, 6], author: 0 },
	    { title: "Pickman's Model", genres: [4, 2, 6], author: 0 },
	    { title: "Flesh Theory Part I - From The Dark", genres: [4, 2, 6], author: 0 },
	    { title: "He who commands at the Seas", genres: [4, 2, 6], author: 0 },
	    { title: "One Step Beyond", genres: [4, 2, 6], author: 0 },
	    { title: "Creators (of all Things)", genres: [4, 2, 6], author: 0 },
	    { title: "A Night in Tristram", genres: [4, 2, 6], author: 0 },
	    { title: "The Outsider", genres: [4, 2, 6], author: 0 },
	    { title: "Breaking the New", genres: [0, 1], author: 1 },
	    { title: "I wish I was a Dog", genres: [0, 1], author: 1 },
	    { title: "Please kill me", genres: [0, 1], author: 1 },
	    { title: "Playmate", genres: [0, 1], author: 1 },
	    { title: "She doesn't care", genres: [0, 1], author: 1 },
	    { title: "The Dawn", genres: [0, 8], author: 2 },
	    { title: "Fear of Height", genres: [0, 8], author: 2 },
	    { title: "Black Book", genres: [0, 8, 6], author: 2 },
	    { title: "Mariachi", genres: [0, 8], author: 2 },
	    { title: "Freedom", genres: [0, 8], author: 2 },
	    { title: "Peaches Sweat", genres: [0, 8], author: 2 },
	    { title: "The Pier - unplugged", genres: [0, 8], author: 2 },
	    { title: "Positive Mediocrity", genres: [0, 8], author: 2 },
	    { title: "Introduction (Roches Rouges)", genres: [6], author: 3 },
	    { title: "Final Scene (Roches Rouges)", genres: [6], author: 3 },
	    { title: "Credits (Roches Rouges)", genres: [6, 4], author: 3 },
	    { title: "Somnium Aeternus", genres: [5], author: 3 },
	    { title: "End of Agony (ft Syvain Pallas)", genres: [4, 2], author: 3 },
	    { title: "Over the Hills", genres: [9], author: 3 },
	    { title: "The March of Evil (introduction)", genres: [7, 4, 3], author: 3 },
	    { title: "Lust in Hell", genres: [4, 3], author: 3 },
	    { title: "Dungeon Quest - Main Theme", genres: [7, 6, 9], author: 3 },
	    { title: "French Fries never die", genres: [7, 6, 9], author: 3 }
    ];

	$('#myPlayer').myPlayer({
		'songs' : $scope.songs,
		'bands' : $scope.bands,
		'folder': 'music'
	});

	$scope.addSongToPlaylist = function (index) {
		$('#myPlayer').myPlayer.addSongsToPlaylist([index]);
	};

	$scope.addAuthorToPlaylist = function (authorId) {
		var songs = [];
		for (var i in $scope.songs) {
			if ($scope.songs[i].author === authorId) {
				songs.push(i);
			}
		}
		$('#myPlayer').myPlayer.addSongsToPlaylist(songs);
	};

	$scope.addGenreToPlaylist = function (genreId) {
		var songs = [];
		for (var i in $scope.songs) {
			if ($scope.songs[i].genres.indexOf(genreId) >= 0) {
				songs.push(i);
			}
		}
		$('#myPlayer').myPlayer.addSongsToPlaylist(songs);
	};

  });
