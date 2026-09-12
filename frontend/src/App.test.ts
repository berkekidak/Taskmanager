import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import App from "./App.vue";

describe("Task Crud", () => {
  it("send a get request and load the data from backend", async () => {
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

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            tasks: mockTasks,
          }),
      }),
    ) as any;

    const wrapper = mount(App);
    await flushPromises();

    expect(wrapper.text()).toContain("Learn Vue");
    expect(wrapper.text()).toContain("Learn FastAPI");
  });
});
