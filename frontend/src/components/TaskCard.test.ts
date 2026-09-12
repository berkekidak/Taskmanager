import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "./TaskCard.vue";

describe("TaskCard", () => {
  it("renders the task title", () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(TaskCard, {
      props: {
        task,
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        openEdit: vi.fn(),
      },
    });

    expect(wrapper.get('[data-test="task-title"]').text()).toBe("Learn Vue");
  });

  it("shows the checkbox as unchecked when task is not done", () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(TaskCard, {
      props: {
        task,
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        openEdit: vi.fn(),
      },
    });

    const checkbox = wrapper.get('[data-test="task-checkbox"]')
      .element as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
  });

  it("shows the checkbox as checked when task is done", () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: true,
    };

    const wrapper = mount(TaskCard, {
      props: {
        task,
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        openEdit: vi.fn(),
      },
    });

    const checkbox = wrapper.get('[data-test="task-checkbox"]')
      .element as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
  });

  it("calls updateTask with toggled done value", async () => {
    const updateTask = vi.fn();

    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(TaskCard, {
      props: {
        task,
        updateTask,
        deleteTask: vi.fn(),
        openEdit: vi.fn(),
      },
    });

    await wrapper.get('[data-test="task-checkbox"]').trigger("change");

    expect(updateTask).toHaveBeenCalledTimes(1);

    expect(updateTask).toHaveBeenCalledWith({
      id: 1,
      title: "Learn Vue",
      done: true,
    });
  });

  it("calls openEdit when edit icon is clicked", async () => {
    const openEdit = vi.fn();

    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(TaskCard, {
      props: {
        task,
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        openEdit,
      },
    });

    await wrapper.get('[data-test="edit-task"]').trigger("click");

    expect(openEdit).toHaveBeenCalledTimes(1);
    expect(openEdit).toHaveBeenCalledWith(task);
  });

  it("calls deleteTask when delete icon is clicked", async () => {
    const deleteTask = vi.fn();

    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(TaskCard, {
      props: {
        task,
        updateTask: vi.fn(),
        deleteTask,
        openEdit: vi.fn(),
      },
    });

    await wrapper.get('[data-test="delete-task"]').trigger("click");

    expect(deleteTask).toHaveBeenCalledTimes(1);
    expect(deleteTask).toHaveBeenCalledWith(1);
  });

  it("adds completed class when task is done", () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: true,
    };

    const wrapper = mount(TaskCard, {
      props: {
        task,
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        openEdit: vi.fn(),
      },
    });

    expect(wrapper.get('[data-test="task-title"]').classes()).toContain(
      "completed",
    );
  });
});
