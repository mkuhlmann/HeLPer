<template>
  <q-page class="q-pa-md">
    <div>
      <q-table title="Patienten" :rows="patientStore.patients" :columns="(columns as any)" v-on:row-click="onRowClick" row-key="id">
        <template v-slot:body-cell-actions="props">
          <q-td>
            <q-btn round flat color="grey" @click="viewPatient(props.row)" icon="visibility"></q-btn>
            <q-btn round flat color="grey" @click="deletePatient(props.row)" icon="delete"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <div>
      <add-patient-form />
    </div>

    <q-dialog v-model="deleteConfirm" persistent>
      <q-card>
        <q-card-section class="flex gap-5">
          <q-avatar icon="delete" color="red" text-color="white" />
          <div>Der Patient inklusive aller festgehaltenen Messwerte wird hiermit unwiederruflich gelöscht.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" color="primary" v-close-popup />
          <q-btn label="Löschen" color="red" v-close-popup v-on:click="deletePatientConfirmed()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { QTableColumn } from 'quasar';
import { usePatientStore } from 'src/stores/patient';
import { Patient } from 'src/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AddPatientForm from '../components/AddPatientForm.vue';


const router = useRouter();

const columns: QTableColumn[] = [
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left'

  },
  {
    name: 'age',
    field: 'age',
    label: 'Alter',
    align: 'left'
  },
  {
    name: 'weight',
    field: 'weight',
    label: 'Gewicht (kg)',
    align: 'left'
  },

  {
    name: 'actions',
    label: 'Aktionen',
    align: 'left',
    field: ''
  }

];

const deleteConfirm = ref(false);
const deletePatientModel = ref<Patient>();

const deletePatient = (patient: Patient) => {
  deletePatientModel.value = patient;
  deleteConfirm.value = true;
};

const deletePatientConfirmed = () => {
  if (deletePatientModel.value != null)
    patientStore.removePatient(deletePatientModel.value.id);
};

const viewPatient = (patient: Patient) => {
  router.push(`/patient/${patient.id}`);
};

const onRowClick = (event: Event, row: Patient) => {
  if (event.target && (event.target as Node).nodeName == 'td')
    viewPatient(row);
};

const patientStore = usePatientStore();
</script>
