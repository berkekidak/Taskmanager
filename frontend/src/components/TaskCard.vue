<script setup lang="ts">
import { ref } from "vue";
import type { Task } from "@/type/Types.ts";
import { Pencil, Trash2 } from "lucide-vue-next";
defineProps<{ task: Task }>();
</script>

<template>
  <div class="task">
    <div class="task-title">
      <input class="task-check" type="checkbox" v-model="task.done" />
      <p>{{ task.title }}</p>
    </div>
    <div class="task-icons">
      <Pencil />
      <Trash2 />
    </div>
  </div>
</template>

<style scoped></style>
