audioBrush.exportSample = function() {
    var buffer = disp.sample.toAudioBuffer();
    var wav = audioBufferToWav(buffer);
    console.log("the Wav!", wav, wav[1]);

    var binary = '';
    var bytes = new Uint8Array( wav );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }

    var uri = "data:audio/wav;base64," + btoa(binary);
    console.log(uri);

    var link = document.createElement("A");
    link.href = uri;
    link.download = "audiobrush output.wav";
    link.click();
}
