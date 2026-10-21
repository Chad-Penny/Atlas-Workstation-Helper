import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { sidebarSwipeAction, type SwipePoint } from "@/lib/sidebar-swipe";

export function SidebarSwipe() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (!isMobile) return;
    let start: SwipePoint | null = null;
    const onStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || event.touches.length !== 1 || (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable='true']"))) { start = null; return; }
      start = openMobile || touch.clientX <= 40 ? { x: touch.clientX, y: touch.clientY } : null;
    };
    const onMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!start || !touch) return;
      if (event.touches.length !== 1) { start = null; return; }
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { start = null; return; }
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5 && (openMobile ? dx < 0 : dx > 0) && event.cancelable) event.preventDefault();
    };
    const onEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (start && touch) {
        const action = sidebarSwipeAction(start, { x: touch.clientX, y: touch.clientY }, openMobile);
        if (action) setOpenMobile(action === "open");
      }
      start = null;
    };
    const cancel = () => { start = null; };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", cancel, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", cancel);
    };
  }, [isMobile, openMobile, setOpenMobile]);
  return null;
}