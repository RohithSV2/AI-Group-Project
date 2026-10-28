import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowLeft,
  TrendingUp,
  BookOpen,
  Loader2,
  Copy,
  Check,
  Download,
  X,
  FileText
} from 'lucide-react'
import { jobApi, matchApi, enhancementApi, applicationApi } from '@/api/endpoints'

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
        <span>{label}</span>
        <span className="font-semibold" style={{ color }}>{score.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--color-surface-container)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function JobDetail() {
  const { id } = useParams()
  const [enhancedData, setEnhancedData] = useState<any>(null)
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false)
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState('')

  const { data: job, isLoading: isJobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobApi.getById(Number(id)),
    enabled: !!id
  })

  const { data: match, isLoading: isMatchLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: () => matchApi.getMatch(Number(id)),
    enabled: !!id
  })

  const { mutate: tailorResume, isPending: isTailoring } = useMutation({
    mutationFn: () => enhancementApi.enhance(Number(id)),
    onSuccess: (data) => setEnhancedData(data)
  })

  const { mutate: saveToTracker, isPending: isSaving } = useMutation({
    mutationFn: () => applicationApi.create({ jobId: Number(id), status: 'SAVED' }),
    onSuccess: () => alert('Job saved to tracker successfully!')
  })

  if (isJobLoading || isMatchLoading) {
    return <div className="text-center py-20 font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Loading AI Analysis...</div>
  }

  if (!job) {
    return <div className="text-center py-20 font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Job not found</div>
  }

  const missing = match?.missingSkills?.map((s: string) => ({
    skill: s,
    importance: 'must-have',
    reason: 'Identified as a gap based on your current resume.',
    suggestion: 'Consider adding ' + s + ' to your skillset.'
  })) || []

  const handleGenerateCoverLetter = () => {
    setIsGeneratingCoverLetter(true)
    setTimeout(() => {
      const topSkills = (job.skills || []).slice(0, 3).join(', ')
      const letter = `Dear Hiring Team at ${job.company},

I am writing to express my strong enthusiasm for the ${job.title} position at ${job.company}. With deep hands-on expertise in Natural Language Processing (NLP), semantic search pipelines, and modern full-stack architectures, I have engineered production-grade systems using Sentence-BERT embeddings (MiniLM-L6-v2), vector retrieval indexing, and high-performance microservices.

In reviewing the requirements for the ${job.title} role, I was especially excited to see the focus on ${topSkills || 'scalable software systems'}. In my recent projects, I implemented high-throughput semantic similarity engines that compute cosine distances across millions of tokens with sub-millisecond latencies, directly mirroring the engineering challenges at ${job.company}.

I would welcome the opportunity to discuss how my technical background in NLP, API design, and system architecture can help accelerate the engineering goals of ${job.company}. Thank you for your time and consideration.

Sincerely,
Rohith S
Bengaluru, India | +91 98765 43210
GitHub: https://github.com/RohithSV2
Portfolio: https://hirematch-ai-kappa.vercel.app`

      setCoverLetterText(letter)
      setIsGeneratingCoverLetter(false)
      setShowCoverLetter(true)
    }, 450)
  }

  const handleCopyCoverLetter = () => {
    if (coverLetterText) {
      navigator.clipboard.writeText(coverLetterText)
      setCopiedCoverLetter(true)
      setTimeout(() => setCopiedCoverLetter(false), 2000)
    }
  }

  const handleDownloadEnhancedResume = () => {
    const summaryChange = enhancedData?.changes?.find((c: any) => c.section === 'Summary')?.after
    const expChange = enhancedData?.changes?.find((c: any) => c.section === 'Experience')?.after
    const resumeContent = `================================================================================
AI-OPTIMIZED RESUME: ROHITH S
TARGET ROLE: ${job.title} | ${job.company}
ATS COMPATIBILITY SCORE: ${enhancedData?.ats_score_after || 96}%
================================================================================

CONTACT INFORMATION
Name: Rohith S
Email: rohithsvernekar2@gmail.com
Phone: +91 98765 43210
Location: Bengaluru, India
GitHub: https://github.com/RohithSV2
Live System: https://hirematch-ai-kappa.vercel.app

PROFESSIONAL SUMMARY
${summaryChange || 'Results-driven ML & Software Engineer specializing in Semantic Textual Similarity, PyTorch, Sentence-BERT embeddings, vector search indexing, and resilient web architectures.'}

CORE COMPETENCIES & TECH STACK
${(job.skills || ['Python', 'PyTorch', 'Transformers', 'Spring Boot', 'PostgreSQL', 'Docker']).join('  •  ')}

EXPERIENCE & PROJECT ACHIEVEMENTS
• ${expChange || 'Architected production-grade Semantic Search engine using Sentence-BERT (MiniLM-L6-v2) and pgvector HNSW indexing, reducing cosine retrieval latency by 45%.'}
• Engineered end-to-end NLP pipelines for real-time document matching and semantic scoring with 94%+ ATS compatibility.
• Implemented zero-latency client caching and resilient REST APIs serving high-concurrency search requests.
• Designed automated evaluation benchmarks analyzing Cosine Similarity vs Pearson/Spearman ground-truth correlations.

EDUCATION
B.E. in Computer Science & Engineering
Specialization: Artificial Intelligence & Machine Learning

================================================================================
Generated by HireMatch AI • Powered by Sentence-BERT Embeddings
================================================================================`

    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Rohith_S_${job.company.replace(/[^a-zA-Z0-9]/g, '_')}_Tailored_Resume.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--color-on-surface-variant)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to search
      </Link>

      {/* AI Tailored Resume Card */}
      {enhancedData && (
        <div className="card p-6 border-l-4 shadow-sm" style={{ borderColor: 'var(--color-primary)', background: 'var(--color-surface-container-lowest)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#e0e7ff', color: 'var(--color-primary)' }}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-on-surface)' }}>AI Tailored Resume Ready!</h2>
                <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Optimized specifically for <strong>{job.company}</strong>'s ATS scoring filters.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-gray-500 block">ATS Score Boost</span>
                <span className="font-bold text-sm" style={{ color: '#065f46' }}>
                  {enhancedData.ats_score_before}% → <span className="text-base text-emerald-600">{enhancedData.ats_score_after}%</span>
                </span>
              </div>
              <button 
                onClick={handleDownloadEnhancedResume}
                className="btn-primary gap-2 text-sm shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Resume (.txt)
              </button>
            </div>
          </div>

          {/* Diff list */}
          <div className="space-y-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Optimized Resume Sections ({enhancedData.changes?.length || 0})</p>
            {enhancedData.changes?.map((ch: any, i: number) => (
              <div key={i} className="p-3.5 rounded-lg border text-xs space-y-1.5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-outline-variant)' }}>
                <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Section: {ch.section}
                </div>
                <div className="line-through text-gray-400 pl-5">
                  <span className="font-medium mr-1 text-red-500">Before:</span>{ch.before}
                </div>
                <div className="text-emerald-800 font-medium pl-5 bg-emerald-50 py-1 px-2 rounded">
                  <span className="font-bold mr-1 text-emerald-700">After:</span>{ch.after}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main column ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Job header card */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
                   style={{ background: 'var(--color-surface-container)', color: 'var(--color-primary)' }}>
                {job.company?.[0] || 'C'}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-on-surface)', letterSpacing: '-0.01em' }}>{job.title}</h1>
                <p className="font-medium mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>{job.company}</p>
                <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--color-outline)' }}>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || 'Remote'}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.jobType || 'Full-time'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.experienceMin ? `${job.experienceMin}+ yrs` : 'Entry Level'}</span>
                  <span className="font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {job.salaryMin && job.salaryMin > 0 ? `$${job.salaryMin} - $${job.salaryMax}` : 'Competitive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <a href={job.applyUrl || '#'} target="_blank" rel="noreferrer" className="btn-primary gap-2 flex-1 justify-center">
                <ExternalLink className="w-4 h-4" /> Apply Now
              </a>
              <button 
                onClick={() => tailorResume()} 
                disabled={isTailoring}
                className="btn-ai gap-2 flex-1 justify-center"
              >
                {isTailoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isTailoring ? 'Tailoring with AI...' : 'Tailor Resume'}
              </button>
            </div>
          </div>

          {/* Job description */}
          <div className="card p-6">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>Job Description</h2>
            <div className="prose prose-sm max-w-none">
              {(job.description || '').split('\n').map((line: string, i: number) => (
                <p key={i} className="mb-2 text-sm leading-relaxed" style={{ color: line.startsWith('•') ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Skill diff — matched vs missing */}
          {match && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-on-surface)' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                Skills Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Matched */}
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: '#065f46' }}>
                    <CheckCircle className="w-3.5 h-3.5" /> Matched ({match.matchedSkills?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedSkills?.map((s: string) => (
                      <span key={s} className="skill-matched text-xs px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                {/* Missing */}
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: '#991b1b' }}>
                    <XCircle className="w-3.5 h-3.5" /> Gaps ({missing.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.map((m: any) => (
                      <span key={m.skill} className="skill-missing text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                        {m.skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gap breakdown */}
              {missing.length > 0 && (
                <div className="space-y-3">
                  {missing.map((m: any) => (
                    <div key={m.skill} className="p-4 rounded-xl border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm" style={{ color: '#991b1b' }}>{m.skill}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: m.importance === 'must-have' ? '#ef4444' : '#f59e0b', color: '#fff' }}>
                          {m.importance}
                        </span>
                      </div>
                      <p className="text-xs mb-2 leading-relaxed" style={{ color: '#b91c1c' }}>{m.reason}</p>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#065f46' }}>
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="font-medium">Learn: </span>{m.suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Overall score */}
          {match && (
            <>
              <div className="card p-6 text-center">
                <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-3">
                  <defs>
                    <linearGradient id="gaugeG2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#e5eeff" strokeWidth="8" />
                  <circle cx="60" cy="60" r="46" fill="none" stroke="url(#gaugeG2)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - (match.overallScore || 0) / 100)}
                    transform="rotate(-90 60 60)" />
                  <text x="60" y="56" textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: '#0b1c30', fontFamily: 'Inter' }}>{match.overallScore?.toFixed(0)}%</text>
                  <text x="60" y="72" textAnchor="middle" style={{ fontSize: 10, fill: '#464555', fontFamily: 'Inter' }}>Match</text>
                </svg>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-on-surface)' }}>Overall Compatibility</h3>
                <p className="text-xs leading-relaxed px-2" style={{ color: 'var(--color-on-surface-variant)' }}>{match.verdict || 'Good match'}</p>
              </div>

              {/* Score breakdown */}
              <div className="card p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--color-on-surface)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  Score Breakdown
                </h3>
                <div className="space-y-3">
                  <ScoreBar label="Semantic Similarity" score={match.semanticScore || 0} />
                  <ScoreBar label="Skill Overlap" score={match.skillScore || 0} />
                  <ScoreBar label="Experience Fit" score={match.experienceScore || 0} />
                </div>
              </div>
            </>
          )}

          {/* AI actions */}
          <div className="card p-5 space-y-3">
            <button 
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCoverLetter}
              className="btn-ai w-full gap-2 py-2.5 justify-center"
            >
              {isGeneratingCoverLetter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGeneratingCoverLetter ? 'Generating Letter...' : 'AI Cover Letter'}
            </button>
            <button 
              onClick={() => saveToTracker()} 
              disabled={isSaving}
              className="btn-secondary w-full gap-2 py-2.5 justify-center"
            >
              <Briefcase className="w-4 h-4" /> 
              {isSaving ? 'Saving...' : 'Save to Tracker'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Cover Letter Modal */}
      {showCoverLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">AI Tailored Cover Letter</h3>
                  <p className="text-xs text-gray-500">Crafted for {job.title} at {job.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCoverLetter(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-5 rounded-xl border border-gray-100">
                {coverLetterText}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">Ready to submit or adapt</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowCoverLetter(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={handleCopyCoverLetter}
                  className="btn-primary gap-1.5 text-xs py-2 px-4 shadow-sm"
                >
                  {copiedCoverLetter ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copiedCoverLetter ? 'Copied to Clipboard!' : 'Copy Cover Letter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
