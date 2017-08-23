(function() {
    if (window.$fsx) {
        return;
    };
    var $fsx = window.$fsx = {}
    $fsx.f = {}
    // cached modules
    $fsx.m = {};
    $fsx.r = function(id) {
        var cached = $fsx.m[id];
        // resolve if in cache
        if (cached) {
            return cached.m.exports;
        }
        var file = $fsx.f[id];
        if (!file)
            return;
        cached = $fsx.m[id] = {};
        cached.exports = {};
        cached.m = { exports: cached.exports };
        file(cached.m, cached.exports);
        return cached.m.exports;
    };
})();
(function($fsx){
// default/index.js
$fsx.f[0] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var socket = $fsx.r(1);
exports.socket = socket;
var generic = $fsx.r(2);
exports.generic = generic;
var player1 = $fsx.r(3);
exports.player1 = player1;
var player2 = $fsx.r(4);
exports.player2 = player2;
var control = $fsx.r(5);
exports.control = control;
var logic = $fsx.r(7);
exports.logic = logic;
}
// default/socketIO.js
$fsx.f[1] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var socketIO = function () {
    function socketIO(url, newConnect) {
        if (url === void 0) {
            url = null;
        }
        if (newConnect === void 0) {
            newConnect = false;
        }
        this.url = url;
        this.newConnect = newConnect;
        this.io = null;
        this.connected = false;
        if (this.url) {
            this.connect(this.url);
        }
    }
    socketIO.prototype.isConnected = function () {
        if (this.io) {
            return this.io.connected;
        } else {
            return false;
        }
    };
    socketIO.prototype.connect = function (url, query) {
        if (query === void 0) {
            query = '';
        }
        if (this.io) {
            this.disconnect();
        }
        this.url = url;
        this.io = io(this.url, {
            query: query,
            'force new connection': this.newConnect
        });
        if (this.io.connected) {
            this.connected = true;
        }
    };
    socketIO.prototype.reconnect = function () {
        if (this.io && this.url) {
            this.io.reconnect();
            this.connected = true;
        }
    };
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
    socketIO.prototype.send = function (msgType, data, cb) {
        this.io.emit(msgType, data, function (result) {
            if (cb) {
                cb(result);
            }
        });
    };
    socketIO.prototype.listen = function (msgType, cb) {
        this.io.on(msgType, function (result) {
            if (cb) {
                cb(result);
            }
        });
    };
    return socketIO;
}();
exports.socketIO = socketIO;
}
// default/player_generic.js
$fsx.f[2] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var generic = function () {
    function generic(id) {
        if (id === void 0) {
            id = 0;
        }
        this._audio = null;
        this._timer = null;
        this._volume = 0.5;
        this._duration = 0;
        this._isFading = false;
        this._isSeeking = false;
        this._fadeTimer = null;
        this._lastVolume = 0;
        this.fadeOutDur = 6;
        this.fadeInDur = 4;
        this.fadeInAuto = true;
        this.fadeOutAuto = true;
        this.isPlaying = false;
        this._id = id;
    }
    generic.prototype.doLoad = function (url) {
    };
    generic.prototype.doPlay = function (pos) {
    };
    generic.prototype.doPause = function () {
    };
    generic.prototype.doStop = function () {
    };
    generic.prototype.doSeekTo = function (pos) {
    };
    generic.prototype.doSetVolume = function (volume) {
    };
    generic.prototype.doSetMute = function (isMute) {
    };
    generic.debugInfo = function (info) {
        if (generic.isDebug) {
            console.log(info);
        }
    };
    generic.sendEvent = function (event, val) {
        amplify.publish(event, val);
    };
    generic.prototype.getId = function () {
        return this._id;
    };
    generic.prototype.load = function (song) {
        generic.sendEvent('zdm_player_new', song);
        this._duration = song.duration;
        this.doLoad(song.url);
    };
    generic.prototype.play = function (pos) {
        if (pos === void 0) {
            pos = 0;
        }
        if (this._audio) {
            generic.debugInfo('play : ' + this._id);
            this.doPlay(pos);
        }
    };
    generic.prototype.pause = function () {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        if (this._audio && this.isPlaying) {
            generic.debugInfo('pause : ' + this._id);
            this.doPause();
        }
    };
    generic.prototype.stop = function () {
        if (this._fadeTimer) {
            clearInterval(this._fadeTimer);
            this._fadeTimer = null;
            this.setVolume(this._lastVolume);
        }
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        if (this._audio) {
            generic.debugInfo('stop : ' + this._id);
            this.doStop();
        }
        this._isFading = false;
        this._isSeeking = false;
        this.isPlaying = false;
        this._duration = 0;
    };
    generic.prototype.seekTo = function (pos) {
        if (this._audio && this.isPlaying) {
            generic.debugInfo('seekTo : ' + this._id + ' pos : ' + pos);
            this.doSeekTo(pos);
        }
    };
    generic.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._audio) {
            generic.debugInfo('setVolume : ' + this._id + ' vol : ' + volume);
            this.doSetVolume(volume);
        }
    };
    generic.prototype.setMute = function (isMute) {
        generic.isMute = isMute;
        if (this._audio) {
            this.doSetMute(isMute);
        }
    };
    generic.prototype.fadeIn = function () {
        if (this._audio && this.fadeInAuto) {
            this.fade(true);
        }
    };
    generic.prototype.fadeOut = function () {
        if (this._audio && this.isPlaying && this.fadeOutAuto) {
            this.fade(false);
        }
    };
    generic.prototype.fade = function (fadeIn) {
        var _this = this;
        generic.debugInfo('fading : ' + +this._id + ' - ' + (fadeIn ? 'in' : 'out'));
        if (!this._isFading) {
            this._isFading = true;
            this._lastVolume = this._volume;
            var currVolume = this._volume;
            if (fadeIn) {
                this.setVolume(0);
                currVolume = 0;
                if (this._audio && !this.isPlaying) {
                    this.play();
                }
            }
            var steps = (fadeIn ? this.fadeInDur : this.fadeOutDur) * 10;
            var incvol = this._lastVolume / steps;
            var counter = 0;
            if (!this._fadeTimer) {
                this._fadeTimer = setInterval(function () {
                    currVolume = fadeIn ? currVolume + incvol : currVolume - incvol;
                    _this.doSetVolume(currVolume);
                    counter += 1;
                    if (counter >= steps) {
                        clearInterval(_this._fadeTimer);
                        _this._fadeTimer = null;
                        _this._isFading = false;
                        if (fadeIn) {
                            _this.setVolume(_this._lastVolume);
                        } else {
                            _this.setVolume(0);
                            _this.stop();
                            _this.setVolume(_this._lastVolume);
                        }
                    }
                }, 100);
            }
        }
    };
    generic.isMute = false;
    generic.isDebug = false;
    return generic;
}();
exports.generic = generic;
}
// default/player_jplayer.js
$fsx.f[3] = function(module,exports){
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var player = $fsx.r(2);
var jplayer = function (_super) {
    __extends(jplayer, _super);
    function jplayer(id) {
        if (id === void 0) {
            id = 0;
        }
        var _this = _super.call(this, id) || this;
        _this._audio = $('#jquery_jplayer_' + id);
        var self = _this;
        player.generic.debugInfo('create player : ' + _this._id);
        _this._audio.jPlayer({
            ready: function (e) {
            },
            timeupdate: function (e) {
                player.generic.sendEvent('zdm_player_position', {
                    player: self._id,
                    position: Math.round(e.jPlayer.status.currentTime)
                });
            },
            play: function (e) {
                self.isPlaying = true;
            },
            error: function (e) {
            },
            seeked: function (e) {
            },
            volumechange: function (e) {
            },
            loadeddata: function (e) {
            },
            loadedmetadata: function (e) {
            },
            swfPath: '../lib/',
            supplied: 'mp3',
            solution: 'html, flash',
            wmmode: 'window'
        });
        return _this;
    }
    jplayer.prototype.doLoad = function (url) {
        this._audio.jPlayer('setMedia', { mp3: url });
        this.fadeIn();
    };
    jplayer.prototype.doPlay = function (pos) {
        if (pos) {
            this._audio.jPlayer('play', pos);
        } else {
            this._audio.jPlayer('play');
        }
    };
    jplayer.prototype.doPause = function () {
        this._audio.jPlayer('pause');
    };
    jplayer.prototype.doStop = function () {
        if (this.isPlaying) {
            this._audio.jPlayer('stop');
        }
    };
    jplayer.prototype.doSeekTo = function (pos) {
        this._audio.jPlayer('pause', pos);
    };
    jplayer.prototype.doSetVolume = function (volume) {
        this._audio.jPlayer('volume', volume);
    };
    jplayer.prototype.doSetMute = function (isMute) {
        if (isMute) {
            this._audio.jPlayer('mute');
        } else {
            this._audio.jPlayer('unmute');
        }
    };
    return jplayer;
}(player.generic);
exports.jplayer = jplayer;
}
// default/player_jplayer_loop.js
$fsx.f[4] = function(module,exports){
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var player = $fsx.r(2);
var jplayer_loop = function (_super) {
    __extends(jplayer_loop, _super);
    function jplayer_loop(interval, url) {
        var _this = _super.call(this, 10) || this;
        _this.interval = interval;
        _this.isLoop = false;
        player.generic.isMute = true;
        _this._audio = $('#jquery_jplayer_loop');
        _this._audio.jPlayer({
            ready: function (e) {
                _this._audio.jPlayer('setMedia', { mp3: url });
            },
            timeupdate: function (e) {
            },
            play: function (e) {
                _this.isPlaying = true;
            },
            error: function (e) {
            },
            seeked: function (e) {
            },
            volumechange: function (e) {
            },
            loadeddata: function (e) {
            },
            loadedmetadata: function (e) {
            },
            swfPath: '../lib/',
            supplied: 'mp3',
            solution: 'html, flash',
            wmmode: 'window'
        });
        return _this;
    }
    jplayer_loop.prototype.startTimer = function () {
        var _this = this;
        if (!this._timer) {
            this._audio.jPlayer('play');
            this._timer = setInterval(function () {
                _this._audio.jPlayer('stop');
                _this._audio.jPlayer('play');
            }, this.interval * 1000);
        }
        ;
    };
    jplayer_loop.prototype.stopTimer = function () {
        clearInterval(this._timer);
        this._timer = null;
    };
    jplayer_loop.prototype.play = function () {
        this.startTimer();
        this.isLoop = true;
    };
    jplayer_loop.prototype.stop = function () {
        this.isLoop = false;
        this.stopTimer();
        if (this.isPlaying) {
            this._audio.jPlayer('stop');
        }
        this.isPlaying = false;
    };
    jplayer_loop.prototype.doSetVolume = function (volume) {
        this._audio.jPlayer('volume', volume);
    };
    return jplayer_loop;
}(player.generic);
exports.jplayer_loop = jplayer_loop;
}
// default/player_control.js
$fsx.f[5] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var player1 = $fsx.r(3);
var player2 = $fsx.r(6);
var control = function () {
    function control(player) {
        this.player = [];
        this.active = 1;
        this.isInitPlay = false;
        if (player == 'cordova') {
            this.isInitPlay = true;
            this.player.push(new player2.cordova(1));
            this.player.push(new player2.cordova(2));
        } else if (player == 'jplayer') {
            this.player.push(new player1.jplayer(1));
            this.player.push(new player1.jplayer(2));
        }
        this.setVolume(0.5);
        this.setFadeIn(4);
        this.setFadeOut(6);
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
        }
    };
    control.prototype.getId = function () {
        return this.player[this.active].getId();
    };
    control.prototype.play = function (song) {
        this.player[this.active].fadeOut();
        if (this.active == 0) {
            this.active = 1;
        } else {
            this.active = 0;
        }
        this.player[this.active].stop();
        this.player[this.active].load(song);
    };
    control.prototype.seekTo = function (position) {
        this.player[this.active].seekTo(position);
    };
    control.prototype.stop = function () {
        this.player[0].stop();
        this.player[1].stop();
    };
    control.prototype.setVolume = function (volume) {
        this.mainVolume = volume;
        this.player[0].setVolume(volume);
        this.player[1].setVolume(volume);
    };
    control.prototype.setFadeIn = function (duration) {
        this.player[0].fadeInDur = duration;
        this.player[1].fadeInDur = duration;
    };
    control.prototype.setFadeOut = function (duration) {
        this.player[0].fadeOutDur = duration;
        this.player[1].fadeOutDur = duration;
    };
    control.prototype.setMute = function (isMute) {
        this.player[0].setMute(isMute);
        this.player[1].setMute(isMute);
    };
    control.prototype.getIsPlaying = function () {
        return this.player[0].isPlaying || this.player[1].isPlaying;
    };
    return control;
}();
exports.control = control;
}
// default/player_cordova.js
$fsx.f[6] = function(module,exports){
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var player = $fsx.r(2);
var cordova = function (_super) {
    __extends(cordova, _super);
    function cordova(id) {
        if (id === void 0) {
            id = 0;
        }
        var _this = _super.call(this, id) || this;
        _this.accessPlayer = false;
        return _this;
    }
    cordova.prototype.doLoad = function (url) {
        var self = this;
        this.stop();
        player.generic.debugInfo('create player : ' + this._id);
        this._audio = new Media(url, function () {
            player.generic.debugInfo('song ended ...' + self._id);
        }, function (error) {
            player.generic.sendEvent('zdm_player_error', {
                code: error.code,
                message: error.message
            });
        }, function (status) {
            if (status == 1) {
                self.accessPlayer = true;
                self._audio.setVolume(0);
            } else if (status == 4) {
                self.stop();
            }
            self.isPlaying = status == 2;
            player.generic.debugInfo('status : ' + self._id + ' / ' + status);
        });
        this.fadeIn();
        if (!this._timer) {
            player.generic.debugInfo('start timer : ' + this._id);
            this._timer = setInterval(function () {
                self._audio.getCurrentPosition(function (position) {
                    if (position > -1) {
                        player.generic.sendEvent('zdm_player_position', {
                            player: self._id,
                            position: Math.round(position)
                        });
                    }
                }, function (error) {
                    player.generic.sendEvent('zdm_player_error', {
                        player: self._id,
                        code: error.code,
                        message: error.message
                    });
                });
            }, 1000);
        }
        ;
    };
    cordova.prototype.doPlay = function (pos) {
        this._audio.play();
    };
    cordova.prototype.doPause = function () {
        this._audio.pause();
    };
    cordova.prototype.doStop = function () {
        this.accessPlayer = false;
        this._audio.release();
        this._audio = null;
        player.generic.debugInfo('release player : ' + this._id);
    };
    cordova.prototype.doSeekTo = function (pos) {
        player.generic.debugInfo('seeking to : ' + this._id + ' ' + pos);
        this._audio.seekTo(pos * 1000);
    };
    cordova.prototype.doSetVolume = function (volume) {
        if (this.accessPlayer) {
            if (!player.generic.isMute) {
                this._audio.setVolume(volume);
            }
        }
    };
    cordova.prototype.doSetMute = function (isMute) {
        if (isMute) {
            this._audio.setVolume(0);
        } else {
            this._audio.setVolume(this._volume);
        }
    };
    return cordova;
}(player.generic);
exports.cordova = cordova;
}
// default/player_logic.js
$fsx.f[7] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var socket = $fsx.r(1);
var player1 = $fsx.r(4);
var player2 = $fsx.r(8);
var player = $fsx.r(5);
var logic = function () {
    function logic(options) {
        this.radioUrl = '';
        this.lblArtist = $('#lbl_artist');
        this.lblChannel = $('#lbl_channel');
        this.lblTitle = $('#lbl_title');
        this.lblDuration = $('#lbl_duration');
        this.lblPosition = $('#lbl_position');
        this.dlgLogin = $('#popupLogin');
        this.dlgSelect = $('#popupSelect');
        this.dlgErr = $('#popupError');
        this.dlgMsg = $('#popupMessage');
        this.txtMsg = $('#txt_msg');
        this.txtErr = $('#txt_err');
        this.btnMute = $('#btn_mute');
        options.player = options.player || 'jplayer';
        this.player = new player.control(options.player);
        if (options.player === 'jplayer') {
            this.loopPlayer = new player1.jplayer_loop(options.loopInterval, options.loopUrl);
        } else {
            this.loopPlayer = new player2.cordova_loop(options.loopInterval, options.loopUrl);
        }
        this.player.setFadeIn(options.fadeIn || 4);
        this.player.setFadeOut(options.fadeOut || 6);
        logic.lastVolume = parseInt(localStorage.getItem('volume')) || 0.5;
        this.player.setVolume(logic.lastVolume);
        this.loopPlayer.setVolume(logic.lastVolume);
        this.initControlEvents();
        this.initVolume();
        this.initPlayerEvents();
        this.clearSongInfo();
        if (options.login) {
            logic.autoSave = false;
            logic.silentLogin = true;
            $('#user').val('DemoUser' + options.login);
            $('#pw').val('demouser');
        }
        if (logic.autoSave) {
            $('#user').val(localStorage.getItem('user'));
            $('#pw').val(localStorage.getItem('pw'));
        }
        ;
        this.radioUrl = options.connect;
        logic.radioIO = new socket.socketIO(null, true);
        this.login('tester', 'tester');
    }
    logic.playerMsg = function (code, param) {
        switch (code) {
        case 101:
            return 'ZirkelTunes Player - ' + param;
        case 102:
            return '\xA9 MusikZirkel GmbH 2017';
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
        case 201:
            return 'Pause ab (' + param + ' Uhr) ...\n\nZum Fortsetzen bitte "OK"';
        case 202:
            return 'Verbinde mit Server\n\nBitte warten ...';
        case 203:
            return 'Der Demo-Player wurde beendet. Bitte\nfordern Sie einen kostenlosen Testzugang\n an, um uns ausführlicher zu testen.\nDer Zugang ist kostenlos und völlig unver-\nbindlich für Sie\n         Ihr MusikZirkel Team';
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
    logic.formatToMMSS = function (second) {
        var hours = Math.floor(second / 3600);
        var minutes = Math.floor((second - hours * 3600) / 60);
        var seconds = second - hours * 3600 - minutes * 60;
        return (minutes < 10 ? '0' + minutes.toString() : minutes.toString()) + ':' + (seconds < 10 ? '0' + seconds.toString() : seconds.toString());
    };
    logic.startMarquee = function (ctrl) {
        ctrl.marquee({
            speed: 15000,
            gap: 40,
            delayBeforeStart: 1000,
            direction: 'left',
            duplicated: true
        });
    };
    logic.prototype.showChannelInfo = function (category, channel) {
        this.lblChannel.text(category + ' : ' + channel);
    };
    logic.prototype.showSongInfo = function (info) {
        this.lblArtist.text(info.artist);
        if (info.artist.length > logic.artistLength) {
            logic.startMarquee($('#lbl_artist.marquee'));
        }
        this.lblTitle.text(info.title);
        if (info.title.length > logic.titleLength) {
            logic.startMarquee($('#lbl_title.marquee'));
        }
        this.lblDuration.text(logic.formatToMMSS(info.duration));
        this.lblPosition.text('00:00');
    };
    logic.prototype.showPosition = function (position) {
        this.lblPosition.text(logic.formatToMMSS(position));
    };
    logic.prototype.showStatus = function (status) {
    };
    logic.prototype.clearSongInfo = function () {
        this.showSongInfo({
            artist: logic.playerMsg(101, logic.version),
            title: logic.playerMsg(102),
            duration: 0
        });
        this.showChannelInfo(logic.playerMsg(103), logic.playerMsg(104));
    };
    logic.prototype.enableButton = function (enabled) {
        $('#btn_1').prop('disabled', !enabled);
        $('#btn_2').prop('disabled', !enabled);
        $('#btn_3').prop('disabled', !enabled);
        logic.doEnableBtn = !enabled;
        if (enabled) {
            $('#btn_1').removeClass('frame');
            $('#btn_2').removeClass('frame');
            $('#btn_3').removeClass('frame');
            this.setButtonActive(logic.user.currButton);
        } else {
            $('#btn_1').addClass('frame');
            $('#btn_2').addClass('frame');
            $('#btn_3').addClass('frame');
        }
    };
    logic.prototype.showButton = function (visible) {
        if (!visible) {
            $('#btn_1').css('visibility', 'hidden');
            $('#btn_2').css('visibility', 'hidden');
            $('#btn_3').css('visibility', 'hidden');
            $('#btn_4').css('visibility', 'hidden');
        } else {
            $('#btn_1').css('visibility', 'visible');
            $('#btn_2').css('visibility', 'visible');
            $('#btn_3').css('visibility', 'visible');
            $('#btn_4').css('visibility', 'visible');
        }
    };
    logic.prototype.setButtonActive = function (nr) {
        $('#btn_1').removeClass('ui-btn-active');
        $('#btn_2').removeClass('ui-btn-active');
        $('#btn_3').removeClass('ui-btn-active');
        $('#btn_4').removeClass('ui-btn-active');
        $('#btn_' + nr).addClass('ui-btn-active');
    };
    logic.prototype.setMute = function () {
        this.loopPlayer.isLoop = !this.loopPlayer.isLoop;
        if (this.loopPlayer.isLoop) {
            this.loopPlayer.play();
        } else {
            this.loopPlayer.stop();
        }
        if (this.loopPlayer.isLoop) {
            this.btnMute.addClass('ui-btn-active');
        } else {
            this.btnMute.removeClass('ui-btn-active');
        }
    };
    logic.prototype.showError = function (txt, cb, cancelEvt) {
        var _this = this;
        if (cb === void 0) {
            cb = null;
        }
        if (cancelEvt === void 0) {
            cancelEvt = false;
        }
        this.dlgErr.undelegate();
        txt = txt.replace(/\n\r?/g, '<br />');
        this.txtErr.html(txt);
        setTimeout(function () {
            _this.dlgErr.popup('open');
        }, 100);
        if (cb) {
            this.dlgErr.delegate('#btn_err', 'tap', function (e) {
                if (cancelEvt) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                cb();
            });
        }
    };
    logic.prototype.showMessageDlg = function (txt, cb, showOk) {
        var _this = this;
        if (cb === void 0) {
            cb = null;
        }
        if (showOk === void 0) {
            showOk = true;
        }
        this.dlgMsg.undelegate();
        txt = txt.replace(/\n\r?/g, '<br/>');
        this.txtMsg.html(txt);
        if (showOk) {
            $('#btn_msg').css('visibility', 'visible');
        } else {
            $('#btn_msg').css('visibility', 'hidden');
        }
        setTimeout(function () {
            _this.dlgMsg.popup('open');
        }, 100);
        if (cb) {
            this.dlgMsg.delegate('#btn_msg', 'tap', function (e) {
                cb();
            });
        }
    };
    logic.prototype.showLoginDlg = function (doShow) {
        var _this = this;
        if (logic.radioIO.isConnected()) {
        }
        if (doShow) {
            this.closeAllDialogs();
            this.dlgLogin.popup('close');
            setTimeout(function () {
                _this.dlgLogin.popup('open');
            }, 100);
        } else {
            this.dlgLogin.popup('close');
        }
    };
    logic.prototype.showSelectDlg = function (category) {
        var _this = this;
        if (logic.autoHide) {
            clearTimeout(logic.autoHide);
            logic.autoHide = null;
        }
        if (category) {
            this.dlgSelect.popup({ positionTo: '#btn_' + category });
            setTimeout(function () {
                _this.dlgSelect.popup('open');
            }, 100);
            logic.autoHide = setTimeout(function () {
                _this.dlgSelect.popup('close');
            }, 7 * 1000);
        } else {
            this.dlgSelect.popup('close');
        }
    };
    logic.prototype.closeAllDialogs = function () {
        this.dlgErr.popup('close');
        this.dlgSelect.popup('close');
        this.dlgMsg.popup('close');
    };
    logic.prototype.playSong = function (song) {
        song.url = this.radioUrl + '/play/' + logic.user.id + song.url;
        this.player.play(song);
    };
    logic.prototype.login = function (name, pw) {
        var errTxt = [
            '',
            logic.playerMsg(301),
            logic.playerMsg(302)
        ];
        if (name && pw) {
            this.closeAllDialogs();
            this.showLoginDlg(false);
            var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJpYXQiOjE1MDI1NTQ3NzR9.qEmtGnl8_yfn2VU_698yy2Ggsvo3r_vQ5IJEjN26Rfw';
            this.connectRadio(this.radioUrl, token);
        }
    };
    logic.prototype.doPause = function () {
        var _this = this;
        if (logic.user.currChannelNr > 0) {
            var user = logic.user;
            var btn = logic.user.currButton;
            var nr = logic.user.currChannelNr;
            var time = logic.user.stop;
            var txt = this.lblChannel.text();
            this.setButtonActive(4);
            this.stop();
            logic.user = null;
            this.closeAllDialogs();
            this.showMessageDlg(logic.playerMsg(201, time), function () {
                _this.dlgMsg.popup('close');
                logic.user = user;
                logic.user.currButton = btn;
                logic.user.currChannelNr = nr;
                logic.activeBtn = btn;
                _this.setButtonActive(btn);
                _this.lblChannel.text(txt);
                if (nr > 0) {
                    _this.selectChannel(nr);
                }
            });
        }
    };
    logic.prototype.autoStartTimer = function (start) {
        var _this = this;
        if (start) {
            if (!logic.autoStop) {
                if (logic.user.stop == '99:99') {
                    logic.autoStop = setInterval(function () {
                        console.info('timer');
                        _this.autoStartTimer(false);
                        _this.stop();
                        _this.showMessageDlg(logic.playerMsg(203), function () {
                            _this.dlgMsg.popup('close');
                            _this.autoStartTimer(true);
                        });
                    }, 30 * 60 * 1000);
                } else {
                    logic.autoStop = setInterval(function () {
                        var date = new Date();
                        if (date.getHours() + ':' + date.getMinutes() == logic.user.stop) {
                            _this.autoStartTimer(false);
                            _this.doPause();
                        }
                    }, 60 * 1000);
                }
            }
        } else {
            if (logic.autoStop) {
                clearInterval(logic.autoStop);
                logic.autoStop = null;
            }
        }
    };
    logic.prototype.stop = function () {
        this.enableButton(true);
        logic.channel = null;
        logic.lastChannel = null;
        this.clearSongInfo();
        this.player.stop();
        if (logic.user) {
            logic.user.currButton = 4;
            logic.user.currChannelNr = 0;
        }
        logic.activeBtn = 4;
        this.setButtonActive(4);
    };
    logic.prototype.stopAll = function () {
        $('body').css('visibility', 'hidden');
        this.autoStartTimer(false);
        logic.user = null;
        logic.channel = null;
        logic.lastChannel = null;
        logic.radioIO.disconnect();
        logic.radioIO = null;
        this.player.stop();
        this.player = null;
        this.loopPlayer.stop();
        this.loopPlayer = null;
        localStorage.setItem('volume', logic.lastVolume.toString());
    };
    logic.prototype.selectChannel = function (nr) {
        var _this = this;
        logic.radioIO.send('switchChannel', nr, function (result) {
            if (result.duration - result.position > 6) {
                _this.playSong(result);
            }
        });
    };
    logic.prototype.renderChannelList = function (nr) {
        if (logic.activeBtn != nr || logic.doNewRender) {
            logic.doNewRender = false;
            var list = logic.user.category[nr - 1].channel;
            var view = $('#selectlist');
            view.undelegate();
            view.empty();
            view.append('<li data-role="divider">' + '(' + nr + ') ' + logic.user.category[nr - 1].name + '</li >');
            if (list) {
                list.forEach(function (el, idx) {
                    view.append('<li>' + '<a class="button_select" data-nr="' + el.nr + '" href=# >' + el.name + '</a>' + '</li >');
                });
            }
            try {
                view.listview('refresh');
            } catch (e) {
            }
            if (logic.user.currButton == nr) {
                $('#selectlist li a').each(function () {
                    if (parseInt($(this).attr('data-nr')) == logic.user.currChannelNr) {
                        $(this).addClass('button_active');
                    }
                });
            }
            ;
            var self = this;
            view.delegate('li a', 'tap', function (e) {
                self.player.initPlay();
                $('#selectlist li a').removeClass('button_active');
                $(this).addClass('button_active');
                var channelnr = parseInt($(this).attr('data-nr'));
                logic.user.currButton = nr;
                self.showSelectDlg();
                self.showChannelInfo(logic.user.category[nr - 1].name, $(this).text());
                if (logic.user.currChannelNr != channelnr) {
                    logic.user.currChannelNr = channelnr;
                    self.selectChannel(channelnr);
                }
                return false;
            });
        }
        this.showSelectDlg(nr);
    };
    logic.prototype.connectRadio = function (server, token) {
        var _this = this;
        if (logic.radioIO.connected) {
        }
        logic.radioIO.connect(server, 'token=' + token);
        logic.radioIO.listen('connect', function () {
            console.info('connect to radio ...');
        });
        logic.radioIO.listen('logindata', function (data) {
            logic.user = data;
            logic.user.start = '06:00';
            logic.user.stop = '22:00';
        });
        logic.radioIO.listen('reconnect', function () {
            if (logic.lastChannel) {
                _this.selectChannel(logic.lastChannel);
            }
        });
        logic.radioIO.listen('song_changed', function (result) {
            _this.playSong(result);
        });
    };
    logic.prototype.initPlayerEvents = function () {
        var _this = this;
        amplify.subscribe('zdm_player_seeking_ready', function (msg) {
            if (msg.player == _this.player.getId()) {
                logic.radioIO.send('getPos', msg.id, function (pos) {
                    console.info('server seeking :' + pos + ' / ' + msg.position);
                    if (msg.position != pos) {
                        _this.player.seekTo(pos);
                    }
                });
            }
            ;
        });
        amplify.subscribe('zdm_player_new', function (msg) {
            _this.showSongInfo(msg);
        });
        amplify.subscribe('zdm_player_status', function (msg) {
            if (msg.player == _this.player.getId()) {
                _this.showStatus(msg.status);
                if (msg.status == 4) {
                    _this.clearSongInfo();
                }
            }
        });
        amplify.subscribe('zdm_player_position', function (msg) {
            if (msg.player == _this.player.getId()) {
                _this.showPosition(msg.position);
                if (logic.doEnableBtn && msg.position >= 6) {
                    _this.enableButton(true);
                }
            }
        });
        amplify.subscribe('zdm_player_error', function (error) {
        });
    };
    logic.prototype.initControlEvents = function () {
        var self = this;
        $(document).delegate('#btn_1', 'tap', function (e) {
            self.renderChannelList(1);
            logic.activeBtn = 1;
            return false;
        });
        $(document).delegate('#btn_2', 'tap', function (e) {
            self.renderChannelList(2);
            logic.activeBtn = 2;
            return false;
        });
        $(document).delegate('#btn_3', 'tap', function (e) {
            self.renderChannelList(3);
            logic.activeBtn = 3;
            return false;
        });
        $(document).delegate('#btn_4', 'tap', function (e) {
            if (logic.activeBtn != 4) {
                self.stop();
            }
            ;
            return false;
        });
        $(document).delegate('#btn_mute', 'tap', function (e) {
            self.setMute();
            return false;
        });
        $(document).delegate('#btn_login', 'tap', function (e) {
            self.showLoginDlg(false);
            if ($('#user').length > 5 && $('#pw').length > 5) {
                self.login($('#user').val().toString(), $('#pw').val().toString());
            } else {
                self.showError(logic.playerMsg(305));
            }
            return false;
        });
        $(document).delegate('#btn_err', 'tap', function (e) {
            self.dlgErr.popup('close');
            self.showLoginDlg(true);
            return false;
        });
        $(document).delegate('#btn_msg', 'tap', function (e) {
            self.dlgMsg.popup('close');
            return false;
        });
        $(document).delegate('#popupSelect', 'popupafterclose', function (e) {
            self.setButtonActive(logic.user.currButton);
        });
        $('body').on('blur', function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        $(document).bind('mobileinit', function () {
        });
    };
    logic.prototype.repaintKnob = function () {
        var colors = [
            '26e000',
            '2fe300',
            '37e700',
            '45ea00',
            '51ef00',
            '61f800',
            '6bfb00',
            '77ff02',
            '80ff05',
            '8cff09',
            '93ff0b',
            '9eff09',
            'a9ff07',
            'c2ff03',
            'd7ff07',
            'f2ff0a',
            'fff30a',
            'ffdc09',
            'ffce0a',
            'ffc30a',
            'ffb509',
            'ffa808',
            'ff9908',
            'ff8607',
            'ff7005',
            'ff5f04',
            'ff4f03',
            'f83a00',
            'ee2b00',
            'e52000',
            'e52000',
            'e52000',
            'e52000',
            'e52000',
            'e52000',
            'e52000'
        ];
        var radius;
        var top;
        var left;
        var width = $('#volume_knob').width();
        if (width <= 128) {
            radius = 52;
            top = 73;
            left = 70;
        } else {
            radius = 80;
            top = 108;
            left = 104;
        }
        ;
        var rad2deg = 180 / Math.PI;
        var deg = 0;
        var bars = $('#volume_bars');
        bars.remove('.colorBar');
        for (var i = 0; i < 36; i++) {
            deg = i * 10;
            $('<div class="colorBar">').css({
                backgroundColor: '#' + colors[i],
                transform: 'rotate(' + deg + 'deg)',
                top: -Math.sin(deg / rad2deg) * radius + top,
                left: Math.cos((180 - deg) / rad2deg) * radius + left
            }).appendTo(bars);
        }
        ;
    };
    logic.prototype.initVolume = function () {
        var bars = $('#volume_bars');
        this.repaintKnob();
        var colorBars = bars.find('.colorBar');
        var numBars = 0;
        var lastNum = -1;
        var self = this;
        var el = $('#volume_knob');
        el.knobKnob({
            snap: 5,
            value: 360 * logic.lastVolume,
            turn: function (ratio) {
                numBars = Math.round(36 * ratio) + 1;
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
    logic.radioIO = null;
    logic.user = null;
    logic.channel = null;
    logic.lastChannel = null;
    logic.activeBtn = 4;
    logic.doNewRender = false;
    logic.doEnableBtn = false;
    logic.silentLogin = false;
    logic.autoHide = null;
    logic.autoStop = null;
    logic.autoStart = null;
    logic.autoSave = true;
    logic.lastVolume = 0.5;
    logic.version = '2.50';
    logic.artistLength = 16;
    logic.titleLength = 30;
    logic.isMute = false;
    return logic;
}();
exports.logic = logic;
}
// default/player_cordova_loop.js
$fsx.f[8] = function(module,exports){
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var player = $fsx.r(2);
var cordova_loop = function (_super) {
    __extends(cordova_loop, _super);
    function cordova_loop(interval, url) {
        var _this = _super.call(this, 10) || this;
        _this.interval = interval;
        _this.url = url;
        _this.accessPlayer = false;
        _this.isLoop = false;
        return _this;
    }
    cordova_loop.prototype.startTimer = function () {
        var _this = this;
        if (!this._timer) {
            player.generic.debugInfo('start loop timer');
            this._audio.play();
            this._timer = setInterval(function () {
                player.generic.debugInfo('loop timer executed');
                _this._audio.play();
            }, this.interval * 1000);
        }
        ;
    };
    cordova_loop.prototype.stopTimer = function () {
        player.generic.debugInfo('stop loop timer');
        clearInterval(this._timer);
        this._timer = null;
    };
    cordova_loop.prototype.play = function () {
        if (!this._audio) {
            this._audio = new Media(this.url);
        }
        this.startTimer();
        this.isLoop = true;
    };
    cordova_loop.prototype.stop = function () {
        this.isLoop = false;
        this.stopTimer();
        if (this.isPlaying) {
            this._audio.stop();
        }
        this.isPlaying = false;
    };
    cordova_loop.prototype.doSetVolume = function (volume) {
        this._audio.setVolume(volume);
    };
    return cordova_loop;
}(player.generic);
exports.cordova_loop = cordova_loop;
}
// default/boot_cordova.js
$fsx.f[9] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var myplayer;
var logic = $fsx.r(7);
$(document).ready(function () {
    console.info('document ready');
    var options = {
        login: null,
        player: 'cordova',
        connect: 'http://94.130.34.228',
        fadeIn: 4,
        fadeOut: 6,
        loopInterval: 40,
        loopUrl: 'http://94.130.34.228/changeStation.mp3'
    };
    myplayer = new logic.logic(options);
});
document.addEventListener('deviceready', function () {
    console.info('device ready');
    var val;
    if ($(window).height() == 527) {
        val = 2;
    } else if ($(window).height() > 533) {
        val = Math.floor(($(window).height() - 533) / 2);
    } else {
        val = Math.floor(($(window).height() - 268) / 2);
    }
    $('#player_view').css('top', val);
    val = $('#popupLogin').css('top');
    $('body').css('visibility', 'visible');
    document.addEventListener('showkeyboard', function (e) {
        $('#popupLogin').css('top', '-100px');
    }, false);
    document.addEventListener('hidekeyboard', function (e) {
        $('#popupLogin').css('top', val);
        $('#user').blur();
        $('#pw').blur();
    }, false);
    document.addEventListener('offline', function (e) {
        navigator.notification.alert('Sie haben keine Internetverbindung !', null, 'MusikZirkel Player', 'OK');
    }, false);
    document.addEventListener('backbutton', function (e) {
        console.info('back button ...');
        navigator.notification.confirm('Den Player beenden ?', function (button) {
            if (button == 1) {
                myplayer.stopAll();
                myplayer = null;
                setTimeout(function () {
                    navigator.app.exitApp();
                }, 500);
            } else {
                return false;
            }
        }, 'ZirkelTunes Player', 'Ja,Nein');
    }, false);
}, false);
}
$fsx.r(0)
})($fsx);