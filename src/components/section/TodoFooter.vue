<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

import TodoButton from "@/components/input/TodoButton.vue";
import SettingModal from "@/components/modal/SettingModal.vue";

import IconSettings from "@/components/icons/IconSettings.vue";

import useScreenSize from "@/composables/useScreenSize";

import { useAppStore } from "@/stores/app";
import { useNotifyStore } from "@/stores/notify";
import { useModalStore } from "@/stores/modal";

const appStore = useAppStore();
const modalStore = useModalStore();
const notifyStore = useNotifyStore();

const { onDesktop } = useScreenSize();

const settingModal = ref<HTMLElement | null>();

watch(
  () => appStore.getTotalOnGoingTodos,
  (total) => {
    if (total === 0 && appStore.getTotalTodos !== 0) {
      notifyStore.addNotification("success", "You've completed all the todos");
    }
  }
);

onMounted(() => {
  onClickOutside(settingModal, (event) => {
    const element = event.target as HTMLDivElement;
    if (element.id === "open-settings-modal") return;

    modalStore.resetModal();
  });
});
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3">
    <p class="text-neutral-400 font-medium">
      <span class="text-neutral-900" data-cy="totalOngoingTodos">
        {{ appStore.getTotalOnGoingTodos }}</span
      >
      of <span data-cy="totalTodos"> {{ appStore.getTotalTodos }}</span> left
    </p>
    <div v-if="onDesktop" class="flex gap-2">
      <div class="relative">
        <todo-button
          button-id="open-settings-modal"
          button-label="Settings"
          button-size="sm"
          tooltip="Settings"
          data-cy="openSettingsModal"
          @trigger-event="modalStore.createSettingsModal()"
        >
          <icon-settings class="w-5 pointer-events-none" />
        </todo-button>
        <transition name="todo-fade">
          <setting-modal
            v-if="modalStore.modalType === 'settings'"
            ref="settingModal"
          />
        </transition>
      </div>
      <todo-button
        button-id="clear-completed-todos"
        button-label="Clear Completed"
        button-size="sm"
        :show-label="true"
        :is-disabled="
          !appStore.hasCompletedTodos || !appStore.getTodosByStatus.length
        "
        data-cy="clearCompletedTodos"
        @trigger-event="appStore.deleteCompletedTodo"
      />
    </div>
  </div>
</template>
