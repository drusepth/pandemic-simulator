// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("jquery")

window.game         = {};
window.game.models  = {};
window.game.ui      = {
  graphs: {}
};
window.game.state   = {};
window.game.lib     = {
  helpers: {}
};

// Can't we, like, move these requires to an index.js in game/ 
// and just require "game" here?
require("game/lib/helpers")
require("game/models/mayor")
require("game/models/disease")
require("game/models/infection")
require("game/models/city")
require("game")

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
