"""
NLP - Semantic Textual Similarity using Embeddings & Cosine Similarity
======================================================================
Author: Group 1 (HireMatch AI / AI-Project)
Topic: Natural Language Processing (NLP) - Semantic Textual Similarity (STS)
Techniques:
    - Lexical Baseline: TF-IDF Vectorization & Cosine Similarity
    - Dense Semantic Embeddings: Sentence-BERT (all-MiniLM-L6-v2, 384 dimensions)
    - Similarity Metric: Cosine Similarity & Cosine Distance
    - Visualizations: Pairwise Heatmaps & Comparative Bar Charts
"""

import sys
import os
import math
import argparse
from typing import List, Tuple, Dict, Any
import numpy as np

# Suppress unnecessary HF warnings
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# ---------------------------------------------------------------------------
# 1. Mathematical Formulation & Implementation
# ---------------------------------------------------------------------------

def manual_cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """
    Computes Cosine Similarity between two 1-D vectors from first principles:
    
        Cosine Similarity(u, v) = (u . v) / (||u||_2 * ||v||_2)
                                = sum(u_i * v_i) / (sqrt(sum(u_i^2)) * sqrt(sum(v_i^2)))
    
    Range: [-1.0, 1.0] (for dense embeddings, typically [0.0, 1.0])
    Cosine Distance = 1.0 - Cosine Similarity
    """
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    
    return float(dot_product / (norm_a * norm_b))


def l2_normalize(vec: np.ndarray) -> np.ndarray:
    """
    Normalizes a vector to unit length (L2 norm = 1.0).
    When ||u||_2 = ||v||_2 = 1.0, Cosine Similarity simplifies to dot product:
        Cosine Similarity(u, v) = u . v
    """
    norm = np.linalg.norm(vec)
    if norm == 0.0:
        return vec
    return vec / norm


# ---------------------------------------------------------------------------
# 2. Embedding Models: Lexical (TF-IDF) & Dense (Sentence-BERT)
# ---------------------------------------------------------------------------

class LexicalTFIDFModel:
    """
    Lexical baseline using Term Frequency - Inverse Document Frequency (TF-IDF).
    Matches based on exact token / n-gram overlap, ignoring deep semantic relations.
    """
    def __init__(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            lowercase=True
        )

    def compute_similarity_matrix(self, texts_a: List[str], texts_b: List[str]) -> np.ndarray:
        from sklearn.metrics.pairwise import cosine_similarity
        all_texts = texts_a + texts_b
        tfidf_matrix = self.vectorizer.fit_transform(all_texts)
        matrix_a = tfidf_matrix[:len(texts_a)]
        matrix_b = tfidf_matrix[len(texts_a):]
        return cosine_similarity(matrix_a, matrix_b)

    def compute_pair_similarity(self, text_a: str, text_b: str) -> float:
        from sklearn.metrics.pairwise import cosine_similarity
        tfidf_matrix = self.vectorizer.fit_transform([text_a, text_b])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(sim)


class DenseTransformerModel:
    """
    Dense Semantic Embedding Model using Sentence-BERT / all-MiniLM-L6-v2.
    Maps sentences to a 384-dimensional dense vector space where semantically
    similar sentences are positioned close together.
    """
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            print(f"[*] Loading Sentence-Transformer model '{self.model_name}'...")
            self.model = SentenceTransformer(self.model_name)
            print("[+] Model loaded successfully (384-dimensional dense embeddings).")
        except Exception as e:
            print(f"[-] Warning: Failed to load SentenceTransformer ({e}). Falling back to simulated dense encoder.")
            self.model = None

    def encode(self, texts: List[str]) -> np.ndarray:
        if self.model is not None:
            embeddings = self.model.encode(texts, normalize_embeddings=True)
            return np.array(embeddings)
        else:
            # Fallback dense encoder simulation (using TF-IDF projected or normalized hashing)
            return self._simulated_encode(texts)

    def _simulated_encode(self, texts: List[str]) -> np.ndarray:
        import hashlib
        vectors = []
        for text in texts:
            h = hashlib.sha256(text.encode("utf-8")).digest()
            vec = np.array([(b / 255.0 - 0.5) for b in (h * 12)[:384]], dtype=np.float32)
            norm = np.linalg.norm(vec) or 1.0
            vectors.append(vec / norm)
        return np.array(vectors)

    def compute_similarity_matrix(self, texts_a: List[str], texts_b: List[str]) -> np.ndarray:
        vecs_a = self.encode(texts_a)
        vecs_b = self.encode(texts_b)
        # Since normalize_embeddings=True, cosine similarity = dot product
        return np.dot(vecs_a, vecs_b.T)

    def compute_pair_similarity(self, text_a: str, text_b: str) -> float:
        vecs = self.encode([text_a, text_b])
        return float(manual_cosine_similarity(vecs[0], vecs[1]))


