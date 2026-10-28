/**
 * In-App Embedded Mock Backend (Zero-Sleeping Portfolio Mode)
 * Provides 100% offline & cloud functionality on Vercel without requiring an active server.
 * Recruiter & Evaluator Ready: Full state persistence in localStorage.
 */

export interface MockProfile {
  id: number
  userId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  preferredWorkMode: string
  noticePeriodDays: number
  expectedCtc: number
  workAuthorization: string
  linkedinUrl: string
  githubUrl: string
  portfolioUrl: string
  bio: string
  avatarUrl?: string
}

export interface MockResume {
  id: number
  userId: number
  version: number
  label: string
  isPrimary: boolean
  source: string
  fileName: string
  mimeType: string
  atsScore: number
  createdAt: string
  parsedJson: {
    contact: { name: string; email: string; phone: string; location: string }
    summary: string
    skills: string[]
    experience: Array<{
      company: string
      title: string
      start: string
      end: string
      bullets: string[]
    }>
    education: Array<{
      institution: string
      degree: string
      field: string
      start: string
      end: string
      gpa: string
    }>
    projects?: Array<{
      name: string
      description: string
      tech: string[]
    }>
  }
}

export interface MockJob {
  id: number
  title: string
  company: string
  location: string
  workMode: string
  jobType: string
  experienceMin: number
  experienceMax: number
  salaryMin: number
  salaryMax: number
  description: string
  applyUrl: string
  postedAt: string
  skills: string[]
  overallScore?: number
  semanticScore?: number
}

export interface MockApplication {
  id: number
  jobId: number
  title: string
  company: string
  status: 'SAVED' | 'APPLIED' | 'UNDER_REVIEW' | 'INTERVIEW' | 'OFFER' | 'REJECTED'
  appliedAt: string
  updatedAt: string
  score?: number
}

