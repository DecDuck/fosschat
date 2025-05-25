<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  MenuItems,
} from "@headlessui/vue";
import ServerSelector from "./ServerSelector.vue";
import { Cog6ToothIcon, HashtagIcon } from "@heroicons/vue/16/solid";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/vue/24/outline";

const groups = [
  {
    name: "General",
    channels: [
      { name: "Dashboard", href: "#", current: true, notifications: true },
      { name: "Team", href: "#", current: false },
      { name: "Projects", href: "#", current: false },
      { name: "Calendar", href: "#", current: false },
      { name: "Documents", href: "#", current: false },
      { name: "Reports", href: "#", current: false },
    ],
  },
  {
    name: "More",
    channels: [
      { name: "Dashboard", href: "#", current: true },
      { name: "Team", href: "#", current: false },
      { name: "Projects", href: "#", current: false },
      { name: "Calendar", href: "#", current: false },
      { name: "Documents", href: "#", current: false },
      { name: "Reports", href: "#", current: false },
    ],
  },
];

const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
</script>

<template>
  <div class="flex grow flex-col gap-y-1 overflow-y-auto bg-zinc-950">
    <div class="m-1">
      <ServerSelector />
    </div>
    <nav class="flex flex-1 flex-col px-4 pb-2">
      <ul role="list" class="flex flex-1 flex-col gap-y-3">
        <li v-for="group in groups">
          <Disclosure
            as="div"
            :key="group.name"
            class="first:pt-0 last:pb-0"
            v-slot="{ open }"
            :default-open="true"
          >
            <dt>
              <DisclosureButton
                class="transition cursor-pointer flex w-full items-center justify-between text-left text-zinc-400 hover:text-white text-sm font-semibold"
              >
                <span class="font-semibold">{{ group.name }}</span>
                <span class="ml-6 flex h-7 items-center">
                  <PlusSmallIcon
                    v-if="!open"
                    class="size-6"
                    aria-hidden="true"
                  />
                  <MinusSmallIcon v-else class="size-6" aria-hidden="true" />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="pl-2">
              <ul role="list" class="-mx-2 space-y-0.5">
                <li v-for="item in group.channels" :key="item.name">
                  <a
                    :href="item.href"
                    :class="[
                      item.current
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-400 hover:text-white',
                      'relative transition group flex items-center gap-x-1 px-1 py-0.5 text-sm font-semibold',
                    ]"
                  >
                    <HashtagIcon
                      :class="[
                        item.current
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-white',
                        'rotate-[3deg] transition size-5 shrink-0',
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name.toLowerCase() }}
                    <div v-if="item.notifications" class="ml-auto">!</div>
                  </a>
                </li>
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </li>
      </ul>
    </nav>

    <div v-if="user" class="mt-auto inline-flex m-1 gap-x-1">
      <a
        href="#"
        class="rounded transition grow-1 flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white bg-zinc-900 hover:bg-zinc-700"
      >
        <img
          class="size-8 rounded-full bg-zinc-900"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <div class="flex flex-col">
          <span>{{ user.displayName }}</span>
          <span class="-mt-1 font-mono text-xs text-zinc-400"
            >@{{ user.username }}
          </span>
        </div>
      </a>
      <button
        class="rounded cursor-pointer aspect-square transition flex items-center justify-center px-4 bg-zinc-900 text-zinc-400 hover:bg-zinc-700 hover:text-white"
      >
        <Cog6ToothIcon class="size-6" />
      </button>
    </div>
    <div v-else class="mt-auto inline-flex m-1 gap-x-1">
      <SpinningButton href="/signin"> Sign in &rarr; </SpinningButton>
    </div>
  </div>
</template>
