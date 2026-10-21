import { describe, expect, it } from "vitest";
import { sidebarSwipeAction } from "@/lib/sidebar-swipe";

describe("phone sidebar gestures", () => {
  it("opens with a rightward swipe from the left edge", () => {
    expect(sidebarSwipeAction({ x: 10, y: 200 }, { x: 120, y: 210 }, false)).toBe("open");
  });
  it("closes an open sidebar with a leftward swipe", () => {
    expect(sidebarSwipeAction({ x: 220, y: 200 }, { x: 100, y: 210 }, true)).toBe("close");
  });
  it("does not intercept vertical scrolling, short touches or central swipes", () => {
    expect(sidebarSwipeAction({ x: 10, y: 200 }, { x: 100, y: 350 }, false)).toBeNull();
    expect(sidebarSwipeAction({ x: 10, y: 200 }, { x: 40, y: 200 }, false)).toBeNull();
    expect(sidebarSwipeAction({ x: 110, y: 200 }, { x: 220, y: 200 }, false)).toBeNull();
  });
});