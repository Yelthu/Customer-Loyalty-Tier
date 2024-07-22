const http = require('http')
const url = require('url')

const { healthCheck } = require('./health-check')
const { calculateRewards } = require('./rewards-points')
const { calculateTier } = require('./loyalty-tier')

const port = 3030;


/* Input : Expected Requeted URL from the client side (/api/health-check or /api/loyalty-tier or /api/rewards-points) */
/* Output : Json formatted object to the client side for each request  */
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    //Checking and Routing for health-check end point
    if (method === 'POST' && pathname === '/api/health-check') {

        healthCheck(res)
    }

    //Checking and Routing for loyalty-tier end point
    else if (method === 'POST' && pathname === '/api/loyalty-tier') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        // Listen for end event to process the complete data
        req.on('end', () => {

            //parse JSON if needed
            try {
                const jsonData = JSON.parse(body);

                //Route to the Tier end point
                const responseLoyalty = calculateTier(jsonData)

                // Respond with the requested json format
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(responseLoyalty);

            } catch (error) {
                // Handle JSON parsing error
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        })

    }

    //Checking and Routing for rewards-points end point
    else if (method === 'POST' && pathname === '/api/rewards-points') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        // Listen for end event to process the complete data
        req.on('end', () => {

            //Parse JSON if needed
            try {
                const jsonData = JSON.parse(body);

                //Route to the Reward end point
                const responseRewards = calculateRewards(jsonData)

                // Respond with the requested json format
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(responseRewards);

            } catch (error) {
                // Handle JSON parsing error
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        })

    }


})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
})