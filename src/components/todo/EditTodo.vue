<script lang="ts" setup>
import { ref } from "vue";

import TodoInput from "@/components/input/TodoInput.vue";
import TodoButton from "@/components/input/TodoButton.vue";

import IconEdit from "@/components/icons/IconEdit.vue";
import IconClose from "@/components/icons/IconClose.vue";

import useScreenSize from "@/composables/useScreenSize";

import { useAppStore } from "@/stores/app";

const appStore = useAppStore();

const { onMobile } = useScreenSize();

const closeEditView = () => {
  appStore.isEditing = false;
  appStore.selectedTodo = undefined;
};

const viewSection = ref("");
const changeView = (sectionName: string) => {
  viewSection.value = sectionName;
};
const editDate = ref(appStore.selectedTodo?.date);
const changeDate = () => {
  appStore.updateDate(appStore.selectedTodo?.id, editDate.value);
};
</script>

<template>
  <div
    v-if="appStore.selectedTodo"
    class="flex flex-col h-full"
    :class="{
      'w-1/3 mx-3': !onMobile,
      'absolute w-full bg-neutral-200': onMobile,
    }"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-xl text-neutral-900 font-bold">
        Todo: {{ appStore.selectedTodo.name }}
      </h2>
      <todo-button
        button-id="close-edit-view"
        button-label="Close"
        button-size="sm"
        :show-label="false"
        data-cy="closeEditTodo"
        @trigger-event="closeEditView()"
      >
        <icon-close class="w-5" />
      </todo-button>
    </div>

    <div v-if="onMobile" class="flex gap-2 my-2">
      <button
        class="relative w-1/2 bg-neutral-300 text-neutral-900 uppercase tracking-widest px-4 py-2 rounded"
        :class="{ active: viewSection === 'description' }"
        data-cy="showDescription"
        @click="changeView('description')"
      >
        Description
      </button>
      <button
        class="relative w-1/2 bg-neutral-300 text-neutral-900 uppercase tracking-widest px-4 py-2 rounded"
        :class="{ active: viewSection === 'subtasks' }"
        data-cy="showSubtasks"
        @click="changeView('subtasks')"
      >
        Date
      </button>
    </div>

    <div
      v-if="!onMobile || viewSection === 'description'"
      class="flex-shrink-0"
    >
      <label v-if="!onMobile" class="text-neutral-600 text-sm tracking-wide"
        >Description</label
      >
      <textarea
        v-model="appStore.selectedTodo.description"
        placeholder="Enter description here"
        class="w-full h-32 mt-1.5 bg-neutral-300 border border-transparent hover:border-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-400/50 text-neutral-900 px-3 py-2 resize-none outline-none rounded"
        data-cy="todoDescription"
      ></textarea>
    </div>

    <div
      v-if="!onMobile || viewSection === 'subtasks'"
      class="flex flex-col flex-grow overflow-hidden"
    >
      <div class="w-full flex gap-x-2 mt-2">
        <todo-input
          type="date"
          v-model="editDate"
          class="flex-grow ml-1"
          input-data-cy="todoInput"
          clear-data-cy="clearTodoInput"
          search-data-cy="searchTodoInput"
        />
        <todo-button
          button-id="edit-date"
          button-label="Edit Date"
          button-size="sm"
          :show-label="false"
          data-cy="todoInput"
          @trigger-event="changeDate()"
        >
          <icon-edit class="w-6" />
        </todo-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-list-move,
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.5s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.todo-list-leave-active {
  position: absolute;
}

.active::before {
  content: "";
  @apply absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-cyan-500 rounded-t;
}
</style>
