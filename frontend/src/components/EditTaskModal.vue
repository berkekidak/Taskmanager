<script setup lang="ts">
import { ref } from "vue";
import type { Task } from "@/type/Types.ts";

const props = defineProps<{ task: Task }>();
const emit = defineEmits<{
  save: [task: Task];
  close: [];
}>();
const task = ref(props.task);
const title = ref(task.value.title);

function save(): void {
  emit("save", {
    ...props.task,
    title: title.value,
  });
}
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h2>Edit Task</h2>
      <form class="modal-form" @submit.prevent="save">
        <input type="text" v-model="title" />
        <div>
          <button type="submit">Save</button>
          <button
            type="button"
            @click="emit('close')"
            style="background-color: var(--territary-color)"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
