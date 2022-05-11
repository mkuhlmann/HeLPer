<template>
  <q-page class="q-pa-md">
    <div>
      <q-table title="Patienten" :rows="patientStore.patients" :columns="(columns as any)" v-on:row-click="onRowClick" row-key="id" />
    </div>

    <div>
      <add-patient-form />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import ExampleComponent from 'components/ExampleComponent.vue';
import { QTableColumn } from 'quasar';
import { usePatientStore } from 'src/stores/patient';
import { defineComponent, ref } from 'vue';
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
    label: 'Age',
    align: 'right'
  }

];

const onRowClick = (evt, row, index) => {
  router.push(`/patient/${row.id}`);
};

const patientStore = usePatientStore();
</script>
