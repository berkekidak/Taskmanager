import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.vue";
import TaskCard from "@/components/TaskCard.vue";
import EditTaskModal from "@/components/EditTaskModal.vue";

describe("Task CRUD", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("sends a GET request and loads tasks from backend", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Learn Vue",
        done: false,
      },
      {
        id: 2,
        title: "Learn FastAPI",
        done: true,
      },
    ];

    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tasks: mockTasks,
      }),
    })) as any;

    const wrapper = mount(App);

    await flushPromises();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/tasks"),
    );

    expect(wrapper.text()).toContain("Learn Vue");
    expect(wrapper.text()).toContain("Learn FastAPI");
  });

  it("sends a POST request and adds a task", async () => {
    globalThis.fetch = vi
      .fn()

      // GET request from onMounted
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tasks: [],
        }),
      })

      // POST request
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      }) as any;

    const wrapper = mount(App);

    await flushPromises();

    const input = wrapper.get('[data-test="task-input"]');

    await input.setValue("Learn Vitest");

    await wrapper.get('[data-test="task-form"]').trigger("submit");

    await flushPromises();

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("/tasks"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          title: "Learn Vitest",
          done: false,
        }),
      },
    );

    expect(wrapper.text()).toContain("Learn Vitest");

    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("does not add an empty task", async () => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tasks: [],
      }),
    })) as any;

    const wrapper = mount(App);

    await flushPromises();

    const input = wrapper.get('[data-test="task-input"]');

    await input.setValue("   ");

    await wrapper.get('[data-test="task-form"]').trigger("submit");

    await flushPromises();

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("sends a PATCH request and updates a task", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Learn Vue",
        done: false,
      },
    ];

    globalThis.fetch = vi
      .fn()

      // GET
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tasks: mockTasks,
        }),
      })

      // PATCH
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      }) as any;

    const wrapper = mount(App);

    await flushPromises();

    const taskCard = wrapper.getComponent(TaskCard);

    const updateTask = taskCard.props("updateTask");

    await updateTask({
      id: 1,
      title: "Learn Vue Testing",
      done: true,
    });

    await flushPromises();

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("/tasks/1"),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Learn Vue Testing",
          done: true,
        }),
      },
    );

    expect(wrapper.text()).toContain("Learn Vue Testing");
  });

  it("does not send PATCH if task has not changed", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Learn Vue",
        done: false,
      },
    ];

    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tasks: mockTasks,
      }),
    })) as any;

    const wrapper = mount(App);

    await flushPromises();

    const taskCard = wrapper.getComponent(TaskCard);

    const updateTask = taskCard.props("updateTask");

    await updateTask({
      id: 1,
      title: "Learn Vue",
      done: false,
    });

    await flushPromises();

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("sends a DELETE request and removes a task", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Delete me",
        done: false,
      },
    ];

    globalThis.fetch = vi
      .fn()

      // GET
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tasks: mockTasks,
        }),
      })

      // DELETE
      .mockResolvedValueOnce({
        ok: true,
      }) as any;

    const wrapper = mount(App);

    await flushPromises();

    expect(wrapper.text()).toContain("Delete me");

    const taskCard = wrapper.getComponent(TaskCard);

    const deleteTask = taskCard.props("deleteTask");

    await deleteTask(1);

    await flushPromises();

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("/tasks/1"),
      {
        method: "Delete",
      },
    );

    expect(wrapper.text()).not.toContain("Delete me");
  });

  it("opens the edit modal", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Learn Vue",
        done: false,
      },
    ];

    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        tasks: mockTasks,
      }),
    })) as any;

    const wrapper = mount(App);

    await flushPromises();

    expect(wrapper.findComponent(EditTaskModal).exists()).toBe(false);

    const taskCard = wrapper.getComponent(TaskCard);

    const openEdit = taskCard.props("openEdit");

    openEdit({
      id: 1,
      title: "Learn Vue",
      done: false,
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(EditTaskModal).exists()).toBe(true);
  });
});
