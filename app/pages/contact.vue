<template>
  <UContainer>
    <UPage>
      <ULandingHero
        orientation="horizontal"
        :ui="{ title: '!text-[75px] font-black', base: 'py-10' }"
        title="Get in touch"
        description="Got something on your mind? Ask us anything, we're here to help!"
        :links="[
          {
            label: 'contact@camp-venture.com',
            to: 'mailto:contact@camp-venture.com',
            variant: 'ghost',
            icon: 'i-lucide-mails',
            color: 'gray',
            size: 'xl',
          },
        ]"
      >
        <UAlert
          icon="i-lucide-mail-check"
          title="Message sended !"
          v-if="isSuccess"
        >
        </UAlert>
        <UForm
          v-else
          :schema="schema"
          :state="state"
          class="space-y-10 border py-10 px-5"
          @submit="onSubmit"
        >
          <UFormGroup required label="Your e-mail address" name="email">
            <UInput color="white" v-model="state.email" />
          </UFormGroup>

          <UFormGroup required label="Your message" name="message">
            <UInput color="white" v-model="state.message" />
          </UFormGroup>

          <UButton :loading="isPending" block type="submit"> Send </UButton>
        </UForm>
      </ULandingHero>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import { ULandingHero } from '#components';
import { object, string, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useMutation } from '@tanstack/vue-query';
const { website_id } = useRuntimeConfig().public;
const { $directus, $createItem } = useNuxtApp();
const schema = object({
  email: string().email('Invalid email').required('Required'),
  message: string().required('Required'),
});

type Schema = InferType<typeof schema>;

const state = reactive<{ email: string; message: string; website: string }>({
  email: undefined,
  message: undefined,
  website: website_id,
});

const { mutate, isPending, isSuccess } = useMutation({
  mutationFn: () => $directus.request($createItem('contact_requests', state)),
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  mutate();
};
</script>
