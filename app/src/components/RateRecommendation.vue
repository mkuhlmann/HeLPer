<template>
  <q-card>
    <q-list>
      <q-item-label header>
        Empfehlungen
      </q-item-label>
      <div class="grid md:grid-cols-3">
        <q-item>
          <q-item-section avatar>
            <q-icon name="speed" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Laufrate</q-item-label>
          </q-item-section>

          <q-item-section v-if="!recommendationAvailable">
            <q-item-label class="text-orange">Warte auf Laborwerte</q-item-label>
          </q-item-section>

          <q-item-section v-else-if="rateRecommendation.rate > 0">
            <q-item-label class="text-red">{{ Math.round(unitToVolume(rateRecommendation.rate) * 100) / 100 }} mL/h</q-item-label>
            <q-item-label caption>≙ {{ rateRecommendation.rate }} IE/h</q-item-label>
          </q-item-section>

          <q-item-section v-else>
            <q-item-label class="text-green">Keine Änderung</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="vaccines" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Bolus</q-item-label>
          </q-item-section>

          <q-item-section v-if="!recommendationAvailable">
            <q-item-label class="text-orange">Warte auf Laborwerte</q-item-label>
          </q-item-section>

          <q-item-section v-else-if="rateRecommendation.bolus > 0">
            <q-item-label class="text-red">{{ rateRecommendation.bolus }} IE</q-item-label>
            <q-item-label caption>≙ {{ unitToVolume(rateRecommendation.bolus) }} ml</q-item-label>
          </q-item-section>

          <q-item-section v-else>
            <q-item-label class="text-green">Kein Bolus</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="bloodtype" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Blutabnahme</q-item-label>
          </q-item-section>

          <q-item-section v-if="latestPTT || latestRate">
            <q-item-label>nach {{ rateRecommendation.next }} Stunden</q-item-label>
            <q-item-label caption>{{ dayjs((latestPTT || latestRate).createdAt).add(rateRecommendation.next, 'hours').format('DD.MM.YYYY HH:mm') }}</q-item-label>
          </q-item-section>

          <q-item-section v-else>
            <q-item-label class="text-orange">Warte auf Laborwerte / Rate</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </q-card>
</template>

<script lang="ts" setup>
import { RateRecommendation, unitToVolume, volumeToUnit } from 'src/lib/rateRecommendation';
import dayjs from 'dayjs';
import { LabResult, Rate } from '.prisma/client';
import { computed, watch } from 'vue';


const props = defineProps<{
  rateRecommendation: RateRecommendation,
  rates: Rate[],
  labResults: LabResult[],
}>();

const latestPTT = computed(() => {
  return props.labResults[0] || null;
});

const latestRate = computed(() => {
  return props.rates[0] || null;
});

const recommendationAvailable = computed(() => {
  if (!latestRate.value) return true;
  return latestPTT.value && latestRate.value && dayjs(latestPTT.value.createdAt).isAfter(dayjs(latestRate.value.createdAt));
});



</script>
