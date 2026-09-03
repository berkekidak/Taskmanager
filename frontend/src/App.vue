<script setup lang="ts">
import { ref, onMounted } from "vue";
import TaskCard from "@/components/TaskCard.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";
import type { Task } from "@/type/Types.ts";
import { NotebookPen } from "lucide-vue-next";

const tasks = ref<Task[]>([]);

const newTask = ref("");
const edit_task = ref<Task | null>(null);

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

function addTask(): void {
  if (!newTask.value.trim()) return;

  tasks.value.push({
    id: Math.max(0, ...tasks.value.map((task) => task.id)) + 1,
    title: newTask.value,
    done: false,
  });

  newTask.value = "";
}

function deleteTask(task_id: Task["id"]): void {
  tasks.value = tasks.value.filter((t) => t.id !== task_id);
}

function updateTask(updt_task: Task): void {
  const index = tasks.value.findIndex((t) => t.id === updt_task.id);
  if (index === -1) return;
  tasks.value[index] = updt_task;
}

function openEdit(task: Task): void {
  edit_task.value = { ...task };
}

function closeEdit(): void {
  edit_task.value = null;
}

function saveEdit(updated: Task): void {
  console.log(updated.title);
  updateTask(updated);
  closeEdit();
}

onMounted(() => {
  getTasks();
});
</script>

<template>
  <main class="flex-center">
    <section class="section flex-center tasks">
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

        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :deleteTask="deleteTask"
          :updateTask="updateTask"
          :openEdit="openEdit"
        />
        <EditTaskModal
          v-if="edit_task"
          :task="edit_task"
          @save="saveEdit"
          @close="closeEdit"
        />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
