'use client'
import { useState } from 'react'

type Profile = { name?:string; email?:string; linkedin?:string; github?:string; openToWork?:boolean }
type Props = { profile?: Profile }

export default function Contact({ profile }: Props) {
  const email = profile?.email ?? 'abarnasivakumar15@gmail.com'
  const linkedin = profile?.linkedin ?? 'https://linkedin.com/in/abarnasivakumar'
  const github = profile?.github ?? 'https://github.com/abarnasivakumar'
  const linkedinDisplay = linkedin.replace('https://', '').replace('http://', '')
  const githubDisplay = github.replace('https://', '').replace('http://', '')

  const [form, setForm] = useState({name:'',email:'',subject:'',message:''})
  const [status, setStatus] = useState<'idle'|'sending'|'done'|'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!form.name||!form.email||form.message.length<20) return
    setStatus('sending')
    try {
      await new Promise(r=>setTimeout(r,1000))
      setStatus('done')
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Let's <span>Connect</span></h2>
        <div className="section-divider"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'4rem',alignItems:'start'}}>
          <div>
            <p style={{color:'#9CA3AF',lineHeight:1.8,marginBottom:'2rem'}}>I'm actively seeking full-time opportunities from 2026. Whether you have a project in mind, a question, or just want to say hi — my inbox is always open.</p>
            {[
              {icon:'📧',label:'Email',val:email,href:`mailto:${email}`},
              {icon:'💼',label:'LinkedIn',val:linkedinDisplay,href:linkedin},
              {icon:'🐙',label:'GitHub',val:githubDisplay,href:github},
            ].map(c=>(
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="card" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'0.75rem',textDecoration:'none'}}>
                <span style={{fontSize:'1.4rem'}}>{c.icon}</span>
                <div><div style={{fontSize:'0.75rem',color:'#9CA3AF'}}>{c.label}</div><div style={{color:'#EAEAEA',fontSize:'0.88rem',fontWeight:500}}>{c.val}</div></div>
              </a>
            ))}
          </div>
          <div>
            {status==='done' ? (
              <div className="card" style={{textAlign:'center',padding:'3rem'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>✓</div>
                <div style={{color:'#C2A878',fontWeight:600,fontSize:'1.1rem'}}>Message sent!</div>
                <div style={{color:'#9CA3AF',marginTop:'0.5rem'}}>I'll get back to you soon.</div>
              </div>
            ) : (
              <form onSubmit={submit} className="card" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <label style={{display:'block',fontSize:'0.78rem',color:'#9CA3AF',marginBottom:'0.4rem'}}>Name *</label>
                    <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required
                      style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1F1F1F',borderRadius:'8px',padding:'0.65rem 0.9rem',color:'#EAEAEA',fontSize:'0.9rem',outline:'none'}} placeholder="Your name"/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'0.78rem',color:'#9CA3AF',marginBottom:'0.4rem'}}>Email *</label>
                    <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required
                      style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1F1F1F',borderRadius:'8px',padding:'0.65rem 0.9rem',color:'#EAEAEA',fontSize:'0.9rem',outline:'none'}} placeholder="hello@example.com"/>
                  </div>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.78rem',color:'#9CA3AF',marginBottom:'0.4rem'}}>Subject</label>
                  <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}
                    style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1F1F1F',borderRadius:'8px',padding:'0.65rem 0.9rem',color:'#EAEAEA',fontSize:'0.9rem',outline:'none'}} placeholder="Job opportunity"/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:'0.78rem',color:'#9CA3AF',marginBottom:'0.4rem'}}>Message * (min 20 chars)</label>
                  <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required rows={5}
                    style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid #1F1F1F',borderRadius:'8px',padding:'0.65rem 0.9rem',color:'#EAEAEA',fontSize:'0.9rem',outline:'none',resize:'vertical'}} placeholder="Hi, I'd love to connect about..."/>
                </div>
                {status==='error'&&<p style={{color:'#EF4444',fontSize:'0.82rem'}}>Something went wrong. Please try again.</p>}
                <button type="submit" disabled={status==='sending'} className="btn-gold" style={{alignSelf:'flex-start',opacity:status==='sending'?0.7:1}}>
                  {status==='sending'?'Sending…':'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#contact .container>div:last-child{grid-template-columns:1fr!important;gap:2rem!important}}`}</style>
    </section>
  )
}
