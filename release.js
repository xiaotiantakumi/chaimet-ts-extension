const zip = require('bestzip');
let destination = `./release/chaimet`;
destination += '.zip';
zip({
  source: 'dist/*',
  destination,
});
