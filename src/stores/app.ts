import { defineStore } from "pinia";
import type { Todo } from "@/types";
import { strToDate } from "@/utils";

import { useNotifyStore } from "./notify";
import { useModalStore } from "./modal";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    todos: [] as Todo[],
    selectedTodo: undefined as Todo | undefined,
    deletedTodos: [] as Todo[],
    isEditing: false,
  }),
  getters: {
    getTodosByStatus(): Todo[] {
      const modalStore = useModalStore();

      if (modalStore.filterOption === "completed") {
        return this.getTodoBySortOrder.filter((todo) => todo.isCompleted);
      } else if (modalStore.filterOption === "ongoing") {
        return this.getTodoBySortOrder.filter((todo) => !todo.isCompleted);
      }

      return this.getTodoBySortOrder;
    },
    getTodoBySortOrder(): Todo[] {
      const modalStore = useModalStore();

      if (modalStore.sortOption === "nameAsc") {
        return this.todos.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (modalStore.sortOption === "nameDesc") {
        return this.todos.sort((a, b) => b.name.localeCompare(a.name));
      }

      if (modalStore.sortOption === "newest") {
        return this.todos.sort(
          (a, b) =>
            strToDate(b.createdAt).getTime() - strToDate(a.createdAt).getTime()
        );
      }

      // returns the oldest by default
      return this.todos.sort(
        (a, b) =>
          strToDate(a.createdAt).getTime() - strToDate(b.createdAt).getTime()
      );
    },
    getTotalOnGoingTodos(): number {
      return this.todos.filter((todo) => !todo.isCompleted).length;
    },
    getTotalTodos(): number {
      return this.todos.length;
    },
    hasCompletedTodos(): boolean {
      return this.todos.find((todo) => todo.isCompleted) !== undefined;
    },
  },
  actions: {
    addTodo(todo: Todo) {
      const notifyStore = useNotifyStore();

      if (this.getTotalTodos >= 50) {
        notifyStore.addNotification(
          "delete",
          "You reached the todo list limit"
        );
        return;
      }
      this.todos.push(todo);
    },
    toggleIsCompleted(id: string) {
      const todoIndex = this.todos.findIndex((todo) => todo.id === id);
      this.todos[todoIndex].isCompleted = !this.todos[todoIndex].isCompleted;
    },
    deleteTodo(id: string) {
      const notifyStore = useNotifyStore();
      const currentTodo = this.todos.find((todo) => todo.id === id);

      if (currentTodo) {
        this.deletedTodos.push(currentTodo);
        if (id === this.selectedTodo?.id) {
          this.isEditing = false;
          this.selectedTodo = undefined;
        }
        notifyStore.addNotification(
          "delete",
          `You've deleted ${this.deletedTodos.length} todos`
        );
      }
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
    deleteCompletedTodo() {
      this.todos = this.todos.filter((todo) => !todo.isCompleted);
    },
    undoDeletedTodos() {
      this.todos.push(...this.deletedTodos);
    },
    updateDate(id: string | undefined, date: string | undefined) {
      this.todos = this.todos.map((value) => {
        if (value.id === id) {
          value.date = date;
        }
        return value;
      });
    },
    setSelectedTodo(id: string) {
      this.selectedTodo = this.todos.find((todo) => todo.id === id);

      if (this.selectedTodo) {
        this.isEditing = true;
      }
    },
  },
});
