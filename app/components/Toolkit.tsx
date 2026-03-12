export default function Toolkit() {
  return (
    <section className="toolkit-section container">
      <h2 className="section-title">The Toolkit</h2>
      <div className="toolkit-icons">
        <div className="toolkit-icon ts-icon">TS</div>
        <div className="toolkit-icon next-icon">N</div>
        <div className="toolkit-icon rust-icon">R</div>
        <div className="toolkit-icon github-icon">GH</div>
        <div className="toolkit-icon solana-icon">
          <div className="sol-bar top"></div>
          <div className="sol-bar mid"></div>
          <div className="sol-bar bot"></div>
        </div>
        <div className="toolkit-icon figma-icon">
          <div className="fig-shape fig-red"></div>
          <div className="fig-shape fig-orange"></div>
          <div className="fig-shape fig-purple"></div>
          <div className="fig-shape fig-blue"></div>
          <div className="fig-shape fig-green"></div>
        </div>
      </div>
    </section>
  );
}