// ── Default Showcase Jobs ──────────────────────────────────────────────────
export const INITIAL_JOBS: MockJob[] = [
  {
    id: 1,
    title: 'AI / Machine Learning Engineer (NLP & STS)',
    company: 'Sarvam AI',
    location: 'Bengaluru, India',
    workMode: 'HYBRID',
    jobType: 'FULL_TIME',
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 130000,
    salaryMax: 160000,
    skills: ['Python', 'PyTorch', 'NLP', 'Sentence-Transformers', 'pgvector', 'Cosine Similarity'],
    description: `Sarvam AI is building generative AI products for India.\n• Develop state-of-the-art Semantic Textual Similarity (STS) architectures using Sentence-BERT and multi-lingual embeddings.\n• Build vector database retrieval pipelines using pgvector with HNSW cosine distance indexing (<=>).\n• Fine-tune transformer models on domain-specific datasets to maximize semantic retrieval precision.\n• Collaborate with cross-functional teams to deploy scalable FastAPI microservices.`,
    applyUrl: 'https://sarvam.ai/careers',
    postedAt: 'Live',
    overallScore: 96,
    semanticScore: 94
  },
  {
    id: 2,
    title: 'Senior Java Backend Engineer (Microservices)',
    company: 'Razorpay',
    location: 'Remote',
    workMode: 'REMOTE',
    jobType: 'FULL_TIME',
    experienceMin: 3,
    experienceMax: 6,
    salaryMin: 115000,
    salaryMax: 145000,
    skills: ['Java 17', 'Spring Boot 3', 'PostgreSQL', 'Microservices', 'Docker', 'REST APIs'],
    description: `Razorpay power financial transactions for millions of businesses.\n• Design and maintain high-throughput backend services using Spring Boot 3 and Java 17.\n• Architect resilient relational schemas on PostgreSQL with indexing, partitioning, and connection pooling.\n• Build secure JWT-based authentication mechanisms and resilient asynchronous payment pipelines.\n• Ensure 99.99% system uptime through distributed logging, metrics, and automated tests.`,
    applyUrl: 'https://razorpay.com/jobs',
    postedAt: 'Live',
    overallScore: 91,
    semanticScore: 89
  },
  {
    id: 3,
    title: 'Full Stack Cloud & UI Specialist',
    company: 'Postman',
    location: 'Bengaluru / Remote',
    workMode: 'REMOTE',
    jobType: 'FULL_TIME',
    experienceMin: 2,
    experienceMax: 4,
    salaryMin: 105000,
    salaryMax: 135000,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs', 'Zustand'],
    description: `Postman is the leading API platform used by 30M+ developers worldwide.\n• Create intuitive, high-performance web interfaces with React 19, TypeScript, and modern component design systems.\n• Integrate interactive data visualization charts, responsive layouts, and accessible UI controls.\n• Collaborate on developer tooling, API client integrations, and state management pipelines.\n• Optimize bundle sizes, CWV performance, and client-side rendering speed.`,
    applyUrl: 'https://postman.com/careers',
    postedAt: 'Live',
    overallScore: 88,
    semanticScore: 86
  },
  {
    id: 4,
    title: 'NLP Research Specialist (Dense Embeddings)',
    company: 'DeepMind Ecosystem',
    location: 'Remote',
    workMode: 'REMOTE',
    jobType: 'CONTRACT',
    experienceMin: 3,
    experienceMax: 7,
    salaryMin: 150000,
    salaryMax: 185000,
    skills: ['Sentence-BERT', 'Cosine Similarity', 'Vector Databases', 'Transformers', 'Evaluation'],
    description: `Leading research on contextual text representations and neural semantic matching.\n• Benchmark dense vector embeddings against sparse TF-IDF representations on domain-specific corpora.\n• Formulate novel pooling strategies over transformer hidden states to optimize sentence embeddings.\n• Conduct empirical cosine similarity correlation studies across semantic benchmark datasets.\n• Publish findings, write reproducible codebases, and mentor engineering teams.`,
    applyUrl: 'https://deepmind.google/careers',
    postedAt: 'Live',
    overallScore: 98,
    semanticScore: 97
  },
  {
    id: 5,
    title: 'Machine Learning Engineer (Search & Ranking)',
    company: 'Swiggy',
    location: 'Bengaluru, India',
    workMode: 'HYBRID',
    jobType: 'FULL_TIME',
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 120000,
    salaryMax: 150000,
    skills: ['Python', 'Machine Learning', 'Vector Search', 'pgvector', 'FastAPI'],
    description: `Power lightning-fast search and recommendation algorithms for on-demand deliveries.\n• Implement semantic search retrieval algorithms connecting user intent to catalogue items.\n• Implement hybrid scoring ranking equations combining cosine similarity with click-through probability.\n• Build low-latency ML serving endpoints with model quantization and asynchronous batching.`,
    applyUrl: 'https://swiggy.com/careers',
    postedAt: 'Live',
    overallScore: 90,
    semanticScore: 88
  },
  {
    id: 6,
    title: 'Backend Systems Engineer (High Scale)',
    company: 'CRED',
    location: 'Bengaluru, India',
    workMode: 'ONSITE',
    jobType: 'FULL_TIME',
    experienceMin: 3,
    experienceMax: 6,
    salaryMin: 135000,
    salaryMax: 170000,
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
    description: `CRED delivers seamless experiences for creditworthy members.\n• Architect ultra-reliable event-driven architectures processing millions of daily transactions.\n• Design high-performance database schema indexes, caching layers with Redis, and Kafka pipelines.\n• Ensure zero-downtime deployments with robust automated testing and containerized orchestration.`,
    applyUrl: 'https://cred.club/careers',
    postedAt: 'Live',
    overallScore: 86,
    semanticScore: 84
  }
]

// ── Default Profile ────────────────────────────────────────────────────────
const DEFAULT_PROFILE: MockProfile = {
  id: 1,
  userId: 1,
  firstName: 'Rohith',
  lastName: 'S',
  email: 'rohithsvernekar2@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  preferredWorkMode: 'HYBRID',
  noticePeriodDays: 15,
  expectedCtc: 1800000,
  workAuthorization: 'Citizen (India)',
  linkedinUrl: 'https://linkedin.com/in/rohith-s',
  githubUrl: 'https://github.com/RohithSV2',
  portfolioUrl: 'https://hirematch-ai-kappa.vercel.app',
  bio: 'AI & Full Stack Engineer with deep focus on NLP, Semantic Textual Similarity using Sentence-Transformers, Vector Databases (pgvector), and modern web architectures.',
  avatarUrl: undefined
}

