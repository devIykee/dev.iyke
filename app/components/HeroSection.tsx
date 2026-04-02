import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="hero-section container">
      <div className="hero-content">
        <h1 className="hero-title">
          Hello, I&apos;m <span className="text-accent">Iyke</span>
        </h1>
        <p className="hero-subtitle">
          ...Architecting Scalable, Logic-Driven Systems
        </p>
        <div className="hero-actions">
          <button className="btn btn-outline">Hire Me!</button>
          <button className="btn btn-primary">Resume</button>
        </div>
      </div>
      <div className="hero-image-wrapper">
        <Image
          src="/iyke-profile.jpg"
          alt="Iyke"
          width={400}
          height={400}
          className="hero-image"
          priority
        />
      </div>
    </section>
  );
}
