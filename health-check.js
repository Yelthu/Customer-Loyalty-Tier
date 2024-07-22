const expectedHeathCheck = {
    message: 'pong'
}

const healthCheck = (res) => {

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(expectedHeathCheck));

}

module.exports = { healthCheck }