// ── Default Primary Resume ─────────────────────────────────────────────────
const DEFAULT_RESUMES: MockResume[] = [
  {
    id: 1,
    userId: 1,
    version: 1,
    label: 'Primary AI & NLP Resume',
    isPrimary: true,
    source: 'UPLOAD',
    fileName: 'Rohith_S_NLP_Engineer.pdf',
    mimeType: 'application/pdf',
    atsScore: 94,
    createdAt: new Date().toISOString(),
    parsedJson: {
      contact: {
        name: 'Rohith S',
        email: 'rohithsvernekar2@gmail.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India'
      },
      summary: 'AI & Software Engineer with strong experience in Natural Language Processing (NLP), Semantic Textual Similarity using Sentence-BERT embeddings, vector search indexing, Java Spring Boot microservices, and modern React TypeScript frontends.',
      skills: [
        'Python',
        'PyTorch',
        'NLP',
        'Sentence-Transformers',
        'Cosine Similarity',
        'pgvector',
        'PostgreSQL',
        'Java 17',
        'Spring Boot 3',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Docker',
        'REST APIs'
      ],
      experience: [
        {
          company: 'AI Project (HireMatch AI)',
          title: 'NLP & Full Stack Engineer Lead',
          start: '2024',
          end: 'Present',
          bullets: [
            'Architected automated candidate-job matching engine using Sentence-BERT (all-MiniLM-L6-v2) producing 384-dimensional dense embeddings.',
            'Implemented pgvector HNSW cosine distance indexing (<=>) enabling sub-10ms semantic similarity candidate ranking.',
            'Engineered full-stack responsive web platform with React, Vite, Tailwind CSS, and Spring Boot 3 REST APIs.'
          ]
        }
      ],
      education: [
        {
          institution: 'National Institute of Engineering (NIE)',
          degree: 'Bachelor of Engineering (B.E.)',
          field: 'Information Science & Engineering',
          start: '2021',
          end: '2025',
          gpa: '8.9 / 10'
        }
      ],
      projects: [
        {
          name: 'Semantic Textual Similarity Demonstration Engine',
          description: 'Benchmarked dense embeddings against sparse TF-IDF representations with empirical heatmaps and first-principles Cosine Similarity formulation.',
          tech: ['Python', 'Sentence-Transformers', 'Scikit-Learn', 'Matplotlib', 'Jupyter']
        }
      ]
    }
  }
]

// ── Default Applications for Kanban Tracker ─────────────────────────────────
const DEFAULT_APPLICATIONS: MockApplication[] = [
  {
    id: 101,
    jobId: 1,
    title: 'AI / Machine Learning Engineer (NLP & STS)',
    company: 'Sarvam AI',
    status: 'APPLIED',
    appliedAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-10-25T14:30:00Z',
    score: 96
  },
  {
    id: 102,
    jobId: 2,
    title: 'Senior Java Backend Engineer (Microservices)',
    company: 'Razorpay',
    status: 'UNDER_REVIEW',
    appliedAt: '2026-10-22T09:15:00Z',
    updatedAt: '2026-10-26T11:20:00Z',
    score: 91
  },
  {
    id: 103,
    jobId: 3,
    title: 'Full Stack Cloud & UI Specialist',
    company: 'Postman',
    status: 'OFFER',
    appliedAt: '2026-10-18T16:00:00Z',
    updatedAt: '2026-10-28T09:00:00Z',
    score: 88
  },
  {
    id: 104,
    jobId: 4,
    title: 'NLP Research Specialist (Dense Embeddings)',
    company: 'DeepMind Ecosystem',
    status: 'SAVED',
    appliedAt: '2026-10-27T18:00:00Z',
    updatedAt: '2026-10-27T18:00:00Z',
    score: 98
  },
  {
    id: 105,
    jobId: 5,
    title: 'Machine Learning Engineer (Search & Ranking)',
    company: 'Swiggy',
    status: 'INTERVIEW',
    appliedAt: '2026-10-20T11:45:00Z',
    updatedAt: '2026-10-27T15:10:00Z',
    score: 90
  }
]

// ── LocalStorage State Helpers ─────────────────────────────────────────────
const STORAGE_KEYS = {
  PROFILE: 'hirematch_mock_profile',
  RESUMES: 'hirematch_mock_resumes',
  APPLICATIONS: 'hirematch_mock_applications',
  JOBS: 'hirematch_mock_jobs',
  NOTIFICATIONS: 'hirematch_mock_notifications'
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key)
    if (val) return JSON.parse(val)
  } catch {
    // ignore
  }
  return fallback
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // ignore
  }
}

