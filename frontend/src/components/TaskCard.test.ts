<script setup lang="ts">
import { ref } from "vue";
import type { Task } from "@/type/Types.ts";
import { Pencil, Trash2 } from "lucide-vue-next";

const props = defineProps<{
  task: Task;
  updateTask: (task: Task) => void;
  deleteTask: (task: Task["id"]) => void;
  openEdit: (task: Task) => void;
}>();

function toggle() {
  props.updateTask({ ...props.task, done: !props.task.done });
}
</script>

<template>
  <div class="task">
    <div class="task-title">
      <input
        class="task-check"
        type="checkbox"
        :checked="task.done"
        @change="toggle"
      />
      <p :class="{ completed: task.done }">{{ task.title }}</p>
    </div>
    <div class="task-icons">
      <Pencil @click="openEdit(task)" />
      <Trash2 @click="deleteTask(task.id)" />
    </div>
  </div>
</template>

<style scoped></style>
