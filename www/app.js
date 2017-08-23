(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index_app.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : zdm.player.logic
// ------         logic for MusikZirkel-player and connecting to
//                radio-controller and radio-server
// ---------------------------------------------------------------
// Version      : 1.00 - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
//
// ---------------------------------------------------------------
// Dependencies : jQuery  >= 1.7.2
//                jQueryMobile >= 1.3.0
//                socket.io >= 0.9.11
//                amplify >= ?.?.?
//                knobKnob >= ?.?.?
//                zdm.player.control >= 1.00
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2013
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
var socket = require("./socketIO");
exports.socket = socket;
var generic = require("./player_generic");
exports.generic = generic;
var player1 = require("./player_cordova");
exports.player1 = player1;
var player2 = require("./player_cordova_loop");
exports.player2 = player2;
var control = require("./player_control");
exports.control = control;
var logic = require("./player_logic");
exports.logic = logic;
var bootCordova = require("./boot_cordova");
exports.bootCordova = bootCordova;
FuseBox.import('./boot_cordova');
//# sourceMappingURL=index_app.js.map
});
___scope___.file("socketIO.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : zdm.socketIO 
// ------         wrapper for socket.io (client)
//                
// ---------------------------------------------------------------
// Version      : 1.00a - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
//
// ---------------------------------------------------------------
// Dependencies : socket.io >= 0.9.10
//                
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : z-dM GmbH 2013
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
//import * as client  from '../lib/socket.io.js'
//const io = require('socket.io-client')
// 
//export module zdm {
var socketIO = (function () {
    // cto
    function socketIO(url, newConnect) {
        if (url === void 0) { url = null; }
        if (newConnect === void 0) { newConnect = false; }
        this.url = url;
        this.newConnect = newConnect;
        // private properties
        this.io = null; // reference to socket io
        // public properties
        this.connected = false; // flag if is connected to server
        if (this.url) {
            this.connect(this.url);
        }
    }
    // check if socket is connected
    socketIO.prototype.isConnected = function () {
        if (this.io) {
            return this.io.connected;
        }
        else {
            return false;
        }
    };
    // connect to server
    socketIO.prototype.connect = function (url, query) {
        if (query === void 0) { query = ''; }
        // first disconnect
        if (this.io) {
            this.disconnect();
        }
        // url
        this.url = url;
        //this.io = io.connect(this.url);
        // connect to server
        //this.io = io(this.url, { query: query, 'force new connection': this.newConnect });
        this.io = io(this.url, { query: query, 'force new connection': this.newConnect });
        // if connected set flag
        if (this.io.connected) {
            this.connected = true;
        }
    };
    // reconnect to server
    socketIO.prototype.reconnect = function () {
        // check if was created
        if (this.io && this.url) {
            this.io.reconnect();
            this.connected = true;
        }
    };
    // disconnect from server
    socketIO.prototype.disconnect = function () {
        if (this.io) {
            if (this.isConnected()) {
                this.io.disconnect();
            }
            this.io.removeAllListeners();
            this.connected = false;
            this.url = null;
            this.io = null;
        }
    };
    // send to server
    socketIO.prototype.send = function (msgType, data, cb) {
        this.io.emit(msgType, data, function (result) {
            if (cb) {
                cb(result);
            }
        });
    };
    // listen on message from server
    socketIO.prototype.listen = function (msgType, cb) {
        this.io.on(msgType, function (result) {
            if (cb) {
                cb(result);
            }
        });
    };
    return socketIO;
}());
exports.socketIO = socketIO;
//} 
//# sourceMappingURL=socketIO.js.map
});
___scope___.file("player_generic.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
var generic = (function () {
    // ctor
    function generic(id) {
        if (id === void 0) { id = 0; }
        this._audio = null; // Media - Object
        this._timer = null; // Media - timer
        this._volume = 0.5; // current volume 0.1 .. 1.0
        this._duration = 0; // duration in seconds
        this._isFading = false; // flag if fading active
        this._isSeeking = false; // flag if seeking active
        this._fadeTimer = null; // timerfunction fading
        this._lastVolume = 0; // lastVolume after fading
        // public properties
        this.fadeOutDur = 6; // duration fadeout in seconds
        this.fadeInDur = 4; // duration fadein in seconds
        this.fadeInAuto = true; // flag for automatic fading
        this.fadeOutAuto = true; // flag for automatic fading
        this.isPlaying = false; // read only flag if is playing 
        this._id = id;
    }
    //----------------------------------------------------------------
    // load file or url -- must be overridden
    generic.prototype.doLoad = function (url) {
    };
    // play -- must be overridden
    generic.prototype.doPlay = function (pos) {
    };
    // pause -- must be overridden
    generic.prototype.doPause = function () {
    };
    // stop -- must be overridden
    generic.prototype.doStop = function () {
    };
    // seekTo -- must be overridden
    generic.prototype.doSeekTo = function (pos) {
    };
    // setVolume -- must be overridden
    generic.prototype.doSetVolume = function (volume) {
    };
    // setMute  -- must be overridden
    generic.prototype.doSetMute = function (isMute) {
    };
    //----------------------------------------------------------------
    // do console output (static)
    generic.debugInfo = function (info) {
        if (generic.isDebug) {
            console.log(info);
        }
    };
    // send event (static)
    generic.sendEvent = function (event, val) {
        amplify.publish(event, val);
    };
    // returns player id
    generic.prototype.getId = function () {
        return this._id;
    };
    // load file or url
    generic.prototype.load = function (song) {
        // send event to show new song
        generic.sendEvent('zdm_player_new', song);
        // save duration
        this._duration = song.duration;
        // load song
        this.doLoad(song.url);
    };
    // play song
    generic.prototype.play = function (pos) {
        if (pos === void 0) { pos = 0; }
        //
        if (this._audio) {
            generic.debugInfo('play : ' + this._id);
            this.doPlay(pos);
        }
    };
    // pause
    generic.prototype.pause = function () {
        // clear timer
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        if (this._audio && this.isPlaying) {
            generic.debugInfo('pause : ' + this._id);
            this.doPause();
        }
    };
    // stop 
    generic.prototype.stop = function () {
        // if fading
        if (this._fadeTimer) {
            // clear timer
            clearInterval(this._fadeTimer);
            this._fadeTimer = null;
            // reset last volume
            this.setVolume(this._lastVolume);
        }
        // clear timer
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        // stop player
        if (this._audio) {
            generic.debugInfo('stop : ' + this._id);
            this.doStop();
        }
        // reset vars
        this._isFading = false;
        this._isSeeking = false;
        this.isPlaying = false;
        this._duration = 0;
    };
    // seek to position
    generic.prototype.seekTo = function (pos) {
        // check state playing
        if (this._audio && this.isPlaying) {
            generic.debugInfo('seekTo : ' + this._id + ' pos : ' + pos);
            this.doSeekTo(pos);
        }
    };
    // set volume
    generic.prototype.setVolume = function (volume) {
        /*
        // save volume if not muted
        if (!generic.isMute) {
            this._volume = volume;
        }
        */
        // save volume
        this._volume = volume;
        // set volume
        if (this._audio) {
            generic.debugInfo('setVolume : ' + this._id + ' vol : ' + volume);
            this.doSetVolume(volume);
        }
    };
    // set Mute on or off
    generic.prototype.setMute = function (isMute) {
        // set Flag
        generic.isMute = isMute;
        //
        if (this._audio) {
            this.doSetMute(isMute);
        }
        /*
        // set mute
        if (isMute) {
            generic.debugInfo('set mute on ...');
            this.setVolume(0);
        }

        // reset volume
        else {
            generic.debugInfo('set mute off ...');
            this.setVolume(this._volume);
        }
        */
    };
    // fade in song
    generic.prototype.fadeIn = function () {
        if (this._audio && this.fadeInAuto) {
            this.fade(true);
        }
    };
    // fade out song
    generic.prototype.fadeOut = function () {
        if (this._audio && this.isPlaying && this.fadeOutAuto) {
            this.fade(false);
        }
    };
    // fade in or fade out song
    generic.prototype.fade = function (fadeIn) {
        var _this = this;
        generic.debugInfo('fading : ' + +this._id + ' - ' + (fadeIn ? 'in' : 'out'));
        // check if not allready fading
        if (!this._isFading) {
            // set flag
            this._isFading = true;
            // save last volume
            this._lastVolume = this._volume;
            //var lastVolume = this._volume;
            var currVolume = this._volume;
            // fadeIn starts with 0
            if (fadeIn) {
                this.setVolume(0);
                currVolume = 0;
                // start playing
                if (this._audio && !this.isPlaying) {
                    this.play();
                }
            }
            // steps for timer
            var steps = (fadeIn ? this.fadeInDur : this.fadeOutDur) * 10;
            // volume steps
            var incvol = this._lastVolume / (steps);
            //var incvol = lastVolume / (steps);
            // counter for steps
            var counter = 0;
            // set intervall
            if (!this._fadeTimer) {
                this._fadeTimer = setInterval(function () {
                    //var fade = setInterval( () => {
                    // set current volume
                    currVolume = (fadeIn ? currVolume + incvol : currVolume - incvol);
                    _this.doSetVolume(currVolume);
                    // inc counter 
                    counter += 1;
                    // check if steps are reached
                    if (counter >= steps) {
                        // clear intervall
                        clearInterval(_this._fadeTimer);
                        _this._fadeTimer = null;
                        //clearInterval(fade);
                        // reset flag
                        _this._isFading = false;
                        // set last volume
                        if (fadeIn) {
                            _this.setVolume(_this._lastVolume);
                            //this.setVolume(lastVolume);
                        }
                        else {
                            _this.setVolume(0);
                            //this._volume = lastVolume;
                            _this.stop(); // ??
                            // reset last volume
                            _this.setVolume(_this._lastVolume);
                            //this.setVolume(lastVolume);
                        }
                    }
                }, 100);
            }
        }
    };
    // static properties
    generic.isMute = false; // flag for mute
    generic.isDebug = false; // flag for debug info
    return generic;
}()); // class
exports.generic = generic;
//# sourceMappingURL=player_generic.js.map
});
___scope___.file("player_cordova.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : zdm.player.cordova
// ------         radioplayer for 
//                Cordova 2.2.0
// ---------------------------------------------------------------
// Version      : 1.0.0 - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
// ---------------------------------------------------------------
// Dependencies : zdm.player.generic >= 1.00
//                cordova  >= 2.2.0
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2013
// ---------------------------------------------------------------
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var player = require("./player_generic");
var cordova = (function (_super) {
    __extends(cordova, _super);
    // ctor
    function cordova(id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this, id) || this;
        // if true -> access on some functions  (volume, seeking ??)
        _this.accessPlayer = false;
        return _this;
    }
    //----------------------------------------------------------------
    // load file or url
    cordova.prototype.doLoad = function (url) {
        // set reference
        var self = this;
        // first stop player
        this.stop();
        //
        player.generic.debugInfo('create player : ' + this._id);
        // create new media object and listen on player events
        this._audio = new Media(
        // set url
        url, 
        // success (called on end of song !!) 
        function () {
            player.generic.debugInfo('song ended ...' + self._id);
        }, 
        // error occured
        function (error) {
            player.generic.sendEvent('zdm_player_error', { code: error.code, message: error.message });
        }, 
        // status changed 
        function (status) {
            // started
            if (status == 1) {
                // set flag
                self.accessPlayer = true;
                // set volume to 0
                self._audio.setVolume(0);
            }
            else if (status == 4) {
                self.stop();
            }
            // set playing flag
            self.isPlaying = status == 2;
            player.generic.debugInfo('status : ' + self._id + ' / ' + status);
        });
        // start playing
        this.fadeIn();
        // check timer
        if (!this._timer) {
            player.generic.debugInfo('start timer : ' + this._id);
            // set timer
            this._timer = setInterval(function () {
                // get current position
                self._audio.getCurrentPosition(
                // success
                function (position) {
                    // send position    
                    if (position > -1) {
                        player.generic.sendEvent('zdm_player_position', { player: self._id, position: Math.round(position) });
                    }
                }, 
                // error position -> todo : check if has to stop timer
                function (error) {
                    player.generic.sendEvent('zdm_player_error', { player: self._id, code: error.code, message: error.message });
                });
            }, 1000); // every second
        }
        ;
    };
    // play
    cordova.prototype.doPlay = function (pos) {
        this._audio.play();
    };
    // pause
    cordova.prototype.doPause = function () {
        this._audio.pause();
    };
    // stop
    cordova.prototype.doStop = function () {
        //this.audio.stop();
        this.accessPlayer = false;
        this._audio.release();
        this._audio = null;
        player.generic.debugInfo('release player : ' + this._id);
    };
    // seekTo
    cordova.prototype.doSeekTo = function (pos) {
        player.generic.debugInfo('seeking to : ' + this._id + ' ' + pos);
        this._audio.seekTo(pos * 1000);
    };
    // setVolume
    cordova.prototype.doSetVolume = function (volume) {
        // check flag
        if (this.accessPlayer) {
            // only if not muted
            if (!player.generic.isMute) {
                this._audio.setVolume(volume);
            }
        }
    };
    // setMute
    cordova.prototype.doSetMute = function (isMute) {
        if (isMute) {
            this._audio.setVolume(0);
        }
        else {
            this._audio.setVolume(this._volume);
        }
    };
    return cordova;
}(player.generic));
exports.cordova = cordova;
//# sourceMappingURL=player_cordova.js.map
});
___scope___.file("player_cordova_loop.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : zdm.player.cordova
// ------         radioplayer for 
//                Cordova 2.2.0
// ---------------------------------------------------------------
// Version      : 1.00a - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
// ---------------------------------------------------------------
// Dependencies : zdm.player.generic >= 1.00
//                cordova  >= 2.2.0
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2013
// ---------------------------------------------------------------
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var player = require("./player_generic");
var cordova_loop = (function (_super) {
    __extends(cordova_loop, _super);
    // ctor
    function cordova_loop(interval, url) {
        var _this = _super.call(this, 10) || this;
        _this.interval = interval;
        _this.url = url;
        // if true -> access on some functions  (volume, seeking ??)
        _this.accessPlayer = false;
        _this.isLoop = false;
        return _this;
        // debug
        //generic.isDebug = true;
        //console.log(url)
        //generic.isMute = true;
    }
    //----------------------------------------------------------------
    //
    cordova_loop.prototype.startTimer = function () {
        var _this = this;
        if (!this._timer) {
            player.generic.debugInfo('start loop timer');
            this._audio.play();
            // set timer
            this._timer = setInterval(function () {
                player.generic.debugInfo('loop timer executed');
                //this._audio.stop();
                _this._audio.play();
            }, this.interval * 1000); // 
        }
        ;
    };
    //
    cordova_loop.prototype.stopTimer = function () {
        player.generic.debugInfo('stop loop timer');
        clearInterval(this._timer);
        this._timer = null;
    };
    // override play
    cordova_loop.prototype.play = function () {
        if (!this._audio) {
            this._audio = new Media(this.url);
        }
        this.startTimer();
        this.isLoop = true;
    };
    // override stop
    cordova_loop.prototype.stop = function () {
        this.isLoop = false;
        this.stopTimer();
        if (this.isPlaying) {
            this._audio.stop();
        }
        this.isPlaying = false;
    };
    // setVolume
    cordova_loop.prototype.doSetVolume = function (volume) {
        this._audio.setVolume(volume);
    };
    return cordova_loop;
}(player.generic));
exports.cordova_loop = cordova_loop;
//# sourceMappingURL=player_cordova_loop.js.map
});
___scope___.file("player_control.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : zdm.player.control
// ------         wrapper for radioplayer (cordova or web)
//                
// ---------------------------------------------------------------
// Version      : 1.0.0 - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
//
// ---------------------------------------------------------------
// Dependencies : zdm.player.generic >= 1.00
//                zdm.player.cordova >= 1.00
//                zdm.player.jplayer >= 1.00
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2013
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
var player1 = require("./player_jplayer");
var player2 = require("./player_cordova");
var control = (function () {
    // public properties
    // ctor
    function control(player) {
        // private properties
        this.player = []; // all player in array
        this.active = 1; // current active player
        this.isInitPlay = false;
        // create native cordova player (android / ios / w8 / wp8)
        if (player == 'cordova') {
            this.isInitPlay = true;
            this.player.push(new player2.cordova(1));
            this.player.push(new player2.cordova(2));
        }
        else if (player == 'jplayer') {
            this.player.push(new player1.jplayer(1));
            this.player.push(new player1.jplayer(2));
        }
        // set default main volume
        this.setVolume(.5);
        // set default fading properties
        this.setFadeIn(4);
        this.setFadeOut(6);
        // set mute off
        this.setMute(false);
    }
    control.prototype.initPlay = function () {
        if (!this.isInitPlay) {
            this.isInitPlay = true;
            var song = {
                url: '',
                id: '1',
                artist: 'Artistname',
                title: 'Title',
                duration: 6,
                position: 6
            };
            this.player[0].load(song);
            this.player[0].stop();
            this.player[1].load(song);
            this.player[1].stop();
            this.stop();
            /*

            setTimeout(() => {
                this.player[0].load(song);
                //this.player[0].play(0);
                this.player[0].stop();
                this.player[1].load(song);
                //this.player[1].play(0);
                this.player[1].stop();

                this.stop();
                
            }, 20);
            */
        }
    };
    // returns ID from active player
    control.prototype.getId = function () {
        return this.player[this.active].getId();
    };
    // plays new song 
    control.prototype.play = function (song) {
        // fadeOut last active player
        this.player[this.active].fadeOut();
        // switch active player
        if (this.active == 0) {
            this.active = 1;
        }
        else {
            this.active = 0;
        }
        // do stop ???
        this.player[this.active].stop();
        // new song to player
        this.player[this.active].load(song);
    };
    // seeks in active player
    control.prototype.seekTo = function (position) {
        this.player[this.active].seekTo(position);
    };
    // stops all player immediately
    control.prototype.stop = function () {
        this.player[0].stop();
        this.player[1].stop();
    };
    // set volume to all player
    control.prototype.setVolume = function (volume) {
        this.mainVolume = volume;
        this.player[0].setVolume(volume);
        this.player[1].setVolume(volume);
    };
    // set fadeIn duration to all player
    control.prototype.setFadeIn = function (duration) {
        this.player[0].fadeInDur = duration;
        this.player[1].fadeInDur = duration;
    };
    // set fadeOut duration to all player
    control.prototype.setFadeOut = function (duration) {
        this.player[0].fadeOutDur = duration;
        this.player[1].fadeOutDur = duration;
    };
    // set Mute on or off
    control.prototype.setMute = function (isMute) {
        this.player[0].setMute(isMute);
        this.player[1].setMute(isMute);
    };
    // get play state
    control.prototype.getIsPlaying = function () {
        return this.player[0].isPlaying || this.player[1].isPlaying;
    };
    return control;
}());
exports.control = control;
//# sourceMappingURL=player_control.js.map
});
___scope___.file("player_jplayer.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : zdm.player.jplayer
// ------         radioplayer for 
//                jPlayer 
// ---------------------------------------------------------------
// Version      : 1.0.0 - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
//
// ---------------------------------------------------------------
// Dependencies : zdm.player.generic >= 1.00
//                jQuery  >= 1.8.0
//                jPlayer  >= 2.2.0
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2013
// ---------------------------------------------------------------
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var player = require("./player_generic");
//
var jplayer = (function (_super) {
    __extends(jplayer, _super);
    // ctor
    function jplayer(id) {
        if (id === void 0) { id = 0; }
        var _this = _super.call(this, id) || this;
        // get player
        _this._audio = $('#jquery_jplayer_' + id);
        // set reference
        var self = _this;
        //
        player.generic.debugInfo('create player : ' + _this._id);
        // init and listen on player events
        _this._audio.jPlayer({
            //
            ready: function (e) {
                //alert('ready');
            },
            // intern timer from jPlayer
            timeupdate: function (e) {
                // send position
                player.generic.sendEvent('zdm_player_position', { player: self._id, position: Math.round(e.jPlayer.status.currentTime) });
            },
            // is playing
            play: function (e) {
                // set status play
                self.isPlaying = true;
            },
            // error
            error: function (e) {
                //alert(e.jPlayer.error.hint)
            },
            // end of seeking
            seeked: function (e) {
            },
            //
            volumechange: function (e) {
            },
            //
            loadeddata: function (e) {
            },
            //
            loadedmetadata: function (e) {
            },
            // set init values
            //preload: "none",
            swfPath: "../lib/",
            //swfPath: './lib/',
            supplied: "mp3",
            //solution: "html",
            solution: "html, flash",
            wmmode: 'window',
        });
        return _this;
    }
    //----------------------------------------------------------------
    // load file or url
    jplayer.prototype.doLoad = function (url) {
        this._audio.jPlayer("setMedia", { mp3: url });
        this.fadeIn();
    };
    // play
    jplayer.prototype.doPlay = function (pos) {
        if (pos) {
            this._audio.jPlayer("play", pos);
        }
        else {
            this._audio.jPlayer("play");
        }
    };
    // pause
    jplayer.prototype.doPause = function () {
        this._audio.jPlayer("pause");
    };
    // stop
    jplayer.prototype.doStop = function () {
        if (this.isPlaying) {
            this._audio.jPlayer("stop");
        }
    };
    // seekTo
    jplayer.prototype.doSeekTo = function (pos) {
        this._audio.jPlayer("pause", pos);
    };
    // setVolume
    jplayer.prototype.doSetVolume = function (volume) {
        this._audio.jPlayer("volume", volume);
    };
    // setMute
    jplayer.prototype.doSetMute = function (isMute) {
        if (isMute) {
            this._audio.jPlayer("mute");
        }
        else {
            this._audio.jPlayer("unmute");
        }
    };
    return jplayer;
}(player.generic)); // class
exports.jplayer = jplayer;
//# sourceMappingURL=player_jplayer.js.map
});
___scope___.file("player_logic.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : zdm.player.logic
// ------         logic for MusikZirkel-player and connecting to
//                radio-controller and radio-server
// ---------------------------------------------------------------
// Version      : 1.00 - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
//
// ---------------------------------------------------------------
// Dependencies : jQuery  >= 1.7.2
//                jQueryMobile >= 1.3.0
//                socket.io >= 0.9.11
//                amplify >= ?.?.?
//                knobKnob >= ?.?.?
//                zdm.player.control >= 1.00
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2013
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
var socket = require("./socketIO");
var player1 = require("./player_jplayer_loop");
var player2 = require("./player_cordova_loop");
var player = require("./player_control");
//
var logic = (function () {
    // ctor
    function logic(options) {
        // private properies
        this.radioUrl = ''; // radio  url
        // info controls
        this.lblArtist = $('#lbl_artist');
        this.lblChannel = $('#lbl_channel');
        this.lblTitle = $('#lbl_title');
        this.lblDuration = $('#lbl_duration');
        this.lblPosition = $('#lbl_position');
        // dialogs
        this.dlgLogin = $('#popupLogin');
        this.dlgSelect = $('#popupSelect');
        this.dlgErr = $('#popupError');
        this.dlgMsg = $('#popupMessage');
        // text controls for dialogs
        this.txtMsg = $('#txt_msg');
        this.txtErr = $('#txt_err');
        //
        this.btnMute = $('#btn_mute');
        options.player = options.player || 'jplayer';
        // create player-control by type 
        this.player = new player.control(options.player);
        if (options.player === 'jplayer') {
            this.loopPlayer = new player1.jplayer_loop(options.loopInterval, options.loopUrl);
        }
        else {
            this.loopPlayer = new player2.cordova_loop(options.loopInterval, options.loopUrl);
        }
        // set fading
        this.player.setFadeIn(options.fadeIn || 4);
        this.player.setFadeOut(options.fadeOut || 6);
        // set volume
        logic.lastVolume = parseInt(localStorage.getItem('volume')) || 0.5;
        this.player.setVolume(logic.lastVolume);
        this.loopPlayer.setVolume(logic.lastVolume);
        // init other controls
        this.initControlEvents();
        this.initVolume();
        // init player events
        this.initPlayerEvents();
        // set length for marquees
        // clear infos
        this.clearSongInfo();
        // if autologin
        if (options.login) {
            logic.autoSave = false;
            logic.silentLogin = true;
            $('#user').val('DemoUser' + options.login);
            $('#pw').val('demouser');
        }
        // create controller socket
        //!! this.initController(options.connect);
        // load userlogin
        if (logic.autoSave) {
            $('#user').val(localStorage.getItem('user'));
            $('#pw').val(localStorage.getItem('pw'));
        }
        ;
        // create radio socket
        this.radioUrl = options.connect;
        logic.radioIO = new socket.socketIO(null, true);
        //!! test
        this.login('tester', 'tester');
        /*
        // something went wrong to connect rc (wait 2 seconds)
        setTimeout(() => {
            if (!logic.rcChannel.isConnected()) {
                this.showLoginDlg(true);
            }
        }, 2000);
        */
    }
    // get msg
    logic.playerMsg = function (code, param) {
        // get msg by code
        switch (code) {
            // info labels
            case 101:
                return 'ZirkelTunes Player - ' + param;
            case 102:
                return '© MusikZirkel GmbH 2017';
            case 103:
                return 'Kanal';
            case 104:
                return 'Auswahl durch 1 bis 3 ...';
            case 105:
                return 'Player';
            case 106:
                return 'z.Zt. keine Musik verfügbar';
            case 107:
                return 'keine Titelangaben verfügbar';
            // info messages (> 200 )
            case 201:
                return 'Pause ab (' + param + ' Uhr) ...\n\nZum Fortsetzen bitte "OK"';
            case 202:
                return 'Verbinde mit Server\n\nBitte warten ...';
            case 203:
                return 'Der Demo-Player wurde beendet. Bitte\nfordern Sie einen kostenlosen Testzugang\n an, um uns ausführlicher zu testen.\nDer Zugang ist kostenlos und völlig unver-\nbindlich für Sie\n         Ihr MusikZirkel Team';
            // error messages (> 300 )
            case 301:
                return 'Falsches Passwort oder ... \nIhr Account ist abgelaufen';
            case 302:
                return 'Sie sind bereits angemeldet !\nBitte vorher abmelden ...';
            case 303:
                return 'Keine Verbindung zum Internet ...\nBitte überprüfen Sie Ihre Internetverbindung \n';
            case 304:
                return 'Sie wurden vom System abgemeldet ...';
            case 305:
                return 'Benutzername und/oder Passwort fehlt ...\n';
            default:
                return '';
        }
    };
    // helper function for formating seconds in MM:SS
    logic.formatToMMSS = function (second) {
        var hours = Math.floor(second / 3600);
        var minutes = Math.floor((second - (hours * 3600)) / 60);
        var seconds = second - (hours * 3600) - (minutes * 60);
        return (minutes < 10 ? "0" + minutes.toString() : minutes.toString()) + ":" + (seconds < 10 ? "0" + seconds.toString() : seconds.toString());
    };
    // marquee control for overflow text (artist / title)
    logic.startMarquee = function (ctrl) {
        ctrl.marquee({
            //speed in milliseconds of the marquee
            speed: 15000,
            //gap in pixels between the tickers
            gap: 40,
            //time in milliseconds before the marquee will start animating
            delayBeforeStart: 1000,
            //'left' or 'right'
            direction: 'left',
            //true or false - should the marquee be duplicated to show an effect of continues flow
            duplicated: true
        });
    };
    // show channel infos
    logic.prototype.showChannelInfo = function (category, channel) {
        this.lblChannel.text(category + ' : ' + channel);
    };
    // show song infos
    logic.prototype.showSongInfo = function (info) {
        this.lblArtist.text(info.artist);
        // set marquee for artist
        if (info.artist.length > logic.artistLength) {
            logic.startMarquee($('#lbl_artist.marquee'));
        }
        // set marquee for title
        this.lblTitle.text(info.title);
        if (info.title.length > logic.titleLength) {
            logic.startMarquee($('#lbl_title.marquee'));
        }
        this.lblDuration.text(logic.formatToMMSS(info.duration));
        this.lblPosition.text('00:00');
    };
    // shows current position in Song
    logic.prototype.showPosition = function (position) {
        this.lblPosition.text(logic.formatToMMSS(position));
    };
    // shows player status
    logic.prototype.showStatus = function (status) {
    };
    // clear song infos
    logic.prototype.clearSongInfo = function () {
        this.showSongInfo({
            artist: logic.playerMsg(101, logic.version),
            title: logic.playerMsg(102),
            duration: 0,
        });
        this.showChannelInfo(logic.playerMsg(103), logic.playerMsg(104));
    };
    // dis- or enabled Channel Buttons
    logic.prototype.enableButton = function (enabled) {
        // set prop
        $('#btn_1').prop("disabled", !enabled);
        $('#btn_2').prop("disabled", !enabled);
        $('#btn_3').prop("disabled", !enabled);
        // set flag
        logic.doEnableBtn = !enabled;
        if (enabled) {
            $('#btn_1').removeClass('frame');
            $('#btn_2').removeClass('frame');
            $('#btn_3').removeClass('frame');
            this.setButtonActive(logic.user.currButton);
        }
        else {
            $('#btn_1').addClass('frame');
            $('#btn_2').addClass('frame');
            $('#btn_3').addClass('frame');
        }
    };
    // shows or hides Channel Buttons
    logic.prototype.showButton = function (visible) {
        //console.info(visible);
        if (!visible) {
            $('#btn_1').css("visibility", "hidden");
            $('#btn_2').css("visibility", "hidden");
            $('#btn_3').css("visibility", "hidden");
            $('#btn_4').css("visibility", "hidden");
        }
        else {
            $('#btn_1').css("visibility", "visible");
            $('#btn_2').css("visibility", "visible");
            $('#btn_3').css("visibility", "visible");
            $('#btn_4').css("visibility", "visible");
        }
    };
    // set button active
    logic.prototype.setButtonActive = function (nr) {
        //
        $('#btn_1').removeClass('ui-btn-active');
        $('#btn_2').removeClass('ui-btn-active');
        $('#btn_3').removeClass('ui-btn-active');
        $('#btn_4').removeClass('ui-btn-active');
        //
        $('#btn_' + nr).addClass('ui-btn-active');
    };
    // set loop on/off
    logic.prototype.setMute = function () {
        this.loopPlayer.isLoop = !this.loopPlayer.isLoop;
        if (this.loopPlayer.isLoop) {
            this.loopPlayer.play();
        }
        else {
            this.loopPlayer.stop();
        }
        // set button
        if (this.loopPlayer.isLoop) {
            this.btnMute.addClass('ui-btn-active');
        }
        else {
            this.btnMute.removeClass('ui-btn-active');
        }
    };
    // show error-dialog
    logic.prototype.showError = function (txt, cb, cancelEvt) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        if (cancelEvt === void 0) { cancelEvt = false; }
        // new message remove delegate
        this.dlgErr.undelegate();
        // parse text   
        txt = txt.replace(/\n\r?/g, '<br />');
        // assign error text
        this.txtErr.html(txt);
        // open popup
        setTimeout(function () {
            _this.dlgErr.popup('open');
        }, 100);
        // if callback
        if (cb) {
            this.dlgErr.delegate('#btn_err', "tap", function (e) {
                // cancel default event
                if (cancelEvt) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                cb();
            });
        }
    };
    // show message-dialog
    logic.prototype.showMessageDlg = function (txt, cb, showOk) {
        var _this = this;
        if (cb === void 0) { cb = null; }
        if (showOk === void 0) { showOk = true; }
        // new message remove delegate
        this.dlgMsg.undelegate();
        // parse text   
        txt = txt.replace(/\n\r?/g, '<br/>');
        // assign text
        this.txtMsg.html(txt);
        // show / hide ok-button
        if (showOk) {
            $('#btn_msg').css("visibility", "visible");
        }
        else {
            $('#btn_msg').css("visibility", "hidden");
        }
        // open popup
        setTimeout(function () {
            _this.dlgMsg.popup('open');
        }, 100);
        // if callback
        if (cb) {
            this.dlgMsg.delegate('#btn_msg', "tap", function (e) {
                cb();
            });
        }
    };
    // show login-dialog
    logic.prototype.showLoginDlg = function (doShow) {
        var _this = this;
        // already connected
        if (logic.radioIO.isConnected()) {
            // do something ??
        }
        // show
        if (doShow) {
            // close all dialogs
            this.closeAllDialogs();
            this.dlgLogin.popup('close');
            setTimeout(function () {
                _this.dlgLogin.popup('open');
            }, 100);
        }
        else {
            this.dlgLogin.popup('close');
        }
    };
    // show channel-select-dialog
    logic.prototype.showSelectDlg = function (category) {
        var _this = this;
        // clear timeout
        if (logic.autoHide) {
            clearTimeout(logic.autoHide);
            logic.autoHide = null;
        }
        if (category) {
            // position on Button nr
            this.dlgSelect.popup({ positionTo: '#btn_' + category });
            // open popup
            setTimeout(function () {
                _this.dlgSelect.popup('open');
            }, 100);
            // 
            logic.autoHide = setTimeout(function () {
                _this.dlgSelect.popup('close');
            }, 7 * 1000);
        }
        else {
            this.dlgSelect.popup('close');
        }
    };
    // close all dialogs
    logic.prototype.closeAllDialogs = function () {
        // stop timer
        //this.autoStartTimer(false); ???
        this.dlgErr.popup('close');
        this.dlgSelect.popup('close');
        this.dlgMsg.popup('close');
    };
    // play song
    logic.prototype.playSong = function (song) {
        // set complete songUrl
        song.url = this.radioUrl + '/play/' + logic.user.id + song.url;
        //song.url = 'http://1live.akacast.akamaistream.net/7/706/119434/v1/gnl.akacast.akamaistream.net/1live';
        // play it
        this.player.play(song);
    };
    // login to controller
    logic.prototype.login = function (name, pw) {
        // error - messages
        // 1 = unknonw user / wrong pw / locked / timelimit reached
        // 2 = max login-count reached
        var errTxt = [
            '',
            logic.playerMsg(301),
            logic.playerMsg(302)
        ];
        // name + pw must set (check min length ??)
        if (name && pw) {
            this.closeAllDialogs();
            // hide login
            this.showLoginDlg(false);
            // !! login via rest
            var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJpYXQiOjE1MDI1NTQ3NzR9.qEmtGnl8_yfn2VU_698yy2Ggsvo3r_vQ5IJEjN26Rfw';
            this.connectRadio(this.radioUrl, token);
            /*

            // login to controller
            logic.rcChannel.send('login', { name: name, pw: new Hashes.MD5().hex(pw) }, (result) => {
                
                // succesfull
                if (!result.err) {
                    var nr: number;
                    var btn: number;

                    // save old values
                    if (logic.user) {
                        nr = logic.user.currChannelNr;
                        btn = logic.user.currButton;
                    }
                    else {
                        nr = 0;
                        btn = 4;
                    }

                    // set result
                    logic.user = result;
                    logic.user.currChannelNr = nr;
                    logic.user.currButton = btn;

                    // is "mein radio"
                    if (logic.user.category.length < 2 ) {
                        this.showButton(false);
                        
                        // something to play
                        if (result.category[0].nr != 0) {
                            logic.user.currChannelNr = result.category[0].nr;
                            
                            this.showChannelInfo(logic.playerMsg(103), result.category[0].name)
                        }
                        else {
                            this.showChannelInfo(logic.playerMsg(105), logic.playerMsg(106))
                        }
                    }

                    // silent on reconnect
                    logic.silentLogin = true;

                    // persist name + pw
                    if (logic.autoSave) {
                        localStorage.setItem('user', name);
                        localStorage.setItem('pw', pw);
                    };
                    
                    // set timer for auto stop
                    if (logic.user.stop && logic.user.stop != '00:00') {
                        this.autoStartTimer(true);
                    }

                    // switch last channel (reconnect)
                    if (logic.user.currChannelNr > 0) {

                        // check if not already playing
                        if (!this.player.getIsPlaying()) {
                            this.selectChannel(logic.user.currChannelNr);
                        }
                    }
                }
                // show error
                else {
                    // reset flag
                    logic.silentLogin = false;

                    // show error
                    this.showError(errTxt[result.err]);
                    }
            });

            */
        }
    };
    // pause player
    logic.prototype.doPause = function () {
        var _this = this;
        // only if has channelNr
        if (logic.user.currChannelNr > 0) {
            // save last values
            var user = logic.user;
            var btn = logic.user.currButton;
            var nr = logic.user.currChannelNr;
            var time = logic.user.stop;
            var txt = this.lblChannel.text();
            // do stop click simulate
            this.setButtonActive(4);
            // stop
            this.stop();
            // clear user (no messages until reset)
            logic.user = null;
            // close all dialogs
            this.closeAllDialogs();
            // show dialog and listen on "OK"
            this.showMessageDlg(logic.playerMsg(201, time), function () {
                // close dialog
                _this.dlgMsg.popup('close');
                // reset last values
                logic.user = user;
                logic.user.currButton = btn;
                logic.user.currChannelNr = nr;
                logic.activeBtn = btn;
                // set active button
                _this.setButtonActive(btn);
                // show channel info
                _this.lblChannel.text(txt);
                // select channel
                if (nr > 0) {
                    _this.selectChannel(nr);
                }
                // restart timer
                //this.autoStartTimer(true);
            });
        }
    };
    // starts or stops timer
    logic.prototype.autoStartTimer = function (start) {
        var _this = this;
        // start 
        if (start) {
            if (!logic.autoStop) {
                if (logic.user.stop == '99:99') {
                    logic.autoStop = setInterval(function () {
                        console.info('timer');
                        // stop timer
                        _this.autoStartTimer(false);
                        // stop
                        _this.stop();
                        // show dialog and listen on "OK"
                        _this.showMessageDlg(logic.playerMsg(203), function () {
                            // close dialog
                            _this.dlgMsg.popup('close');
                            // restart timer
                            _this.autoStartTimer(true);
                        });
                    }, 30 * 60 * 1000); // half an hour
                }
                else {
                    logic.autoStop = setInterval(function () {
                        // get current time
                        var date = new Date();
                        // if reached
                        if (date.getHours() + ':' + date.getMinutes() == logic.user.stop) {
                            // stop timer
                            _this.autoStartTimer(false);
                            // pause
                            _this.doPause();
                        }
                    }, 60 * 1000); // check every minute
                }
            }
        }
        else {
            if (logic.autoStop) {
                clearInterval(logic.autoStop);
                logic.autoStop = null;
            }
        }
    };
    // stop current radio channel
    logic.prototype.stop = function () {
        // clear 
        //logic.rcChannel.send('select', 0, null);
        // enable channel buttons
        this.enableButton(true);
        // clear last radio channel
        logic.channel = null;
        logic.lastChannel = null;
        // disconnect channel
        //logic.rsChannel.disconnect();
        // stop player
        this.clearSongInfo();
        this.player.stop();
        // reset current category and channel
        if (logic.user) {
            logic.user.currButton = 4;
            logic.user.currChannelNr = 0;
        }
        logic.activeBtn = 4;
        this.setButtonActive(4);
    };
    // destroy all player and all sockets
    logic.prototype.stopAll = function () {
        // prevent error-dialog here
        $('body').css('visibility', 'hidden');
        // stop timer
        this.autoStartTimer(false);
        // clear 
        logic.user = null;
        logic.channel = null;
        logic.lastChannel = null;
        // disconnect channel
        logic.radioIO.disconnect();
        logic.radioIO = null;
        // finally stop player
        this.player.stop();
        this.player = null;
        this.loopPlayer.stop();
        this.loopPlayer = null;
        // save last volume
        localStorage.setItem('volume', logic.lastVolume.toString());
    };
    // new channel is selected
    logic.prototype.selectChannel = function (nr) {
        //console.log('nr is', nr)
        var _this = this;
        // clear last radio channel ??
        //logic.channel = logic.user.category[]
        //logic.lastChannel = null;
        // switch channel on radio server
        logic.radioIO.send('switchChannel', nr, function (result) {
            // save last channel-id ??
            //logic.lastChannel = logic.channel.id;
            // only play if position > fadeOut time
            if ((result.duration - result.position) > 6) {
                _this.playSong(result);
            }
        });
        /*
        // get selected channel data from rc
        logic.rcChannel.send('select', nr, (result: iChannel) => {
            
            // if ok
            if (result) {
                
                // disable channel buttons
                this.enableButton(false);

                // assign radio channel
                logic.channel = result;

                // set timer for auto stop
                if (logic.user.stop && logic.user.stop == '99:99') {
                    this.autoStartTimer(true);
                }

                // MusikZirkel Radio
                if (logic.channel.type == 1) {

                    // check if connected to radio server
                    if (!logic.rsChannel.isConnected()) {
                        // !!this.connectRadio(logic.channel.url);
                    }
                        // check if server url has changed
                    else if (logic.channel.url != logic.rsChannel.url) {

                        // disconnect
                        logic.rsChannel.disconnect();

                        // connect new rs
                        // !!this.connectRadio(logic.channel.url);
                    }

                    // switch channel on radio server
                    logic.rsChannel.send('switchChannel', logic.channel.id, (result: generic.iSong) => {

                        // save last channel-id
                        logic.lastChannel = logic.channel.id;

                        // only play if position > fadeOut time
                        if ((result.duration - result.position) > 6) {
                            this.playSong(result);
                        }
                    });
                }

                // shoutcast stream
                else {
                    // save last channel-id
                    logic.lastChannel = logic.channel.id;

                    // disconnect from MusikZirkel radio
                    if (logic.rsChannel.isConnected()) {
                        logic.rsChannel.disconnect();
                    };

                    // set song values
                    var song: generic.iSong = {
                        url : logic.channel.url,
                        id : logic.channel.id,
                        artist : logic.playerMsg(101, logic.version),
                        title : logic.playerMsg(107),
                        duration : 0,
                        position : 0
                    };

                    // play it
                    this.player.play(song);
                }
            }
            else {
                // do stop click simulate
                this.setButtonActive(4);
                logic.activeBtn = 4;

                // show login
                this.showLoginDlg(true);
            }
        });
        */
    };
    // render channel select menu and delegate click event on channelNr 
    logic.prototype.renderChannelList = function (nr) {
        // already rendered
        if (logic.activeBtn != nr || logic.doNewRender) {
            // reset flag
            logic.doNewRender = false;
            // channels
            var list = logic.user.category[nr - 1].channel;
            // the view
            var view = $('#selectlist');
            // undelegate and clear list
            view.undelegate();
            view.empty();
            // set caption
            view.append('<li data-role="divider">' +
                '(' + nr + ') ' + logic.user.category[nr - 1].name +
                '</li >');
            // all channels
            if (list) {
                list.forEach(function (el, idx) {
                    view.append('<li>' +
                        '<a class="button_select" data-nr="' + el.nr + '" href=# >' + el.name +
                        '</a>' +
                        '</li >');
                });
            }
            // refresh list
            try {
                view.listview('refresh');
            }
            catch (e) {
            }
            // set last active channel
            if (logic.user.currButton == nr) {
                $("#selectlist li a").each(function () {
                    if (parseInt($(this).attr("data-nr")) == logic.user.currChannelNr) {
                        $(this).addClass('button_active');
                    }
                });
            }
            ;
            // reference
            var self = this;
            // eventhandler click on channel
            view.delegate('li a', 'tap', function (e) {
                self.player.initPlay();
                // remove active state from all
                $('#selectlist li a').removeClass('button_active');
                // set button active
                $(this).addClass('button_active');
                // get channelnr
                var channelnr = parseInt($(this).attr('data-nr'));
                // set category 
                logic.user.currButton = nr;
                // close select menu
                self.showSelectDlg();
                // show channel info
                self.showChannelInfo(logic.user.category[nr - 1].name, $(this).text());
                // check if not same channelnr
                if (logic.user.currChannelNr != channelnr) {
                    // set new channelnr
                    logic.user.currChannelNr = channelnr;
                    // finally select channel from radio
                    self.selectChannel(channelnr);
                }
                return false;
            });
        }
        // show select menu
        this.showSelectDlg(nr);
    };
    /*
    // connect to controller
    private initController(server: string) {
        
        // show message dialog
        this.showMessageDlg(logic.playerMsg(202), null, false);
        
        // create or connect to controller-server
        if (!logic.rcChannel) {
            logic.rcChannel = new socket.socketIO(server, true);
        }
        else {
            logic.rcChannel.connect(server);
        }

        // -------------------------------------------------------------------------
        //  listen on connect
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('connect', () => {
            
            // set flag
            logic.rcConnected = true;

            // show login dialog
            if (!logic.silentLogin) {
                this.showLoginDlg(true);
            }
            // silent login
            else {
                
                // close all dialogs
                setTimeout(() => {
                    this.closeAllDialogs();
                }, 100);

                this.showLoginDlg(false);

                // login
                this.login($('#user').val().toString(), $('#pw').val().toString());
            }
        });

        // -------------------------------------------------------------------------
        // listen on disconnect
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('disconnect', () => {
            console.info('disconnect');

            // close all dialogs
            this.closeAllDialogs();

            // set flag
            logic.rcConnected = false;

            //* no message here ??

            // show error
            this.showError(logic.playerMsg(303), () => {
                logic.silentLogin = false;
            });

            
        });

        // -------------------------------------------------------------------------
        // listen on reconnect
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('reconnect', () => {
            console.info('reconnect client ');

            // set flag
            logic.rcConnected = true;

            // close all dialogs
            this.closeAllDialogs();
            this.showLoginDlg(false);

        });

        // -------------------------------------------------------------------------
        // listen on doLogout from controller api
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('doLogout', (result) => {

            // close all dialogs
            this.closeAllDialogs();

            // do stop click simulate
            this.setButtonActive(4);
            
            // stop
            this.stop();

            // reset userdata
            logic.user = null;

            // reset flag
            logic.silentLogin = false;

            // logout on server for safety reasons
            logic.rcChannel.send('logout', {}, (result) => {
                //console.info('logout by system ');
            });

            // disconnect from rc !! check it !!
            //logic.rcChannel.disconnect();
            
            // show error
            var msg = result.msg || logic.playerMsg(304);

            this.showError(msg);

        });

        // -------------------------------------------------------------------------
        // listen on pause or update stoptime from controller api
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('doPause', (result) => {

            // update stoptime
            if (result && result.stop) {

                // stop timer
                this.autoStartTimer(false);

                if (logic.user) {
                    logic.user.stop = result.stop;

                    // start timer
                    if (logic.user.stop != '00:00') {
                        this.autoStartTimer(true);
                    }
                }
            }
            // do pause
            else {
                this.doPause();
            }
        });

        // -------------------------------------------------------------------------
        // listen on update category from controller api for me
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('updCategoryAll', (result) => {

            //
            if (logic.user && result) {

                // assign new categories
                logic.user.category = result.category;
                logic.doNewRender = true;

                // show message
                if (result.msg) {

                    // close all dialogs
                    this.closeAllDialogs();

                    // show message dialog
                    this.showMessageDlg(result.msg);
                }
            }
            
        });

        // -------------------------------------------------------------------------
        // listen on message from controller api (Broadcast to all user / or for me)
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('message', (result) => {
            if (result && result.msg && logic.user) {

                // close all dialogs
                this.closeAllDialogs();

                // show message dialog
                this.showMessageDlg(result.msg);
            }
        });

        // -------------------------------------------------------------------------
        // listen update one category from controller api (Broadcast to all user)
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('updCategory', (result) => {
            
            //
            if (result && logic.user) {
                for (var i = 0; i < logic.user.category.length; i++) {
                    if (logic.user.category[i].nr == result.category.nr) {

                        // assign new category
                        logic.user.category[i] = result.category;

                        // check for newNr
                        if (result.newnr) {
                            logic.user.category[i].nr = result.newnr;
                        }

                        // if current selected
                        if (logic.activeBtn == (i + 1)) {
                            
                            // for new render
                            logic.doNewRender = true;
                            
                            // show channel info
                            if (logic.lastChannel) {
                                for (var j = 0; j < logic.user.category[i].channel.length; j++) {

                                    //
                                    if (logic.user.category[i].channel[j].nr == logic.user.currChannelNr) {
                                        this.showChannelInfo(logic.user.category[i].name, logic.user.category[i].channel[j].name);

                                        //
                                        break;
                                    }
                                }
                            }
                        }
                        // all done
                        break;
                    }
                }
            }
        });
        
        // -------------------------------------------------------------------------
        // listen update one channel from controller api (Broadcast to all user)
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('updChannel', (result) => {

            //
            if (result && logic.user) {

                // if update channel
                if (!result.oldid) {

                    // for all categories
                    for (var i = 0; i < logic.user.category.length; i++) {

                        // for all channels
                        for (var j = 0; j < logic.user.category[i].channel.length; j++) {

                            // find by nr
                            if (logic.user.category[i].channel[j].nr == result.channel.nr) {

                                // assign new name
                                logic.user.category[i].channel[j].name = result.channel.name;

                                // check for newNr (change)
                                if (result.newnr) {
                                    logic.user.category[i].channel[j].nr = result.newnr;
                                }

                                // show channel info if playing
                                if (logic.lastChannel == result.channel.id) {
                                    this.showChannelInfo(logic.user.category[i].name, result.channel.name);
                                }

                                // if current selected
                                if (logic.activeBtn == (i + 1)) {
                                    logic.doNewRender = true;
                                }
                            }
                        }
                    }
                }

                // check for oldid and if current playing
                if (logic.channel.nr == result.channel.nr && logic.lastChannel == result.oldid) {

                    // assign new id
                    logic.channel.id = result.channel.id;

                    // switch channel on radio server
                    logic.rsChannel.send('switchChannel', logic.channel.id, (result: generic.iSong) => {
                        // save last channel-id
                        logic.lastChannel = logic.channel.id;

                        // play it
                        this.playSong(result);
                    });
                }
            }
        });

        // -------------------------------------------------------------------------
        // listen on radio server changed (Broadcast to all user)
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('updRadio', (result) => {
            
            // current radio url = old radio url
            if (result && logic.channel && result.url == logic.channel.url) {

                if (logic.user) {

                    // get selected channel data from rc (and reset listen-counter on rc)
                    logic.rcChannel.send('select', logic.user.currChannelNr, (result: iChannel) => {

                        // disconnect old rs
                        if (logic.rsChannel.connected) {
                            logic.rsChannel.disconnect();
                        }

                        // assign radio channel
                        logic.channel = result;

                        // connect new rs
                        // !! this.connectRadio(logic.channel.url);

                        // switch channel on radio server
                        logic.rsChannel.send('switchChannel', logic.channel.id, (result: generic.iSong) => {
                            // save last channel-id
                            logic.lastChannel = logic.channel.id;

                            // play it
                            this.playSong(result);
                        });
                        });
                }
            }

        });

        // -------------------------------------------------------------------------
        // listen on controller server changed (Broadcast to all user)
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('updController', (result) => {

        });

        // -------------------------------------------------------------------------
        // listen on controller sync channel for me
        // -------------------------------------------------------------------------
        logic.rcChannel.listen('syncChannel', (result) => {

            if (result.nr > 0) {
                //
                this.selectChannel(result.nr);
                this.showChannelInfo(logic.playerMsg(103), result.txt)
            }
            else {
                // stop
                this.stop();
                this.showChannelInfo(logic.playerMsg(105), logic.playerMsg(106))
            }
        });
    }
    */
    // connect to radio server
    logic.prototype.connectRadio = function (server, token) {
        var _this = this;
        // check 
        if (logic.radioIO.connected) {
        }
        // connect with token
        logic.radioIO.connect(server, 'token=' + token);
        // listen on reconnect
        logic.radioIO.listen('connect', function () {
            console.info('connect to radio ...');
        });
        // listen on logindata
        logic.radioIO.listen('logindata', function (data) {
            // set user data
            logic.user = data;
            // later from server !!
            logic.user.start = '06:00';
            logic.user.stop = '22:00';
            //console.info('logindata ', JSON.stringify(logic.user) );
        });
        // listen on reconnect
        logic.radioIO.listen('reconnect', function () {
            //console.info('reconnect radio channel ' );
            // switch last channel 
            if (logic.lastChannel) {
                _this.selectChannel(logic.lastChannel);
            }
        });
        // listen on song changed
        logic.radioIO.listen('song_changed', function (result) {
            //console.info('song_changed : ' + result.id);
            _this.playSong(result);
        });
    };
    // events from player
    logic.prototype.initPlayerEvents = function () {
        var _this = this;
        // get new current position after seeking
        amplify.subscribe("zdm_player_seeking_ready", function (msg) {
            // check if current player
            if (msg.player == _this.player.getId()) {
                //    
                logic.radioIO.send('getPos', msg.id, function (pos) {
                    console.info('server seeking :' + pos + ' / ' + msg.position);
                    // seek to new position
                    if (msg.position != pos) {
                        _this.player.seekTo(pos);
                    }
                });
            }
            ;
        });
        // new song 
        amplify.subscribe('zdm_player_new', function (msg) {
            _this.showSongInfo(msg);
        });
        // status changed for active player
        amplify.subscribe('zdm_player_status', function (msg) {
            //console.info('status : ' + msg.status + ' from ' + msg.player);
            // check if current player
            if (msg.player == _this.player.getId()) {
                // 
                _this.showStatus(msg.status);
                // stop
                if (msg.status == 4) {
                    _this.clearSongInfo();
                }
            }
        });
        // position change for active player
        amplify.subscribe('zdm_player_position', function (msg) {
            // check if current player
            if (msg.player == _this.player.getId()) {
                _this.showPosition(msg.position);
                // enable channel buttons
                if (logic.doEnableBtn && msg.position >= 6) {
                    _this.enableButton(true);
                }
            }
        });
        // error occurs
        amplify.subscribe('zdm_player_error', function (error) {
            //console.error(error.code + ' ' + error.message);
        });
    };
    // init controls events
    logic.prototype.initControlEvents = function () {
        var self = this;
        // first category
        $(document).delegate('#btn_1', "tap", function (e) {
            self.renderChannelList(1);
            logic.activeBtn = 1;
            return false;
        });
        // second category
        $(document).delegate('#btn_2', "tap", function (e) {
            self.renderChannelList(2);
            logic.activeBtn = 2;
            return false;
        });
        // third category
        $(document).delegate('#btn_3', "tap", function (e) {
            self.renderChannelList(3);
            logic.activeBtn = 3;
            return false;
        });
        // stop playing
        $(document).delegate('#btn_4', "tap", function (e) {
            if (logic.activeBtn != 4) {
                self.stop();
            }
            ;
            return false;
        });
        // mute 
        $(document).delegate('#btn_mute', "tap", function (e) {
            self.setMute();
            return false;
        });
        // login button
        $(document).delegate('#btn_login', "tap", function (e) {
            // close login dialog
            self.showLoginDlg(false);
            if ($('#user').length > 5 && $('#pw').length > 5) {
                // try to login
                self.login($('#user').val().toString(), $('#pw').val().toString());
            }
            else {
                // show error 
                self.showError(logic.playerMsg(305));
            }
            return false;
        });
        // close error dialog default event  
        $(document).delegate('#btn_err', "tap", function (e) {
            // close error dialog
            self.dlgErr.popup('close');
            // show login dialog
            self.showLoginDlg(true);
            return false;
        });
        // close message dialog  
        $(document).delegate('#btn_msg', "tap", function (e) {
            // close dialog dialog
            self.dlgMsg.popup('close');
            return false;
        });
        // on close select menu
        $(document).delegate('#popupSelect', "popupafterclose", function (e) {
            // click simulate to last current button
            self.setButtonActive(logic.user.currButton);
        });
        // bug on IE > 9
        $('body').on('blur', function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        //
        $(document).bind("mobileinit", function () {
            /*
            $.mobile.ajaxEnabled = false;
            $.mobile.linkBindingEnabled = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.pushStateEnabled = false;
            $.mobile.changePage.defaults.changeHash = false;
            */
        });
    };
    logic.prototype.repaintKnob = function () {
        var colors = [
            '26e000', '2fe300', '37e700', '45ea00', '51ef00', '61f800',
            '6bfb00', '77ff02', '80ff05', '8cff09', '93ff0b', '9eff09',
            'a9ff07', 'c2ff03', 'd7ff07', 'f2ff0a', 'fff30a', 'ffdc09',
            'ffce0a', 'ffc30a', 'ffb509', 'ffa808', 'ff9908', 'ff8607',
            'ff7005', 'ff5f04', 'ff4f03', 'f83a00', 'ee2b00', 'e52000',
            'e52000', 'e52000', 'e52000', 'e52000', 'e52000', 'e52000'
        ];
        // responsive design
        var radius;
        var top;
        var left;
        // get width
        var width = $('#volume_knob').width();
        if (width <= 128) {
            radius = 52;
            top = 73;
            left = 70;
        }
        else {
            radius = 80;
            top = 108;
            left = 104;
        }
        ;
        var rad2deg = 180 / Math.PI;
        var deg = 0;
        var bars = $('#volume_bars');
        //
        bars.remove('.colorBar');
        // create colorbars	        
        for (var i = 0; i < 36; i++) {
            deg = i * 10;
            // Create the colorbars
            $('<div class="colorBar">').css({
                backgroundColor: '#' + colors[i],
                transform: 'rotate(' + deg + 'deg)',
                top: -Math.sin(deg / rad2deg) * radius + top,
                left: Math.cos((180 - deg) / rad2deg) * radius + left // left
            }).appendTo(bars);
        }
        ;
    };
    // init volume knob
    logic.prototype.initVolume = function () {
        var bars = $('#volume_bars');
        this.repaintKnob();
        //
        var colorBars = bars.find('.colorBar');
        var numBars = 0;
        var lastNum = -1;
        var self = this;
        var el = $('#volume_knob');
        //
        el.knobKnob({
            snap: 5,
            value: 360 * logic.lastVolume,
            //value: 180,
            turn: function (ratio) {
                //console.log('ratio ' + ratio);
                //
                numBars = Math.round(36 * ratio) + 1;
                // no change 
                if (numBars == lastNum) {
                    return false;
                }
                lastNum = numBars;
                colorBars.removeClass('active').slice(0, numBars).addClass('active');
                logic.lastVolume = ratio;
                self.player.setVolume(ratio);
                self.loopPlayer.setVolume(ratio);
            }
        });
    };
    // static properies
    logic.radioIO = null; // socket-io for radio server
    logic.user = null; // user categories for Buttons 1,2,3
    logic.channel = null; // current radio channel
    logic.lastChannel = null; // last valid selected radio-channel-id for reconnecting
    logic.activeBtn = 4; // current button off = default
    logic.doNewRender = false; // render new for selectlist
    logic.doEnableBtn = false; // flag for select Button state
    logic.silentLogin = false; // silent login without Dialog
    logic.autoHide = null; // select-Menu autoHide timeout function
    logic.autoStop = null; // autoStop Timer function 
    logic.autoStart = null; // autoStop Timer function 
    logic.autoSave = true; // autoSave last login values
    logic.lastVolume = 0.5; // last volume setting
    logic.version = '2.50'; // Version
    logic.artistLength = 16; // artist-length before marquee
    logic.titleLength = 30; // title-length before marquee
    logic.isMute = false; // mute flag
    return logic;
}()); // class
exports.logic = logic;
//# sourceMappingURL=player_logic.js.map
});
___scope___.file("player_jplayer_loop.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : player_jplayer_loop
// ------         loop player for zirkeltunes
//                jPlayer 
// ---------------------------------------------------------------
// Version      : 1.0.0 - 03.05.2014
// -------        initial creation
//                ------------------------------------------------
//              : 
//
// ---------------------------------------------------------------
// Dependencies : zdm.player.generic >= 1.00 
//                jQuery  >= 1.8.0
//                jPlayer  >= 2.2.0
// ---------------------------------------------------------------  
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2014
// ---------------------------------------------------------------
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//
var player = require("./player_generic");
//
var jplayer_loop = (function (_super) {
    __extends(jplayer_loop, _super);
    // ctor
    function jplayer_loop(interval, url) {
        var _this = 
        // inherited
        _super.call(this, 10) || this;
        _this.interval = interval;
        _this.isLoop = false;
        // debug
        //generic.isDebug = true;
        player.generic.isMute = true;
        //generic.debugInfo('start loop player')
        // get player
        _this._audio = $('#jquery_jplayer_loop');
        //
        //generic.debugInfo('create loop player');
        // init and listen on player events
        _this._audio.jPlayer({
            // load on init
            ready: function (e) {
                _this._audio.jPlayer("setMedia", { mp3: url });
            },
            // intern timer from jPlayer
            timeupdate: function (e) {
            },
            // is playing
            play: function (e) {
                // set status play
                _this.isPlaying = true;
            },
            // error
            error: function (e) {
                //generic.debugInfo('error -> ' + e.jPlayer.error.hint);
                //alert(e.jPlayer.error.hint)
            },
            // end of seeking
            seeked: function (e) {
            },
            //
            volumechange: function (e) {
            },
            //
            loadeddata: function (e) {
            },
            //
            loadedmetadata: function (e) {
            },
            // set init values
            swfPath: "../lib/",
            supplied: "mp3",
            solution: "html, flash",
            wmmode: 'window',
        });
        return _this;
    }
    //----------------------------------------------------------------
    //
    jplayer_loop.prototype.startTimer = function () {
        var _this = this;
        if (!this._timer) {
            //generic.debugInfo('start loop timer');
            this._audio.jPlayer("play");
            // set timer
            this._timer = setInterval(function () {
                //generic.debugInfo('loop timer executed');
                _this._audio.jPlayer("stop");
                _this._audio.jPlayer("play");
            }, this.interval * 1000); // 
        }
        ;
    };
    //
    jplayer_loop.prototype.stopTimer = function () {
        //generic.debugInfo('stop loop timer');
        clearInterval(this._timer);
        this._timer = null;
    };
    // override play
    jplayer_loop.prototype.play = function () {
        this.startTimer();
        this.isLoop = true;
    };
    // override stop
    jplayer_loop.prototype.stop = function () {
        this.isLoop = false;
        this.stopTimer();
        if (this.isPlaying) {
            this._audio.jPlayer("stop");
        }
        this.isPlaying = false;
    };
    // setVolume
    jplayer_loop.prototype.doSetVolume = function (volume) {
        this._audio.jPlayer("volume", volume);
    };
    return jplayer_loop;
}(player.generic));
exports.jplayer_loop = jplayer_loop;
//# sourceMappingURL=player_jplayer_loop.js.map
});
___scope___.file("boot_cordova.js", function(exports, require, module, __filename, __dirname){

"use strict";
// ---------------------------------------------------------------
// Module       : boot_cordova
// ------         bootstrip for cordova MusikZirkel player 
//                
// ---------------------------------------------------------------
// Version      : 1.0.0 - 01.01.2013
// -------        initial creation
//                ------------------------------------------------
//              : 
//
// ---------------------------------------------------------------
// Dependencies : zdm.player.logic >= 1.00
//                jQuery  >= 1.8.2
//                cordova >= 2.2.0
// ---------------------------------------------------------------
// Author       : P. Busch
// Copyright    : MusikZirkel GmbH 2013
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// the player
var player = require("./player_logic");
var myplayer;
// jquery is ready ...
$(document).ready(function () {
    console.info('document ready');
    var options = {
        login: null,
        player: 'cordova',
        connect: 'http://94.130.34.228',
        //connect: 'http://192.168.178.32:3005',
        fadeIn: 4,
        fadeOut: 6,
        loopInterval: 40,
        loopUrl: 'http://94.130.34.228/changeStation.mp3',
    };
    // import node_modules via FuseBox
    myplayer = new player.logic(options);
});
// cordova is ready ...
document.addEventListener('deviceready', function () {
    console.info('device ready');
    // for login
    var val;
    if ($(window).height() == 527) {
        val = 2;
    }
    else if ($(window).height() > 533) {
        val = Math.floor(($(window).height() - 533) / 2);
    }
    else {
        val = Math.floor(($(window).height() - 268) / 2);
    }
    // set top 
    $('#player_view').css('top', val);
    //console.info('top :' + val);
    // test
    //$('#lbl_channel').text($(window).height() + '/' + $(window).width() + '/' + val);
    // save login top
    val = $('#popupLogin').css('top');
    // set body visible
    $('body').css('visibility', 'visible');
    /*
    $('#lbl_channel').text($(window).height() + '/' + $(window).width());

    $(window).resize(function () {
        $('#lbl_channel').text($(window).height() + '/' + $(window).width());
    });
    */
    // for login 
    document.addEventListener("showkeyboard", function (e) {
        //console.info('show');
        $('#popupLogin').css('top', '-100px');
    }, false);
    // for login 
    document.addEventListener("hidekeyboard", function (e) {
        //console.info('hide');
        $('#popupLogin').css('top', val);
        $('#user').blur();
        $('#pw').blur();
    }, false);
    // Handle the offline event
    document.addEventListener("offline", function (e) {
        navigator.notification.alert('Sie haben keine Internetverbindung !', // message    
        null, // callback    
        'MusikZirkel Player', // title
        'OK' // buttonName
        );
    }, false);
    // handle backbutton
    document.addEventListener("backbutton", function (e) {
        console.info('back button ...');
        // confirm exit
        navigator.notification.confirm('Den Player beenden ?', 
        //
        function (button) {
            if (button == 1) {
                myplayer.stopAll();
                myplayer = null;
                // exit app
                setTimeout(function () {
                    navigator.app.exitApp();
                }, 500);
            }
            else {
                return false;
            }
        }, 'ZirkelTunes Player', 'Ja,Nein');
    }, false);
}, false);
//# sourceMappingURL=boot_cordova.js.map
});
});
FuseBox.global("__extends", function(d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
});

FuseBox.target = "browser"

FuseBox.import("default/index_app.js");
FuseBox.main("default/index_app.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=m[a];if(!s){if(d&&"electron"!==h.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:v}}function s(e,r,n){if(void 0===n&&(n={}),!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);h.dynamic(a,o),r(h.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=g[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=m[t.pkgName];if(u){var p={};for(var g in u.f)a.test(g)&&(p[g]=c(t.pkgName+"/"+g));return p}}if(!i){var h="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return h?r(e):null},r)}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},d||!v.require.main?w.require.main={filename:"./",paths:[]}:w.require.main=v.require.main;var j=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",j),i.fn.apply(0,j),l("after-import",j),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var m=p.p=p.p||{},g=p.e=p.e||{},h=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){g[e]=g[e]||[],g[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=m[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=m.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(m[e])return n(m[e].s);var t=m[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=m,r.isBrowser=d,r.isServer=!d,r.plugins=[],r}();return d||(v.FuseBox=h),e.FuseBox=h}(this))