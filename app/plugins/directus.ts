import {
  createDirectus,
  rest,
  readItem,
  readItems,
  createItem,
  readSingleton,
} from '@directus/sdk';
import type { CustomDirectusTypes } from '~/types/directus';

const directus = createDirectus<CustomDirectusTypes>(
  'https://api-affiliate-websites.com/'
).with(rest());

export default defineNuxtPlugin(() => {
  return {
    provide: { directus, readItem, readItems, createItem, readSingleton },
  };
});
