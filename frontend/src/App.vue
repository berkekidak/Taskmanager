<script setup lang="ts">
import { ref } from "vue";
import TaskCard from "@/components/TaskCard.vue";
import type { Task } from "@/type/Types.ts";

const task = ref<Task>({
  id: 1,
  title: "Plan meals",
  done: true,
});

const newTask = ref("");

function addTask() {
  if (!newTask.value.trim()) return;
  console.log(newTask.value);
  newTask.value = "";
}
</script>

<template>
  <main class="flex-center">
    <section class="section tasks">
      <div class="task-card">
        <div class="task-title">
          <img src="" alt="" />
          <div class="task-header">
            <h2>Mini Tasks</h2>
            <p>simple task tracker</p>
          </div>
        </div>

        <form @submit.prevent="addTask"></form>

        <TaskCard :task="task" />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
