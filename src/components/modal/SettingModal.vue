<script lang="ts" setup>
import TodoButton from "@/components/input/TodoButton.vue";
import IconClose from "@/components/icons/IconClose.vue";
import IconDelete from "@/components/icons/IconDelete.vue";

import { useModalStore } from "@/stores/modal";
const modalStore = useModalStore();

const nukeIt = () => {
  localStorage.clear();
  location.reload();
};
</script>

<template>
  <div
    class="absolute -top-3 -translate-y-full -right-2 w-max p-3 backdrop-blur-sm bg-neutral-100 border border-neutral-500/50 rounded-md"
    data-cy="settingsModal"
  >
    <div
      class="flex items-center justify-between border-b border-neutral-300 pb-2.5 mb-3"
    >
      <h3 class="text-neutral-700 text-sm tracking-wide">Settings</h3>
      <todo-button
        button-id="close-settings-model"
        button-label="Close Settings Modal"
        button-size="xs"
        :is-icon-button="true"
        data-cy="closeSettingsModal"
        @trigger-event="modalStore.resetModal"
      >
        <icon-close class="w-4" />
      </todo-button>
    </div>
    <div>
      <todo-button
        button-id="clear-localstorage"
        button-label="Clear Storage"
        button-size="sm"
        :show-label="true"
        :is-icon-button="true"
        data-cy="clearStorage"
        @trigger-event="nukeIt()"
      >
        <icon-delete class="w-4" />
      </todo-button>
    </div>
  </div>
</template>
