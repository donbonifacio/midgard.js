var midgard = require('./../lib/midgard.js');
midgard.route('/', 'midgard#index');
midgard.start(process.env.PORT || 3000);