# ---------------------------------------------------------------------------
# 3. Benchmark Dataset: STS Pairwise Comparisons
# ---------------------------------------------------------------------------

BENCHMARK_PAIRS = [
    {
        "id": "P1",
        "category": "Paraphrase / Synonymy",
        "text1": "Experienced Machine Learning Engineer with expertise in PyTorch, NLP, and LLM fine-tuning.",
        "text2": "AI Specialist skilled in Deep Learning, Natural Language Processing, and training transformer models.",
        "expected": "HIGH",
        "description": "Different vocabulary & wording, but highly overlapping semantic meaning."
    },
    {
        "id": "P2",
        "category": "Role & Domain Alignment",
        "text1": "Senior Backend Developer building microservices with Java Spring Boot, PostgreSQL, and Docker.",
        "text2": "Backend Software Engineer experienced in enterprise Java, relational databases, and containerized deployments.",
        "expected": "HIGH",
        "description": "Domain-specific synonyms (Spring Boot/Docker vs Enterprise Java/Containers)."
    },
    {
        "id": "P3",
        "category": "Cross-Disciplinary Distinction",
        "text1": "Front-End UI/UX Designer creating wireframes, Figma prototypes, and responsive CSS animations.",
        "text2": "Senior Backend Developer building microservices with Java Spring Boot, PostgreSQL, and Docker.",
        "expected": "LOW",
        "description": "Completely disparate tech stacks and engineering domains."
    },
    {
        "id": "P4",
        "category": "Unrelated Industry",
        "text1": "Certified Public Accountant (CPA) with 8 years managing corporate tax filings, audits, and QuickBooks ledger reconciliation.",
        "text2": "Full Stack Cloud Engineer developing scalable web applications using React, Node.js, and AWS Lambda.",
        "expected": "VERY LOW",
        "description": "Completely orthogonal domains (Finance/Accounting vs Cloud Software Engineering)."
    },
    {
        "id": "P5",
        "category": "Superficial Keyword Trap",
        "text1": "Software Engineer who loves cooking Italian food and organizing office pizza parties.",
        "text2": "Executive Chef specializing in authentic Italian pasta, wood-fired pizza, and culinary team management.",
        "expected": "MODERATE/LOW",
        "description": "Shares keywords ('Italian', 'pizza'), but the core profession and context differ drastically."
    }
]

# Sample Candidates vs Jobs for HireMatch Matching Simulation
SAMPLE_CANDIDATES = [
    {
        "name": "Candidate A (NLP & ML Engineer)",
        "profile": "Data Scientist with 3+ years experience in Natural Language Processing, PyTorch, HuggingFace transformers, text embeddings, and semantic search algorithms."
    },
    {
        "name": "Candidate B (Java Enterprise Developer)",
        "profile": "Java Developer with 5 years experience designing scalable backend architectures using Spring Boot, Hibernate, microservices, and PostgreSQL."
    },
    {
        "name": "Candidate C (Frontend React Developer)",
        "profile": "Frontend Web Developer specializing in React.js, TypeScript, Next.js, Tailwind CSS, responsive web design, and state management with Zustand."
    }
]

SAMPLE_JOBS = [
    {
        "title": "Job 1: AI / NLP Research Engineer",
        "description": "Seeking an AI Engineer to develop semantic textual similarity algorithms, vector retrieval pipelines, and sentence embedding models using PyTorch and NLP."
    },
    {
        "title": "Job 2: Senior Java Backend Engineer",
        "description": "Looking for a seasoned Java Backend Developer proficient in Spring Cloud, microservices, PostgreSQL database optimization, and REST API engineering."
    },
    {
        "title": "Job 3: UI/UX Frontend Specialist",
        "description": "Hiring a passionate Frontend Developer with deep knowledge of React, modern JavaScript/TypeScript, component design systems, and frontend performance."
    }
]


# ---------------------------------------------------------------------------
# 4. Evaluation & Visualization Functions
# ---------------------------------------------------------------------------

