import { defineStore } from 'pinia';
import { Patient } from 'src/types';
import { ref } from 'vue';
import { apiFetch } from 'src/lib/apiFetch';

export const usePatientStore = defineStore('patient', () => {

  const patients = ref<Patient[]>([]);

  const addPatient = async (name: string, age: number, weight: number) => {
    const patient = await apiFetch('/api/patients', {
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
    const patient = await apiFetch(`/api/patients/${id}`) as Patient;
    return patient;
  };

  const removePatient = async (id: string) => {
    await apiFetch(`/api/patients/${id}`, {
      method: 'DELETE'
    });
    await refreshPatients();
  };

  const refreshPatients = async () => {
    patients.value = await apiFetch('/api/patients');
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
