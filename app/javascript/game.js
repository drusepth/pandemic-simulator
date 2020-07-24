$(document).ready(function () {
  window.game.state.city = new window.game.models.City("Uh-oh-opolis");
  window.game.state.city.initializeGraphs();

  window.game.state.week = 1;

  $('#next-week-button').click(function () {
    window.game.state.city.processWeek();
    return false;
  });

  setInterval(function () {
    window.game.state.city.processWeek();
  }, 1000);
});