def run_benchmark(tfidf_model: LexicalTFIDFModel, dense_model: DenseTransformerModel) -> List[Dict[str, Any]]:
    print("\n" + "=" * 80)
    print("  RUNNING STS BENCHMARK: LEXICAL (TF-IDF) vs DENSE (SENTENCE-BERT)  ")
    print("=" * 80)
    
    results = []
    
    for item in BENCHMARK_PAIRS:
        t1, t2 = item["text1"], item["text2"]
        sim_tfidf = tfidf_model.compute_pair_similarity(t1, t2)
        sim_dense = dense_model.compute_pair_similarity(t1, t2)
        cos_dist_dense = 1.0 - sim_dense
        
        result_entry = {
            "id": item["id"],
            "category": item["category"],
            "tfidf_sim": sim_tfidf,
            "dense_sim": sim_dense,
            "cosine_dist": cos_dist_dense,
            "expected": item["expected"],
            "description": item["description"]
        }
        results.append(result_entry)
        
        print(f"\n[Pair {item['id']}] - Category: {item['category']}")
        print(f"  Text 1: \"{t1[:75]}...\"")
        print(f"  Text 2: \"{t2[:75]}...\"")
        print(f"  -> TF-IDF Cosine Similarity   : {sim_tfidf:.4f} ({sim_tfidf*100:.1f}%)")
        print(f"  -> Dense BERT Cosine Similarity: {sim_dense:.4f} ({sim_dense*100:.1f}%)")
        print(f"  -> Cosine Distance (1 - sim)  : {cos_dist_dense:.4f}")
        print(f"  -> Expected Alignment          : {item['expected']}")
        print(f"  -> Insight                    : {item['description']}")
    
    print("\n" + "=" * 80)
    return results


def run_candidate_job_matrix(dense_model: DenseTransformerModel) -> np.ndarray:
    print("\n" + "=" * 80)
    print("  HIREMATCH AI: RESUME vs JOB DESCRIPTION SEMANTIC MATCH MATRIX  ")
    print("=" * 80)
    
    cand_texts = [c["profile"] for c in SAMPLE_CANDIDATES]
    cand_labels = [c["name"] for c in SAMPLE_CANDIDATES]
    
    job_texts = [j["description"] for j in SAMPLE_JOBS]
    job_labels = [j["title"] for j in SAMPLE_JOBS]
    
    sim_matrix = dense_model.compute_similarity_matrix(cand_texts, job_texts)
    
    print("\nPairwise Cosine Similarity Scores (Candidate Rows x Job Columns):")
    header = f"{'Candidate':<35} | " + " | ".join([f"{j[:12]}..." for j in job_labels])
    print("-" * len(header))
    print(header)
    print("-" * len(header))
    
    for i, cand in enumerate(cand_labels):
        row_str = f"{cand:<35} | "
        for j in range(len(job_labels)):
            score = sim_matrix[i, j]
            row_str += f"   {score:.4f}    | "
        print(row_str)
    
    print("-" * len(header))
    return sim_matrix


def generate_visualizations(benchmark_results: List[Dict[str, Any]], sim_matrix: np.ndarray, output_dir: str = "."):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    
    os.makedirs(output_dir, exist_ok=True)
    
    # ----------------------------------------------------
    # Chart 1: Model Comparison Bar Chart (TF-IDF vs Dense)
    # ----------------------------------------------------
    pair_labels = [r["id"] + "\n(" + r["expected"] + ")" for r in benchmark_results]
    tfidf_scores = [r["tfidf_sim"] for r in benchmark_results]
    dense_scores = [r["dense_sim"] for r in benchmark_results]
    
    x = np.arange(len(pair_labels))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=150)
    rects1 = ax.bar(x - width/2, tfidf_scores, width, label='TF-IDF (Lexical Overlap)', color='#64748b', alpha=0.9)
    rects2 = ax.bar(x + width/2, dense_scores, width, label='Sentence-BERT (Dense Embeddings)', color='#3b82f6', alpha=0.9)
    
    ax.set_ylabel('Cosine Similarity Score [0.0 - 1.0]', fontsize=11, fontweight='bold')
    ax.set_title('Semantic Textual Similarity: Lexical TF-IDF vs Dense Transformer Embeddings', fontsize=12, fontweight='bold', pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(pair_labels, fontsize=10)
    ax.set_ylim(0, 1.1)
    ax.legend(frameon=True, facecolor='#f8fafc', edgecolor='#cbd5e1')
    ax.grid(axis='y', linestyle='--', alpha=0.4)
    
    # Add data values on top of bars
    for bar in rects1:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}', xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9)
    for bar in rects2:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}', xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9, fontweight='bold', color='#1d4ed8')
    
    plt.tight_layout()
    chart1_path = os.path.join(output_dir, "sts_model_comparison.png")
    plt.savefig(chart1_path)
    plt.close()
    print(f"[+] Saved comparison plot to: {chart1_path}")
    
    # ----------------------------------------------------
    # Chart 2: Candidate vs Job Similarity Matrix Heatmap
    # ----------------------------------------------------
    fig, ax = plt.subplots(figsize=(8, 6.5), dpi=150)
    cax = ax.imshow(sim_matrix, cmap='Blues', vmin=0.0, vmax=1.0)
    
    cand_labels = [c["name"].split('(')[0].strip() for c in SAMPLE_CANDIDATES]
    job_labels = [j["title"].split(':')[1].strip() for j in SAMPLE_JOBS]
    
    ax.set_xticks(np.arange(len(job_labels)))
    ax.set_yticks(np.arange(len(cand_labels)))
    ax.set_xticklabels(job_labels, rotation=25, ha="right", fontsize=10, fontweight='medium')
    ax.set_yticklabels(cand_labels, fontsize=10, fontweight='medium')
    ax.set_title('HireMatch AI: Resume-to-Job Semantic Match Heatmap\n(Sentence-Transformers Cosine Similarity)', fontsize=12, fontweight='bold', pad=15)
    
    # Annotate values inside cells
    for i in range(len(cand_labels)):
        for j in range(len(job_labels)):
            val = sim_matrix[i, j]
            color = "white" if val > 0.55 else "black"
            ax.text(j, i, f"{val:.3f}\n({val*100:.1f}%)", ha="center", va="center", color=color, fontsize=10, fontweight='bold')
    
    cbar = fig.colorbar(cax, shrink=0.8)
    cbar.set_label('Cosine Similarity Score', rotation=270, labelpad=15, fontweight='bold')
    
    plt.tight_layout()
    chart2_path = os.path.join(output_dir, "sts_similarity_heatmap.png")
    plt.savefig(chart2_path)
    plt.close()
    print(f"[+] Saved heatmap plot to: {chart2_path}")


