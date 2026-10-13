import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Bean, Calculator, Check, CheckCheck, ChevronRight, CircleCheck, Droplets, FlaskConical, Info, Leaf, RotateCcw, ShieldCheck, SlidersHorizontal, Sprout, TestTubeDiagonal, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeSoil, recommendPh, sampleSoil, type SoilInput, type Level, type Texture } from "@/lib/soil-analysis";
import farmland from "@/assets/farmland.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Terraform — Soil & Crop Analysis" },
    { name: "description", content: "Explore your soil conditions, discover suitable crops, and plan your next steps with Terraform’s preliminary soil analysis." },
    { property: "og:title", content: "Terraform — Soil & Crop Analysis" },
    { property: "og:description", content: "A healthier soil. A better harvest. Explore crop suitability and practical soil management recommendations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function SoilSelect({ id, label, icon: Icon, value, options, onChange }: { id: string; label: string; icon: typeof Leaf; value: string; options: string[]; onChange: (value: string) => void }) {
  return <div className="field"><label htmlFor={id}><Icon />{label}</label><Select value={value} onValueChange={onChange}><SelectTrigger id={id} className="field-control"><SelectValue /></SelectTrigger><SelectContent>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>;
}

function Index() {
  const [ph, setPh] = useState("6.5");
  const [texture, setTexture] = useState<Texture>("Loam");
  const [nitrogen, setNitrogen] = useState<Level>("Medium");
  const [water, setWater] = useState<Level>("Medium");
  const [analyzed, setAnalyzed] = useState<SoilInput>(sampleSoil);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  const [phNote, setPhNote] = useState("");
  const result = analyzeSoil(analyzed);
  const changed = Number(ph) !== analyzed.ph || texture !== analyzed.texture || nitrogen !== analyzed.nitrogen || water !== analyzed.water;
  function submit(event: FormEvent) {
    event.preventDefault();
    if (ph.trim() === "" || !Number.isFinite(Number(ph)) || Number(ph) < 0 || Number(ph) > 14) { setError("Enter a soil pH between 0 and 14."); return; }
    setError(""); setPhNote(""); setAnalyzed({ ph: Number(ph), texture, nitrogen, water }); setRevision(value => value + 1);
  }
  function calculatePh() { const { targetPh, detail } = recommendPh({ texture, nitrogen, water }); setPh(targetPh.toFixed(1)); setPhNote(detail); setError(""); }
  function reset() { setPh("6.5"); setTexture("Loam"); setNitrogen("Medium"); setWater("Medium"); setAnalyzed(sampleSoil); setError(""); setPhNote(""); setRevision(value => value + 1); }
  return <div className="min-h-screen">
    <header className="app-header"><div className="header-inner"><div className="flex items-center"><a href="/" className="brand" aria-label="Terraform home"><Sprout className="brand-icon" strokeWidth={2.1} />terraform<span className="text-primary">.</span></a><span className="header-label">Soil & agriculture management</span></div><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground hidden sm:inline">Grow with confidence</span><span className="flex size-9 items-center justify-center rounded-full bg-accent text-primary"><Leaf size={17} /></span></div></div></header>
    <main className="workspace">
      <div className="breadcrumb"><Leaf size={13} /><span>Workspace</span><ChevronRight size={12} /><span className="text-foreground">Soil analysis</span></div>
      <div className="page-heading"><div><h1>Soil & crop analysis</h1><p>Understand your soil. Make better growing decisions.</p></div><span className="pill"><span className="pill-dot" /> Your next harvest starts here</span></div>
      <section className="land-banner" aria-label="Healthy agricultural fields"><img src={farmland} width={1600} height={544} alt="Lush green crop rows stretching across rolling farmland" /><div className="banner-copy"><div className="banner-eyebrow"><Sprout size={13} />Rooted in better decisions</div><h2>Healthy soil. Thriving crops.</h2><p>A little insight today. A stronger harvest tomorrow.</p></div></section>
      <div className="analysis-grid">
        <section className="panel"><div className="panel-heading"><div><div className="heading-title"><SlidersHorizontal /><h2>Soil parameters</h2></div><p>A closer look at what’s beneath the surface.</p></div><Button variant="ghost" size="icon" title="Reset soil parameters" aria-label="Reset soil parameters" onClick={reset}><RotateCcw className="text-muted-foreground" /></Button></div>
          <form className="soil-form" onSubmit={submit} noValidate>
            <div className="field"><div className="field-label-row"><label htmlFor="soil-ph"><TestTubeDiagonal />Soil pH</label><Button type="button" variant="secondary" size="sm" className="calc-btn" onClick={calculatePh} title="Calculate a target pH from your soil texture, nitrogen, and water inputs"><Calculator />Calculate pH</Button></div><input id="soil-ph" className="field-control" type="number" min="0" max="14" step="0.1" value={ph} onChange={event => { setPh(event.target.value); setError(""); setPhNote(""); }} aria-invalid={!!error} aria-describedby="ph-hint" required /><div className="ph-scale" /><div className="ph-labels"><span>Acidic</span><span>Neutral</span><span>Alkaline</span></div><p id="ph-hint" className="field-hint">Most crops thrive between pH 6.0 and 7.0.</p>{phNote && <p className="field-note"><CircleCheck size={12} />{phNote}</p>}{error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}</div>
            <SoilSelect id="soil-texture" label="Soil texture" icon={Leaf} value={texture} options={["Sandy", "Clay", "Loam"]} onChange={value => setTexture(value as Texture)} />
            <SoilSelect id="nitrogen" label="Nitrogen level" icon={FlaskConical} value={nitrogen} options={["Low", "Medium", "High"]} onChange={value => setNitrogen(value as Level)} />
            <SoilSelect id="water" label="Water availability" icon={Droplets} value={water} options={["Low", "Medium", "High"]} onChange={value => setWater(value as Level)} />
            <div className="form-actions"><Button type="submit" className="w-full h-11"><Sprout />Analyze soil<ArrowRight className="ml-auto" /></Button><p className="form-note"><ShieldCheck size={12} />{changed ? "Parameters changed · ready to analyze" : "Insights tailored to your soil conditions"}</p></div>
          </form>
        </section>
        <section className="panel" aria-label="Analysis results"><div className="panel-heading"><div><div className="heading-title"><Sprout /><h2>Analysis results</h2></div><p>{changed ? "Showing your last analysis. Update to refresh." : `Based on pH ${analyzed.ph} · ${analyzed.texture.toLowerCase()} soil · ${analyzed.water.toLowerCase()} water`}</p></div><span className="pill"><CircleCheck size={12} />{revision > 0 ? "Updated" : "Sample analysis"}</span></div>
          <div key={revision} className="results-body result-refresh" aria-live="polite">
            <div className="section-label"><Wheat size={14} />Recommended crops</div>
            <div className="crop-list">{result.crops.map(crop => { const Icon = crop.icon === "bean" ? Bean : crop.icon === "wheat" ? Wheat : Sprout; return <div className="crop-row" key={crop.name}><div className="crop-icon"><Icon size={24} strokeWidth={1.6} /></div><div className="min-w-0"><div className="crop-name">{crop.name}<span className="ml-2 text-[10px] font-normal text-muted-foreground">{crop.group}</span></div><p className="crop-detail">{crop.detail}</p></div><span className={`pill crop-badge ${crop.score < 8 ? "caution" : ""}`}>{crop.score === 8 && <Check size={11} />}{crop.suitability}</span></div>; })}</div>
            <div className="actions-section"><div className="section-label"><CheckCheck size={14} />Your next steps</div><div className="action-list">{result.actions.map(action => <div className="action" key={action.title}><CircleCheck /><div><h3>{action.title}</h3><p>{action.detail}</p></div></div>)}</div></div>
            <div className={`lab-alert ${result.labRequired ? "required" : ""}`} role="status"><FlaskConical /><div><h3>{result.labRequired ? "Laboratory testing required" : "No immediate laboratory testing flagged"}</h3><p>{result.labRequired ? "Confirm your soil pH and nutrient levels with a laboratory before making amendment decisions." : "Your inputs fall within typical screening ranges. A laboratory test is still recommended before major planting or fertilizer decisions."}</p></div></div>
            <p className="disclaimer"><Info />Preliminary guidance only. Local climate, crop variety, and a complete soil test may change these recommendations.</p>
          </div>
        </section>
      </div>
      <footer className="footer"><span className="flex items-center gap-1.5"><Sprout size={12} />Cultivating better decisions, from the ground up.</span><span>Terraform · Soil intelligence</span></footer>
    </main>
  </div>;
}
