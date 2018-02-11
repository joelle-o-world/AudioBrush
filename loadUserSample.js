audioBrush.loadUserSample = function(file) {
    console.log(file.data)
    var reader = new FileReader();
    reader.onload = function() {
        disp.sample.loadFromArrayBuffer(reader.result);
    }
    reader.readAsArrayBuffer(file);
}
