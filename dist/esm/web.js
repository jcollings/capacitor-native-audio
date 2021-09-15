import { WebPlugin } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
export class NativeAudioWeb extends WebPlugin {
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
        let contents = await Filesystem.readFile({
            path: this.asset_cache[options.assetId].substr(5),
            directory: Directory.Data,
            encoding: Encoding.UTF16,
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
export { NativeAudio };
//# sourceMappingURL=web.js.map