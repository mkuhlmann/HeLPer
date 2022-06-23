<script lang="ts" setup>
import dayjs from 'dayjs';
import { QTableColumn } from 'quasar';
import { apiFetch } from 'src/lib/apiFetch';


const auditLog = await apiFetch('/api/audit-log');

const columns: QTableColumn[] = [
  {
    name: 'event',
    field: 'event',
    label: 'Event',
    align: 'left'
  },

  {
    name: 'modelAction',
    field: 'modelAction',
    label: 'Aktion',
    align: 'left'
  },

  {
    name: 'model',
    field: 'model',
    label: 'Model',
    align: 'left'
  },

  {
    name: 'modelId',
    field: 'modelId',
    label: 'Model ID',
    align: 'left'
  },

  {
    name: 'ip',
    field: 'ip',
    label: 'IP-Adresse',
    align: 'left'
  },

  {
    name: 'user',
    field: 'user',
    label: 'Nutzer',
    align: 'left'
  },

  {
    name: 'createdAt',
    field: 'createdAt',
    label: 'Datum',
    align: 'left',
    format: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    sortable: true
  }
];


</script>


<template>


  <q-page class="q-pa-md">
    <q-table title="Audit Log" :rows="auditLog" :columns="(columns as any)" row-key="id">
    </q-table>
  </q-page>

</template>
