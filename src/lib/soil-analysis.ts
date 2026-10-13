export type Level = "Low" | "Medium" | "High";
export type Texture = "Sandy" | "Clay" | "Loam";
export interface SoilInput { ph: number; texture: Texture; nitrogen: Level; water: Level }
export const sampleSoil: SoilInput = { ph: 6.5, texture: "Loam", nitrogen: "Medium", water: "Medium" };

const crops = [
  { name: "Soybean", group: "Legume", min: 6, max: 7.5, textures: ["Loam", "Clay"], water: "Medium", nitrogen: "Low", icon: "bean" },
  { name: "Wheat", group: "Cereal", min: 6, max: 7.5, textures: ["Loam", "Clay"], water: "Medium", nitrogen: "Medium", icon: "wheat" },
  { name: "Maize", group: "Cereal", min: 5.8, max: 7.5, textures: ["Loam"], water: "High", nitrogen: "High", icon: "sprout" },
  { name: "Potato", group: "Root crop", min: 5, max: 6.5, textures: ["Sandy", "Loam"], water: "Medium", nitrogen: "Medium", icon: "sprout" },
  { name: "Sorghum", group: "Cereal", min: 5.5, max: 8, textures: ["Sandy", "Loam", "Clay"], water: "Low", nitrogen: "Low", icon: "wheat" },
];
const levelValue = { Low: 0, Medium: 1, High: 2 };
export function analyzeSoil(input: SoilInput) {
  if (!Number.isFinite(input.ph) || input.ph < 0 || input.ph > 14) throw new Error("Enter a soil pH between 0 and 14.");
  const labRequired = input.ph < 5.5 || input.ph > 8 || input.nitrogen === "Low";
  const ranked = crops.map((crop) => {
    const phMatch = input.ph >= crop.min && input.ph <= crop.max;
    const textureMatch = crop.textures.includes(input.texture);
    const waterMatch = levelValue[input.water] >= levelValue[crop.water as Level];
    const nitrogenMatch = levelValue[input.nitrogen] >= levelValue[crop.nitrogen as Level];
    const score = Number(phMatch) * 4 + Number(textureMatch) * 2 + Number(waterMatch) + Number(nitrogenMatch);
    return { ...crop, score, suitability: score === 8 ? "Well suited" : score >= 6 ? "Potential fit" : "Needs attention", detail: !phMatch ? "Soil pH is outside the preferred range." : !textureMatch ? "Soil texture may limit establishment." : !waterMatch ? "Additional water may be needed." : !nitrogenMatch ? "Review nutrient needs before planting." : "Your soil conditions align with this crop." };
  }).sort((a, b) => b.score - a.score).slice(0, 3);
  const actions = [
    input.ph < 5.5 ? { title: "Check soil acidity", detail: "Confirm pH with a laboratory before considering lime." } : input.ph > 8 ? { title: "Investigate alkaline soil", detail: "Request a pH and salinity assessment before amendments." } : { title: "Maintain balanced soil pH", detail: "Monitor pH seasonally and before adding amendments." },
    input.nitrogen === "Low" ? { title: "Confirm nutrient availability", detail: "Request a nutrient panel before applying fertilizer." } : { title: "Support soil organic matter", detail: "Use cover crops and crop residues to support soil health." },
    input.water === "Low" ? { title: "Conserve available moisture", detail: "Consider mulch, efficient irrigation, and drought-tolerant crops." } : input.texture === "Clay" && input.water === "High" ? { title: "Review field drainage", detail: "Check for waterlogging before establishing crops." } : { title: "Plan consistent irrigation", detail: "Monitor soil moisture and adjust water to the selected crop." },
  ];
  return { crops: ranked, actions, labRequired };
}

export type SoilParams = Omit<SoilInput, "ph">;

const phBase = 6.5;
const phTextureShift: Record<Texture, number> = { Sandy: -0.5, Loam: 0, Clay: 0.2 };
const phNitrogenShift: Record<Level, number> = { Low: -0.3, Medium: 0, High: 0.3 };
const phWaterShift: Record<Level, number> = { Low: -0.4, Medium: 0, High: 0.2 };

export function recommendPh(params: SoilParams) {
  const raw = phBase + phTextureShift[params.texture] + phNitrogenShift[params.nitrogen] + phWaterShift[params.water];
  const targetPh = Math.round(Math.min(7.5, Math.max(5.5, raw)) * 10) / 10;
  const detail = `A target of pH ${targetPh.toFixed(1)} suits ${params.texture.toLowerCase()} soil with ${params.nitrogen.toLowerCase()} nitrogen and ${params.water.toLowerCase()} water availability.`;
  return { targetPh, detail };
}