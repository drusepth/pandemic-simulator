window.game.models.Mayor = class Mayor {
  MINIMUM_APPROVAL = 50;
  MAXIMUM_APPROVAL = 90;

  MINUMUM_TRUSTWORTHINESS = 50;
  MAXIMUM_TRUSTWORTHINESS = 90;

  constructor(name) {
    this.name = name;

    this.approval = Math.floor(Math.random() * this.MAXIMUM_APPROVAL - this.MINIMUM_APPROVAL) + this.MINIMUM_APPROVAL;
    this.trustworthiness = Math.floor(Math.random() * this.MAXIMUM_TRUSTWORTHINESS - this.MINUMUM_TRUSTWORTHINESS) + this.MINUMUM_TRUSTWORTHINESS;
  }

  someFunc() {

  }
}