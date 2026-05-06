const http = require('http');

const data = JSON.stringify({
  image_base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
  description: 'The leaves are turning yellow and falling off.',
  crop_type: 'maize'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/diagnose',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
