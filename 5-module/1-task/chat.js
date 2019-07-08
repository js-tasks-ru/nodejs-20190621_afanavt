let clients = [];

exports.subscribe = function () {
    return new Promise(resolve => {
        clients.push(resolve);
    });

}

exports.publish = function (message) {
    clients.forEach(function (resolve) {
        resolve(message);
    });

    clients = [];
}
