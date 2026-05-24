'use client'
import { useEffect, useRef } from 'react'

const tech = [
  { name:'React', slug:'react' },
  { name:'Python', slug:'python' },
  { name:'TypeScript', slug:'typescript' },
  { name:'Java', slug:'java' },
  { name:'AWS', slug:'amazonwebservices' },
  { name:'Firebase', slug:'firebase' },
  { name:'PostgreSQL', slug:'postgresql' },
  { name:'Flutter', slug:'flutter' },
  { name:'Next.js', slug:'nextdotjs' },
  { name:'GitHub', slug:'github' },
]

const icon = (slug:string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`

export default function Marquee() {
  const doubled = [...tech, ...tech]
  return (
    <section style={{padding:'3rem 0',borderTop:'1px solid #1F1F1F',borderBottom:'1px solid #1F1F1F',background:'rgba(17,17,17,0.5)'}}>
      <div className="marquee-wrap">
        <div className="marquee-track">
          {doubled.map((t,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem',minWidth:'80px'}}>
              <img
                src={icon(t.slug)}
                alt={t.name}
                width={40} height={40}
                style={{opacity:0.8,filter:'brightness(0.9)'}}
                onError={(e)=>{ (e.target as HTMLImageElement).style.display='none' }}
              />
              <span style={{fontSize:'0.7rem',color:'#9CA3AF',whiteSpace:'nowrap'}}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
