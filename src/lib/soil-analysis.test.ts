import { describe, it, expect } from "vitest";
import { analyzeSoil, sampleSoil } from "./soil-analysis";

describe("preliminary soil analysis", () => {
  it("returns three ranked crop recommendations for sample soil", () => {
    const result = analyzeSoil(sampleSoil);
    expect(result.crops).toHaveLength(3);
    expect(result.crops[0]?.name).toBe("Soybean");
    expect(result.labRequired).toBe(false);
  });
  it("flags acidic soil for laboratory testing", () => {
    expect(analyzeSoil({ ...sampleSoil, ph: 4.5 }).labRequired).toBe(true);
  });
  it("flags alkaline soil for laboratory testing", () => {
    expect(analyzeSoil({ ...sampleSoil, ph: 8.5 }).labRequired).toBe(true);
  });
  it("flags low nitrogen for laboratory testing", () => {
    expect(analyzeSoil({ ...sampleSoil, nitrogen: "Low" }).labRequired).toBe(true);
  });
  it("rejects pH outside its valid range", () => {
    expect(() => analyzeSoil({ ...sampleSoil, ph: 15 })).toThrow();
  });
  it("adjusts recommendations when water availability changes", () => {
    const result = analyzeSoil({ ph: 7.8, texture: "Sandy", nitrogen: "Low", water: "Low" });
    expect(result.crops[0]?.name).toBe("Sorghum");
    expect(result.actions[2]?.title).toBe("Conserve available moisture");
  });
});

describe("soil pH calculation", () => {
  it("targets neutral loam with moderate nitrogen and water", () => {
    expect(recommendPh({ texture: "Loam", nitrogen: "Medium", water: "Medium" }).targetPh).toBe(6.5);
  });
  it("lowers the target for sandy soil with low nitrogen and limited moisture", () => {
    expect(recommendPh({ texture: "Sandy", nitrogen: "Low", water: "Low" }).targetPh).toBe(5.5);
  });
  it("raises the target for clay with high nitrogen and plentiful water", () => {
    expect(recommendPh({ texture: "Clay", nitrogen: "High", water: "High" }).targetPh).toBe(7.2);
  });
  it("explains the calculated target in plain language", () => {
    expect(recommendPh({ texture: "Sandy", nitrogen: "Medium", water: "Medium" }).detail).toBe("A target of pH 6.0 suits sandy soil with medium nitrogen and medium water availability.");
  });
});