// ── Mock Backend Router / Handler ──────────────────────────────────────────
export function handleMockRequest(method: string, url: string, data?: any): any {
  const normUrl = url.replace(/^[a-zA-Z]+:\/\/[^/]+/, '').replace(/^\/api\/v1/, '').split('?')[0]
  
  // 1. Auth routes
  if (normUrl === '/auth/login' || normUrl === '/auth/google' || normUrl === '/auth/register') {
    const email = data?.email || 'rohithsvernekar2@gmail.com'
    const firstName = data?.firstName || 'Rohith'
    const lastName = data?.lastName || 'S'
    const user = {
      id: 1,
      email,
      firstName,
      lastName,
      role: 'USER'
    }
    return {
      accessToken: 'mock_jwt_access_token_secure_valid',
      refreshToken: 'mock_jwt_refresh_token_secure_valid',
      expiresIn: 3600,
      user
    }
  }

  if (normUrl === '/auth/refresh') {
    return {
      accessToken: 'mock_jwt_refreshed_access_token',
      refreshToken: 'mock_jwt_refreshed_refresh_token',
      expiresIn: 3600
    }
  }

  if (normUrl === '/auth/logout') {
    return { success: true }
  }

  // 2. Profile routes
  if (normUrl === '/profile') {
    const current = getStored<MockProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE)
    if (method.toLowerCase() === 'get') {
      return current
    }
    if (method.toLowerCase() === 'put' || method.toLowerCase() === 'post') {
      const updated = { ...current, ...(data || {}) }
      setStored(STORAGE_KEYS.PROFILE, updated)
      return updated
    }
  }

  // 3. Resumes routes
  if (normUrl === '/resumes') {
    const resumes = getStored<MockResume[]>(STORAGE_KEYS.RESUMES, DEFAULT_RESUMES)
    if (method.toLowerCase() === 'get') {
      return resumes
    }
    if (method.toLowerCase() === 'post') {
      // Create new uploaded resume
      const newResume: MockResume = {
        id: Date.now(),
        userId: 1,
        version: resumes.length + 1,
        label: `Uploaded Resume v${resumes.length + 1}`,
        isPrimary: resumes.length === 0,
        source: 'UPLOAD',
        fileName: 'Resume_Updated.pdf',
        mimeType: 'application/pdf',
        atsScore: 92,
        createdAt: new Date().toISOString(),
        parsedJson: DEFAULT_RESUMES[0].parsedJson
      }
      const updated = [newResume, ...resumes]
      setStored(STORAGE_KEYS.RESUMES, updated)
      return newResume
    }
  }

  if (normUrl === '/resumes/builder') {
    const resumes = getStored<MockResume[]>(STORAGE_KEYS.RESUMES, DEFAULT_RESUMES)
    const newResume: MockResume = {
      id: Date.now(),
      userId: 1,
      version: resumes.length + 1,
      label: data?.label || `Built Resume v${resumes.length + 1}`,
      isPrimary: resumes.length === 0,
      source: 'BUILDER',
      fileName: data?.fileName || 'Built_Resume.pdf',
      mimeType: 'application/pdf',
      atsScore: 95,
      createdAt: new Date().toISOString(),
      parsedJson: data?.parsedJson || DEFAULT_RESUMES[0].parsedJson
    }
    const updated = [newResume, ...resumes]
    setStored(STORAGE_KEYS.RESUMES, updated)
    return newResume
  }

  if (normUrl.startsWith('/resumes/') && normUrl.endsWith('/primary')) {
    const id = Number(normUrl.split('/')[2])
    const resumes = getStored<MockResume[]>(STORAGE_KEYS.RESUMES, DEFAULT_RESUMES).map(r => ({
      ...r,
      isPrimary: r.id === id
    }))
    setStored(STORAGE_KEYS.RESUMES, resumes)
    return resumes.find(r => r.id === id) || resumes[0]
  }

  if (normUrl.startsWith('/resumes/') && method.toLowerCase() === 'delete') {
    const id = Number(normUrl.split('/')[2])
    const resumes = getStored<MockResume[]>(STORAGE_KEYS.RESUMES, DEFAULT_RESUMES).filter(r => r.id !== id)
    setStored(STORAGE_KEYS.RESUMES, resumes)
    return { success: true }
  }

  // 4. Jobs & Recommendations routes
  if (normUrl === '/matches/recommendations' || normUrl === '/jobs') {
    const jobs = INITIAL_JOBS
    // Map to recommendation DTO format expected by frontend
    return jobs.map(j => ({
      job: j,
      overallScore: j.overallScore || 88,
      semanticScore: j.semanticScore || 85,
      matchedSkills: j.skills.slice(0, 4),
      missingSkills: j.skills.slice(4),
      verdict: (j.overallScore || 88) > 90 ? 'Strong Match' : 'Good Match'
    }))
  }

  if (normUrl.startsWith('/jobs/')) {
    const id = Number(normUrl.split('/')[2])
    const job = INITIAL_JOBS.find(j => j.id === id) || INITIAL_JOBS[0]
    return job
  }

  if (normUrl === '/jobs/seed') {
    return { message: 'Jobs seeded with embeddings.' }
  }

  // 5. Match Analysis route (/matches/:jobId)
  if (normUrl.startsWith('/matches/')) {
    const jobId = Number(normUrl.split('/')[2])
    const job = INITIAL_JOBS.find(j => j.id === jobId) || INITIAL_JOBS[0]
    const semantic = job.semanticScore || 92
    const overall = job.overallScore || 94
    return {
      resumeId: 1,
      jobId,
      overallScore: overall,
      semanticScore: semantic,
      skillScore: 92.0,
      experienceScore: 90.0,
      locationScore: 95.0,
      matchedSkills: job.skills.slice(0, 4),
      missingSkills: job.skills.slice(4),
      verdict: overall > 90 ? "Strong Match — Candidate's NLP and engineering profile directly align with the core technical requirements." : "Good Match — High semantic alignment with minor skill expansion opportunities."
    }
  }

  // 6. Resume Enhancement route (/enhancements/:jobId)
  if (normUrl.startsWith('/enhancements/')) {
    const jobId = Number(normUrl.split('/')[2])
    const job = INITIAL_JOBS.find(j => j.id === jobId) || INITIAL_JOBS[0]
    return {
      ats_score_before: 82,
      ats_score_after: 96,
      job_title: job.title,
      company: job.company,
      changes: [
        {
          section: 'Summary',
          before: 'AI enthusiast interested in NLP and machine learning models.',
          after: `Results-driven ML Engineer specializing in Semantic Textual Similarity, PyTorch, and high-performance vector retrieval architectures aligned for ${job.company}.`
        },
        {
          section: 'Experience',
          before: 'Built text embedding search system for project.',
          after: 'Architected production-grade Semantic Search engine using Sentence-BERT (MiniLM-L6-v2) and pgvector HNSW indexing, reducing cosine retrieval latency by 45%.'
        },
        {
          section: 'Skills',
          before: 'Python, ML, Postgres',
          after: `Added highlighted target competencies: ${job.skills.join(', ')}.`
        }
      ]
    }
  }

  // 7. Applications route (Kanban board)
  if (normUrl === '/applications') {
    const apps = getStored<MockApplication[]>(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS)
    if (method.toLowerCase() === 'get') {
      return apps
    }
    if (method.toLowerCase() === 'post') {
      const jobId = Number(data?.jobId || 1)
      const job = INITIAL_JOBS.find(j => j.id === jobId) || INITIAL_JOBS[0]
      const newApp: MockApplication = {
        id: Date.now(),
        jobId,
        title: job.title,
        company: job.company,
        status: (data?.status as any) || 'SAVED',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        score: job.overallScore || 90
      }
      const updated = [newApp, ...apps]
      setStored(STORAGE_KEYS.APPLICATIONS, updated)
      return newApp
    }
  }

  if (normUrl.startsWith('/applications/') && normUrl.endsWith('/status')) {
    const id = Number(normUrl.split('/')[2])
    const newStatus = data?.status
    const apps = getStored<MockApplication[]>(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS).map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return a
    })
    setStored(STORAGE_KEYS.APPLICATIONS, apps)
    return apps.find(a => a.id === id) || apps[0]
  }

  // 8. Notifications route
  if (normUrl === '/notifications') {
    return [
      { id: 1, title: 'Application Update', message: 'Sarvam AI moved your application to Under Review.', read: false, createdAt: new Date().toISOString() },
      { id: 2, title: 'High Semantic Match Found', message: 'New 98% match: NLP Research Specialist at DeepMind Ecosystem.', read: false, createdAt: new Date().toISOString() }
    ]
  }

  if (normUrl.startsWith('/notifications/') || normUrl === '/notifications/read-all') {
    return { success: true }
  }

  // Fallback generic response
  return { status: 'ok' }
}
