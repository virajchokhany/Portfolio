import { Component, HostListener, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type SectionId =
  | 'home'
  | 'skills'
  | 'experience'
  | 'achievements'
  | 'projects'
  | 'education'
  | 'contact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.dark.set(this.readTheme());
    }
  }
  private sanitizer = inject(DomSanitizer);

  viewerOpen = signal(false);
  viewerType = signal<'image' | 'pdf'>('image');
  viewerTitle = signal('Preview');

  // For images
  viewerImgSrc = signal<string>('');

  // For PDFs (Angular requires SafeResourceUrl)
  viewerPdfSrc = signal<SafeResourceUrl>('' as any);

  openViewer(type: 'image' | 'pdf', src: string, title: string) {
    this.viewerType.set(type);
    this.viewerTitle.set(title);

    if (type === 'pdf') {
      this.viewerPdfSrc.set(this.sanitizer.bypassSecurityTrustResourceUrl(src));
      this.viewerImgSrc.set('');
    } else {
      this.viewerImgSrc.set(src);
      this.viewerPdfSrc.set('' as any);
    }

    this.viewerOpen.set(true);
  }

  closeViewer() {
    this.viewerOpen.set(false);
    this.viewerImgSrc.set('');
    this.viewerPdfSrc.set('' as any);
    this.viewerTitle.set('Preview');
    this.viewerType.set('image');
  }

  private platformId = inject(PLATFORM_ID);
  // ------- THEME -------
  dark = signal<boolean>(false);
  toggleTheme() {
    if (!isPlatformBrowser(this.platformId)) return;

    const next = !this.dark();
    this.dark.set(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }


  private readTheme(): boolean {
  if (!isPlatformBrowser(this.platformId)) {
    return false; // server-side safe default
  }

  const saved = localStorage.getItem('theme');
  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const isDark = saved ? saved === 'dark' : true; 
  document.documentElement.classList.toggle('dark', isDark);
  return isDark;
}


  // ------- ACTIVE NAV -------
  active = signal<SectionId>('home');

  private readonly navOffset = 110; // a bit more than navbar height

  @HostListener('window:scroll')
  onScroll() {
    const ids: SectionId[] = ['home','skills','experience','achievements','projects','education','contact'];

    const scrollTop = window.scrollY;
    const viewportBottom = scrollTop + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // If near bottom, force highlight contact (common scrollspy edge case)
    if (viewportBottom >= docHeight - 5) {
      this.active.set('contact');
      return;
    }

    const current = scrollTop + this.navOffset;

    let active: SectionId = 'home';
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= current) active = id;
    }
    this.active.set(active);
  }



  scrollTo(id: SectionId) {
      const el = document.getElementById(id);
      if (!el) return;

      // If contact, scroll to page bottom so the section is definitely reached
      if (id === 'contact') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        return;
      }

      const top = el.offsetTop - (this.navOffset - 10);
      window.scrollTo({ top, behavior: 'smooth' });
    }


  lightboxOpen = signal(false);
  lightboxSrc = signal<string>('');
  lightboxAlt = signal<string>('Certificate');

  openImage(src: string, alt: string) {
    this.lightboxSrc.set(src);
    this.lightboxAlt.set(alt);
    this.lightboxOpen.set(true);
  }

  closeImage() {
    this.lightboxOpen.set(false);
    this.lightboxSrc.set('');
    this.lightboxAlt.set('Certificate');
  }

  // ------- CONTENT (edit anytime) -------
  profile = {
    name: 'Viraj Chokhany',
    title: 'SDE -2 @ Microsoft | Full Stack | DSA | Microservices | System Design | Distributed Systems | Azure | AI' ,
    location: 'India',
    email: 'viraj.chokhany@gmail.com',
    phone: '8335896971',
    summary: [
      'Full-stack software developer with 4.5 years of experience designing and implementing scalable, high-performance applications in Agile environments.',
      'Backend-leaning engineer with strong focus on distributed systems, resiliency, and platform reliability - plus solid UI delivery with Angular.'
    ],
    links: {
      linkedin: 'https://www.linkedin.com/in/viraj-chokhany-262b041b1/',
      github: 'https://github.com/virajchokhany',
      leetcode: 'https://leetcode.com/u/user1026v/',
      twitter: 'https://x.com/viraj_chokhany',
      resume: 'https://drive.google.com/file/d/11r6o6JIYhgFAPRPUVx6Jeb5V3HxThAPr/view?usp=sharing',
    },
    photo: 'assets/viraj.jpg'
  };

  highlights = [
    { label: 'Feature Flags', value: '6,000 Flights • 5T Evaluations/day • Microsecond Latency' },
    { label: 'Scale', value: '400k VMs • 2,000 farms • 99.99% Availability Target' },
    { label: 'Enterprise Ops', value: '20,000+ servers • Automation • Patching Orchestration' },
  ];

  skills = [
    {
      title: 'Backend',
      items: ['.NET', 'C#', 'Java', 'Microservices', 'REST APIs', 'WebSocket (Socket.IO)', 'Concurrency & Multithreading', 'Node.js']
    },
    {
      title: 'Frontend',
      items: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS']
    },
    {
      title: 'Cloud & DevOps',
      items: ['Azure', 'Azure DevOps', 'CI/CD', 'Azure Service Bus']
    },
    {
      title: 'Databases & Systems',
      items: ['SQL', 'PostgreSQL', 'MongoDB', 'Distributed Systems', 'Event-Driven Architecture']
    }
  ];

  experience = [
    {
      company: 'Microsoft',
      team: 'OneDrive and SharePoint (ODSP)',
      role: 'Software Engineer 2',
      dates: 'Oct 2025 – Present',
      bullets: [
        'Designed and contributed to a feature flag management solution supporting 6,000 flags and ~5 trillion evaluations/day, optimized for microsecond-level latency.',
        'Built platform SDK and optimized configuration propagation across ~400k VMs across 2,000 farms for fast, consistent rollouts.',
        'Implemented multi-layer resiliency with fallback mechanisms enabling zero-disruption evaluations during partial outages.',
        'Drove reliability improvements helping sustain 99.99% availability targets via caching, fallback paths, and read-optimized patterns.',
        'Designed the platform to be extensible beyond ODSP for broader adoption across MS E+D.'
      ],
      tech: ['C#', '.NET', 'Azure', 'Distributed Systems', 'Caching', 'Reliability']
    },
    {
      company: 'Schlumberger (SLB)',
      team: 'Maintenance Window Management (MWM)',
      role: 'Software Engineer 2',
      dates: 'Aug 2021 – Oct 2025',
      bullets: [
        'Architected and developed a microservices solution to manage patching and maintenance for 20,000+ Windows/Linux servers.',
        'Implemented OAuth 2.0 sign-in with Azure AD integrated with RBAC.',
        'Built scalable APIs + scheduling to sync patching via Apigee, achieving 88% patch success, 92% reboot success, and 70% fewer reschedules.',
        'Automated monitoring integrations reducing manual ticket creation by 82%.',
        'Led reboot compliance system using Azure Service Bus, achieving 100% cybersecurity policy adherence for 20,000+ servers.',
        'Developed a maintenance page with “Notify Me” serving 55,000+ users and ~12,000 daily visits.',
        'Built a chatbot widget powered by a Copilot AI Agent with SSO integration.'
      ],
      tech: ['Angular', 'TypeScript', '.NET/C#', 'Microservices', 'Azure Service Bus', 'Azure AD', 'MongoDB', 'Apigee', 'HLD', 'LLD']
    }
  ];

  professionalAchievements = [
    {
      title: 'Reward of Excellence (ROE) Award',
      org: 'SLB',
      note: 'Awarded for impact and contribution during my time at SLB.',
      certs: [
        { label: 'Above And Beyond Award 2022 Q3', type: 'pdf', url: 'assets/AboveAndBeyondQ32022.pdf', thumb: 'assets/AboveAndBeyondQ32022.png' },
        { label: 'Above And Beyond Award 2022 Q4', type: 'pdf', url: 'assets/AboveAndBeyondQ42022.pdf', thumb: 'assets/AboveAndBeyondQ42022.png' },
        { label: 'Champion Team Award 2022', type: 'pdf', url: 'assets/ChampionTeamDec2022.pdf', thumb: 'assets/ChampionTeamDec2022.png' },
      ]
    }
  ];
  educationAchievements = [
    {
      title: '3rd Rank in Branch',
      org: 'VIT (ECE)',
      note: 'Awarded 3rd rank in branch for academic performance.',
      cert: { label: 'Rank Certificate', type: 'image', url: 'assets/vit-rank.jpeg' }
    }
  ];
  projects = [
    {
      name: 'Real-Time Chat Application',
      tagline: 'Real-time chat with auth, group messaging, and Socket.IO communication.',
      stack: ['Angular', 'Node.js', 'Express', 'Socket.IO', 'MongoDB', 'MSAL'],
      links: {
        live: '#',     // add your live demo URL
        github: 'https://github.com/virajchokhany/Realtime-Chat-App',   // add your repo URL
        demo: 'https://drive.google.com/file/d/1al7NfJ_FaVwnCYcbZLTkkmgTG9ZWlri-/view',     // add demo video URL if any
      },
      bullets: [
        'Built a real-time chat system with authentication, group messaging, and WebSocket-based communication.',
        'Designed for responsive UX and scalable messaging patterns.'
      ]
    },
    {
      name: 'File System Organizer (CLI)',
      tagline: 'CLI tool to organize files and render directory tree views.',
      stack: ['Node.js', 'JavaScript'],
      links: {
        github: 'https://github.com/virajchokhany/File-System-Organiser'
      },
      bullets: [
        'Developed a CLI that organizes directories and prints tree structures.',
        'Improved speed of repetitive file management tasks.'
      ]
    }
  ];

  education = {
    degree: 'B.Tech – Electronics & Communication Engineering',
    institute: 'Vellore Institute of Technology, Vellore',
    year: 'May 2021',
    score: 'CGPA 9.57',
    note: '3rd rank in branch'
  };

  year = new Date().getFullYear();

  // Derived helpers
  navItems = computed(() => ([
    { id: 'home' as SectionId, label: 'Intro' },
    { id: 'skills' as SectionId, label: 'Skills' },
    { id: 'experience' as SectionId, label: 'Experience' },
    { id: 'achievements' as SectionId, label: 'Achievements' },
    { id: 'projects' as SectionId, label: 'Projects' },
    { id: 'education' as SectionId, label: 'Education' },
    { id: 'contact' as SectionId, label: 'Contact' },
  ]));
}
