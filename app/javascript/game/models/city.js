  window.game.models.City = class City {
    MINIMUM_POPULATION = 5000;
    MAXIMUM_POPULATION = 5000000;

    MINIMUM_SQUARE_MILES = 100;
    MAXIMUM_SQUARE_MILES = 5000;

    MINIMUM_TEMPERATURE = 0;
    MAXIMUM_TEMPERATURE = 100;
    TEMPERATURE_FLUCTUATION = 10;

    // The density exposure rate is a measure of how active the city is, and therefore what
    // percentage of the density (e.g. people per square mile) that a random person is exposed
    // to on a weekly basis.
    MINIMUM_DENSITY_EXPOSURE_RATE = 0.1;
    MAXIMUM_DENSITY_EXPOSURE_RATE = 3;

    MINIMUM_TOURISM_NUMBERS = 1000;
    MAXIMUM_TOURISM_NUMBERS = 100000;

    constructor(name) {
      this.name = name;
      window.game.state.week = 0;

      // Add mayor
      this.mayor = new window.game.models.Mayor("Bob");

      // Build initial population
      this.population = window.game.lib.helpers.randomNumberBetween(this.MINIMUM_POPULATION, this.MAXIMUM_POPULATION);
      this.initial_population = this.population;

      // Other stats about the city
      this.square_miles = window.game.lib.helpers.randomNumberBetween(this.MINIMUM_SQUARE_MILES, this.MAXIMUM_SQUARE_MILES);
      this.density = Math.floor(this.population / this.square_miles);
      this.density_exposure_rate = window.game.lib.helpers.randomNumberBetween(this.MINIMUM_DENSITY_EXPOSURE_RATE, this.MAXIMUM_DENSITY_EXPOSURE_RATE);

      // Weather
      this.temperature = window.game.lib.helpers.randomNumberBetween(this.MINIMUM_TEMPERATURE, this.MAXIMUM_TEMPERATURE);
    
      // Tourism
      this.weekly_tourists = window.game.lib.helpers.randomNumberBetween(this.MINIMUM_TOURISM_NUMBERS, this.MAXIMUM_TOURISM_NUMBERS);

      // Store up-to-date numbers we can manipulate and pull from
      this.healthy_count      = this.initial_population;
      this.incubating_count   = 0;
      this.infected_count     = 1;
      this.hospitalized_count = 0;
      this.recovered_count    = 0;
      this.death_count        = 0;

      // Start the spread of a disease!
      this.disease    =  new window.game.models.Disease();
      this.infections = [new window.game.models.Infection(this.disease, window.game.state.week)];

      // Array of breakdowns per day
      this.breakdown_counts = [{
        healthy_count:      this.healthy_count,
        infected_count:     this.infections.filter(inf => inf.phase == inf.PHASE.ILLNESS || inf.phase == inf.PHASE.CONVALESCENCE).length,
        hospitalized_count: this.infections.filter(inf => inf.is_hospitalized).length,
        recovered_count:    this.recovered_count,
        death_count:        this.death_count
      }];

      // Show initial stats
      this.updateStats();
    }

    initializeGraphs() {
      window.game.ui.graphs.infection = new Chart(document.getElementById('infection-breakdown-graph'), {
        type: 'bar',
        data: {
          labels: [
            'Uninfected', 
            'Infected', 
            'Hospitalized', 
            'Recovered', 
            'Dead'
          ],
          datasets: [{
            label: 'Pandemic Stage Breakdown',
            data: [
              this.breakdown_counts[0].healthy_count,
              this.breakdown_counts[0].infected_count,
              this.breakdown_counts[0].hospitalized_count,
              this.breakdown_counts[0].recovered_count,
              this.breakdown_counts[0].death_count
            ],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor:     ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth:     1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    
      window.game.ui.graphs.timeline = new Chart(document.getElementById('infection-timeline-graph'), {
        type: 'line',
        data: {
        labels: Array.from({length: window.game.state.week}, (_, index) => index + 1),
        datasets: [{
          label: 'Confirmed Infections',
          data: [this.breakdown_counts[0].infected_count],
          fill:false,
          borderColor:"#308af3",
          pointBackgroundColor: "#308af3",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 2,
          lineTension:0.05
        }, {
          label: 'Hospitalizations',
          data: [this.breakdown_counts[0].hospitalized_count],
          fill:false,
          borderColor:"#48ba16",
          pointBackgroundColor: "#48ba16",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 2,
          lineTension:0.05
        }, {
          label: 'Recoveries',
          data: [this.breakdown_counts[0].recovered_count],
          fill:false,
          borderColor:"#0000ff",
          pointBackgroundColor: "#0000ff",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 2,
          lineTension:0.05
        }, {
          label: 'Deaths',
          data: [this.breakdown_counts[0].death_count],
          fill:false,
          borderColor:"#ff0000",
          pointBackgroundColor: "#ff0000",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 2,
          lineTension:0.05
        }]
        },
        options: {
        legend: { display: true },
        scales: {
          xAxes: [{
            gridLines: { display:false },
          }],
          yAxes: [{
            gridLines: {
            color: "rgba(0, 0, 0, .05)",
            },
            ticks: {
              beginAtZero: true
            }
          }]
        },
        }
      });
    }

    updateGraphs() {
      // Update the infection graph dataset with the latest numbers
      latest_week_i = window.game.state.week - 1;
      window.game.ui.graphs.infection.data.datasets[0].data = [
        this.breakdown_counts[latest_week_i].healthy_count,
        this.breakdown_counts[latest_week_i].infected_count,
        this.breakdown_counts[latest_week_i].hospitalized_count,
        this.breakdown_counts[latest_week_i].recovered_count,
        this.breakdown_counts[latest_week_i].death_count
      ];
      // Redraw the infection graph
      window.game.ui.graphs.infection.update();

      // Update the timeline graph datasets
      window.game.ui.graphs.timeline.data.datasets[0].data = window.game.state.city.breakdown_counts.map(weeklyCount => { return weeklyCount.infected_count });
      window.game.ui.graphs.timeline.data.datasets[1].data = window.game.state.city.breakdown_counts.map(weeklyCount => { return weeklyCount.hospitalized_count });
      window.game.ui.graphs.timeline.data.datasets[2].data = window.game.state.city.breakdown_counts.map(weeklyCount => { return weeklyCount.recovered_count });
      window.game.ui.graphs.timeline.data.datasets[3].data = window.game.state.city.breakdown_counts.map(weeklyCount => { return weeklyCount.death_count });
      // Redraw X-axis
      window.game.ui.graphs.timeline.data.labels = Array.from({length: window.game.state.week}, (_, index) => index + 1);
      // Redraw the timeline graph
      window.game.ui.graphs.timeline.update();
    }

    updateStats() {
      let city_stats = $('#city-stats');
      city_stats.find('.name').text(this.name);
      city_stats.find('.population').text('Population: ' + window.game.lib.helpers.numberWithCommas(this.population - this.death_count));
      city_stats.find('.area').text('Area: ' + window.game.lib.helpers.numberWithCommas(this.square_miles) + ' square miles');
      city_stats.find('.density').text('Density: ~' + window.game.lib.helpers.numberWithCommas(this.density) + ' people per square mile');
      city_stats.find('.density-exposure-rate').text("Density exposure rate: " + this.density_exposure_rate + "% (" + Math.floor(this.density_exposure_rate / 100 * this.density) + " people/week/person)")
      city_stats.find('.temperature').text('Temperature: ' + this.temperature + 'F');
      city_stats.find('.tourists').text('Tourists: ' + window.game.lib.helpers.numberWithCommas(this.weekly_tourists) + ' per week');

      let mayor_stats = $('#mayor-stats');
      mayor_stats.find('.name').text('Mayor ' + this.mayor.name);
      mayor_stats.find('.approval-rating').text('Approval rating: ' + this.mayor.approval + '%');
      mayor_stats.find('.trustworthiness').text('Trustworthiness: ' + this.mayor.trustworthiness + '%');

      let disease_stats = $('#disease-stats');
      disease_stats.find('.infection-chance').text('Infection chance: ' + this.disease.infection_chance + '%');
      disease_stats.find('.tourist-infection-chance').text("Tourist infection rate: " + this.disease.tourist_infection_rate + "%");
      disease_stats.find('.fatality-chance').text("Illness fatality chance: " + this.disease.illness_fatality + "% per week");

      disease_stats.find('.incubation').text('Incubation: ' + this.infections.filter(inf => inf.phase == inf.PHASE.INCUBATION).length + ' (typically ' + this.disease.incubation_length + ' weeks)');
      disease_stats.find('.prodromal').text('Prodromal: ' + this.infections.filter(inf => inf.phase == inf.PHASE.PRODROMAL).length + ' (typically ' + this.disease.prodromal_length + ' weeks)');
      disease_stats.find('.illness').text('Illness: ' + this.infections.filter(inf => inf.phase == inf.PHASE.ILLNESS).length + ' (typically ' + this.disease.illness_length + ' weeks)');
      disease_stats.find('.convalescence').text('Convalescence: ' + this.infections.filter(inf => inf.phase == inf.PHASE.CONVALESCENCE).length + ' (typically ' + this.disease.convalescence_length + ' weeks)');
      disease_stats.find('.recovered').text('Recovered: ' + this.recovered_count);
      disease_stats.find('.deaths').text('Deaths: ' + this.death_count);

      let game_stats = $('#game-stats');
      game_stats.find('.week').text('Week #' + window.game.state.week);
    }

    processWeek() {
      let city = this;

      // We should probably model temperature over some distribution that trends toward middle-range
      // instead of just randomly fluctuating with no bounds lol
      this.temperature += Math.floor(Math.random() * this.TEMPERATURE_FLUCTUATION * 2) - this.TEMPERATURE_FLUCTUATION;

      // Process infection spread within the city
      var new_infections = 0;
      this.infections.forEach(function (infection) {
        for (var i = 0; i < Math.floor(city.density_exposure_rate / 100 * city.density); i++) {
          if (infection.successful_infection()) {
            new_infections++;
          }
        }
      });

      var infected_tourists = Math.floor(this.weekly_tourists * (this.disease.tourist_infection_rate / 100));
      for (var i = 0; i < infected_tourists; i++) {
        // For each infected person, compute new infections from the number of people they're
        // exposed to each week times the disease infection chance per week
        if (this.disease.successful_infection()) {
          new_infections++;
        }
      }

      // Bound new infections by healthy count
      if (new_infections > this.healthy_count) {
        new_infections = this.healthy_count;
      }

      // Create the new infection models
      for (var i = 0; i < new_infections; i++) {
        this.infections.push(new window.game.models.Infection(this.disease, window.game.state.week));
      }

      // Remove new infections from healthy count and add them to infected count
      this.healthy_count -= new_infections;
      this.infected_count += new_infections;

      // Tick all the infections
      this.infections.forEach(infection => infection.tick(window.game.state.week));

      // Remove recovered/death infections from live infection pool
      var new_recoveries   = this.infections.filter(inf => inf.phase == inf.PHASE.RECOVERED).length;
      var new_deaths       = this.infections.filter(inf => inf.phase == inf.PHASE.DEATH).length;
      this.infections      = this.infections.filter(inf => inf.phase != inf.PHASE.RECOVERED && inf.phase != inf.PHASE.DEATH);

      this.infected_count   = this.infected_count - new_recoveries - new_deaths;
      this.recovered_count += new_recoveries;
      this.death_count     += new_deaths;

      // Release this week's numbers
      this.breakdown_counts.push({
        healthy_count:      this.healthy_count,
        infected_count:     this.infections.filter(inf => inf.phase == inf.PHASE.ILLNESS || inf.phase == inf.PHASE.CONVALESCENCE).length,
        hospitalized_count: this.infections.filter(inf => inf.is_hospitalized).length,
        recovered_count:    this.recovered_count,
        death_count:        this.death_count
      });

      // Update the weekly graphs and stats
      this.updateGraphs();
      this.updateStats();

      window.game.state.week += 1;
    }
  }
