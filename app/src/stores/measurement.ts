import { useStorage } from '@vueuse/core';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { Measurement } from 'src/types';

export const useMeasurementStore = defineStore('measurement', () => {

  const getMeasurements = (patientId: string) => {
    return JSON.parse(localStorage.getItem(`m-${patientId}`) || '[]');
  };

  const addMeasurement = (patientId: string, measurement: Measurement) => {
    let measurements = getMeasurements(patientId);
    measurements.push(measurement);

    measurements = sortMeasurements(measurements);

    localStorage.setItem(`m-${patientId}`, JSON.stringify(measurements));
  };

  const sortMeasurements = (measurements: Measurement[]) => {
    return measurements.sort((a, b) => {
      return dayjs(a.createdAt).diff(dayjs(b.createdAt));
    });
  };

  return {
    addMeasurement,
    getMeasurements
  };

});
