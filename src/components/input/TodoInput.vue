<script lang="ts" setup>
import TodoButton from "@/components/input/TodoButton.vue";
import IconClose from "@/components/icons/IconClose.vue";
import IconSearch from "@/components/icons/IconSearch.vue";

export interface Prop {
  label?: string;
  type: string;
  placeholder?: string;
  modelValue: string | undefined;
  isOptional?: boolean;
  hasClearButton?: boolean;
  hasSearchButton?: boolean;
  inputDataCy: string;
  clearDataCy: string;
  searchDataCy: string;
  value?: string;
}

withDefaults(defineProps<Prop>(), {
  label: "",
  isOptional: false,
  hasClearButton: true,
  hasSearchButton: false,
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "triggerEventOnEnter"): void;
  (e: "clearTodoInput"): void;
}>();
</script>

<template>
  <div class="relative flex flex-col">
    <label v-if="label"
      >{{ label }} <span v-if="isOptional">(Optional)</span></label
    >
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="w-full h-full bg-neutral-50 border border-neutral-300 hover:border-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-400/50 text-neutral-800 px-3 py-2 outline-none rounded-md"
      :data-cy="inputDataCy"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      @keypress.enter="$emit('triggerEventOnEnter')"
    />

    <div class="absolute top-1/2 right-2 -translate-y-1/2 flex gap-2 mb-[3px]">
      <transition name="fade">
        <todo-button
          v-if="modelValue?.length !== 0 && hasSearchButton"
          button-id="search-todos"
          button-label="Search Todos"
          button-size="xs"
          :data-cy="searchDataCy"
          :is-icon-button="true"
        >
          <icon-search class="w-4" />
        </todo-button>
      </transition>
      <transition name="fade">
        <todo-button
          v-if="modelValue?.length !== 0 && hasClearButton"
          button-id="clear-todo-input"
          button-label="Clear Todo Input"
          button-size="xs"
          :data-cy="clearDataCy"
          :is-icon-button="true"
          @trigger-event="$emit('update:modelValue', '')"
        >
          <icon-close class="w-4" />
        </todo-button>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
