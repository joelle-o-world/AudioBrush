audioBrush.playback = new Object();

audioBrush.playback.ctx = new AudioContext();
audioBrush.playback.master = audioBrush.playback.ctx.createGain();
audioBrush.playback.master.connect(audioBrush.playback.ctx.destination);