<template>
  <q-page class="q-pa-md">


    <rate-recommendation :rate-recommendation="recommendedRate" />

    <div>
      <q-form class="q-mt-lg" @submit="onSubmit" @reset="onReset">

        <div class="flex flex-col md:flex-row q-gutter-md">
          <q-input class="col" filled label="Laufrate (mL/h)" type="number" v-model.number="newMeasurement.rate" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Bitte Laufrate eingeben',
            val => val > 0 && val < 100 || 'Bitte gültige Laufrate eingeben'
          ]" />


          <q-input class="col" filled label="PTT (s)" type="number" v-model.number="newMeasurement.ptt" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Bitte PTT eingeben',
            val => val > 0 && val < 100 || 'Bitte gültige PTT eingeben'
          ]" />

          <q-input class="col" filled label="Thrombozyten (optional)" type="number" v-model.number="newMeasurement.ptt" lazy-rules :rules="[
            val => val == 0 || val > 0 && val < 100 || 'Bitte gültige Thromozytenzahl eingeben'
          ]" />

          <q-input filled v-model="newMeasurement.createdAt">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="newMeasurement.createdAt" mask="YYYY-MM-DD HH:mm">
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
                  <q-time v-model="newMeasurement.createdAt" mask="YYYY-MM-DD HH:mm" format24h>
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
          <q-btn label="Zurücksetzen" type="reset" color="primary" flat />

        </div>
      </q-form>

    </div>


    <div>
      <q-table :rows="measurements" :columns="(columns as any)" row-key="id" />
    </div>

  </q-page>

</template>

<script lang="ts" setup>
import { QTableColumn } from 'quasar';
import { useMeasurementStore } from 'src/stores/measurement';
import { usePatientStore } from 'src/stores/patient';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { Measurement } from 'src/types';
import { nanoid } from 'nanoid';
import RateRecommendation from 'src/components/RateRecommendation.vue';
import { calculateRateRecommendation } from 'src/lib/rateRecommendation';

const route = useRoute();

const patientStore = usePatientStore();
const patient = patientStore.getPatient(route.params.id as string)!;

const measurementStore = useMeasurementStore();
const measurements = ref<Measurement[]>(measurementStore.getMeasurements(patient.id));

const lastMeasurement = measurements.value[measurements.value.length - 1];
const recommendedRate = ref(calculateRateRecommendation(lastMeasurement.rate, lastMeasurement.ptt, patient.weight));

const newMeasurement = ref<Measurement>({
  id: nanoid(),
  rate: 0,
  ptt: 0,
  thrombocytes: 0,
  createdAt: dayjs().format('YYYY-MM-DD HH:mm')
});

const columns: QTableColumn[] = [
  {
    name: 'rate',
    field: 'rate',
    label: 'Laufrate (mL/h)',
    align: 'left'
  },

  {
    name: 'ptt',
    field: 'ptt',
    label: 'PTT (s)',
    align: 'left'
  },

  {
    name: 'createdAt',
    field: 'createdAt',
    label: 'Datum',
    align: 'left'
  }
];

const onReset = () => {
  newMeasurement.value = {
    id: nanoid(),
    rate: 0,
    ptt: 0,
    thrombocytes: 0,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm')
  };
};

const onSubmit = () => {
  measurementStore.addMeasurement(patient.id, newMeasurement.value);
  measurements.value = measurementStore.getMeasurements(patient.id);
};



</script>
