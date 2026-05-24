'use client'
import { useState } from 'react'

type Project = {
  id?: string; title:string; problem:string; solution:string
  description:string; techStack:string[]; tags:string[]
  githubUrl:string; liveUrl:string; featured?:boolean
}
type Props = { projects?: Project[] }

const DEFAULT_PROJECTS: Project[] = [
  {
    title:'ElevIQ — GenAI Financial Assistant',
    problem:'Managing personal finances is complex with no intelligent, personalized tools.',
    solution:'AI-powered finance assistant with OCR receipt analysis and Gemini-driven guidance.',
    techStack:['TypeScript','Firebase','Google Gemini','React.js'],
    tags:['AI','Finance','Full-Stack'],
    githubUrl:'https://github.com/abarnasivakumar/eleviq',
    liveUrl:'',
    description:`ElevIQ is a full-stack GenAI application that transforms how individuals track finances.\n\nKey Features:\n- OCR-based Receipt Analysis — AI extracts structured data automatically\n- Google Gemini AI for personalized financial guidance\n- Real-time analytics dashboards with spending patterns\n- Categorized transaction management`,
    featured: true,
  },
  {
    title:'LetBuyy — E-Commerce Platform',
    problem:'Building a secure e-commerce experience with real payment integration is complex.',
    solution:'React e-commerce app with cart, wishlist, Razorpay integration, and Firebase auth.',
    techStack:['React.js','Firebase','Razorpay','JavaScript'],
    tags:['E-Commerce','React','Payments'],
    githubUrl:'https://github.com/abarnasivakumar/letbuyy',
    liveUrl:'',
    description:`LetBuyy is a full-featured e-commerce web application.\n\nKey Features:\n- Product catalog with search and filter\n- Cart & Wishlist with persistent state\n- Razorpay payments with webhook handling\n- Firebase Auth for secure user management`,
    featured: true,
  },
]

export default function Projects({ projects: propProjects }: Props) {
  const projects = propProjects ?? DEFAULT_PROJECTS
  const [modal, setModal] = useState<Project|null>(null)
  return (
    <section id="projects" className="section" style={{borderBottom:'1px solid #1F1F1F'}}>
      <div className="container">
        <h2 className="section-title">Selected <span>Work</span></h2>
        <div className="section-divider"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'1.5rem'}}>
          {projects.map(p=>(
            <div key={p.id ?? p.title} className="card" style={{cursor:'pointer'}} onClick={()=>setModal(p)}>
              <div style={{marginBottom:'1rem'}}>
                {p.tags.map(t=><span key={t} className="pill" style={{marginRight:'0.4rem'}}>{t}</span>)}
                {p.featured && <span className="pill" style={{marginRight:'0.4rem',background:'rgba(194,168,120,0.15)'}}>★ Featured</span>}
              </div>
              <h3 style={{fontSize:'1.05rem',fontWeight:700,color:'#EAEAEA',marginBottom:'0.75rem'}}>{p.title}</h3>
              <p style={{fontSize:'0.82rem',color:'#9CA3AF',marginBottom:'0.35rem'}}>
                <span style={{color:'#C2A878',fontWeight:600}}>Problem — </span>{p.problem}
              </p>
              <p style={{fontSize:'0.82rem',color:'#9CA3AF',marginBottom:'1.25rem'}}>
                <span style={{color:'#C2A878',fontWeight:600}}>Solution — </span>{p.solution}
              </p>
              <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
                {p.techStack.map(t=><span key={t} className="pill">{t}</span>)}
              </div>
              <div style={{display:'flex',gap:'0.75rem',borderTop:'1px solid #1F1F1F',paddingTop:'1rem'}}>
                {p.githubUrl&&<a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{fontSize:'0.8rem',padding:'0.4rem 0.9rem'}} onClick={e=>e.stopPropagation()}>GitHub ↗</a>}
                {p.liveUrl&&<a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{fontSize:'0.8rem',padding:'0.4rem 0.9rem'}} onClick={e=>e.stopPropagation()}>Live Demo ↗</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {modal&&(
        <div onClick={()=>setModal(null)} style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.95)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#111111',border:'1px solid #1F1F1F',borderRadius:'16px',maxWidth:'640px',width:'100%',maxHeight:'85vh',overflow:'auto',padding:'2rem',position:'relative'}}>
            <button onClick={()=>setModal(null)} style={{position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',color:'#9CA3AF',fontSize:'1.5rem',cursor:'pointer'}}>✕</button>
            <div style={{marginBottom:'1rem'}}>{modal.tags.map(t=><span key={t} className="pill" style={{marginRight:'0.4rem'}}>{t}</span>)}</div>
            <h2 style={{fontSize:'1.35rem',fontWeight:700,color:'#EAEAEA',marginBottom:'1rem'}}>{modal.title}</h2>
            <div style={{color:'#9CA3AF',lineHeight:1.8,fontSize:'0.9rem',whiteSpace:'pre-line'}}>{modal.description}</div>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',margin:'1.25rem 0'}}>
              {modal.techStack.map(t=><span key={t} className="pill">{t}</span>)}
            </div>
            <div style={{display:'flex',gap:'0.75rem'}}>
              {modal.githubUrl&&<a href={modal.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">GitHub ↗</a>}
              {modal.liveUrl&&<a href={modal.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">Live Demo ↗</a>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
