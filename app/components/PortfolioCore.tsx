import Image from 'next/image';

const projects = [
  { id: 1, title: 'Yokohama', desc: "Yokohama is located in the centre of Japan, along the coastline of Japan's Pacific Ocean." },
  { id: 2, title: 'Yokohama', desc: "Yokohama is located in the centre of Japan, along the coastline of Japan's Pacific Ocean." },
  { id: 3, title: 'Yokohama', desc: "Yokohama is located in the centre of Japan, along the coastline of Japan's Pacific Ocean." },
];

export default function PortfolioCore() {
  return (
    <section className="portfolio-section container">
      <h2 className="section-title">Portfolio Core</h2>
      <div className="portfolio-grid">
        {projects.map((project) => (
          <div key={project.id} className="portfolio-card">
            <Image
              src="/yokohama_cityscape.png"
              alt={project.title}
              width={400}
              height={200}
              className="portfolio-image"
            />
            <h3 className="portfolio-title">{project.title}</h3>
            <p className="portfolio-desc">{project.desc}</p>
            <div className="portfolio-actions">
              <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Explore</button>
            </div>
          </div>
        ))}
      </div>
      <div className="view-more-container">
        <button className="btn btn-outline" style={{ borderRadius: '20px' }}>View More</button>
      </div>
    </section>
  );
}
