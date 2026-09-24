import { AcademicPaper, ResearchSearchFilters, ResearchSearchResponse } from "@/types/research";

export const MOCK_ACADEMIC_PAPERS: AcademicPaper[] = [
  {
    id: "sem-101",
    title: "Attention Is All You Need: Scalable Multi-Head Self-Attention in Neural Machine Translation",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Lukasz Kaiser", "Illia Polosukhin"],
    year: 2017,
    venue: "Advances in Neural Information Processing Systems (NeurIPS 2017)",
    abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
    citationCount: 104520,
    doi: "10.48550/arXiv.1706.03762",
    isOpenAccess: true,
    pdfUrl: "https://arxiv.org/pdf/1706.03762.pdf",
    sourceUrl: "https://arxiv.org/abs/1706.03762",
    sourceProvider: "Semantic Scholar",
    fieldsOfStudy: ["Computer Science", "Artificial Intelligence", "Computational Linguistics"],
  },
  {
    id: "sem-102",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
    year: 2016,
    venue: "IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2016)",
    abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.",
    citationCount: 198400,
    doi: "10.1109/CVPR.2016.90",
    isOpenAccess: true,
    pdfUrl: "https://arxiv.org/pdf/1512.03385.pdf",
    sourceUrl: "https://arxiv.org/abs/1512.03385",
    sourceProvider: "Semantic Scholar",
    fieldsOfStudy: ["Computer Science", "Computer Vision", "Pattern Recognition"],
  },
  {
    id: "openalex-201",
    title: "Highly accurate protein structure prediction with AlphaFold",
    authors: ["John Jumper", "Richard Evans", "Alexander Pritzel", "Tim Green", "Michael Figurnov", "Olaf Ronneberger", "Kathryn Tunyasuvunakool", "Russ Bates", "Demis Hassabis"],
    year: 2021,
    venue: "Nature 596, 583–589",
    abstract: "Proteins are essential to life, and understanding their structure can facilitate a mechanistic understanding of their function. We demonstrate that AlphaFold can regularly predict 3D protein structures to atomic accuracy even in cases where no similar structure is known, demonstrating computational structural biology breakthroughs.",
    citationCount: 22400,
    doi: "10.1038/s41586-021-03819-2",
    isOpenAccess: true,
    pdfUrl: "https://www.nature.com/articles/s41586-021-03819-2.pdf",
    sourceUrl: "https://www.nature.com/articles/s41586-021-03819-2",
    sourceProvider: "OpenAlex",
    fieldsOfStudy: ["Biology", "Bioinformatics", "Structural Biology", "Artificial Intelligence"],
  },
  {
    id: "crossref-301",
    title: "Language Models are Few-Shot Learners",
    authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder", "Melanie Subbiah", "Jared Kaplan", "Prafulla Dhariwal", "Arvind Neelakantan", "Dario Amodei", "Sam Altman"],
    year: 2020,
    venue: "Advances in Neural Information Processing Systems (NeurIPS 2020)",
    abstract: "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. We demonstrate that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes reaching competitiveness with prior state-of-the-art fine-tuning approaches.",
    citationCount: 42100,
    doi: "10.48550/arXiv.2005.14165",
    isOpenAccess: true,
    pdfUrl: "https://arxiv.org/pdf/2005.14165.pdf",
    sourceUrl: "https://arxiv.org/abs/2005.14165",
    sourceProvider: "Crossref",
    fieldsOfStudy: ["Computer Science", "Natural Language Processing", "Artificial Intelligence"],
  },
  {
    id: "sem-103",
    title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
    authors: ["Tri Dao", "Daniel Y. Fu", "Stefano Ermon", "Atri Rudra", "Christopher Ré"],
    year: 2022,
    venue: "Advances in Neural Information Processing Systems (NeurIPS 2022)",
    abstract: "Transformers are slow and memory-hungry on long sequences, as the time and memory complexity of self-attention are quadratic in sequence length. We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and GPU on-chip SRAM.",
    citationCount: 4320,
    doi: "10.48550/arXiv.2205.14135",
    isOpenAccess: true,
    pdfUrl: "https://arxiv.org/pdf/2205.14135.pdf",
    sourceUrl: "https://arxiv.org/abs/2205.14135",
    sourceProvider: "Semantic Scholar",
    fieldsOfStudy: ["Computer Science", "Parallel Computing", "Machine Learning"],
  },
  {
    id: "openalex-202",
    title: "Generative Adversarial Nets",
    authors: ["Ian Goodfellow", "Jean Pouget-Abadie", "Mehdi Mirza", "Bing Xu", "David Warde-Farley", "Sherjil Ozair", "Aaron Courville", "Yoshua Bengio"],
    year: 2014,
    venue: "Advances in Neural Information Processing Systems (NIPS 2014)",
    abstract: "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.",
    citationCount: 68900,
    doi: "10.1145/3422622",
    isOpenAccess: true,
    pdfUrl: "https://arxiv.org/pdf/1406.2661.pdf",
    sourceUrl: "https://arxiv.org/abs/1406.2661",
    sourceProvider: "OpenAlex",
    fieldsOfStudy: ["Computer Science", "Machine Learning", "Generative Modeling"],
  },
  {
    id: "crossref-302",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    year: 2018,
    venue: "NAACL-HLT 2019",
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    citationCount: 91400,
    doi: "10.18653/v1/N19-1423",
    isOpenAccess: true,
    pdfUrl: "https://arxiv.org/pdf/1810.04805.pdf",
    sourceUrl: "https://arxiv.org/abs/1810.04805",
    sourceProvider: "Crossref",
    fieldsOfStudy: ["Computer Science", "Natural Language Processing"],
  },
  {
    id: "sem-104",
    title: "Mastering the Game of Go with Deep Neural Networks and Tree Search",
    authors: ["David Silver", "Aja Huang", "Chris J. Maddison", "Arthur Guez", "Laurent Sifre", "George van den Driessche", "Julian Schrittwieser", "Ioannis Antonoglou", "Demis Hassabis"],
    year: 2016,
    venue: "Nature 529, 484–489",
    abstract: "The game of Go has long been viewed as the most challenging of classic games for artificial intelligence. We introduce a new approach to computer Go that uses 'value networks' to evaluate board positions and 'policy networks' to select moves, defeating the human European Go champion by 5 games to 0.",
    citationCount: 16200,
    doi: "10.1038/nature16961",
    isOpenAccess: false,
    sourceUrl: "https://www.nature.com/articles/nature16961",
    sourceProvider: "Semantic Scholar",
    fieldsOfStudy: ["Computer Science", "Reinforcement Learning", "Game Theory"],
  },
  {
    id: "openalex-203",
    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
    authors: ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov", "Dirk Weissenborn", "Xiaohua Zhai", "Thomas Unterthiner", "Mostafa Dehghani", "Matthias Minderer", "Georg Heigold", "Sylvain Gelly", "Jakob Uszkoreit", "Neil Houlsby"],
    year: 2020,
    venue: "International Conference on Learning Representations (ICLR 2021)",
    abstract: "While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. We show that this reliance on CNNs is not necessary and a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks.",
    citationCount: 38700,
    doi: "10.48550/arXiv.2010.11929",
    isOpenAccess: true,
    pdfUrl: "https://arxiv.org/pdf/2010.11929.pdf",
    sourceUrl: "https://arxiv.org/abs/2010.11929",
    sourceProvider: "OpenAlex",
    fieldsOfStudy: ["Computer Science", "Computer Vision", "Machine Learning"],
  }
];

