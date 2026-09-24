import {
  PaperAnalysisResult,
  PaperAnalysisSchema,
  ComparisonResult,
  ComparisonMatrixSchema,
  AdvisorResult,
  AdvisorOutputSchema,
} from "@/types/ai";
import { PaperGenerationPrompt, GeneratedDraft, GenerationDraftSchema } from "@/types/generator";

export async function mockAnalyzePaper(extractedText: string, filename?: string): Promise<PaperAnalysisResult> {
  // Derive title from text snippet or filename
  const cleanSnippet = extractedText.slice(0, 300).trim();
  const detectedTitle = filename
    ? filename.replace(/\.pdf$/i, "").replace(/[_-]/g, " ")
    : cleanSnippet.split("\n")[0]?.slice(0, 100) || "Comprehensive Investigation of Emerging Methodologies";

  const rawAnalysis = {
    title: detectedTitle.length > 8 ? detectedTitle : "Multi-Scale Analysis of Machine Learning Representations",
    authors: ["Dr. Sarah Lin", "Prof. David K. Miller", "Dr. Chen Wei"],
    overview: `This study conducts a rigorous empirical and architectural evaluation into scalable representations. The authors analyze computational trade-offs, model capacity, and convergence behavior across heterogeneous benchmark distributions.`,
    problem: `Existing state-of-the-art architectures encounter substantial performance degradation when generalized across out-of-distribution domain shifts, alongside severe memory overhead during high-throughput inference on constrained hardware accelerators.`,
    objectives: `1. Quantify inductive bias limitations across standard neural architectures under covariate shift.\n2. Formulate a modular, low-rank attention formulation that decreases quadratic memory complexity to sub-linear thresholds.\n3. Benchmark diagnostic reliability against established baseline models on open-source datasets.`,
    methodology: `The authors implement a hybrid transformer framework utilizing orthogonal low-rank projections, adaptive layer normalization, and contrastive auxiliary loss functions. Controlled ablations were performed across varied parameter budgets.`,
    dataset: `Evaluated across curated subsets of ImageNet-1K, Common Crawl, and WMT benchmark suites, totaling 1.4 million validated tokens/samples subjected to 5-fold cross-validation.`,
    results: `Achieved a 4.2% accuracy boost over baseline ResNet and ViT architectures, with a 38% reduction in GPU peak VRAM utilization and 2.1x speedup during FP16 inference batching.`,
    findings: `Decoupling attention spatial dimensions from channel mixing significantly improves feature invariance under extreme noise without necessitating over-parameterized model backbones.`,
    limitations: `The approach demonstrates reduced empirical convergence stability when trained with batch sizes smaller than 64. Furthermore, evaluation was restricted to synthetic noise distributions rather than multi-modal clinical/field telemetry.`,
    researchGap: `Sub-quadratic attention mechanisms remain brittle when processing non-contiguous sparse contexts, and real-time inference below 10ms on low-power IoT/mobile microcontrollers is unresolved.`,
    futureWork: `Extend the orthogonal projection framework to multi-modal audio-visual architectures, integrate 4-bit integer quantization kernels, and conduct physical hardware validation on robotic edge platforms.`,
    recommendation: `Recommended for researchers developing memory-constrained deep learning models; practitioners should ensure minimum batch sizes of 128 and employ warm-up schedulers to preserve convergence stability.`,
    confidenceScore: 94,
    gapProminence: 86,
    suggestedResearchQuestion: `How can decoupled low-rank self-attention be generalized to dynamic graph-structured data without losing non-local topological correlations?`,
    suggestedMethodology: `Formulate a message-passing graph neural network that incorporates low-rank orthogonal attention across k-hop neighbor subgraphs with dynamic edge pruning.`,
  };

  return PaperAnalysisSchema.parse(rawAnalysis);
}

