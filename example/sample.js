"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
// Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
// var e2ee_worker_worker_1 = require("../src/e2ee/worker/e2ee.worker?worker");
var livekit = require("livekit-client");
// var e2ee_worker_worker_1 = require("e2ee.worker");

var $ = function (id) { return document.getElementById(id); };
var state = {
    isFrontFacing: false,
    encoder: new TextEncoder(),
    decoder: new TextDecoder(),
    defaultDevices: new Map(),
    bitrateInterval: undefined,
    e2eeKeyProvider: new livekit.ExternalE2EEKeyProvider(),
};
var currentRoom;
var startTime;
var searchParams = new URLSearchParams(window.location.search);
var storedUrl = (_a = searchParams.get('url')) !== null && _a !== void 0 ? _a : 'ws://localhost:7880';
var storedToken = (_b = searchParams.get('token')) !== null && _b !== void 0 ? _b : '';
$('url').value = storedUrl;
$('token').value = storedToken;
var storedKey = searchParams.get('key');
if (!storedKey) {
    $('crypto-key').value = 'password';
}
else {
    $('crypto-key').value = storedKey;
}
function updateSearchParams(url, token, key) {
    var params = new URLSearchParams({ url: url, token: token, key: key });
    window.history.replaceState(null, '', "".concat(window.location.pathname, "?").concat(params.toString()));
}
// handles actions from the HTML
var appActions = {
    connectWithFormInput: function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, token, simulcast, dynacast, forceTURN, adaptiveStream, shouldPublish, preferredCodec, cryptoKey, autoSubscribe, e2eeEnabled, audioOutputId, roomOpts, connectOpts;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = $('url').value;
                    token = $('token').value;
                    simulcast = $('simulcast').checked;
                    dynacast = $('dynacast').checked;
                    forceTURN = $('force-turn').checked;
                    adaptiveStream = $('adaptive-stream').checked;
                    shouldPublish = $('publish-option').checked;
                    preferredCodec = $('preferred-codec').value;
                    cryptoKey = $('crypto-key').value;
                    autoSubscribe = $('auto-subscribe').checked;
                    e2eeEnabled = $('e2ee').checked;
                    audioOutputId = $('audio-output').value;
                    (0, livekit.setLogLevel)(livekit.LogLevel.debug);
                    updateSearchParams(url, token, cryptoKey);
                    roomOpts = {
                        adaptiveStream: adaptiveStream,
                        dynacast: dynacast,
                        audioOutput: {
                            deviceId: audioOutputId,
                        },
                        publishDefaults: {
                            simulcast: simulcast,
                            videoSimulcastLayers: [livekit.VideoPresets.h90, livekit.VideoPresets.h216],
                            videoCodec: preferredCodec || 'vp8',
                            dtx: true,
                            red: true,
                            forceStereo: false,
                            screenShareEncoding: livekit.ScreenSharePresets.h1080fps30.encoding,
                        },
                        videoCaptureDefaults: {
                            resolution: livekit.VideoPresets.h720.resolution,
                        },
                        e2ee: e2eeEnabled
                            ? { keyProvider: state.e2eeKeyProvider, worker: new Worker("./e2ee.worker.js", { type: "module" }) } // e2ee_worker_worker_1.default() }
                            : undefined,
                    };
                    if (((_a = roomOpts.publishDefaults) === null || _a === void 0 ? void 0 : _a.videoCodec) === 'av1' ||
                        ((_b = roomOpts.publishDefaults) === null || _b === void 0 ? void 0 : _b.videoCodec) === 'vp9') {
                        roomOpts.publishDefaults.backupCodec = true;
                    }
                    connectOpts = {
                        autoSubscribe: autoSubscribe,
                    };
                    if (forceTURN) {
                        connectOpts.rtcConfig = {
                            iceTransportPolicy: 'relay',
                        };
                    }
                    return [4 /*yield*/, appActions.connectToRoom(url, token, roomOpts, connectOpts, shouldPublish)];
                case 1:
                    _c.sent();
                    state.bitrateInterval = setInterval(renderBitrate, 1000);
                    return [2 /*return*/];
            }
        });
    }); },
    connectToRoom: function (url, token, roomOptions, connectOptions, shouldPublish) { return __awaiter(void 0, void 0, void 0, function () {
        var room, prewarmTime, cryptoKey, elapsed, _a, _b, error_1, message;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    room = new livekit.Room(roomOptions);
                    startTime = Date.now();
                    return [4 /*yield*/, room.prepareConnection(url, token)];
                case 1:
                    _c.sent();
                    prewarmTime = Date.now() - startTime;
                    appendLog("prewarmed connection in ".concat(prewarmTime, "ms"));
                    room
                        .on(livekit.RoomEvent.ParticipantConnected, participantConnected)
                        .on(livekit.RoomEvent.ParticipantDisconnected, participantDisconnected)
                        .on(livekit.RoomEvent.DataReceived, handleData)
                        .on(livekit.RoomEvent.Disconnected, handleRoomDisconnect)
                        .on(livekit.RoomEvent.Reconnecting, function () { return appendLog('Reconnecting to room'); })
                        .on(livekit.RoomEvent.Reconnected, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = appendLog;
                                    _b = ['Successfully reconnected. server'];
                                    return [4 /*yield*/, room.engine.getConnectedServerAddress()];
                                case 1:
                                    _a.apply(void 0, _b.concat([_c.sent()]));
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .on(livekit.RoomEvent.LocalTrackPublished, function (pub) {
                        var track = pub.track;
                        if (track instanceof livekit.LocalAudioTrack) {
                            var calculateVolume_1 = (0, livekit.createAudioAnalyser)(track).calculateVolume;
                            setInterval(function () {
                                var _a;
                                (_a = $('local-volume')) === null || _a === void 0 ? void 0 : _a.setAttribute('value', calculateVolume_1().toFixed(4));
                            }, 200);
                        }
                        renderParticipant(room.localParticipant);
                        updateButtonsForPublishState();
                        renderScreenShare(room);
                    })
                        .on(livekit.RoomEvent.LocalTrackUnpublished, function () {
                        renderParticipant(room.localParticipant);
                        updateButtonsForPublishState();
                        renderScreenShare(room);
                    })
                        .on(livekit.RoomEvent.RoomMetadataChanged, function (metadata) {
                        appendLog('new metadata for room', metadata);
                    })
                        .on(livekit.RoomEvent.MediaDevicesChanged, handleDevicesChanged)
                        .on(livekit.RoomEvent.AudioPlaybackStatusChanged, function () {
                        var _a, _b;
                        if (room.canPlaybackAudio) {
                            (_a = $('start-audio-button')) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', 'true');
                        }
                        else {
                            (_b = $('start-audio-button')) === null || _b === void 0 ? void 0 : _b.removeAttribute('disabled');
                        }
                    })
                        .on(livekit.RoomEvent.MediaDevicesError, function (e) {
                        var failure = livekit.MediaDeviceFailure.getFailure(e);
                        appendLog('media device failure', failure);
                    })
                        .on(livekit.RoomEvent.ConnectionQualityChanged, function (quality, participant) {
                        appendLog('connection quality changed', participant === null || participant === void 0 ? void 0 : participant.identity, quality);
                    })
                        .on(livekit.RoomEvent.TrackSubscribed, function (track, pub, participant) {
                        appendLog('subscribed to track', pub.trackSid, participant.identity);
                        renderParticipant(participant);
                        renderScreenShare(room);
                    })
                        .on(livekit.RoomEvent.TrackUnsubscribed, function (_, pub, participant) {
                        appendLog('unsubscribed from track', pub.trackSid);
                        renderParticipant(participant);
                        renderScreenShare(room);
                    })
                        .on(livekit.RoomEvent.SignalConnected, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var signalConnectionTime;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    signalConnectionTime = Date.now() - startTime;
                                    appendLog("signal connection established in ".concat(signalConnectionTime, "ms"));
                                    if (!shouldPublish) return [3 /*break*/, 2];
                                    return [4 /*yield*/, room.localParticipant.enableCameraAndMicrophone()];
                                case 1:
                                    _a.sent();
                                    appendLog("tracks published in ".concat(Date.now() - startTime, "ms"));
                                    updateButtonsForPublishState();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })
                        .on(livekit.RoomEvent.ParticipantEncryptionStatusChanged, function () {
                        updateButtonsForPublishState();
                    })
                        .on(livekit.RoomEvent.TrackStreamStateChanged, function (pub, streamState, participant) {
                        appendLog("stream state changed for ".concat(pub.trackSid, " (").concat(participant.identity, ") to ").concat(streamState.toString()));
                    });
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 7, , 8]);
                    cryptoKey = $('crypto-key').value;
                    state.e2eeKeyProvider.setKey(cryptoKey);
                    if (!$('e2ee').checked) return [3 /*break*/, 4];
                    return [4 /*yield*/, room.setE2EEEnabled(true)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [4 /*yield*/, room.connect(url, token, connectOptions)];
                case 5:
                    _c.sent();
                    elapsed = Date.now() - startTime;
                    _a = appendLog;
                    _b = ["successfully connected to ".concat(room.name, " in ").concat(Math.round(elapsed), "ms")];
                    return [4 /*yield*/, room.engine.getConnectedServerAddress()];
                case 6:
                    _a.apply(void 0, _b.concat([_c.sent()]));
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _c.sent();
                    message = error_1;
                    if (error_1.message) {
                        message = error_1.message;
                    }
                    appendLog('could not connect:', message);
                    return [2 /*return*/];
                case 8:
                    currentRoom = room;
                    window.currentRoom = room;
                    setButtonsForState(true);
                    if (room.remoteParticipants != undefined)
                        room.remoteParticipants.forEach(function (participant) {
                            participantConnected(participant);
                        });
                    participantConnected(room.localParticipant);
                    return [2 /*return*/, room];
            }
        });
    }); },
    toggleE2EE: function () { return __awaiter(void 0, void 0, void 0, function () {
        var cryptoKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentRoom || !currentRoom.options.e2ee) {
                        return [2 /*return*/];
                    }
                    cryptoKey = $('crypto-key').value;
                    state.e2eeKeyProvider.setKey(cryptoKey);
                    return [4 /*yield*/, currentRoom.setE2EEEnabled(!currentRoom.isE2EEEnabled)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    ratchetE2EEKey: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentRoom || !currentRoom.options.e2ee) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, state.e2eeKeyProvider.ratchetKey()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    toggleAudio: function () { return __awaiter(void 0, void 0, void 0, function () {
        var enabled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentRoom)
                        return [2 /*return*/];
                    enabled = currentRoom.localParticipant.isMicrophoneEnabled;
                    setButtonDisabled('toggle-audio-button', true);
                    if (enabled) {
                        appendLog('disabling audio');
                    }
                    else {
                        appendLog('enabling audio');
                    }
                    return [4 /*yield*/, currentRoom.localParticipant.setMicrophoneEnabled(!enabled)];
                case 1:
                    _a.sent();
                    setButtonDisabled('toggle-audio-button', false);
                    updateButtonsForPublishState();
                    return [2 /*return*/];
            }
        });
    }); },
    toggleVideo: function () { return __awaiter(void 0, void 0, void 0, function () {
        var enabled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentRoom)
                        return [2 /*return*/];
                    setButtonDisabled('toggle-video-button', true);
                    enabled = currentRoom.localParticipant.isCameraEnabled;
                    if (enabled) {
                        appendLog('disabling video');
                    }
                    else {
                        appendLog('enabling video');
                    }
                    return [4 /*yield*/, currentRoom.localParticipant.setCameraEnabled(!enabled)];
                case 1:
                    _a.sent();
                    setButtonDisabled('toggle-video-button', false);
                    renderParticipant(currentRoom.localParticipant);
                    // update display
                    updateButtonsForPublishState();
                    return [2 /*return*/];
            }
        });
    }); },
    flipVideo: function () {
        var _a;
        var videoPub = currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.localParticipant.getTrackPublication(livekit.Track.Source.Camera);
        if (!videoPub) {
            return;
        }
        if (state.isFrontFacing) {
            setButtonState('flip-video-button', 'Front Camera', false);
        }
        else {
            setButtonState('flip-video-button', 'Back Camera', false);
        }
        state.isFrontFacing = !state.isFrontFacing;
        var options = {
            resolution: livekit.VideoPresets.h720.resolution,
            facingMode: state.isFrontFacing ? 'user' : 'environment',
        };
        (_a = videoPub.videoTrack) === null || _a === void 0 ? void 0 : _a.restartTrack(options);
    },
    shareScreen: function () { return __awaiter(void 0, void 0, void 0, function () {
        var enabled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentRoom)
                        return [2 /*return*/];
                    enabled = currentRoom.localParticipant.isScreenShareEnabled;
                    appendLog("".concat(enabled ? 'stopping' : 'starting', " screen share"));
                    setButtonDisabled('share-screen-button', true);
                    return [4 /*yield*/, currentRoom.localParticipant.setScreenShareEnabled(!enabled, { audio: true })];
                case 1:
                    _a.sent();
                    setButtonDisabled('share-screen-button', false);
                    updateButtonsForPublishState();
                    return [2 /*return*/];
            }
        });
    }); },
    startAudio: function () {
        currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.startAudio();
    },
    enterText: function () {
        if (!currentRoom)
            return;
        var textField = $('entry');
        if (textField.value) {
            var msg = state.encoder.encode(textField.value);
            currentRoom.localParticipant.publishData(msg, { reliable: true });
            $('chat').value +=
                "".concat(currentRoom.localParticipant.identity, " (me): ").concat(textField.value, "\n");
            textField.value = '';
        }
    },
    disconnectRoom: function () {
        if (currentRoom) {
            currentRoom.disconnect();
        }
        if (state.bitrateInterval) {
            clearInterval(state.bitrateInterval);
        }
    },
    handleScenario: function (e) {
        var scenario = e.target.value;
        if (scenario === 'subscribe-all') {
            currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.remoteParticipants.forEach(function (p) {
                p.trackPublications.forEach(function (rp) { return rp.setSubscribed(true); });
            });
        }
        else if (scenario === 'unsubscribe-all') {
            currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.remoteParticipants.forEach(function (p) {
                p.trackPublications.forEach(function (rp) { return rp.setSubscribed(false); });
            });
        }
        else if (scenario !== '') {
            currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.simulateScenario(scenario);
            e.target.value = '';
        }
    },
    handleDeviceSelected: function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var deviceId, elementId, kind;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deviceId = e.target.value;
                    elementId = e.target.id;
                    kind = elementMapping[elementId];
                    if (!kind) {
                        return [2 /*return*/];
                    }
                    state.defaultDevices.set(kind, deviceId);
                    if (!currentRoom) return [3 /*break*/, 2];
                    return [4 /*yield*/, currentRoom.switchActiveDevice(kind, deviceId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); },
    handlePreferredQuality: function (e) {
        var quality = e.target.value;
        var q = livekit.VideoQuality.HIGH;
        switch (quality) {
            case 'low':
                q = livekit.VideoQuality.LOW;
                break;
            case 'medium':
                q = livekit.VideoQuality.MEDIUM;
                break;
            case 'high':
                q = livekit.VideoQuality.HIGH;
                break;
            default:
                break;
        }
        if (currentRoom) {
            currentRoom.remoteParticipants.forEach(function (participant) {
                participant.trackPublications.forEach(function (track) {
                    track.setVideoQuality(q);
                });
            });
        }
    },
    handlePreferredFPS: function (e) {
        var fps = +e.target.value;
        if (currentRoom) {
            currentRoom.remoteParticipants.forEach(function (participant) {
                participant.trackPublications.forEach(function (track) {
                    track.setVideoFPS(fps);
                });
            });
        }
    },
};
window.appActions = appActions;

