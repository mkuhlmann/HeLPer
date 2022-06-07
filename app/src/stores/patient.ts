import { defineStore } from 'pinia';
import { Patient } from 'src/types';
import { $fetch } from 'ohmyfetch';
import { ref } from 'vue';

export const usePatientStore = defineStore('patient', () => {

  const patients = ref<Patient[]>([]);

  const addPatient = async (name: string, age: number, weight: number) => {
    const patient = await $fetch('/api/patients', {
      method: 'POST',
      body: {
        name,
        age,
        weight
      }
    }) as Patient;

    patients.value.push(patient);
  };

  const getPatient = async (id: number) => {
    const patient = await $fetch(`/api/patients/${id}`) as Patient;
    return patient;
  };

  const removePatient = async(id: string) => {
    await $fetch(`/api/patients/${id}`, {
      method: 'DELETE'
    });
    await refreshPatients();
  };

  const refreshPatients = async () => {
    patients.value = await $fetch('/api/patients');
  };
  refreshPatients().then();

  return {
    // state
    patients,

    // actions
    getPatient,
    addPatient,
    removePatient

  };

});
