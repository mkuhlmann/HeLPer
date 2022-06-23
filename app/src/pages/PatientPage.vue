<template>
  <q-page class="q-pa-md">
    <div class="text-xl font-semibold mb-5">{{ patient.name }} ({{ patient.weight }} kg)</div>

    <div class="flex gap-5 mb-5">
      <div class="flex-auto">

        <rate-recommendation :rate-recommendation="recommendation" />
      </div>
      <div class="flex-auto">
        Graph
      </div>
    </div>


    <div class="flex gap-5">
      <div class="flex-auto">
        <h2 class="text-xl font-semibold mb-5">Laufraten</h2>

        <q-form class="q-mt-lg" @submit="addRate" ref="rateForm" v-if="user.isRole(UserRole.physician)">

          <div class="flex flex-col md:flex-row q-gutter-md">
            <q-input class="col" filled label="Laufrate (mL/h)" type="number" step="0.01" v-model.number="newRate.rate" lazy-rules :rules="[
              val => val !== null && val !== '' || 'Bitte Laufrate eingeben',
              val => val > 0 && val < 100 || 'Bitte gültige Laufrate eingeben'
            ]" />

          </div>

          <div class="q-mb-lg">
            <q-btn label="Laufrate übernehmen" type="submit" color="primary" />
          </div>
        </q-form>

        <q-table :rows="rates" :columns="(rateColumns as any)" row-key="id">
          <template v-slot:body-cell-actions="props">
            <q-td>
              <q-btn round flat color="grey" @click="deleteRate(props.row)" icon="delete"></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>

      <div class="flex-auto">
        <h2 class="text-xl font-semibold mb-5">Laborwerte</h2>


        <q-form class="q-mt-lg" @submit="addLabResult" ref="labForm">

          <div class="flex flex-col md:flex-row q-gutter-md">
            <q-input class="col" filled label="PTT (s)" type="number" v-model.number="newLabResult.ptt" lazy-rules :rules="[
              val => !val || val > 0 && val < 500 || 'Bitte gültige PTT eingeben'
            ]" />

            <q-input class="col" filled label="Thrombozyten (/nl)" type="number" v-model.number="newLabResult.thrombocytes" lazy-rules :rules="[
              val => !val || val > 0 && val < 1000 || 'Bitte gültige Thromozytenzahl eingeben'
            ]" />

            <q-input filled v-model="newLabResult.recordedAt">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="newLabResult.recordedAt" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="newLabResult.recordedAt" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

          </div>

          <div class="q-mb-lg">
            <q-btn label="Hinzufügen" type="submit" color="primary" />
          </div>
        </q-form>

        <q-table :rows="labResults" :columns="(labColumns as any)" row-key="id">
          <template v-slot:body-cell-actions="props">
            <q-td>
              <q-btn round flat color="grey" @click="deleteLabResult(props.row)" icon="delete"></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

  </q-page>

</template>

<script lang="ts" setup>
import { QForm, QTableColumn } from 'quasar';
import { usePatientStore } from 'src/stores/patient';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { LabResult, Rate } from '@prisma/client';
import RateRecommendation from 'src/components/RateRecommendation.vue';
import { calculateRateRecommendation, unitToVolume } from 'src/lib/rateRecommendation';
import { apiFetch } from 'src/lib/apiFetch';
import { useUserStore, UserRole } from 'src/stores/user';

const route = useRoute();

const patientStore = usePatientStore();
const patient = await patientStore.getPatient(Number(route.params.id));
const user = useUserStore();


const rates = ref([] as Rate[]);
const labResults = ref([] as LabResult[]);

const refreshData = async () => {
  rates.value = await apiFetch(`/api/patients/${patient.id}/rates`);
  labResults.value = await apiFetch(`/api/patients/${patient.id}/lab-results`);
};
await refreshData();

const newLabResult = ref({
  ptt: null,
  thrombocytes: null,
  recordedAt: dayjs().format('YYYY-MM-DD HH:mm')
});


const labForm = ref<QForm>();
const addLabResult = async () => {
  await apiFetch(`/api/patients/${patient.id}/lab-results`, {
    method: 'POST',
    body: newLabResult.value
  });
  await refreshData();
  newLabResult.value = {
    ptt: null,
    thrombocytes: null,
    recordedAt: dayjs().format('YYYY-MM-DD HH:mm')
  };
  labForm.value?.reset();
  recalculateRecommendation();
};

const deleteLabResult = async (labResult: LabResult) => {
  await apiFetch(`/api/lab-results/${labResult.id}`, {
    method: 'DELETE'
  });
  await refreshData();
};


const recommendation = ref(calculateRateRecommendation(0, 0, patient.weight));
const recalculateRecommendation = () => {
  const latestPTT = labResults.value[labResults.value.length - 1]?.ptt;
  const latestRate = rates.value[rates.value.length - 1]?.rate;

  if (latestPTT && latestRate) {
    recommendation.value = calculateRateRecommendation(latestRate, latestPTT, patient.weight);
  }
};
recalculateRecommendation();

const newRate = ref({
  rate: Math.round(unitToVolume(recommendation.value.rate) * 100) / 100
});

const rateForm = ref<QForm>();
const addRate = async () => {
  await apiFetch(`/api/patients/${patient.id}/rates`, {
    method: 'POST',
    body: newRate.value
  });
  await refreshData();
  newRate.value = {
    rate: 0
  };
  rateForm.value?.reset();
};

const deleteRate = async (rate: Rate) => {
  await apiFetch(`/api/rates/${rate.id}`, {
    method: 'DELETE'
  });
  await refreshData();
};


const rateColumns: QTableColumn[] = [
  {
    name: 'rate',
    field: 'rate',
    label: 'Laufrate (mL/h)',
    align: 'left'
  },

  {
    name: 'recordedAt',
    field: 'recordedAt',
    label: 'Datum',
    align: 'left',
    format: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm')
  },

  {
    name: 'actions',
    label: 'Aktionen',
    align: 'left',
    field: ''
  }
];

const labColumns: QTableColumn[] = [
  {
    name: 'ptt',
    field: 'ptt',
    label: 'PTT (s)',
    align: 'left'
  },

  {
    name: 'thrombocytes',
    field: 'thrombocytes',
    label: 'Thrombozyten (/nl)',
    align: 'left'
  },

  {
    name: 'recordedAt',
    field: 'recordedAt',
    label: 'Datum',
    align: 'left',
    format: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm')
  },
  {
    name: 'actions',
    label: 'Aktionen',
    align: 'left',
    field: ''
  }
];
</script>