export async function mockComparePapers(
  papers: Array<{ id: string; title: string; authors?: string[]; text?: string }>
): Promise<ComparisonResult> {
  const paperList = papers.slice(0, 5).map((p, idx) => ({
    id: p.id || `p-${idx + 1}`,
    title: p.title || `Study ${idx + 1}`,
    authors: p.authors && p.authors.length ? p.authors : [`Lead Investigator et al.`],
    year: 2021 + (idx % 4),
    problem: `High computational complexity and sensitivity to noisy out-of-distribution data (Study ${idx + 1}).`,
    objectives: `Improve inference efficiency while preserving feature representation robustness in real-world benchmarks.`,
    methodology: idx % 2 === 0 ? "Hybrid Transformer with Low-Rank Multi-Head Projections" : "Dense Convolutional Network with Spatial Attention Gates",
    dataset: idx % 2 === 0 ? "Curated ImageNet-1K (1.2M samples)" : "Public domain benchmark corpora with synthetic augmentations",
    algorithms: idx % 2 === 0 ? "Orthogonal Attention + AdamW + Cosine Decay" : "SGD with Momentum + Focal Loss + CutMix",
    results: `Achieved +${3.5 + idx * 0.8}% improvement over baselines with ${25 + idx * 5}% reduced latency.`,
    limitations: `Requires substantial GPU memory for pre-training; limited generalizability to streaming sequential feeds.`,
    researchGap: `Lacks dynamic adaptability when sequence lengths fluctuate during continuous inference.`,
    futureWork: `Investigation of sparse temporal kernels and on-device INT8 quantization.`,
  }));

  const rawComparison = {
    title: `Comparative Matrix: ${papers.map((p) => p.title.slice(0, 30)).join(" vs ")}`,
    papers: paperList,
    crossPaperGap: `Across all ${papers.length} examined studies, there is a consistent trade-off between architectural expressiveness and edge-device hardware feasibility. While each paper successfully mitigates specific accuracy bottlenecks in controlled benchmarks, none address the compound challenge of zero-shot domain adaptation under strict energy constraints (<5W) with guaranteed latency bounds.`,
    commonThemes: [
      "Attention mechanism efficiency bottlenecks",
      "Sensitivity to out-of-distribution covariate shift",
      "Absence of standardized cross-domain evaluation criteria",
    ],
  };

  return ComparisonMatrixSchema.parse(rawComparison);
}

export async function mockAdviseResearch(topic: string, gapSummary: string): Promise<AdvisorResult> {
  const rawAdvisor = {
    potentialDirections: [
      "Hybridization of state space models (e.g., Mamba) with sparse attention layers to achieve linear time complexity on extreme sequences.",
      "Post-training weight-activation INT4 quantization with outlier preservation for ultra-low latency edge microcontrollers.",
      "Cross-modal knowledge distillation transferring invariant priors from foundation vision-language teachers to compact student architectures.",
    ],
    researchQuestions: [
      "RQ1: To what extent does continuous state-space token mixing preserve long-range semantic coherence compared to standard quadratic attention?",
      "RQ2: What is the degradation threshold of diagnostic sensitivity when applying mixed-precision INT8/INT4 quantization to critical lesion detections?",
      "RQ3: Can self-supervised contrastive pre-training on unlabeled field imagery overcome the scarcity of clinical annotations?",
    ],
    possibleMethodologies: [
      "Formulate a dual-branch neural architecture featuring parallel convolutional stems and linear state space layers.",
      "Implement structured pruning guided by first-order gradient sensitivity to eliminate redundant attention heads.",
      "Utilize randomized controlled ablation testing across 5 independent random seeds with non-parametric Wilcoxon signed-rank significance tests.",
    ],
    potentialDatasets: [
      "PlantVillage / FieldPlant agricultural benchmark datasets (Public Open-Access)",
      "MIMIC-CXR multimodal medical imaging database (PhysioNet credentialed)",
      "WMT-14 multi-lingual parallel text translation corpus",
    ],
    relatedLiterature: [
      {
        title: "Attention Is All You Need",
        authors: "Vaswani et al.",
        year: 2017,
        doi: "10.48550/arXiv.1706.03762",
        sourceUrl: "https://arxiv.org/abs/1706.03762",
        verified: true,
      },
      {
        title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
        authors: "Dao et al.",
        year: 2022,
        doi: "10.48550/arXiv.2205.14135",
        sourceUrl: "https://arxiv.org/abs/2205.14135",
        verified: true,
      },
      {
        title: "Deep Residual Learning for Image Recognition",
        authors: "He et al.",
        year: 2016,
        doi: "10.1109/CVPR.2016.90",
        sourceUrl: "https://arxiv.org/abs/1512.03385",
        verified: true,
      },
    ],
    suggestedExperiments: [
      "Conduct empirical FLOPS vs. BLEU/Top-1 Pareto frontier comparison against standard ViT-Base and ResNet-50 baselines.",
      "Measure peak on-chip SRAM cache hit rates under simulated GPU hardware execution profiles.",
      "Perform stress testing under synthetic Gaussian noise, motion blur, and ambient illumination shifts.",
    ],
    potentialLimitations: [
      "High sensitivity to hyperparameter tuning in learning rate warm-up schedules.",
      "Potential memory fragmentation during variable-length batch packing on older hardware architectures.",
      "Reliance on public benchmarks may not capture real-world environmental artifacts.",
    ],
  };

  return AdvisorOutputSchema.parse(rawAdvisor);
}

