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
// Object.defineProperty(exports, "__esModule", { value: true });
var livekit = require("livekit-client");

var participantCryptors = [];
var participantKeys = new Map();
var sharedKeyHandler;
var isEncryptionEnabled = false;
var useSharedKey = false;
var sharedKey;
var sifTrailer;
var keyProviderOptions = livekit.KEY_PROVIDER_DEFAULTS;

var workerLogger = livekit.getLogger('lk-e2ee');
workerLogger.setDefaultLevel('info');
// livekit.setLogLevel(livekit.LogLevel.debug);

onmessage = function (ev) {
    var _a = ev.data, kind = _a.kind, data = _a.data;
    switch (kind) {
        case 'init':
            workerLogger.info('worker initialized');
            keyProviderOptions = data.keyProviderOptions;
            useSharedKey = !!data.keyProviderOptions.sharedKey;
            // acknowledge init successful
            var ackMsg = {
                kind: 'initAck',
                data: { enabled: isEncryptionEnabled },
            };
            postMessage(ackMsg);
            break;
        case 'enable':
            setEncryptionEnabled(data.enabled, data.participantIdentity);
            workerLogger.info('updated e2ee enabled status');
            // acknowledge enable call successful
            postMessage(ev.data);
            break;
        case 'decode':
            var cryptor = getTrackCryptor(data.participantIdentity, data.trackId);
            cryptor.setupTransform(kind, data.readableStream, data.writableStream, data.trackId, data.codec);
            break;
        case 'encode':
            var pubCryptor = getTrackCryptor(data.participantIdentity, data.trackId);
            pubCryptor.setupTransform(kind, data.readableStream, data.writableStream, data.trackId, data.codec);
            break;
        case 'setKey':
            if (useSharedKey) {
                workerLogger.warn('set shared key');
                setSharedKey(data.key, data.keyIndex);
            }
            else if (data.participantIdentity) {
                workerLogger.warn("set participant sender key ".concat(data.participantIdentity, " index ").concat(data.keyIndex));
                getParticipantKeyHandler(data.participantIdentity).setKey(data.key, data.keyIndex);
            }
            else {
                workerLogger.error('no participant Id was provided and shared key usage is disabled');
            }
            break;
        case 'removeTransform':
            unsetCryptorParticipant(data.trackId);
            break;
        case 'updateCodec':
            getTrackCryptor(data.participantIdentity, data.trackId).setVideoCodec(data.codec);
            break;
        case 'setRTPMap':
            // this is only used for the local participant
            participantCryptors.forEach(function (cr) {
                if (cr.getParticipantIdentity() === data.participantIdentity) {
                    cr.setRtpMap(data.map);
                }
            });
            break;
        case 'ratchetRequest':
            handleRatchetRequest(data);
            break;
        case 'setSifTrailer':
            handleSifTrailer(data.trailer);
            break;
        default:
            break;
    }
};
function handleRatchetRequest(data) {
    return __awaiter(this, void 0, void 0, function () {
        var keyHandler, keyHandler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!useSharedKey) return [3 /*break*/, 2];
                    keyHandler = getSharedKeyHandler();
                    return [4 /*yield*/, keyHandler.ratchetKey(data.keyIndex)];
                case 1:
                    _a.sent();
                    keyHandler.resetKeyStatus();
                    return [3 /*break*/, 5];
                case 2:
                    if (!data.participantIdentity) return [3 /*break*/, 4];
                    keyHandler = getParticipantKeyHandler(data.participantIdentity);
                    return [4 /*yield*/, keyHandler.ratchetKey(data.keyIndex)];
                case 3:
                    _a.sent();
                    keyHandler.resetKeyStatus();
                    return [3 /*break*/, 5];
                case 4:
                    workerLogger.error('no participant Id was provided for ratchet request and shared key usage is disabled');
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getTrackCryptor(participantIdentity, trackId) {
    var cryptor = participantCryptors.find(function (c) { return c.getTrackId() === trackId; });
    if (!cryptor) {
        workerLogger.info('creating new cryptor for', { participantIdentity: participantIdentity });
        if (!keyProviderOptions) {
            throw Error('Missing keyProvider options');
        }
        cryptor = new livekit.FrameCryptor({
            participantIdentity: participantIdentity,
            keys: getParticipantKeyHandler(participantIdentity),
            keyProviderOptions: keyProviderOptions,
            sifTrailer: sifTrailer,
        });
        setupCryptorErrorEvents(cryptor);
        participantCryptors.push(cryptor);
    }
    else if (participantIdentity !== cryptor.getParticipantIdentity()) {
        // assign new participant id to track cryptor and pass in correct key handler
        cryptor.setParticipant(participantIdentity, getParticipantKeyHandler(participantIdentity));
    }
    if (sharedKey) {
    }
    return cryptor;
}
function getParticipantKeyHandler(participantIdentity) {
    if (useSharedKey) {
        return getSharedKeyHandler();
    }
    var keys = participantKeys.get(participantIdentity);
    if (!keys) {
        keys = new livekit.ParticipantKeyHandler(participantIdentity, keyProviderOptions);
        if (sharedKey) {
            keys.setKey(sharedKey);
        }
        keys.on(livekit.KeyHandlerEvent.KeyRatcheted, emitRatchetedKeys);
        participantKeys.set(participantIdentity, keys);
    }
    return keys;
}
function getSharedKeyHandler() {
    if (!sharedKeyHandler) {
        sharedKeyHandler = new livekit.ParticipantKeyHandler('shared-key', keyProviderOptions);
    }
    return sharedKeyHandler;
}
function unsetCryptorParticipant(trackId) {
    var _a;
    (_a = participantCryptors.find(function (c) { return c.getTrackId() === trackId; })) === null || _a === void 0 ? void 0 : _a.unsetParticipant();
}
function setEncryptionEnabled(enable, participantIdentity) {
    livekit.encryptionEnabledMap.set(participantIdentity, enable);
}
function setSharedKey(key, index) {
    workerLogger.debug('setting shared key');
    sharedKey = key;
    getSharedKeyHandler().setKey(key, index);
}
function setupCryptorErrorEvents(cryptor) {
    cryptor.on(livekit.CryptorEvent.Error, function (error) {
        var msg = {
            kind: 'error',
            data: { error: new Error("".concat(livekit.CryptorErrorReason[error.reason], ": ").concat(error.message)) },
        };
        postMessage(msg);
    });
}
function emitRatchetedKeys(material, participantIdentity, keyIndex) {
    var msg = {
        kind: "ratchetKey",
        data: {
            participantIdentity: participantIdentity,
            keyIndex: keyIndex,
            material: material,
        },
    };
    postMessage(msg);
}
function handleSifTrailer(trailer) {
    sifTrailer = trailer;
    participantCryptors.forEach(function (c) {
        c.setSifTrailer(trailer);
    });
}
// Operations using RTCRtpScriptTransform.
// @ts-ignore
if (self.RTCTransformEvent) {
    workerLogger.debug('setup transform event');
    // @ts-ignore
    self.onrtctransform = function (event) {
        var transformer = event.transformer;
        workerLogger.debug('transformer', transformer);
        transformer.handled = true;
        var _a = transformer.options, kind = _a.kind, participantIdentity = _a.participantIdentity, trackId = _a.trackId, codec = _a.codec;
        var cryptor = getTrackCryptor(participantIdentity, trackId);
        workerLogger.debug('transform', { codec: codec });
        cryptor.setupTransform(kind, transformer.readable, transformer.writable, trackId, codec);
    };
}
