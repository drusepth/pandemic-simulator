window.game.lib.helpers = class {
  static randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}