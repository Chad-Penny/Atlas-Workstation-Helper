export type SwipePoint = { x: number; y: number };

export function sidebarSwipeAction(start: SwipePoint, end: SwipePoint, open: boolean): "open" | "close" | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (Math.abs(dx) < 64 || Math.abs(dx) <= Math.abs(dy) * 1.5) return null;
  if (!open && start.x <= 40 && dx > 0) return "open";
  if (open && dx < 0) return "close";
  return null;
}