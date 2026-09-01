<script setup lang="ts">
import { ref } from "vue";
import type { Task } from "@/type/Types.ts";

defineProps<{ task: Task }>();
</script>

<template>
  <div class="task">
    <input type="checkbox" v-model="task.done" />
    <p>{{ task.title }}</p>
    <div class="task-icons">
      <img src="" alt="" />
      <img src="" alt="" />
    </div>
  </div>
</template>

<style scoped></style>