export async function searchMockResearch(filters: ResearchSearchFilters): Promise<ResearchSearchResponse> {
  const query = filters.query.toLowerCase().trim();
  
  let results = MOCK_ACADEMIC_PAPERS.filter((paper) => {
    if (!query) return true;
    const inTitle = paper.title.toLowerCase().includes(query);
    const inAbstract = paper.abstract.toLowerCase().includes(query);
    const inAuthors = paper.authors.some((a) => a.toLowerCase().includes(query));
    const inField = paper.fieldsOfStudy?.some((f) => f.toLowerCase().includes(query));
    return inTitle || inAbstract || inAuthors || inField;
  });

  if (filters.openAccessOnly) {
    results = results.filter((p) => p.isOpenAccess);
  }

  if (filters.yearMin) {
    results = results.filter((p) => p.year >= (filters.yearMin || 0));
  }

  if (filters.yearMax) {
    results = results.filter((p) => p.year <= (filters.yearMax || 9999));
  }

  if (filters.minCitations) {
    results = results.filter((p) => p.citationCount >= (filters.minCitations || 0));
  }

  const offset = filters.offset || 0;
  const limit = filters.limit || 10;
  const paginated = results.slice(offset, offset + limit);

  return {
    papers: paginated,
    total: results.length,
    query: filters.query,
    source: "Academic Index (Verified Database)",
  };
}
