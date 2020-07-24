window.game.models.Infection = class Infection {
  PHASE = {
    INCUBATION:    0,
    PRODROMAL:     1,
    ILLNESS:       2,
    // DECLINING
    CONVALESCENCE: 3,
    RECOVERED:     4,
    DEATH:         5
  }

  constructor(disease, week) {
    this.disease = disease;
    this.phase   = this.PHASE.INCUBATION;

    this.last_phase_change_week = week;

    // Treatment flags
    this.is_hospitalized = false;
  }

  tick(week_index) {
    // Check if we should progress to the next stage
    var week_delta = week_index - this.last_phase_change_week;
    switch(this.phase) {
      case this.PHASE.INCUBATION:
        if (week_delta >= this.disease.incubation_length) {
          this.phase                  = this.PHASE.PRODROMAL;
          this.last_phase_change_week = week_index;
        }

        break;

      case this.PHASE.PRODROMAL:
        if (week_delta >= this.disease.prodromal_length) {
          this.phase                  = this.PHASE.ILLNESS;
          this.last_phase_change_week = week_index;
        }
        break;

      case this.PHASE.ILLNESS:
        if (Math.floor(Math.random() * 100) <= this.disease.illness_fatality) {
          // Death!
          this.phase                  = this.PHASE.DEATH;
          this.last_phase_change_week = week_index;
          break;
        }

        if (week_delta >= this.disease.illness_length) {
          this.phase                  = this.PHASE.CONVALESCENCE;
          this.last_phase_change_week = week_index;
        }
        break;
      
      case this.PHASE.CONVALESCENCE:
        if (week_delta >= this.disease.convalescence_length) {
          this.phase                  = this.PHASE.RECOVERED;
          this.last_phase_change_week = week_index;
        }
        break;
    }
  }

  successful_infection() {
    // not contagious in incubation stage
    if (this.phase == this.PHASE.INCUBATION) { return false; }

    // contagious in prodromal and illness stages
    if (this.phase == this.PHASE.PRODROMAL || this.phase == this.PHASE.ILLNESS) {
      return Math.floor(Math.random() * 100) <= this.disease.infection_chance;
    }

    // 75% contagious in convalescence stage
    if (this.phase == this.PHASE.CONVALESCENCE) {
      return Math.floor(Math.random() * 100) <= (this.disease.infection_chance * 0.75);
    }
  }
}