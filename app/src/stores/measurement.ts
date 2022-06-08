import { useStorage } from '@vueuse/core';
import dayjs from 'dayjs';
import { $fetch } from 'ohmyfetch';
import { defineStore } from 'pinia';
import { Measurement } from 'src/types';

export const useMeasurementStore = defineStore('measurement', () => {

  const getMeasurements = async (patientId: number) => {
    const measurements = await $fetch(`/api/patients/${patientId}/measurements`) as Measurement[];
    return measurements;
  };

  const addMeasurement = async (patientId: number, measurement: Partial<Measurement>) => {
    const _measurement = await $fetch(`/api/patients/${patientId}/measurements`, {
      method: 'POST',
      body: {
        ...measurement,
      }
    }) as Measurement;

    return _measurement;
  };

  return {
    addMeasurement,
    getMeasurements
  };

});
