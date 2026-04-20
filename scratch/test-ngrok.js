const ngrok = require('@expo/ngrok');
ngrok.connect({ addr: 8081 }).then(url => {
  console.log('Success:', url);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
