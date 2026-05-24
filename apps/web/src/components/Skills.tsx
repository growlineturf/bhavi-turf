'use client'
import { useState } from 'react'

type Skill = { id?:string; name:string; category:string; proficiency:number; iconSlug:string }
type Props = { skills?: Skill[] }

const DEFAULT_SKILLS: Skill[] = [
  { name:'Java', category:'LANGUAGE', proficiency:85, iconSlug:'java' },
  { name:'Python', category:'LANGUAGE', proficiency:80, iconSlug:'python' },
  { name:'JavaScript', category:'LANGUAGE', proficiency:78, iconSlug:'javascript' },
  { name:'TypeScript', category:'LANGUAGE', proficiency:72, iconSlug:'typescript' },
  { name:'React.js', category:'FRAMEWORK', proficiency:82, iconSlug:'react' },
  { name:'HTML5', category:'FRAMEWORK', proficiency:90, iconSlug:'html5' },
  { name:'CSS3', category:'FRAMEWORK', proficiency:85, iconSlug:'css3' },
  { name:'Flutter', category:'FRAMEWORK', proficiency:70, iconSlug:'flutter' },
  { name:'PostgreSQL', category:'DATABASE', proficiency:75, iconSlug:'postgresql' },
  { name:'MySQL', category:'DATABASE', proficiency:78, iconSlug:'mysql' },
  { name:'Firebase', category:'DATABASE', proficiency:80, iconSlug:'firebase' },
  { name:'AWS', category:'CLOUD', proficiency:70, iconSlug:'amazonwebservices' },
  { name:'GitHub', category:'TOOL', proficiency:85, iconSlug:'github' },
  { name:'VS Code', category:'TOOL', proficiency:92, iconSlug:'vscode' },
]

const cats = ['ALL','LANGUAGE','FRAMEWORK','DATABASE','CLOUD','TOOL']

export default function Skills({ skills: propSkills }: Props) {
  const skills = propSkills ?? DEFAULT_SKILLS
  const [active, setActive] = useState('ALL')
  const filtered = active==='ALL' ? skills : skills.filter(s=>s.category===active)
  return (
    <section id="skills" className="section" style={{borderBottom:'1px solid #1F1F1F'}}>
      <div className="container">
        <h2 className="section-title">Tech <span>Skills</span></h2>
        <div className="section-divider"/>
        <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'2.5rem'}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setActive(c)}
              style={{background:active===c?'#C2A878':'transparent',color:active===c?'#0A0A0A':'#9CA3AF',border:`1px solid ${active===c?'#C2A878':'#1F1F1F'}`,borderRadius:'999px',padding:'0.35rem 1rem',fontSize:'0.78rem',fontWeight:500,cursor:'pointer',transition:'all 0.2s'}}>
              {c}
            </button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'1rem'}}>
          {filtered.map(s=>(
            <div key={s.id ?? s.name} className="card" style={{textAlign:'center'}}>
              <img
                src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s.iconSlug}/${s.iconSlug}-original.svg`}
                alt={s.name} width={40} height={40}
                style={{margin:'0 auto 0.75rem',display:'block'}}
                onError={e=>{(e.target as HTMLImageElement).style.display='none'}}
              />
              <div style={{fontSize:'0.85rem',fontWeight:600,color:'#EAEAEA',marginBottom:'0.25rem'}}>{s.name}</div>
              <span className="pill" style={{fontSize:'0.65rem'}}>{s.category}</span>
              <div className="prof-bar" style={{marginTop:'0.75rem'}}>
                <div className="prof-fill" style={{width:`${s.proficiency}%`}}/>
              </div>
              <div style={{fontSize:'0.65rem',color:'#9CA3AF',marginTop:'0.25rem'}}>{s.proficiency}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