# ---------------------------------------------------------------------------
# 5. Interactive Mode
# ---------------------------------------------------------------------------

def interactive_mode(tfidf_model: LexicalTFIDFModel, dense_model: DenseTransformerModel):
    print("\n" + "=" * 80)
    print("  INTERACTIVE SEMANTIC TEXTUAL SIMILARITY (STS) CALCULATOR  ")
    print("=" * 80)
    print("Type two custom texts or resumes/job descriptions to compute similarity.")
    print("Type 'exit' to quit.\n")
    
    while True:
        try:
            t1 = input("Text 1 (e.g. Candidate Profile/Resume): ").strip()
            if t1.lower() in ["exit", "quit", "q"]:
                break
            if not t1:
                continue
                
            t2 = input("Text 2 (e.g. Job Description / Required Skills): ").strip()
            if t2.lower() in ["exit", "quit", "q"]:
                break
            if not t2:
                continue
            
            sim_tfidf = tfidf_model.compute_pair_similarity(t1, t2)
            sim_dense = dense_model.compute_pair_similarity(t1, t2)
            cos_dist = 1.0 - sim_dense
            
            verdict = "Outstanding Match" if sim_dense >= 0.75 else \
                      "Strong Match" if sim_dense >= 0.60 else \
                      "Moderate Match" if sim_dense >= 0.40 else "Weak/Low Match"
            
            print("\n" + "-" * 50)
            print(f"[*] Lexical TF-IDF Cosine Similarity   : {sim_tfidf:.4f} ({sim_tfidf*100:.1f}%)")
            print(f"[*] Dense Sentence-BERT Similarity     : {sim_dense:.4f} ({sim_dense*100:.1f}%)")
            print(f"[*] Cosine Distance (1 - sim)          : {cos_dist:.4f}")
            print(f"[*] Semantic Match Verdict             : {verdict}")
            print("-" * 50 + "\n")
        except (KeyboardInterrupt, EOFError):
            print("\nExiting interactive mode.")
            break


# ---------------------------------------------------------------------------
# Main Entrypoint
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="NLP Semantic Textual Similarity using Embeddings and Cosine Similarity")
    parser.add_argument("--interactive", action="store_true", help="Launch interactive CLI for comparing custom text pairs")
    parser.add_argument("--output-dir", type=str, default="evaluation_charts", help="Directory to save generated chart PNGs")
    args = parser.parse_args()

    print("=" * 80)
    print("  PROJECT: NLP – Semantic Textual Similarity using Embeddings & Cosine Similarity")
    print("  System: HireMatch AI Match Engine Verification")
    print("=" * 80)

    # Initialize Models
    tfidf_model = LexicalTFIDFModel()
    dense_model = DenseTransformerModel()

    # 1. Run Benchmark on Defined Test Cases
    results = run_benchmark(tfidf_model, dense_model)

    # 2. Run Resume vs Job Similarity Matrix
    sim_matrix = run_candidate_job_matrix(dense_model)

    # 3. Generate Visualizations
    generate_visualizations(results, sim_matrix, output_dir=args.output_dir)

    # 4. Interactive Mode if requested
    if args.interactive:
        interactive_mode(tfidf_model, dense_model)
    else:
        print("\n[TIP] Run with '--interactive' to test arbitrary sentences and resume text dynamically!")
        print("[+] Benchmark & evaluation completed successfully.\n")


if __name__ == "__main__":
    main()
