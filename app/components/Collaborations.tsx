const collabs = [
  { id: 1, name: 'Superteamng', role: 'Core Member. Creator', color: '#14F195' },
  { id: 2, name: 'Arcium', role: 'Contributor', color: '#9945FF' },
  { id: 3, name: 'Superteam Earn', role: 'Creator', color: '#14F195' },
  { id: 4, name: 'Skate Chain', role: 'Contributor', color: '#00FF00' },
  { id: 5, name: 'Xpow', role: 'Dev. Partner', color: '#00AAAA' },
  { id: 6, name: 'Warden Protocol', role: 'Contributor', color: '#A3E000' },
  { id: 7, name: 'Nosana Ai', role: 'Builder. Creator. Ambassador', color: '#00FF00' },
  { id: 8, name: 'Getblock', role: 'Creator. Ambassador', color: '#0055FF' },
  { id: 9, name: 'Scribble Dao', role: 'Creator', color: '#AAFF00' },
  { id: 10, name: 'Regenerates', role: 'Dev. Member', color: '#00FF88' },
  { id: 11, name: 'Solana Collective', role: 'Creator', color: '#14F195' },
  { id: 12, name: 'Web3 Kingsmen', role: 'Co-Founder. Moderator', color: '#0088FF' },
];

export default function Collaborations() {
  return (
    <section className="collaborations-section container" style={{ padding: '4rem 0' }}>
      <h2 className="section-title">Collaborations</h2>
      <div className="collaborations-grid">
        {collabs.map((collab) => (
          <div key={collab.id} className="collab-item">
            <div className="collab-icon-box" style={{ backgroundColor: collab.color }}></div>
            <h4 className="collab-title">{collab.name}</h4>
            <p className="collab-role">{collab.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
