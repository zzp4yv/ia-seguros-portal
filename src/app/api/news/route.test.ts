import { describe, expect, it } from "vitest";
import { dynamic } from "./route";

describe("api/news route config", () => {
  it("marca a rota como dinamica para nao congelar o RSS em build-time", () => {
    expect(dynamic).toBe("force-dynamic");
  });
});
