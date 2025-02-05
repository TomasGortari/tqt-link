<template>
  <div>
    <UForm
      :schema="schema"
      :state="state"
      class="border py-10 px-2 grid grid-cols-2 gap-5"
      @submit="onSubmit"
    >
      <UFormGroup required label="Lvl" name="lvl">
        <UInput
          :ui="{
            icon: { trailing: { pointer: '' }, leading: { pointer: '' } },
          }"
          type="number"
          color="white"
          input-class="text-center"
          v-model="state.lvl"
        >
          <template #leading>
            <UButton
              label="-"
              @click="
                state.lvl > 1
                  ? (state.lvl = state.lvl - 1)
                  : (state.lvl = state.lvl)
              "
            />
          </template>
          <template #trailing>
            <UButton
              label="+"
              @click="
                state.lvl < 5
                  ? (state.lvl = state.lvl + 1)
                  : (state.lvl = state.lvl)
              "
            />
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup required label="Points" name="points">
        <UInput
          :ui="{
            icon: { trailing: { pointer: '' }, leading: { pointer: '' } },
          }"
          type="number"
          color="white"
          input-class="text-center"
          v-model="state.points"
        >
          <template #leading>
            <UButton
              label="-"
              @click="
                state.points > 2
                  ? (state.points = state.points - 1)
                  : (state.points = state.points)
              "
            />
          </template>
          <template #trailing>
            <UButton
              label="+"
              @click="
                state.points < 3
                  ? (state.points = state.points + 1)
                  : (state.points = state.points)
              "
            />
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup required label="Pos" name="pos">
        <UInput
          :ui="{
            icon: { trailing: { pointer: '' }, leading: { pointer: '' } },
          }"
          type="number"
          color="white"
          input-class="text-center"
          v-model="state.pos"
        >
          <template #leading>
            <UButton
              label="-"
              @click="
                state.pos > 1
                  ? (state.pos = state.pos - 1)
                  : (state.pos = state.pos)
              "
            />
          </template>
          <template #trailing>
            <UButton
              label="+"
              @click="
                state.pos < 5
                  ? (state.pos = state.pos + 1)
                  : (state.pos = state.pos)
              "
            />
          </template>
        </UInput>
      </UFormGroup>
      <UCheckbox
        class="col-span-full"
        color="primary"
        label="Shoot IN !"
        @click="state.shoot_in = !state.shoot_in"
        v-model="state.shoot_in"
      />
      <UCheckbox
        class="col-span-full"
        v-if="state.shoot_in"
        color="primary"
        label="Flash ?"
        @click="state.flash = !state.flash"
        v-model="state.flash"
      />

      <!-- <UFormGroup required label="Your message" name="message">
            <UInput color="white" v-model="state.message" />
          </UFormGroup> -->

      <UButton
        class="col-span-full"
        :loading="isPending || isConfinging"
        block
        type="submit"
      >
        Send
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { object, number, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useMutation } from '@tanstack/vue-query';
const { $directus, $readSingleton, $createItem, $updateSingleton } =
  useNuxtApp();

const { data: config } = await useAsyncData('get config_basket', () =>
  $directus.request($readSingleton('config_basket', { fields: ['*'] }))
);

const schema = object({
  lvl: number().min(1, 'Min 1').max(5, 'Max 5'),
  points: number().min(2, 'Min 2').max(3, 'Max 3'),
  pos: number().min(1, 'Min 1').max(5, 'Max 5'),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  lvl: config.value.lvl,
  points: config.value.points,
  pos: config.value.pos,
  shoot_in: false,
  flash: false,
});

const { mutate: updateConfig, isPending: isConfinging } = useMutation({
  mutationFn: () =>
    $directus
      .request(
        $updateSingleton('config_basket', {
          lvl: state.lvl,
          points: state.points,
          pos: state.pos,
        })
      )
      .then(() => {
        state.shoot_in = false;
        state.flash = false;
      }),
});
const { mutate, isPending, isSuccess } = useMutation({
  mutationFn: () =>
    $directus.request($createItem('shoots', state)).then(() => {
      updateConfig();
    }),
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  mutate();
};
</script>
