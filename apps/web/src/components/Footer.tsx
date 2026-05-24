'use client'

type Profile = { name?:string; email?:string; linkedin?:string; github?:string; openToWork?:boolean }
type Props = { profile?: Profile }

export default function Footer({ profile }: Props) {
  const name = profile?.name ?? 'Abarna Sivakumar'
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
  const github = profile?.github ?? 'https://github.com/abarnasivakumar'
  const linkedin = profile?.linkedin ?? 'https://linkedin.com/in/abarnasivakumar'
  const email = profile?.email ?? 'abarnasivakumar15@gmail.com'

  return (
    <footer style={{borderTop:'1px solid #1F1F1F',padding:'2.5rem 1.5rem',textAlign:'center'}}>
      <div style={{color:'#C2A878',fontWeight:700,fontSize:'1.25rem',letterSpacing:'0.05em',marginBottom:'0.5rem'}}>{initials}.</div>
      <p style={{color:'#9CA3AF',fontSize:'0.82rem',marginBottom:'1.25rem'}}>
        {profile?.openToWork !== false ? 'Open to full-time opportunities from 2026' : name}
      </p>
      <div style={{display:'flex',gap:'1.25rem',justifyContent:'center',marginBottom:'1.5rem'}}>
        {[
          {label:'GitHub',href:github},
          {label:'LinkedIn',href:linkedin},
          {label:'Email',href:`mailto:${email}`},
        ].map(s=>(
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{color:'#9CA3AF',fontSize:'0.82rem',textDecoration:'none',transition:'color 0.2s'}}
            onMouseEnter={e=>(e.target as HTMLElement).style.color='#C2A878'}
            onMouseLeave={e=>(e.target as HTMLElement).style.color='#9CA3AF'}>
            {s.label}
          </a>
        ))}
      </div>
      <p style={{color:'#4B5563',fontSize:'0.75rem'}}>
        © 2026 {name}. Built with Next.js &amp; ♥
      </p>
    </footer>
  )
}
