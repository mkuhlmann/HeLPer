import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';
import { useStorage } from '@vueuse/core';
import { Patient } from 'src/types';

export const usePatientStore = defineStore('patient', () => {

  const patients = useStorage<Patient[]>('patients', []);

  const addPatient = (name: string, age: number, weight: number) => {
    const patient: Patient = {
      id: nanoid(),
      name,
      age,
      weight
    };
    patients.value.push(patient);
  };

  const getPatient = (id: string) => {
    return patients.value.find(patient => patient.id === id);
  };

  const removePatient = (id: string) => {
    patients.value = patients.value.filter(patient => patient.id !== id);
  };

  return {
    // state
    patients,

    // actions
    getPatient,
    addPatient,
    removePatient

  };

});
