<template>
  <div>
    <label
      :for="props.name"
      class="block text-sm/6 font-medium text-zinc-100"
      >{{ props.label }}</label
    >
    <div class="mt-2 relative flex">
      <input
        :type="props.type ?? 'text'"
        :name="props.name"
        :id="props.name"
        :autocomplete="props.name"
        :placeholder="props.placeholder"
        required
        :class="[
          'block w-full rounded-md bg-zinc-950/50 px-3 py-1.5 text-base -outline-offset-1 sm:text-sm/6 focus:outline-2 focus:-outline-offset-2',
          !props.error &&
            'text-zinc-100 outline-1 outline-zinc-800 placeholder:text-zinc-600 focus:outline-zinc-300',
          props.error &&
            'text-red-400 outline-2 outline-red-400 focus:outline-red-400',
        ]"
        v-model="value"
      />
      <ExclamationCircleIcon
        v-if="props.error"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 sm:size-4"
        aria-hidden="true"
      />
    </div>
    <p
      v-if="props.error"
      class="mt-2 text-sm text-red-400"
      :id="`${props.name}-error`"
    >
      {{ props.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleIcon } from "@heroicons/vue/16/solid";

const value = defineModel<string>();
const props = defineProps<{
  error?: string;
  name: string;
  label: string;
  placeholder?: string
  type?: "text" | "password";
}>();
</script>