export async function mockGeneratePaperDraft(prompt: PaperGenerationPrompt): Promise<GeneratedDraft> {
  const title = `A Methodological Investigation into ${prompt.topic}: Formulations, System Architecture, and Empirical Framework`;
  
  const hasVerifiedLit = prompt.verifiedLiterature && prompt.verifiedLiterature.length > 0;
  const finalCitations = hasVerifiedLit
    ? prompt.verifiedLiterature!
    : [
        {
          id: "cit-101",
          citationKey: "Vaswani et al., 2017",
          title: "Attention Is All You Need",
          authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
          year: 2017,
          venue: "NeurIPS 2017",
          doi: "10.48550/arXiv.1706.03762",
          sourceUrl: "https://arxiv.org/abs/1706.03762",
          verified: true,
        },
        {
          id: "cit-102",
          citationKey: "He et al., 2016",
          title: "Deep Residual Learning for Image Recognition",
          authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
          year: 2016,
          venue: "CVPR 2016",
          doi: "10.1109/CVPR.2016.90",
          sourceUrl: "https://arxiv.org/abs/1512.03385",
          verified: true,
        },
        {
          id: "cit-103",
          citationKey: "Dao et al., 2022",
          title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
          authors: ["Tri Dao", "Daniel Y. Fu", "Stefano Ermon", "Christopher Ré"],
          year: 2022,
          venue: "NeurIPS 2022",
          doi: "10.48550/arXiv.2205.14135",
          sourceUrl: "https://arxiv.org/abs/2205.14135",
          verified: true,
        },
      ];

  const literatureReviewContent = hasVerifiedLit
    ? `Academic inquiry into ${prompt.topic} is grounded in verified literature indexed in scholarly discovery repositories.\n\n` +
      prompt.verifiedLiterature!
        .map(
          (c) =>
            `Prior research presented in "${c.title}" (${c.citationKey}) demonstrated foundational theoretical and empirical principles regarding ${c.venue ? `publication in ${c.venue}` : "domain representations"}. Their analysis underscores essential architectural and statistical considerations directly informing our research objectives.`
        )
        .join("\n\n") +
      `\n\nDespite these crucial contributions, existing literature has not systematically integrated ${prompt.methodology} to overcome ${prompt.problem.toLowerCase()}. This work addresses that critical void.`
    : `Academic inquiry into ${prompt.topic} spans several distinct epochs. Foundational investigations by Vaswani et al. (2017) demonstrated that self-attention mechanisms provide superior representation capabilities compared to recurrence, establishing the groundwork for contemporary sequence modeling.\n\nSubsequent advancements by He et al. (2016) demonstrated that identity mapping and residual connections resolve vanishing gradient phenomena in deep networks, facilitating the training of architectures exceeding one hundred layers. Further refinements introduced by Dosovitskiy et al. (2020) translated these architectural paradigms to spatial vision benchmarks, demonstrating that patch-based tokenization competes with convolutional inductive biases.\n\nNevertheless, contemporary literature reveals a persistent schism between theoretical computational capacity and practical resource budgets. Recent contributions by Dao et al. (2022) emphasize that input-output memory bandwidth, rather than theoretical FLOP count, dictates actual hardware execution latency. This investigation builds directly upon these insights.`;

  const rawDraft = {
    title,
    abstract: `This paper presents a formal research draft addressing ${prompt.problem.toLowerCase()}. Driven by the objective to ${prompt.objective.toLowerCase()}, we propose an algorithmic and experimental methodology grounded in ${prompt.methodology}. In contrast to conventional heuristics, this framework incorporates structured mathematical formulations, empirical benchmark definitions, and expected performance characteristics under rigorous evaluation standards. All theoretical and experimental claims are framed as structured proposals for peer review.`,
    keywords: [
      prompt.field,
      "Artificial Intelligence",
      "Empirical Methodology",
      "Architectural Optimization",
      "Benchmark Evaluation",
    ],
    sections: [
      {
        id: "sec-1",
        sectionNumber: "1",
        title: "INTRODUCTION",
        content: `The rapid proliferation of ${prompt.field} has catalyzed transformative advancements across modern computing. Despite substantial progress, foundational challenges persist in addressing ${prompt.problem.toLowerCase()}.\n\nHistorically, researchers have combated these limitations through empirical hyperparameter tuning and over-parameterized neural networks. While these approaches demonstrate efficacy in isolated laboratory environments, their real-world deployment is frequently hampered by high computational demands, vulnerability to out-of-distribution drift, and lack of interpretable theoretical guarantees.\n\nTo overcome these deficiencies, this research advances a novel methodological paradigm: ${prompt.objective.toLowerCase()}. By harmonizing principles from ${prompt.methodology}, we articulate a principled pipeline capable of rigorous deployment while establishing reproducible benchmarks.`,
      },
      {
        id: "sec-2",
        sectionNumber: "2",
        title: "LITERATURE REVIEW",
        content: literatureReviewContent,
      },
      {
        id: "sec-3",
        sectionNumber: "3",
        title: "RESEARCH PROBLEM",
        content: `The overarching research problem addressed herein is formulated as follows: ${prompt.problem}.\n\nSpecifically, existing state-of-the-art implementations exhibit unacceptable performance degradation when subjected to domain variance, alongside prohibitive memory footprint during high-throughput batching. Formalizing solutions to this trade-off is critical for enabling dependable applications.`,
      },
      {
        id: "sec-4",
        sectionNumber: "4",
        title: "RESEARCH OBJECTIVES",
        content: `This research pursues the following concrete objectives:\n1. Formulate a rigorous theoretical model for ${prompt.objective.toLowerCase()} utilizing ${prompt.methodology}.\n2. Design an open-source evaluation benchmark that decouples spatial feature extraction from computational complexity.\n3. Quantify empirical gains against three baseline architectures across standard public corpora.\n4. Establish reproducible ablation studies detailing hyperparameter sensitivity and boundary failure conditions.`,
      },
      {
        id: "sec-5",
        sectionNumber: "5",
        title: "RESEARCH QUESTIONS",
        content: `This inquiry is structured around four primary research questions:\n• RQ1: How does the integration of ${prompt.methodology} affect gradient propagation stability during deep network convergence?\n• RQ2: What quantitative trade-offs emerge between inference throughput and representation fidelity when operating under constrained memory budgets?\n• RQ3: Can the proposed methodology maintain statistical significance when evaluated across out-of-distribution test sets?\n• RQ4: What are the minimal dataset thresholds necessary to avoid catastrophic overfitting in low-sample regimes?`,
      },
      {
        id: "sec-6",
        sectionNumber: "6",
        title: "METHODOLOGY",
        content: `Our proposed methodology adheres to a five-stage experimental protocol: formulation, algorithmic design, dataset preprocessing, training execution, and metric validation.\n\nLet the input space be defined as X and the target representation as Y. We construct an optimization mapping f_θ: X → Y parameterized by weights θ. Utilizing ${prompt.methodology}, the transformation is factorized into hierarchical sub-modules designed to capture multi-scale interactions without quadratic parameter growth.\n\nLoss functions are formulated using a hybrid objective combining cross-entropy with a regularized divergence penalty to penalize uncalibrated model certainty. Optimization is executed via AdamW with cosine annealing decay and automated mixed-precision arithmetic.`,
      },
      {
        id: "sec-7",
        sectionNumber: "7",
        title: "PROPOSED SYSTEM / EXPERIMENT",
        content: `The experimental architecture comprises dual computational pipelines: a training pipeline executing on distributed GPU clusters (NVIDIA A100/H100 80GB) and an evaluation testbed simulating low-power edge accelerators.\n\nEvaluation is conducted using five-fold cross-validation across three distinct benchmark splits. Statistical significance is validated via non-parametric Wilcoxon signed-rank tests with confidence thresholds set at p < 0.01. Comprehensive telemetry, including GPU kernel execution timing, memory bandwidth utilization, and carbon footprint metrics, are logged continuously.`,
      },
      {
        id: "sec-8",
        sectionNumber: "8",
        title: "EXPECTED RESULTS",
        content: `[AI-Generated Research Draft — Expected Analytical Outcomes]\n\nBased on preliminary mathematical modeling and ablation projections, the proposed methodology is expected to achieve:\n• A statistically significant improvement of 3.8% to 5.2% in primary evaluation metrics over baseline standards.\n• A reduction of approximately 35% in peak memory consumption during inference.\n• Latency acceleration of 1.8x to 2.4x on edge-class hardware platforms.\n• Enhanced robustness under adversarial perturbations with less than 6% degradation under extreme noise conditions.`,
      },
      {
        id: "sec-9",
        sectionNumber: "9",
        title: "DISCUSSION",
        content: `The theoretical and expected empirical outcomes illustrate that architectural constraints can be systematically decoupled through ${prompt.methodology}. The primary novelty stems from the modular separation of representation spaces, which eliminates redundant gradient paths.\n\nCompared to prior literature, our framework avoids the pitfalls of unconstrained attention while delivering transparent interpretability. The implications for researchers working on ${prompt.topic} include reduced training costs, faster iteration cycles, and enhanced reproducibility.`,
      },
      {
        id: "sec-10",
        sectionNumber: "10",
        title: "LIMITATIONS",
        content: `Several important limitations must be underscored:\n1. The current draft presents expected theoretical performance which must be validated against physical, multi-institutional clinical/field trials.\n2. In extreme low-sample regimes (<100 training examples), the framework may require auxiliary synthetic augmentations to prevent variance inflation.\n3. The hardware optimization profile assumes CUDA/ROCm compatible execution engines; heterogeneous embedded microcontrollers may exhibit divergent memory dynamics.`,
      },
      {
        id: "sec-11",
        sectionNumber: "11",
        title: "FUTURE WORK",
        content: `Subsequent investigations will target three promising horizons:\n• Extension into multimodal domains combining vision, audio, and structured sensor streams.\n• Exploration of self-supervised foundation pre-training utilizing contrastive predictive coding.\n• Integration of formal verification methods to mathematically guarantee safety bounds in safety-critical deployment contexts.`,
      },
      {
        id: "sec-12",
        sectionNumber: "12",
        title: "CONCLUSION",
        content: `This paper articulates an end-to-end research draft addressing ${prompt.topic}. By detailing the research problem, explicit objectives, structured research questions, and a methodology grounded in ${prompt.methodology}, we establish a strong foundation for empirical peer-reviewed development. Continued exploration of these principles promises to advance state-of-the-art capabilities while ensuring accessible, reproducible science.`,
      },
    ],
    citations: finalCitations,
  };

  const parsed = GenerationDraftSchema.parse(rawDraft);

  return {
    id: `draft-${Date.now()}`,
    title: parsed.title,
    abstract: parsed.abstract,
    keywords: parsed.keywords,
    sections: parsed.sections,
    citations: parsed.citations,
    citationStyle: prompt.citationStyle || "APA",
    wordCount: parsed.sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0),
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function mockRefineSection(
  sectionTitle: string,
  currentContent: string,
  action: "expand" | "shorten" | "academic-tone" | "fix-grammar" | "explain"
): Promise<string> {
  switch (action) {
    case "expand":
      return `${currentContent}\n\nFurthermore, when scrutinizing the underlying mathematical constraints, it becomes evident that parameter variances introduce higher-order perturbation terms. Formalizing these dynamics requires quantifying the Lipschitz constants associated with each layer transition. By incorporating auxiliary regularizers, future iterations can guarantee bounded variance across extreme out-of-distribution domains.`;

    case "shorten":
      const paragraphs = currentContent.split("\n\n");
      return paragraphs.length > 1
        ? paragraphs.slice(0, Math.ceil(paragraphs.length / 2)).join("\n\n")
        : currentContent.slice(0, Math.floor(currentContent.length * 0.65)) + "...";

    case "academic-tone":
      return currentContent
        .replace(/we think/gi, "empirical evidence indicates")
        .replace(/good results/gi, "statistically significant improvements")
        .replace(/bad/gi, "sub-optimal")
        .replace(/a lot of/gi, "substantial cohorts of")
        .replace(/shows that/gi, "substantiates the hypothesis that");

    case "fix-grammar":
      return currentContent.trim() + " [Grammar and academic syntax verified according to publication standards.]";

    case "explain":
      return `### Conceptual Explanation of ${sectionTitle}\n\nThis section addresses the foundational trade-offs of the proposed research. In plain terms:\n• **Core Objective:** Establish reproducible and mathematically grounded criteria.\n• **Key Mechanism:** Eliminates non-essential computational paths to optimize efficiency.\n• **Scientific Significance:** Bridges the gap between empirical laboratory observations and real-world deployment guarantees.\n\n---\n*Original Section Content:*\n${currentContent}`;

    default:
      return currentContent;
  }
}
