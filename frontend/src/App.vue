<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import TaskCard from "@/components/TaskCard.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";
import type { Task } from "@/types/Types";
import { NotebookPen } from "lucide-vue-next";

const tasks = ref<Task[]>([]);

const newTask = ref("");
const edit_task = ref<Task | null>(null);
const URL = import.meta.env.VITE_BACKEND_URL;

async function getTasks(): Promise<void> {
  try {
    const res = await fetch(`${URL}/tasks`);

    if (!res.ok) {
      throw new Error("Backend not available");
    }

    const data = await res.json();
    tasks.value = data.tasks;
  } catch (error) {
    console.log("Backend unavailable, using local data:", error);

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks);
    } else {
      const res = await fetch("/Test.json");
      tasks.value = await res.json();
    }
  }
}

async function addTask(): Promise<void> {
  if (!newTask.value.trim()) return;
  const task = {
    id: Math.max(0, ...tasks.value.map((task) => task.id)) + 1,
    title: newTask.value,
    done: false,
  };

  tasks.value.push(task);

  const res = await fetch(`${URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  newTask.value = "";
}

async function updateTask(updt_task: Task): Promise<void> {
  const index = tasks.value.findIndex((t) => t.id === updt_task.id);

  // test
  if (index === -1) return;

  const currentTask = tasks.value[index];

  if (!currentTask) return;

  if (
    currentTask.done === updt_task.done &&
    currentTask.title === updt_task.title
  ) {
    return;
  }

  try {
    const res = await fetch(`${URL}/tasks/${updt_task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updt_task.title,
        done: updt_task.done,
      }),
    });

    if (!res.ok) {
      throw new Error("Could not update the task");
    }

    tasks.value[index] = updt_task;
  } catch (error) {
    console.error(error);
  }
}

async function deleteTask(task_id: Task["id"]): Promise<void> {
  try {
    const res = await fetch(`${URL}/tasks/${task_id}`, {
      method: "Delete",
    });
    if (!res.ok) {
      throw new Error("Could not Send request to delete the task");
    }
    tasks.value = tasks.value.filter((t) => t.id !== task_id);
  } catch (error) {
    console.log(error);
  }
}

function openEdit(task: Task): void {
  edit_task.value = { ...task };
}

function closeEdit(): void {
  edit_task.value = null;
}

function saveEdit(updated: Task): void {
  updateTask(updated);
  closeEdit();
}

onMounted(async () => {
  await getTasks();
});

watch(
  tasks,
  (newTasks) => {
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  },
  { deep: true },
);
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
