<template>
  <Combobox as="div" v-model="selectedServer" @update:modelValue="query = ''">
    <div class="relative">
      <img
        :src="selectedServer.imageUrl"
        alt=""
        class="absolute top-1/2 -translate-y-1/2 left-3 flex items-center size-7 shrink-0 rounded-full"
      />
      <ComboboxInput
        class="rounded block w-full bg-zinc-900 py-3 px-12 text-base text-zinc-100 outline-1 -outline-offset-1 outline-zinc-900 placeholder:text-zinc-400 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-100 sm:text-sm/6"
        @change="query = $event.target.value"
        @blur="query = ''"
        :display-value="(person: any) => person?.name"
      />
      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden"
      >
        <ChevronDownIcon class="size-6 text-zinc-500" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredServers.length > 0"
        class="absolute z-10 max-h-56 w-full overflow-auto rounded-md bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
      >
        <ComboboxOption
          v-for="person in filteredServers"
          :key="person.id"
          :value="person"
          as="template"
          v-slot="{ active, selected }"
        >
          <li
            :class="[
              'relative cursor-default py-2 pr-9 pl-3 select-none',
              active
                ? 'bg-zinc-200 text-zinc-900 outline-hidden'
                : 'text-zinc-300',
            ]"
          >
            <div class="flex items-center">
              <img
                :src="person.imageUrl"
                alt=""
                class="size-6 shrink-0 rounded-full"
              />
              <span :class="['ml-3 truncate', selected && 'font-semibold']">
                {{ person.name }}
              </span>
            </div>
          </li>
        </ComboboxOption>
        <button
          class="w-full relative cursor-default py-2 pr-9 pl-3 select-none bg-zinc-800 text-zinc-300 hover:bg-zinc-200 hover:text-white hover:outline-hidden"
          @click.prevent="() => console.log('lol')"
        >
          <div class="flex items-center">
            <PlusIcon alt="" class="size-6 shrink-0 rounded-full" />
            <span :class="['ml-3 truncate']"> Create new server </span>
          </div>
        </button>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { CheckIcon, ChevronDownIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { PlusIcon } from "@heroicons/vue/16/solid";

const router = useRouter();

const servers = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Fuckwit Alexander",
    imageUrl: "https://images.unsplash.com/",
  },
  // More users...
];

const query = ref("");
const selectedServer = ref(servers[0]);
const filteredServers = computed(() =>
  query.value === ""
    ? servers
    : servers.filter((server) => {
        return server.name.toLowerCase().includes(query.value.toLowerCase());
      })
);

watch(selectedServer, (n) => {
  router.push(`/${n.id}/`)
})
</script>
