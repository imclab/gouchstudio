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

        var parameters = $.extend(defaults,options);
	
        var element = $(this);
        var history = [];
        var audiotag = $('audio', element)[0];
        var audioFilesFormat;

        if (audiotag.canPlayType('audio/ogg') != '') {
            audioFilesFormat = '.ogg';
        } else if (audiotag.canPlayType('audio/mp3') =! '') {
            audioFilesFormat = '.mp3';
        } else {
            alert('Your browser cannot play music. Please update it for the greater good !');
            return false;
        }
         
        // on music end, play a random song
        audiotag.addEventListener('ended' ,function(){
            playNextRandomSong();
        });         
        
        // play / pause button
        $('.playPause', element).click(function() {
            if (parameters.songs.length > 0) {
                if (history.length == 0) {
                    // if first song, pick a random one in the playlist
                    playSong(getRandomSong());
                } else if(!audiotag.paused) {
                    // if music was playing, pause it
                    audiotag.pause();
                } else {
                    // else music was paused, resume it
                    audiotag.play();
                }
                $(this).toggleClass('glyphicon-play glyphicon-pause');
            }
        });
        
        // next / previous buttons
        $('.nextSong', element).click(function() {
            playNextRandomSong();
        });
        $('.prevSong', element).click(function() {
            if(history.length > 0){
                if(audiotag.currentTime < 20){
                    // play previous song
                    if(history.length > 1){
                        playSong(history[history.length - 2]);
                    }else{
                        playSong(history[0]);
                    }
                }else{
                    // replay song
                    playSong(history[history.length - 1]);
                }    
            }
        });
        
        function getRandomSong() {
            return Math.floor(Math.random() * parameters.songs.length);
        }	

        function playSong(musicIndex) {
            startLoadingBar();
            audiotag.src = parameters.folder + "/" + parameters.songs[musicIndex].title + audioFilesFormat;
            $('#songName', element).html(parameters.songs[musicIndex].title);
            $('#songImage', element).attr('src', '../images/' + parameters.bands[parameters.songs[musicIndex].author].image);
            audiotag.play();
            $('.playPause', this).addClass('glyphicon-pause');
            $('.playPause', this).removeClass('glyphicon-play');
            history.push(musicIndex);

            var rem = parseInt(audiotag.duration, 10),
            mins = Math.floor(rem/60,10),
            secs = rem - mins*60;
            if(!isNaN(mins-secs)){
                $('.timeLeft', element).text('- ' + mins + ':' + (secs > 9 ? secs : '0' + secs));
            }else{
                $('.timeLeft', element).text('0:00');
            }
        }

        function playNextRandomSong() {
            var i = getRandomSong();
            if(history.length > 0 && parameters.songs.length > 1){
                while(history[history.length-1] == i){
                    i = getRandomSong();
                }
            }
            playSong(i);
        }
        
        //progress bar        
        var progressBar = $('.progressBar', element);
        $('audio', element).bind('timeupdate', function() {
            rem = parseInt(audiotag.duration - audiotag.currentTime, 10),
            pos = (audiotag.currentTime / audiotag.duration) * 100,
            mins = Math.floor(rem/60,10),
            secs = rem - mins*60;
            if(!isNaN(mins-secs)){
                $('.timeLeft', element).text('- ' + mins + ':' + (secs > 9 ? secs : '0' + secs));
            }else{
                $('.timeLeft', element).text('0:00');
            }
            progressAmount = parseInt((progressBar.width()+ 6)*audiotag.currentTime/audiotag.duration);
            $('.progress', element).css('width', progressAmount + 'px');
        });
        progressBar.click(function(e){
            if(history.length > 0){
                audiotag.volume=0;
                audiotag.currentTime = (e.pageX - progressBar[0].offsetParent.offsetLeft
                    - progressBar[0].offsetLeft)/(progressBar.width() + 6)*audiotag.duration;
                audiotag.volume=1;
            }
        });
        
        function startLoadingBar(){
            var loadingIndicator = $('.loadingBar', element);
            if (audiotag.buffered != undefined) {
                loadingIndicator.show();
                $('audio', element).bind('progress', function() {
                    var amountLoaded = parseInt(((audiotag.buffered.end(0) /    audiotag.duration) * progressBar.width()), 10);
                    loadingIndicator.css('width', amountLoaded + 'px');
                    if(amountLoaded >= progressBar.width()){
                        loadingIndicator.hide();
                    }
                });
            }
        }        
    }

})(jQuery);
