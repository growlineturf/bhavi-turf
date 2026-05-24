export default function About() {
  return (
    <section id="about" className="section" style={{borderBottom:'1px solid #1F1F1F'}}>
      <div className="container">
        <h2 className="section-title">About <span>Me</span></h2>
        <div className="section-divider"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div>
            <p style={{color:'#9CA3AF',lineHeight:1.9,fontSize:'1rem',marginBottom:'1.5rem'}}>
              I'm an ambitious software developer pursuing B.Tech in <span style={{color:'#C2A878'}}>Artificial Intelligence & Data Science</span> (2026) at Dhanalakshmi Srinivasan College of Engineering, Coimbatore.
            </p>
            <p style={{color:'#9CA3AF',lineHeight:1.9,fontSize:'1rem',marginBottom:'2rem'}}>
              With hands-on experience in Java, Python, React.js, and AWS, I have a strong foundation in object-oriented programming, web development, and database management — with a passion for building scalable, secure applications.
            </p>
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
              {['Salem, Tamil Nadu 📍','abarnasivakumar15@gmail.com 📧'].map(t=>(
                <span key={t} className="pill">{t}</span>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {[
              {n:'8.5',l:'CGPA',d:'B.Tech AI & DS'},
              {n:'2+',l:'Projects',d:'Live & on GitHub'},
              {n:'2',l:'Internships',d:'AWS & Java Dev'},
              {n:'4',l:'Certifications',d:'IBM, NPTEL, AWS'},
            ].map(({n,l,d})=>(
              <div key={l} className="card" style={{textAlign:'center'}}>
                <div style={{fontSize:'2.25rem',fontWeight:800,color:'#C2A878',lineHeight:1}}>{n}</div>
                <div style={{fontSize:'0.85rem',fontWeight:600,color:'#EAEAEA',marginTop:'0.4rem'}}>{l}</div>
                <div style={{fontSize:'0.7rem',color:'#9CA3AF',marginTop:'0.2rem'}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#about .container>div{grid-template-columns:1fr!important;gap:2rem!important}}`}</style>
    </section>
  )
}
