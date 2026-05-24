type Exp  = { id?:string; company:string; role:string; period:string; type?:string; location?:string; highlights:string[]; tech:string[] }
type Cert = { id?:string; name:string; issuer:string }
type Props = { experience?: Exp[]; certifications?: Cert[] }

const DEFAULT_EXP: Exp[] = [
  { company:'iStudio', role:'AWS Cloud Intern', period:'Nov 2025 – Dec 2025', type:'INTERNSHIP',
    highlights:['Worked with EC2, S3, IAM, VPC, Lambda','Gained practical cloud deployment fundamentals','Completed AWS Cloud Training Program'],
    tech:['AWS','EC2','S3','Lambda'] },
  { company:'Emglitz Technologies', role:'Java Developer Intern', period:'Feb 2024 – Mar 2024', type:'INTERNSHIP', location:'Coimbatore',
    highlights:['Developed Java backend modules using OOP','Collaborated in Agile sprints with daily standups','Wrote unit tests and participated in code reviews'],
    tech:['Java','OOP','Agile','Git'] },
]
const DEFAULT_CERTS: Cert[] = [
  { name:'AWS Cloud Training Program', issuer:'iStudio / Amazon Web Services' },
  { name:'Cloud Computing', issuer:'NPTEL' },
  { name:'Introduction to Generative AI', issuer:'IBM SkillsBuild' },
  { name:'Cyber Security Fundamentals', issuer:'IBM SkillsBuild' },
]

export default function Experience({ experience: propExp, certifications: propCerts }: Props) {
  const exp = propExp ?? DEFAULT_EXP
  const certs = propCerts ?? DEFAULT_CERTS
  return (
    <section id="experience" className="section" style={{borderBottom:'1px solid #1F1F1F'}}>
      <div className="container">
        <h2 className="section-title">Experience &amp; <span>Education</span></h2>
        <div className="section-divider"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem'}}>
          <div>
            <h3 style={{color:'#C2A878',fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'1.5rem'}}>Work Experience</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
              {exp.map(e=>(
                <div key={e.id ?? e.company} className="timeline-line">
                  <div className="timeline-dot"/>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.4rem',flexWrap:'wrap',gap:'0.5rem'}}>
                    <div>
                      <div style={{fontWeight:700,color:'#EAEAEA',fontSize:'1rem'}}>{e.role}</div>
                      <div style={{color:'#9CA3AF',fontSize:'0.85rem'}}>{e.company}{e.location?` · ${e.location}`:''}</div>
                    </div>
                    <span className="pill">{e.period}</span>
                  </div>
                  <ul style={{color:'#9CA3AF',fontSize:'0.82rem',lineHeight:1.7,paddingLeft:'1rem',marginBottom:'0.75rem'}}>
                    {e.highlights.map(h=><li key={h}>{h}</li>)}
                  </ul>
                  <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                    {e.tech.map(t=><span key={t} className="pill">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{color:'#C2A878',fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',margin:'2.5rem 0 1.5rem'}}>Education</h3>
            <div className="card">
              <div style={{fontWeight:700,color:'#EAEAEA',marginBottom:'0.25rem'}}>B.Tech — AI &amp; Data Science</div>
              <div style={{color:'#C2A878',fontSize:'0.85rem',marginBottom:'0.25rem'}}>Dhanalakshmi Srinivasan College of Engineering</div>
              <div style={{color:'#9CA3AF',fontSize:'0.8rem'}}>Coimbatore · 2022–2026 · <span style={{color:'#C2A878',fontWeight:600}}>CGPA: 8.5</span></div>
            </div>
          </div>

          <div>
            <h3 style={{color:'#C2A878',fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'1.5rem'}}>Certifications</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {certs.map(c=>(
                <div key={c.id ?? c.name} className="card" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'8px',background:'rgba(194,168,120,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>🏅</div>
                  <div>
                    <div style={{fontWeight:600,color:'#EAEAEA',fontSize:'0.9rem'}}>{c.name}</div>
                    <div style={{color:'#C2A878',fontSize:'0.78rem',marginTop:'0.2rem'}}>{c.issuer}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{color:'#C2A878',fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',margin:'2.5rem 0 1.5rem'}}>Activities</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {[
                {icon:'💻',t:'College Coding Club Member',d:'Organized hackathons and mentored juniors'},
                {icon:'🏆',t:'Hackathon Winner',d:'Won top prizes and earned internship offers'},
                {icon:'🔓',t:'Open Source Contributor',d:'Published backend & cloud projects on GitHub'},
              ].map(a=>(
                <div key={a.t} className="card" style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.3rem'}}>{a.icon}</span>
                  <div><div style={{color:'#EAEAEA',fontWeight:600,fontSize:'0.9rem'}}>{a.t}</div><div style={{color:'#9CA3AF',fontSize:'0.8rem',marginTop:'0.2rem'}}>{a.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#experience .container>div:last-child{grid-template-columns:1fr!important;gap:2rem!important}}`}</style>
    </section>
  )
}
