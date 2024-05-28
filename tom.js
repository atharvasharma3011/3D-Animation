ws = new WebSocket("ws://" + ipAddress + ":81");

ws.onopen = function (event) {
    console.log(`onopen Websocket Connected ${ipAddress[i]}`);
    setTimeout(function () {
        ws.send("SECRET_KEY");
    }, 1000);

};
ws.onerror = function (event) {
    alert(" Wrong IP");

};

ws.onmessage = function (event) {
    let decryptData = (data) => {
        var decryptedData = "";
        var masterKey = "SECRETKEY";
        for (var i = 0; i < data.length; i++) {
            decryptedData += String.fromCharCode(
                data.charCodeAt(i) ^
                masterKey.charCodeAt(i % masterKey.length)
            );
        }
        return decryptedData;
    };
    var Data = decryptData(event.data);
    // console.log(Data);
    var parts = Data.split(" ");
    let mode = parseInt(parts[3]);

};

let goneo = () => {
    console.log(2 + 2);
    if (ws) {
        ws.send("rpy");
    }
};