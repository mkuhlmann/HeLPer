import { computedWithControl } from "@vueuse/core";

const conf = {
  INITIAL_BOLUS: 70, // IE/kgKG
  INITIAL_RATE: 18, // IE/kgKG/h
};

export type RateRecommendation = {
  rate: number;
  bolus: number;
  pause: number;
  next: number;
};

export function unitToVolume(units: number) {
  return units / 500; // 500 IE/ml
};

export function volumeToUnit(volume: number) {
  return volume * 500; // 500 IE/ml
};

export function calculateRateRecommendation(currentRate: number, currentPTT: number, patientWeight: number): RateRecommendation {
  if(currentRate < 5) { // currentRate is in mL/h
    currentRate = volumeToUnit(currentRate);
  }

  const r = {
    rate: 0,
    bolus: 0,
    pause: 0,
    next: 6
  };

  if(currentRate == 0) {
    r.rate = conf.INITIAL_RATE * patientWeight;
    r.bolus = conf.INITIAL_BOLUS * patientWeight;
  } else if(currentPTT < 48) {
    r.rate = currentRate + 4 * patientWeight;
    r.bolus = conf.INITIAL_BOLUS * patientWeight;
    r.pause = 0;

  } else if(currentPTT < 60) {
    r.rate = currentRate + 2 * patientWeight;
    r.bolus = conf.INITIAL_BOLUS / 2 * patientWeight;
    r.pause = 0;

  } else if(currentPTT < 92) {
    r.rate = 0;
    r.bolus = 0;
    r.pause = 0;

  } else if(currentPTT < 120) {
    r.rate = currentRate - 2 * patientWeight;
    r.bolus = 0;
    r.pause = 0;

  } else {
    r.rate = currentRate - 3 * patientWeight;
    r.bolus = 0;
    r.pause = 1;

  }

  return r;
};
