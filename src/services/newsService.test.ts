import { describe, expect, it } from "vitest";
import { isRelevant } from "./newsService";

describe("isRelevant", () => {
  it("aceita noticia de fonte de seguros que menciona IA (ai-only)", () => {
    expect(
      isRelevant("Insurers turn to AI for fraud detection", "ai-only")
    ).toBe(true);
  });

  it("rejeita noticia de fonte de seguros sem mencao a IA (ai-only)", () => {
    expect(
      isRelevant("Regulators propose new capital rules for insurers", "ai-only")
    ).toBe(false);
  });

  it("nao confunde substrings como 'Bianca' ou 'Russia' com o termo IA", () => {
    expect(isRelevant("Bianca anuncia noivado em festa intima", "ai-only")).toBe(
      false
    );
    expect(
      isRelevant("Guerra entre Russia e Ucrania se intensifica", "ai-only")
    ).toBe(false);
  });

  it("exige IA e seguros juntos em fontes generalistas (ai-and-insurance)", () => {
    expect(
      isRelevant("Seguradora usa IA para acelerar sinistros", "ai-and-insurance")
    ).toBe(true);
    expect(
      isRelevant("Startup lança novo modelo de IA generativa", "ai-and-insurance")
    ).toBe(false);
    expect(
      isRelevant("Susep regula novas normas para seguradoras", "ai-and-insurance")
    ).toBe(false);
  });

  it("reconhece 'IA' maiuscula isolada como termo, nao como parte de outra palavra", () => {
    expect(isRelevant("Empresa lança nova solução de IA", "ai-only")).toBe(true);
    expect(isRelevant("Fiat lança novo modelo de carro", "ai-only")).toBe(false);
  });
});
