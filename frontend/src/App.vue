<script setup lang="ts">
import { ref, onMounted } from "vue";
import TaskCard from "@/components/TaskCard.vue";
import type { Task } from "@/type/Types.ts";

const tasks = ref<Task[]>([]);

const newTask = ref("");

async function getTasks() {
  try {
    const res = await fetch("http://localhost:5000/tasks");
    if (!res.ok) {
      throw new Error("Backend not avaible");
    }
    const data = await res.json();
    tasks.value = data.tasks;
  } catch (error) {
    console.log("Backend unavailable, using local data");
    const res = await fetch("/Test.json");
    tasks.value = await res.json();
  }
}

function addTask() {
  if (!newTask.value.trim()) return;
  console.log(newTask.value);
  newTask.value = "";
}
onMounted(() => {
  getTasks();
});
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

        <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
