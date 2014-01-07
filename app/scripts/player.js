/**
 * my Audio Player
 * @author : Guillaume Gouchon
 * 
 * @param folder (optional, default = "../music")  where to get the music files
 * @param songs
 * @param bands
 */     
(function($){
    $.fn.myPlayer = function(options) {
        var defaults = {
            'folder':'../music',
            'songs': [],
            'bands': []
        };

        var parameters = $.extend(defaults, options);
	
        var element = $(this);
        var audiotag = $('audio', element)[0];
        var audioFilesFormat;
        
        var history = [];
        var playlist = [];
        var currentSongPlaying = -1;

        var playButton = $('.playPause', element);
        var timeLeftLabel=  $('.timeLeft', element);
        var randomToggleButton = $('.toggleRandom', element);
        var progressLayout = $('.progressLayout', element);
        var progressBar = $('.progressBar', element);
        var loadingBar = $('.loadingBar', element);
        var playlistLayout = $('#playlist', element);
        var showPlaylistButton = $('#showPlaylistButton', element);

        if (audiotag.canPlayType('audio/ogg') != '') {
            audioFilesFormat = '.ogg';
        } else if (audiotag.canPlayType('audio/mp3') != '') {
            audioFilesFormat = '.mp3';
        } else {
            alert('Your browser cannot play music. Please update it for the greater good !');
            return false;
        }
         
        // on music end, play a random song
        audiotag.addEventListener('ended' , function (){
            playNextSong();
        });         
        
        // play / pause button
        playButton.click(function () {
            if (parameters.songs.length > 0) {
                if (history.length === 0) {
                    // if first song, pick a random one in the playlist
                    playNextSong();
                } else if(!audiotag.paused) {
                    // if music was playing, pause it
                    pauseSong();
                } else {
                    // else music was paused, resume it
                    resumeSong();
                }
            }
        });
        
        // next / previous buttons
        $('.nextSong', element).click(function () {
            playNextSong();
        });
        $('.prevSong', element).click(function () {
            playPreviousSong();
        });

        // toggle random button
        randomToggleButton.click(function () {
            $(this).toggleClass('active');
        });

        var getRandomSongIndex = function (inAllSongs) {
            var random;
            do {
                random =  Math.floor(Math.random() * (inAllSongs ? parameters.songs.length : playlist.length));
                if (inAllSongs && parameters.songs.length == 1 || !inAllSongs && playlist.length == 1) {
                    return random;
                }
            } while (inAllSongs && parameters.songs[random] == currentSongPlaying
                || !inAllSongs && playlist[random] == currentSongPlaying);
            return random;
        };

        var isShuffleModeEnabled = function () {
            return randomToggleButton.hasClass('active');
        };

        var pauseSong = function () {
            audiotag.pause();
            playButton.addClass('glyphicon-play').removeClass('glyphicon-pause');
            $('#songImage', element).addClass('blink');
        };

        var resumeSong = function () {
            audiotag.play();
            playButton.addClass('glyphicon-pause').removeClass('glyphicon-play');
            $('#songImage', element).removeClass('blink');
        };

        var playNextSong = function () {
            var musicIndex;
            if (playlist.length > 0) {
                if (!isShuffleModeEnabled()) {
                    // play next song in playlist
                    var indexInPlaylist = playlist.indexOf(currentSongPlaying);
                    musicIndex = indexInPlaylist >= 0 && indexInPlaylist < playlist.length - 1 ? indexInPlaylist + 1 : 0;    
                } else {
                    // play random song in playlist
                    musicIndex = getRandomSongIndex(false);
                }
                playSong(playlist[musicIndex]);
                updatePlaylistUI();
            } else {
                if (!isShuffleModeEnabled() && currentSongPlaying >= 0) {
                    // play next song
                    musicIndex = currentSongPlaying + 1;
                } else {
                    // play a random song
                    musicIndex = getRandomSongIndex(true);
                }
                playSong(musicIndex);
            }
        };

        var playPreviousSong = function () {
            if (history.length > 1) {
                var historyIndex;
                if (audiotag.currentTime < 10) {
                    // play previous song
                    historyIndex = Math.max(0, history.length - 2);
                } else {
                    // replay song
                    historyIndex = history.length - 1;
                }
                var musicIndex = history[historyIndex];
                history.splice(history.length - 1, 1);
                playSong(musicIndex);
                history.splice(history.length - 1, 1);
            }
        };

        var playSong = function (musicIndex) {
            audiotag.src = parameters.folder + "/" + parameters.songs[musicIndex].title + audioFilesFormat;
            
            // update UI
            $('#songName', element).html(parameters.songs[musicIndex].title);
            $('#songImage', element).attr('src', '../images/' + parameters.bands[parameters.songs[musicIndex].author].image);
            resumeSong();

            updateTimeLeft();            
            startLoadingBar();

             // update history
            history.push(musicIndex);

            currentSongPlaying = musicIndex;
        };

        var updateTimeLeft = function () {
            var rem = parseInt(audiotag.duration - audiotag.currentTime, 10);
            var mins = Math.floor(rem / 60,10);
            var secs = rem - mins * 60;
            if (!isNaN(mins - secs)) {
                if (!timeLeftLabel.hasClass('visible')) {
                    timeLeftLabel.addClass('visible');
                }
                timeLeftLabel.text('- ' + mins + ':' + (secs > 9 ? secs : '0' + secs));
            } else {
                timeLeftLabel.removeClass('visible');
            }
        };

        var updatePlaylistUI = function () {
            playlistLayout.html('');
            for (var i in playlist) {
                var song = parameters.songs[playlist[i]];
                playlistLayout.append('<div class="playlist" data-song="' + playlist[i] + '">' + song.title + '</div>');
            }
            $('.playlist').click(function () {
                playSong($(this).attr('data-song'));
            });
            if (playlist.length > 0) {
                showPlaylistButton.addClass('visible');
            } else {
                showPlaylistButton.removeClass('visible');
            }
        };

        showPlaylistButton.click(function () {
            playlistLayout.toggleClass('visible');
        });

        // binds progress bar update        
        $('audio', element).bind('timeupdate', function () {
            updateTimeLeft();
            var progress = parseInt((progressLayout.width()) * audiotag.currentTime / audiotag.duration);
            if (progress <= 2) {
                progress = 0;
            }
            progressBar.css('width', progress + 'px');
        });

        progressLayout.click(function (e){
            if (history.length > 0) {
                audiotag.volume = 0;
                audiotag.currentTime = (e.pageX - progressLayout[0].offsetParent.offsetLeft - progressLayout[0].offsetLeft) / (progressLayout.width()) * audiotag.duration;
                audiotag.volume = 1;
            }
        });
        
        var startLoadingBar = function () {
            if (audiotag.buffered != undefined) {
                // loadingBar.removeClass('hide');
            }
        };

        // $('audio', element).bind('progress', function () {
        //     if (audiotag.buffered != null) {
        //         var amountLoaded = parseInt(((audiotag.buffered.end(0) / audiotag.duration) * progressLayout.width()), 10);
        //         loadingBar.css('width', amountLoaded + 'px');
        //         if (audiotag.buffered.end(0) / audiotag.duration > 0.9) {
        //             loadingBar.addClass('hide');
        //         }
        //     }
        // });

        /**
        *   PUBLIC METHODS
        */
        $.fn.myPlayer.addSongsToPlaylist = function (songs) {
            playlist = songs;
            playNextSong();
        };

    };
})(jQuery);
