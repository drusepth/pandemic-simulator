// todo it'd be best not to have to model every single citizen lol
window.game.models.Citizen = class Citizen {
  constructor() {
    this.active_infections   = [];
    this.previous_infections = [];
  }
}