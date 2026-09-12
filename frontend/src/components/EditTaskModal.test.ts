import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import EditTaskModal from "./EditTaskModal.vue";

describe("EditTaskModal", () => {
  it("shows the current task title in the input", () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(EditTaskModal, {
      props: {
        task,
      },
    });

    const input = wrapper.get('[data-test="edit-input"]')
      .element as HTMLInputElement;

    expect(input.value).toBe("Learn Vue");
  });

  it("allows the title to be changed", async () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(EditTaskModal, {
      props: {
        task,
      },
    });

    const input = wrapper.get('[data-test="edit-input"]');

    await input.setValue("Learn Vitest");

    expect((input.element as HTMLInputElement).value).toBe("Learn Vitest");
  });

  it("emits save with the updated task when the form is submitted", async () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(EditTaskModal, {
      props: {
        task,
      },
    });

    await wrapper.get('[data-test="edit-input"]').setValue("Learn Vitest");

    await wrapper.get('[data-test="edit-form"]').trigger("submit");

    expect(wrapper.emitted("save")).toBeTruthy();

    expect(wrapper.emitted("save")?.[0]).toEqual([
      {
        id: 1,
        title: "Learn Vitest",
        done: false,
      },
    ]);
  });

  it("emits close when Cancel is clicked", async () => {
    const task = {
      id: 1,
      title: "Learn Vue",
      done: false,
    };

    const wrapper = mount(EditTaskModal, {
      props: {
        task,
      },
    });

    await wrapper.get('[data-test="cancel-button"]').trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
