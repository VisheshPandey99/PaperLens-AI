import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: "demo@paperlens.ai" },
    });

    if (existingUser) {
      console.log("Database already seeded with demo user.");
      return;
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Free tier demo user
    const demoUser = await prisma.user.create({
      data: {
        name: "Dr. Elena Rostova",
        email: "demo@paperlens.ai",
        passwordHash: hashedPassword,
        plan: "FREE",
        analysisCount: 2, // 2 used out of 5 lifetime
        subscriptionStatus: "INACTIVE",
      },
    });

    // Create Premium tier demo user
    await prisma.user.create({
      data: {
        name: "Prof. Marcus Vance",
        email: "premium@paperlens.ai",
        passwordHash: hashedPassword,
        plan: "PREMIUM",
        analysisCount: 14,
        subscriptionStatus: "ACTIVE",
        stripeCustomerId: "cus_demo12345",
        stripeSubscriptionId: "sub_demo12345",
      },
    });

    // Create sample academic paper
    const paper1 = await prisma.researchPaper.create({
      data: {
        title: "Attention Is All You Need: Scalable Multi-Head Self-Attention in Neural Machine Translation",
        authors: JSON.stringify(["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"]),
        abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
        year: 2017,
        doi: "10.48550/arXiv.1706.03762",
        sourceUrl: "https://arxiv.org/abs/1706.03762",
        externalId: "arxiv:1706.03762",
        venue: "NeurIPS 2017",
        citationCount: 104500,
        isOpenAccess: true,
      },
    });

    // Create sample analysis for demo user
    await prisma.analysis.create({
      data: {
        userId: demoUser.id,
        paperId: paper1.id,
        status: "COMPLETED",
        title: "Attention Is All You Need: Scalable Multi-Head Self-Attention in Neural Machine Translation",
        authors: JSON.stringify(["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"]),
        overview: "Foundational architecture replacing RNNs and CNNs with stacked self-attention and point-wise fully connected layers for sequence-to-sequence modelling.",
        problem: "Sequential computation constraints in RNN/LSTM architectures prevent parallelized training across long input contexts, causing training bottlenecks and gradient degradation.",
        objectives: "Design a sequence transduction model that dispenses with recurrence completely, relying entirely on self-attention to compute input-output representations in parallel.",
        methodology: "Encoder-decoder architecture utilizing 6 stacked identical layers, scaled dot-product attention, multi-head attention mechanisms (8 heads), and sinusoidal positional encodings.",
        dataset: "WMT 2014 English-to-German (4.5 million sentence pairs) and WMT 2014 English-to-French (36 million sentence pairs) benchmarks.",
        results: "Achieved 28.4 BLEU on English-to-German and 41.8 BLEU on English-to-French, surpassing existing ensembles while training in 3.5 days on 8 P100 GPUs.",
        findings: "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions, eliminating path length dependencies.",
        limitations: "Quadratic computational complexity O(n²) with respect to sequence length n; absence of inherent recurrence requires synthetic positional encodings.",
        researchGap: "Sub-quadratic scaling for ultra-long context windows (>4096 tokens) remains unaddressed in standard dot-product attention.",
        futureWork: "Sparse attention patterns, linear attention approximations, recurrence hybridization, and application to non-text modalities.",
        recommendation: "Adopt Transformer attention for sequence modeling but implement linear attention or FlashAttention optimizations for long contexts.",
        confidenceScore: 96,
        gapProminence: 88,
        similarPapers: JSON.stringify([
          {
            id: "sim-1",
            title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
            authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
            year: 2018,
            venue: "NAACL-HLT 2019",
            doi: "10.18653/v1/N19-1423",
            sourceUrl: "https://arxiv.org/abs/1810.04805",
            citationCount: 88000,
            isOpenAccess: true,
            relevanceReason: "Extends Transformer encoder to bidirectional masked language modeling pre-training.",
          },
          {
            id: "sim-2",
            title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
            authors: ["Tri Dao", "Daniel Y. Fu", "Stefano Ermon", "Atri Rudra", "Christopher Ré"],
            year: 2022,
            venue: "NeurIPS 2022",
            doi: "10.48550/arXiv.2205.14135",
            sourceUrl: "https://arxiv.org/abs/2205.14135",
            citationCount: 4200,
            isOpenAccess: true,
            relevanceReason: "Directly solves the quadratic memory I/O bottleneck highlighted in the Transformer limitation.",
          },
        ]),
      },
    });

    // Create a sample generated paper draft
    await prisma.generatedPaper.create({
      data: {
        userId: demoUser.id,
        prompt: JSON.stringify({
          topic: "AI-based early detection of plant diseases via lightweight vision transformers",
          problem: "Crop loss from delayed foliar disease diagnosis in low-resource agricultural edges",
          objective: "Develop an energy-efficient Edge-ViT model capable of high-accuracy foliar disease classification",
          field: "Agricultural Artificial Intelligence & Computer Vision",
          methodology: "Mobile-optimized Vision Transformer with MobileNetV4 hybrid blocks",
          targetLengthWords: 3000,
          citationStyle: "APA",
        }),
        title: "Energy-Efficient Vision Transformers for Early-Stage Foliar Crop Disease Detection on Edge Devices: A Methodological Framework",
        abstract: "Foliar crop diseases account for significant global agricultural yield reductions, demanding rapid, localized diagnosis. While deep convolutional neural networks and standard Vision Transformers achieve remarkable benchmark accuracy, their high computational overhead hinders direct deployment on edge devices with limited power budgets. This paper proposes a hybrid Edge-ViT architecture combining depthwise separable convolutions with windowed self-attention. We outline a systematic methodology, empirical evaluation criteria on PlantVillage and FieldPlant benchmarks, and present expected performance characteristics under quantization constraints.",
        content: JSON.stringify({
          sections: [
            {
              id: "sec-1",
              sectionNumber: "1",
              title: "INTRODUCTION",
              content: "Foliar crop pathogens represent one of the foremost hazards to global food security, accounting for estimated crop yield losses exceeding 20% to 40% annually across major cereal and horticultural crops (Savary et al., 2019). Early diagnosis is crucial to restrict pathogen propagation and prevent irreversible losses. Traditional diagnosis relies on manual visual inspection by agronomists, which is labor-intensive, subjective, and inaccessible in geographically remote agricultural communities.\n\nIn recent years, deep learning methodologies—predominantly Convolutional Neural Networks (CNNs) such as ResNet, DenseNet, and EfficientNet—have demonstrated exceptional diagnostic capability on controlled datasets (Mohanty et al., 2016). More recently, Vision Transformers (ViTs) introduced by Dosovitskiy et al. (2020) have redefined computer vision benchmarks through global receptive fields. However, the quadratic computational complexity of multi-head self-attention restricts vanilla ViTs on edge microcontrollers and solar-powered robotic field monitors. This paper introduces an energy-efficient Edge-ViT paradigm designed specifically for lightweight agricultural deployment.",
            },
            {
              id: "sec-2",
              sectionNumber: "2",
              title: "LITERATURE REVIEW",
              content: "The evolution of automated plant pathology diagnosis has progressed across three foundational epochs: hand-crafted feature engineering, deep convolutional feature extractors, and self-attention vision models.\n\nEarly diagnostic systems relied on color co-occurrence matrices and support vector machines (Camargo & Smith, 2009). The transition to deep CNNs achieved unprecedented classification accuracy on the PlantVillage dataset (Hughes & Salathé, 2015). Despite these successes, CNNs exhibit intrinsic inductive biases that prioritize local texture over long-range spatial context, rendering them susceptible to background illumination fluctuations, soil clutter, and overlapping foliage artifacts.\n\nVision Transformers address this inductive constraint by modeling non-local token dependencies across image patches. Nevertheless, mobile deployment remains constrained by high parameter counts and memory bandwidth limits. Emerging compact architectures like MobileViT (Mehta & Rastegari, 2021) and EfficientViT (Liu et al., 2023) suggest that hybridizing convolution with local attention offers a viable path forward.",
            },
            {
              id: "sec-3",
              sectionNumber: "3",
              title: "RESEARCH PROBLEM",
              content: "Despite rapid algorithmic developments, a critical disconnect persists between high-accuracy laboratory vision models and deployable field hardware in rural agricultural settings. Existing state-of-the-art models demand high-wattage GPU accelerators or continuous cloud connectivity. In real-world environments characterized by intermittent cellular connectivity and low-cost hardware constraints (such as Raspberry Pi 4, ESP32-CAM, or NVIDIA Jetson Nano), existing models experience prohibitive inference latency (>800ms per frame) and excessive battery drain. There is an urgent need for an architecture that maintains diagnostic sensitivity above 96% while reducing latency below 60ms under a 5-watt envelope.",
            },
            {
              id: "sec-4",
              sectionNumber: "4",
              title: "RESEARCH OBJECTIVES",
              content: "This research addresses the aforementioned limitations through four core objectives:\n1. Formulate a hybrid Edge-ViT neural architecture that merges depthwise separable inverted residual blocks with linear-complexity windowed self-attention.\n2. Design a domain-specific 8-bit post-training quantization and knowledge distillation pipeline optimized for agricultural sensor hardware.\n3. Benchmark diagnostic accuracy, FLOP count, and frames-per-second (FPS) across 38 distinct crop-disease pairs under variable ambient illumination.\n4. Evaluate zero-shot field robustness when exposed to realistic agricultural noise, including dew drops, insect damage, and motion blur.",
            },
            {
              id: "sec-5",
              sectionNumber: "5",
              title: "RESEARCH QUESTIONS",
              content: "This investigation is framed around the following scientific questions:\n• RQ1: To what extent does combining inverted bottleneck convolutions with localized self-attention mitigate the loss of spatial detail in micro-lesion pathogen detection?\n• RQ2: How does INT8 and FP8 integer quantization impact diagnostic specificity on visually subtle viral chlorosis compared to fungal necrotic spots?\n• RQ3: Can knowledge distillation from a full-capacity Swin-Transformer teacher model restore diagnostic performance on a 2.4-million-parameter edge student network?",
            },
            {
              id: "sec-6",
              sectionNumber: "6",
              title: "METHODOLOGY",
              content: "The proposed framework integrates a five-stage pipeline: dataset curation, hybrid architectural design, training with progressive image augmentations, post-training quantization, and on-device hardware benchmarking.\n\nThe input image x ∈ R^(H×W×3) is first processed through a 3×3 convolutional stem to reduce spatial dimensions while capturing high-frequency edge textures. Subsequently, feature maps are routed into alternating MobileNetV4 inverted residual blocks and windowed Multi-Head Self-Attention (W-MHSA) modules. Rather than computing all-to-all attention across the entire token map, attention is constrained within local 7×7 token windows, reducing computational complexity from O((H×W)²) to linear O(H×W).",
            },
            {
              id: "sec-7",
              sectionNumber: "7",
              title: "PROPOSED SYSTEM / EXPERIMENT",
              content: "The hardware testing bench comprises an NVIDIA Jetson Orin Nano (8GB) and a Raspberry Pi 5 equipped with an external Coral Edge TPU. The training setup utilizes PyTorch 2.4 with AdamW optimizer, cosine annealing learning rate scheduler starting at 5e-4, and stochastic depth rate of 0.1. Data augmentations include RandAugment, MixUp (α=0.8), and simulated agricultural field conditions (random shadows, simulated lens blur, and chromatic aberration).",
            },
            {
              id: "sec-8",
              sectionNumber: "8",
              title: "EXPECTED RESULTS",
              content: "Based on theoretical modeling and comparative validation against baseline MobileNetV3 and ResNet-50 architectures, the proposed Edge-ViT is expected to achieve:\n• Top-1 classification accuracy of 97.4% (±0.3%) on the PlantVillage 38-class benchmark.\n• Parameter footprint of 2.65 million parameters, representing an 88% reduction compared to standard ViT-Base.\n• Hardware inference latency of 22ms per frame on Jetson Orin Nano (INT8 TensorRT) and 68ms on Raspberry Pi 5 (ONNX Runtime).\n• Energy consumption below 3.8 watts during continuous 30 FPS video stream inference.",
            },
            {
              id: "sec-9",
              sectionNumber: "9",
              title: "DISCUSSION",
              content: "The expected performance indicates that non-local attention mechanisms can be successfully condensed into sub-3-million parameter envelopes without compromising micro-lesion feature extraction. The hybrid combination resolves the primary limitation of pure CNNs—namely, sensitivity to confounding background clutter—by allowing the model to attend to the global leaf structure while retaining acute sensitivity to localized chlorotic margins.",
            },
            {
              id: "sec-10",
              sectionNumber: "10",
              title: "LIMITATIONS",
              content: "Several methodological limitations must be acknowledged:\n1. The current draft relies upon public benchmark distributions where disease severity is cataloged primarily at advanced symptomatic stages, leaving ultra-early asymptomatic pre-visual incubation stages undetected.\n2. In vitro laboratory background leaves from standard datasets may not fully replicate real-world multi-canopy occlusions.\n3. The synthetic expected results require formal empirical validation on physical field trials under varying geographical micro-climates.",
            },
            {
              id: "sec-11",
              sectionNumber: "11",
              title: "FUTURE WORK",
              content: "Subsequent research will investigate:\n• Integration of multimodal sensor telemetry (e.g., hyper-spectral narrow-band reflectance and ambient relative humidity) into the transformer cross-attention blocks.\n• Federated learning frameworks enabling cooperative on-farm model updates without uploading proprietary agricultural imagery to centralized cloud servers.\n• Active learning pipelines for continuous automated annotation of novel crop pathogen variants.",
            },
            {
              id: "sec-12",
              sectionNumber: "12",
              title: "CONCLUSION",
              content: "This paper presents an energy-efficient Edge Vision Transformer framework addressing the critical trade-off between diagnostic accuracy and hardware tractability in precision agriculture. By combining localized window self-attention with depthwise convolutional stems, the proposed framework establishes a viable methodology for autonomous, on-device foliar crop disease identification, advancing the democratization of AI-assisted agricultural stewardship.",
            },
          ],
          citations: [
            {
              id: "cit-1",
              citationKey: "Dosovitskiy et al., 2020",
              title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
              authors: ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov"],
              year: 2020,
              venue: "ICLR 2021",
              doi: "10.48550/arXiv.2010.11929",
              sourceUrl: "https://arxiv.org/abs/2010.11929",
              verified: true,
            },
            {
              id: "cit-2",
              citationKey: "Mehta & Rastegari, 2021",
              title: "MobileViT: Light-weight, General-purpose, and Mobile-friendly Vision Transformer",
              authors: ["Sachin Mehta", "Mohammad Rastegari"],
              year: 2021,
              venue: "ICLR 2022",
              doi: "10.48550/arXiv.2110.02178",
              sourceUrl: "https://arxiv.org/abs/2110.02178",
              verified: true,
            },
            {
              id: "cit-3",
              citationKey: "Savary et al., 2019",
              title: "The global burden of pathogens and pests on major food crops",
              authors: ["Serge Savary", "Laetitia Willocquet", "Sarah J. Pethybridge"],
              year: 2019,
              venue: "Nature Ecology & Evolution",
              doi: "10.1038/s41559-018-0793-5",
              sourceUrl: "https://www.nature.com/articles/s41559-018-0793-5",
              verified: true,
            },
          ],
        }),
        status: "DRAFT",
        wordCount: 2450,
        citationStyle: "APA",
      },
    });

    console.log("Database seeded successfully with demo and premium users, sample papers, and drafts.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
