<script setup lang="ts">
import { ref, onMounted } from "vue";
import TaskCard from "@/components/TaskCard.vue";
import type { Task } from "@/type/Types.ts";
import { NotebookPen } from "lucide-vue-next";

const tasks = ref<Task[]>([]);

const newTask = ref("");

async function getTasks() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`);
    if (!res.ok) {
      throw new Error("Backend not avaible");
    }
    const data = await res.json();
    tasks.value = data.tasks;
  } catch (error) {
    console.log("Backend unavailable, using local data: ", error);
    const res = await fetch("/Test.json");
    tasks.value = await res.json();
  }
}

function addTask() {
  if (!newTask.value.trim()) return;

  tasks.value.push({
    id: Math.max(0, ...tasks.value.map((task) => task.id)) + 1,
    title: newTask.value,
    done: false,
  });

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
          <NotebookPen />
          <div class="task-header">
            <h2>Mini Tasks</h2>
            <p>simple task tracker</p>
          </div>
        </div>

        <form @submit.prevent="addTask" class="task-form">
          <input
            type="text"
            v-model="newTask"
            placeholder="Please enter a new task..."
          />
          <button type="submit">Add</button>
        </form>

        <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