// --------------------------- Button click ----------------------------------- //
// $("connect-button").addEventListener('click', appActions.connectWithFormInput());


// --------------------------- event handlers ------------------------------- //
function handleData(msg, participant) {
    var str = state.decoder.decode(msg);
    var chat = $('chat');
    var from = 'server';
    if (participant) {
        from = participant.identity;
    }
    chat.value += "".concat(from, ": ").concat(str, "\n");
}
function participantConnected(participant) {
    appendLog('participant', participant.identity, 'connected', participant.metadata);
    console.log('tracks', participant.trackPublications);
    participant
        .on(livekit.ParticipantEvent.TrackMuted, function (pub) {
        appendLog('track was muted', pub.trackSid, participant.identity);
        renderParticipant(participant);
    })
        .on(livekit.ParticipantEvent.TrackUnmuted, function (pub) {
        appendLog('track was unmuted', pub.trackSid, participant.identity);
        renderParticipant(participant);
    })
        .on(livekit.ParticipantEvent.IsSpeakingChanged, function () {
        renderParticipant(participant);
    })
        .on(livekit.ParticipantEvent.ConnectionQualityChanged, function () {
        renderParticipant(participant);
    });
}
function participantDisconnected(participant) {
    appendLog('participant', participant.sid, 'disconnected');
    renderParticipant(participant, true);
}
function handleRoomDisconnect(reason) {
    if (!currentRoom)
        return;
    appendLog('disconnected from room', { reason: reason });
    setButtonsForState(false);
    renderParticipant(currentRoom.localParticipant, true);
    if (currentRoom.remoteParticipants != undefined)
        currentRoom.remoteParticipants.forEach(function (p) {
            renderParticipant(p, true);
        });
    renderScreenShare(currentRoom);
    var container = $('participants-area');
    if (container) {
        container.innerHTML = '';
    }
    // clear the chat area on disconnect
    var chat = $('chat');
    chat.value = '';
    currentRoom = undefined;
    window.currentRoom = undefined;
}
// -------------------------- rendering helpers ----------------------------- //
function appendLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var logger = $('log');
    for (var i = 0; i < arguments.length; i += 1) {
        if (typeof args[i] === 'object') {
            logger.innerHTML += "".concat(JSON && JSON.stringify ? JSON.stringify(args[i], undefined, 2) : args[i], " ");
        }
        else {
            logger.innerHTML += "".concat(args[i], " ");
        }
    }
    logger.innerHTML += '\n';
    (function () {
        logger.scrollTop = logger.scrollHeight;
    })();
}
// updates participant UI
function renderParticipant(participant, remove) {
    var _a, _b, _c, _d;
    if (remove === void 0) { remove = false; }
    var container = $('participants-area');
    if (!container)
        return;
    var identity = participant.identity;
    var div = $("participant-".concat(identity));
    if (!div && !remove) {
        div = document.createElement('div');
        div.id = "participant-".concat(identity);
        div.className = 'participant';
        div.innerHTML = "\n      <video id=\"video-".concat(identity, "\"></video>\n      <audio id=\"audio-").concat(identity, "\"></audio>\n      <div class=\"info-bar\">\n        <div id=\"name-").concat(identity, "\" class=\"name\">\n        </div>\n        <div style=\"text-align: center;\">\n          <span id=\"codec-").concat(identity, "\" class=\"codec\">\n          </span>\n          <span id=\"size-").concat(identity, "\" class=\"size\">\n          </span>\n          <span id=\"bitrate-").concat(identity, "\" class=\"bitrate\">\n          </span>\n        </div>\n        <div class=\"right\">\n          <span id=\"signal-").concat(identity, "\"></span>\n          <span id=\"mic-").concat(identity, "\" class=\"mic-on\"></span>\n          <span id=\"e2ee-").concat(identity, "\" class=\"e2ee-on\"></span>\n        </div>\n      </div>\n      ").concat(participant instanceof livekit.RemoteParticipant
            ? "<div class=\"volume-control\">\n        <input id=\"volume-".concat(identity, "\" type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" value=\"1\" orient=\"vertical\" />\n      </div>")
            : "<progress id=\"local-volume\" max=\"1\" value=\"0\" />", "\n\n    ");
        container.appendChild(div);
        var sizeElm_1 = $("size-".concat(identity));
        var videoElm_1 = $("video-".concat(identity));
        videoElm_1.onresize = function () {
            updateVideoSize(videoElm_1, sizeElm_1);
        };
    }
    var videoElm = $("video-".concat(identity));
    var audioELm = $("audio-".concat(identity));
    if (remove) {
        div === null || div === void 0 ? void 0 : div.remove();
        if (videoElm) {
            videoElm.srcObject = null;
            videoElm.src = '';
        }
        if (audioELm) {
            audioELm.srcObject = null;
            audioELm.src = '';
        }
        return;
    }
    // update properties
    $("name-".concat(identity)).innerHTML = participant.identity;
    if (participant instanceof livekit.LocalParticipant) {
        $("name-".concat(identity)).innerHTML += ' (you)';
    }
    var micElm = $("mic-".concat(identity));
    var signalElm = $("signal-".concat(identity));
    var cameraPub = participant.getTrackPublication(livekit.Track.Source.Camera);
    var micPub = participant.getTrackPublication(livekit.Track.Source.Microphone);
    if (participant.isSpeaking) {
        div.classList.add('speaking');
    }
    else {
        div.classList.remove('speaking');
    }
    if (participant instanceof livekit.RemoteParticipant) {
        var volumeSlider = $("volume-".concat(identity));
        volumeSlider.addEventListener('input', function (ev) {
            participant.setVolume(Number.parseFloat(ev.target.value));
        });
    }
    var cameraEnabled = cameraPub && cameraPub.isSubscribed && !cameraPub.isMuted;
    if (cameraEnabled) {
        if (participant instanceof livekit.LocalParticipant) {
            // flip
            videoElm.style.transform = 'scale(-1, 1)';
        }
        else if (!((_a = cameraPub === null || cameraPub === void 0 ? void 0 : cameraPub.videoTrack) === null || _a === void 0 ? void 0 : _a.attachedElements.includes(videoElm))) {
            var renderStartTime_1 = Date.now();
            // measure time to render
            videoElm.onloadeddata = function () {
                var elapsed = Date.now() - renderStartTime_1;
                var fromJoin = 0;
                if (participant.joinedAt && participant.joinedAt.getTime() < startTime) {
                    fromJoin = Date.now() - startTime;
                }
                appendLog("RemoteVideoTrack ".concat(cameraPub === null || cameraPub === void 0 ? void 0 : cameraPub.trackSid, " (").concat(videoElm.videoWidth, "x").concat(videoElm.videoHeight, ") rendered in ").concat(elapsed, "ms"), fromJoin > 0 ? ", ".concat(fromJoin, "ms from start") : '');
            };
        }
        (_b = cameraPub === null || cameraPub === void 0 ? void 0 : cameraPub.videoTrack) === null || _b === void 0 ? void 0 : _b.attach(videoElm);
    }
    else {
        // clear information display
        $("size-".concat(identity)).innerHTML = '';
        if (cameraPub === null || cameraPub === void 0 ? void 0 : cameraPub.videoTrack) {
            // detach manually whenever possible
            (_c = cameraPub.videoTrack) === null || _c === void 0 ? void 0 : _c.detach(videoElm);
        }
        else {
            videoElm.src = '';
            videoElm.srcObject = null;
        }
    }
    var micEnabled = micPub && micPub.isSubscribed && !micPub.isMuted;
    if (micEnabled) {
        if (!(participant instanceof livekit.LocalParticipant)) {
            // don't attach local audio
            audioELm.onloadeddata = function () {
                if (participant.joinedAt && participant.joinedAt.getTime() < startTime) {
                    var fromJoin = Date.now() - startTime;
                    appendLog("RemoteAudioTrack ".concat(micPub === null || micPub === void 0 ? void 0 : micPub.trackSid, " played ").concat(fromJoin, "ms from start"));
                }
            };
            (_d = micPub === null || micPub === void 0 ? void 0 : micPub.audioTrack) === null || _d === void 0 ? void 0 : _d.attach(audioELm);
        }
        micElm.className = 'mic-on';
        micElm.innerHTML = '<i class="fas fa-microphone"></i>';
    }
    else {
        micElm.className = 'mic-off';
        micElm.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    }
    var e2eeElm = $("e2ee-".concat(identity));
    if (participant.isEncrypted) {
        e2eeElm.className = 'e2ee-on';
        e2eeElm.innerHTML = '<i class="fas fa-lock"></i>';
    }
    else {
        e2eeElm.className = 'e2ee-off';
        e2eeElm.innerHTML = '<i class="fas fa-unlock"></i>';
    }
    switch (participant.connectionQuality) {
        case livekit.ConnectionQuality.Excellent:
        case livekit.ConnectionQuality.Good:
        case livekit.ConnectionQuality.Poor:
            signalElm.className = "connection-".concat(participant.connectionQuality);
            signalElm.innerHTML = '<i class="fas fa-circle"></i>';
            break;
        default:
            signalElm.innerHTML = '';
        // do nothing
    }
}
function renderScreenShare(room) {
    var _a, _b;
    var div = $('screenshare-area');
    if (room.state !== livekit.ConnectionState.Connected) {
        div.style.display = 'none';
        return;
    }
    var participant;
    var screenSharePub = room.localParticipant.getTrackPublication(livekit.Track.Source.ScreenShare);
    var screenShareAudioPub;
    if (!screenSharePub) {
        room.remoteParticipants.forEach(function (p) {
            if (screenSharePub) {
                return;
            }
            participant = p;
            var pub = p.getTrackPublication(livekit.Track.Source.ScreenShare);
            if (pub === null || pub === void 0 ? void 0 : pub.isSubscribed) {
                screenSharePub = pub;
            }
            var audioPub = p.getTrackPublication(livekit.Track.Source.ScreenShareAudio);
            if (audioPub === null || audioPub === void 0 ? void 0 : audioPub.isSubscribed) {
                screenShareAudioPub = audioPub;
            }
        });
    }
    else {
        participant = room.localParticipant;
    }
    if (screenSharePub && participant) {
        div.style.display = 'block';
        var videoElm_2 = $('screenshare-video');
        (_a = screenSharePub.videoTrack) === null || _a === void 0 ? void 0 : _a.attach(videoElm_2);
        if (screenShareAudioPub) {
            (_b = screenShareAudioPub.audioTrack) === null || _b === void 0 ? void 0 : _b.attach(videoElm_2);
        }
        videoElm_2.onresize = function () {
            updateVideoSize(videoElm_2, $('screenshare-resolution'));
        };
        var infoElm = $('screenshare-info');
        infoElm.innerHTML = "Screenshare from ".concat(participant.identity);
    }
    else {
        div.style.display = 'none';
    }
}
function renderBitrate() {
    var _a;
    if (!currentRoom || currentRoom.state !== livekit.ConnectionState.Connected) {
        return;
    }
    var participants = __spreadArray([], currentRoom.remoteParticipants.values(), true);
    participants.push(currentRoom.localParticipant);
    for (var _i = 0, participants_1 = participants; _i < participants_1.length; _i++) {
        var p = participants_1[_i];
        var elm = $("bitrate-".concat(p.identity));
        var totalBitrate = 0;
        for (var _b = 0, _c = p.trackPublications.values(); _b < _c.length; _b++) {
            var t = _c[_b];
            if (t.track) {
                totalBitrate += t.track.currentBitrate;
            }
            if (t.source === livekit.Track.Source.Camera) {
                if (t.videoTrack instanceof livekit.RemoteVideoTrack) {
                    var codecElm = $("codec-".concat(p.identity));
                    codecElm.innerHTML = (_a = t.videoTrack.getDecoderImplementation()) !== null && _a !== void 0 ? _a : '';
                }
            }
        }
        var displayText = '';
        if (totalBitrate > 0) {
            displayText = "".concat(Math.round(totalBitrate / 1024).toLocaleString(), " kbps");
        }
        if (elm) {
            elm.innerHTML = displayText;
        }
    }
}
function updateVideoSize(element, target) {
    target.innerHTML = "(".concat(element.videoWidth, "x").concat(element.videoHeight, ")");
}
function setButtonState(buttonId, buttonText, isActive, isDisabled) {
    if (isDisabled === void 0) { isDisabled = undefined; }
    var el = $(buttonId);
    if (!el)
        return;
    if (isDisabled !== undefined) {
        el.disabled = isDisabled;
    }
    el.innerHTML = buttonText;
    if (isActive) {
        el.classList.add('active');
    }
    else {
        el.classList.remove('active');
    }
}
function setButtonDisabled(buttonId, isDisabled) {
    var el = $(buttonId);
    el.disabled = isDisabled;
}
setTimeout(handleDevicesChanged, 100);
function setButtonsForState(connected) {
    var connectedSet = [
        'toggle-video-button',
        'toggle-audio-button',
        'share-screen-button',
        'disconnect-ws-button',
        'disconnect-room-button',
        'flip-video-button',
        'send-button',
    ];
    if (currentRoom && currentRoom.options.e2ee) {
        connectedSet.push('toggle-e2ee-button', 'e2ee-ratchet-button');
    }
    var disconnectedSet = ['connect-button'];
    var toRemove = connected ? connectedSet : disconnectedSet;
    var toAdd = connected ? disconnectedSet : connectedSet;
    toRemove.forEach(function (id) { var _a; return (_a = $(id)) === null || _a === void 0 ? void 0 : _a.removeAttribute('disabled'); });
    toAdd.forEach(function (id) { var _a; return (_a = $(id)) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', 'true'); });
}
var elementMapping = {
    'video-input': 'videoinput',
    'audio-input': 'audioinput',
    'audio-output': 'audiooutput',
};
function handleDevicesChanged() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            Promise.all(Object.keys(elementMapping).map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                var kind, devices, element;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            kind = elementMapping[id];
                            if (!kind) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, livekit.Room.getLocalDevices(kind)];
                        case 1:
                            devices = _a.sent();
                            element = $(id);
                            populateSelect(element, devices, state.defaultDevices.get(kind));
                            return [2 /*return*/];
                    }
                });
            }); }));
            return [2 /*return*/];
        });
    });
}
function populateSelect(element, devices, selectedDeviceId) {
    // clear all elements
    element.innerHTML = '';
    for (var _i = 0, devices_1 = devices; _i < devices_1.length; _i++) {
        var device = devices_1[_i];
        var option = document.createElement('option');
        option.text = device.label;
        option.value = device.deviceId;
        if (device.deviceId === selectedDeviceId) {
            option.selected = true;
        }
        element.appendChild(option);
    }
}
function updateButtonsForPublishState() {
    if (!currentRoom) {
        return;
    }
    var lp = currentRoom.localParticipant;
    // video
    setButtonState('toggle-video-button', "".concat(lp.isCameraEnabled ? 'Disable' : 'Enable', " Video"), lp.isCameraEnabled);
    // audio
    setButtonState('toggle-audio-button', "".concat(lp.isMicrophoneEnabled ? 'Disable' : 'Enable', " Audio"), lp.isMicrophoneEnabled);
    // screen share
    setButtonState('share-screen-button', lp.isScreenShareEnabled ? 'Stop Screen Share' : 'Share Screen', lp.isScreenShareEnabled);
    // e2ee
    setButtonState('toggle-e2ee-button', "".concat(currentRoom.isE2EEEnabled ? 'Disable' : 'Enable', " E2EE"), currentRoom.isE2EEEnabled);
}
function acquireDeviceList() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            handleDevicesChanged();
            return [2 /*return*/];
        });
    });
}
function populateSupportedCodecs() {
    /*
  <option value="" selected>PreferredCodec</option>
                  <option value="vp8">VP8</option>
                  <option value="h264">H.264</option>
                  <option value="vp9">VP9</option>
                  <option value="av1">AV1</option>
  */
    var codecSelect = $('preferred-codec');
    var options = [
        ['', 'Preferred codec'],
        ['h264', 'H.264'],
        ['vp8', 'VP8'],
    ];
    if ((0, livekit.supportsVP9)()) {
        options.push(['vp9', 'VP9']);
    }
    if ((0, livekit.supportsAV1)()) {
        options.push(['av1', 'AV1']);
    }
    for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
        var o = options_1[_i];
        var n = document.createElement('option');
        n.value = o[0];
        n.appendChild(document.createTextNode(o[1]));
        codecSelect.appendChild(n);
    }
}
acquireDeviceList();
populateSupportedCodecs();
