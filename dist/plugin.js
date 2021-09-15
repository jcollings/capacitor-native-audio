var capacitorApp = (function (exports, core, filesystem) {
    'use strict';

    const NativeAudio$1 = core.registerPlugin('NativeAudio', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.NativeAudioWeb()),
    });

    class NativeAudioWeb extends core.WebPlugin {
        constructor() {
            super({
                name: "NativeAudio",
                platforms: ["web"],
            });
            this.asset_cache = {};
        }
        resume(options) {
            console.log(options);
            throw new Error('Method not implemented.');
        }
        getCurrentTime(options) {
            console.log(options);
            throw new Error('Method not implemented.');
        }
        getDuration(options) {
            console.log(options);
            throw new Error('Method not implemented.');
        }
        configure(options) {
            console.log(options);
            throw new Error("Method not implemented.");
        }
        async preload(options) {
            if (!this.asset_cache.hasOwnProperty(options.assetId)) {
                this.asset_cache[options.assetId] = options.assetPath;
            }
        }
        async play(options) {
            if (!this.asset_cache.hasOwnProperty(options.assetId)) {
                throw new Error("Asset has not been preloaded:" + options.assetId);
            }
            function _convertUint8ArrayToFloat32Array(incomingData) {
                // incoming data is a UInt8Array
                var i, l = incomingData.length;
                var outputData = new Float32Array(incomingData.length);
                for (i = 0; i < l; i++) {
                    outputData[i] = (incomingData[i] - 128) / 128.0;
                }
                return outputData;
            }
            function _stringToMultiUint8Array(input) {
                var binary_string = input;
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes;
            }
            const context = new AudioContext();
            let contents = await filesystem.Filesystem.readFile({
                path: this.asset_cache[options.assetId].substr(5),
                directory: filesystem.Directory.Data,
                encoding: filesystem.Encoding.UTF16,
            });
            const file_data = _stringToMultiUint8Array(contents.data);
            const chunk = _convertUint8ArrayToFloat32Array(file_data);
            const audio_buffer = context.createBuffer(1, chunk.length, context.sampleRate);
            audio_buffer.getChannelData(0).set(chunk);
            const source = context.createBufferSource();
            source.buffer = audio_buffer;
            source.connect(context.destination);
            source.start();
        }
        loop(options) {
            console.log(options);
            throw new Error("Method not implemented.");
        }
        stop(options) {
            console.log(options);
            throw new Error("Method not implemented.");
        }
        unload(options) {
            console.log(options);
            throw new Error("Method not implemented.");
        }
        setVolume(options) {
            console.log(options);
            throw new Error("Method not implemented.");
        }
    }
    const NativeAudio = new NativeAudioWeb();

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        NativeAudioWeb: NativeAudioWeb,
        NativeAudio: NativeAudio
    });

    exports.NativeAudio = NativeAudio$1;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, capacitorExports, capacitorFilesystem));
//# sourceMappingURL=plugin.js.map
