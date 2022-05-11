<template>
  <div>
    <q-form @submit="onSubmit" @reset="onReset">
      <h4 class="q-mb-md q-mt-lg">Patient hinzufügen</h4>
      <div class="row q-gutter-md">
        <q-input class="col" filled label="Name" v-model="patient.name" lazy-rules :rules="[
          val => !!val || 'Name ist erforderlich'
        ]" />

        <q-input class="col" filled label="Alter" type="number" v-model.number="patient.age" lazy-rules :rules="[
          val => val !== null && val !== '' || 'Bitte Alter eingeben',
          val => val > 0 && val < 100 || 'Bitte gültiges Alter eingeben'
        ]" />

        <q-btn label="Hinzufügen" type="submit" color="primary" />
        <q-btn label="Zurücksetzen" type="reset" color="primary" flat class="q-ml-sm" />

      </div>
    </q-form>
  </div>

</template>

<script lang="ts" setup>
import { usePatientStore } from 'src/stores/patient';
import { Patient } from 'src/types';
import { ref } from 'vue';


const patientStore = usePatientStore();

const patient = ref({
  name: '',
  age: 0
});

const onSubmit = () => {
  patientStore.addPatient(patient.value.name, patient.value.age);
};

const onReset = () => {
  patient.value = {
    name: '',
    age: 0
  };
};




</script>
