import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppearanceProvider, useAppearance } from "@/components/app/AppearanceProvider";

function Control() {
  const { theme, toggle } = useAppearance();
  return <button onClick={toggle}>{theme}</button>;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("shared appearance", () => {
  it("switches both ways and retains the choice after remount", async () => {
    const view = render(<AppearanceProvider><Control /></AppearanceProvider>);
    fireEvent.click(screen.getByRole("button", { name: "light" }));
    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
    expect(localStorage.getItem("atlas-theme")).toBe("dark");
    view.unmount();
    render(<AppearanceProvider><Control /></AppearanceProvider>);
    await screen.findByRole("button", { name: "dark" });
    fireEvent.click(screen.getByRole("button", { name: "dark" }));
    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(false));
    expect(localStorage.getItem("atlas-theme")).toBe("light");
  });
});