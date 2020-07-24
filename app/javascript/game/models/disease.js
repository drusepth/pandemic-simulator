window.game.models.Disease = class Disease {
  MINIMUM_INFECTION_CHANCE = 10;
  MAXIMUM_INFECTION_CHANCE = 100;

  // % chance someone traveling through the area (e.g. not a resident) will have the disease
  MINIMUM_TOURIST_INFECTION_RATE = 0.0001;
  MAXIMUM_TOURIST_INFECTION_RATE = 2;

  // INFECTION STAGES

  // Someone is infected but not yet contagious or symptomatic
  // (not listed as an active infection)
  MIN_INCUBATION_WEEKS = 1;
  MAX_INCUBATION_WEEKS = 5;

  // Someone is contagious but not yet symptomatic
  // (not listed as an active infection)
  MIN_PRODROMAL_WEEKS = 1;
  MAX_PRODROMAL_WEEKS = 5;

  // Someone is contagious AND symptomatic
  // (listed as an active infection)
  MIN_ILLNESS_WEEKS = 1;
  MAX_ILLNESS_WEEKS = 10;
  MIN_ILLNESS_FATALITY = 1;   // fatality rate per week
  MAX_ILLNESS_FATALITY = 100; // ""

  // Someone is almost recovered but still 75% contagious and symptomatic
  // (listed as an active infection)
  MIN_CONVALESCENCE_WEEKS = 1;
  MAX_CONVALESCENCE_WEEKS = 5;

  constructor() {
    this.infection_chance       = (Math.random() * (this.MAXIMUM_INFECTION_CHANCE - this.MINIMUM_INFECTION_CHANCE) + this.MINIMUM_INFECTION_CHANCE).toFixed(2);
    this.tourist_infection_rate = (Math.random() * (this.MAXIMUM_TOURIST_INFECTION_RATE - this.MINIMUM_TOURIST_INFECTION_RATE) + this.MINIMUM_TOURIST_INFECTION_RATE).toFixed(4);

    this.illness_fatality = window.game.lib.helpers.randomNumberBetween(this.MIN_ILLNESS_FATALITY, this.MAX_ILLNESS_FATALITY);

    // Set average stages for this disease
    this.incubation_length    = window.game.lib.helpers.randomNumberBetween(this.MIN_INCUBATION_WEEKS, this.MAX_INCUBATION_WEEKS);
    this.prodromal_length     = window.game.lib.helpers.randomNumberBetween(this.MIN_PRODROMAL_WEEKS, this.MAX_PRODROMAL_WEEKS);
    this.illness_length       = window.game.lib.helpers.randomNumberBetween(this.MIN_ILLNESS_WEEKS, this.MAX_ILLNESS_WEEKS);
    this.convalescence_length = window.game.lib.helpers.randomNumberBetween(this.MIN_CONVALESCENCE_WEEKS, this.MAX_CONVALESCENCE_WEEKS);
  }

  successful_infection() {
    return Math.floor(Math.random() * 100) <= this.infection_chance;
  }
}