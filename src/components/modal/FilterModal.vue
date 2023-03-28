<script lang="ts" setup>
import IconCheck from "@/components/icons/IconCheck.vue";
import type { ModalOption } from "@/types";

import { useModalStore } from "@/stores/modal";
const modalStore = useModalStore();

const changeStatus = (option: ModalOption) => {
  option.event();

  setTimeout(() => {
    modalStore.resetModal();
  }, 250);
};
</script>

<template>
  <div
    class="absolute top-full -right-3 translate-y-3 flex flex-col gap-1 bg-neutral-300 border border-neutral-700 p-2 cursor-default rounded-lg"
  >
    <div
      v-for="option in modalStore.modalOptions"
      class="flex items-center gap-x-2"
    >
      <label
        :for="option.value"
        class="relative w-4 h-4 flex items-center justify-center text-neutral-900 border-neutral-500 hover:bg-neutral-400/30 cursor-pointer rounded group/filter"
        :data-cy="option.value"
        @click.stop="changeStatus(option)"
      >
        <input
          :id="option.value"
          type="radio"
          class="absolute w-full h-full opacity-0 peer"
          :checked="option.value === modalStore.currentModalOption"
        />
        <icon-check
          class="w-3 opacity-0 peer-checked:opacity-100 group-hover/filter:opacity-40"
        />
      </label>
      <p
        class="cursor-pointer"
        :class="{
          'text-neutral-500 hover:text-neutral-400':
            option.value !== modalStore.currentModalOption,
          'font-bold text-neutral-900 ':
            option.value === modalStore.currentModalOption,
        }"
        :data-cy="`${option.value}Label`"
        @click="changeStatus(option)"
      >
        {{ option.displayName }}
      </p>
    </div>
  </div>
</template>
