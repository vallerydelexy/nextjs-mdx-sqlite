export const caseStudies = {
  sailpro: {
    slug: "sailpro",
    title: "SailPro Tactical Marine Navigation",
    subtitle: "Offline-First Marine Telemetry & Vessel Tracking Engine",
    year: "2025",
    stacks: ["Next.js", "TypeScript", "Tailwind CSS", "IndexedDB", "WebSockets", "Leaflet"],
    problem:
      "Competitive sailing and offshore marine navigation operate under severe physical constraints: continuous salt spray, high-glare sunlight, and total loss of cellular connectivity once vessels leave coastal ranges. Standard cloud-dependent navigation apps fail immediately when boats navigate beyond cellular line-of-sight.",
    architecture:
      "Engineered an offline-first Progressive Web App (PWA) with bidirectional WebSocket synchronization. Navigation waypoints, nautical bathymetry tiles, and route tracks are cached locally in IndexedDB using custom service worker routing. When cellular or satellite signals reconnect, an optimistic replication layer reconciles pending vessel telemetry without blocking real-time UI rendering.",
    bottleneck:
      "Managing continuous 60fps vector map panning and tactical layline calculations under limited mobile CPU and battery constraints. Solved by decoupling telemetry ingestion from canvas rendering via Web Workers, preventing main-thread UI jank during intense tactical race maneuvering.",
    impact:
      "Zero-latency map responsiveness in offshore offline conditions, supporting persistent background GPS tracking and instant tactical recalculation.",
  },

  bagipulsa: {
    slug: "bagipulsa",
    title: "BagiPulsa Digital Fintech Platform",
    subtitle: "High-Throughput Balance Settlements & Real-Time Socket Stream",
    year: "2024",
    stacks: ["Flutter", "Node.js", "MySQL", "WebSockets", "Tailwind CSS"],
    problem:
      "PPOB and digital cellular credit transactions require near-instant settlement. During peak periods, concurrent automated transactions across thousands of mobile agents caused race conditions in balance deductions and duplicate debit requests.",
    architecture:
      "Architected a dedicated transaction pipeline utilizing persistent WebSocket channels paired with an event-driven reconciliation backend. The mobile client was developed in Flutter using clean architecture with isolated data sources, reactive repository layers, and deterministic state management.",
    bottleneck:
      "Eliminating double-spend vulnerabilities and intermittent connection drops common on mobile cellular networks in rural Indonesia. Implemented idempotent transaction tokens with server-side distributed locking and automatic exponential-backoff socket reconnection with queued request flushing.",
    impact:
      "Handled high-volume daily transactions with zero duplicate deductions and instant transaction status pushes across agent devices.",
  },

  tehkota: {
    slug: "tehkota",
    title: "Tehkota Enterprise ERP & Franchise Platform",
    subtitle: "Multi-Outlet Beverage Franchise Supply Chain & Sales Audit",
    year: "2024",
    stacks: ["Next.js", "React", "CodeIgniter", "Tailwind CSS", "MySQL"],
    problem:
      "Managing supply chain logistics, syrup inventory, raw ingredients, and daily sales auditing across hundreds of beverage franchise outlets required replacing fragmented manual WhatsApp spreadsheets with a consolidated, secure enterprise dashboard.",
    architecture:
      "Engineered an internal Enterprise Resource Planning (ERP) platform connecting warehouse inventory dispatch, franchisee reordering workflows, and automated point-of-sale audits. The frontend was built with Next.js for high-speed responsiveness, interfacing with structured REST endpoints.",
    bottleneck:
      "Consolidating end-of-day sales reconciliations across disparate franchise branches with varying network quality. Designed batch upload pipelines with client-side validation to prevent corrupted receipt submissions.",
    impact:
      "Streamlined nationwide franchisee logistics, providing management real-time visibility into stock depletion, branch revenue, and supply demands.",
  },

  versus: {
    slug: "versus",
    title: "Versus Real Estate Agent Platform",
    subtitle: "Property Ecosystem with Synchronized Cross-Platform Agents",
    year: "2021",
    stacks: ["Next.js", "Flutter", "MySQL", "Bootstrap", "Figma"],
    problem:
      "Property agents and prospective buyers lacked a unified portal in East Java to coordinate verified listings, commissions, agent referrals, and direct client communication in a transparent, real-time environment.",
    architecture:
      "Developed a dual ecosystem comprising a Next.js web portal for high-SEO property browsing and administrative control, alongside a Flutter mobile application for registered real estate agents to capture on-site property photos, manage client leads, and track commission milestones.",
    bottleneck:
      "High-resolution property photo processing on low-end agent mobile devices caused frequent memory crashes. Built client-side image compression and staged progressive uploads prior to server-side CDN ingestion.",
    impact:
      "Delivered a fully integrated property ecosystem with unified agent management, structured commission tracking, and seamless cross-platform lead distribution.",
  },

  atapkita: {
    slug: "atapkita",
    title: "Atapkita Online Crowdfunding",
    subtitle: "Secure Social Fundraising & Transparent Donation Pipeline",
    year: "2023",
    stacks: ["Next.js", "CodeIgniter", "Tailwind CSS", "MySQL"],
    problem:
      "Online fundraising campaigns face intense scrutiny regarding donation transparency, campaign verification, and immediate payment reconciliation for urgent medical emergencies.",
    architecture:
      "Built a modern Next.js donation interface integrated with automated Indonesian payment gateways (Virtual Accounts, QRIS, e-Wallets). Configured dynamic campaign tracking, automated fund disbursement audits, and social sharing optimizations.",
    bottleneck:
      "Handling traffic spikes during viral social media campaigns while maintaining sub-second donation confirmation and instant cryptographic receipt generation.",
    impact:
      "Facilitated thousands of successful community campaigns with transparent real-time balance auditing and instant payment gateway reconciliation.",
  },

  pixelninja: {
    slug: "pixelninja",
    title: "Pixel Ninja Creative Academy",
    subtitle: "LMS Learning Management Platform for Design & Media Arts",
    year: "2022",
    stacks: ["WordPress", "MySQL", "Bootstrap", "LMS"],
    problem:
      "Delivering interactive digital art, 3D modeling, and motion graphics video courses required custom student progress tracking, interactive quizzes, and protected video streaming before the platform was acquired.",
    architecture:
      "Architected a customized Learning Management System (LMS) with secure curriculum gating, student assignment submissions, automated certification issuing, and optimized video player delivery.",
    bottleneck:
      "Preventing unauthorized media downloading while keeping video streaming smooth across Indonesian broadband infrastructure. Configured token-authenticated video streams and adaptive bitrates.",
    impact:
      "Successfully scaled the creative community platform with thousands of active learners, ultimately leading to acquisition.",
  },

  dsc: {
    slug: "dsc",
    title: "Duta Sarana Computer E-Commerce & Retail",
    subtitle: "Enterprise IT Distributor, Retail Network & Authorized Service Portal",
    year: "2020",
    stacks: ["WordPress", "MySQL", "Bootstrap", "SEO", "WooCommerce"],
    problem:
      "Beroperasi sejak tahun 1987 sebagai distributor dan penyedia IT terpercaya di Indonesia dengan jaringan cabang di Surabaya, Malang, Kediri, Solo, Yogyakarta, dan Denpasar, Duta Sarana membutuhkan platform web modern untuk menyajikan katalog ribuan SKU (komputer, laptop, printer, proyektor, aksesoris) serta layanan Authorized Service Center resmi (Canon, HP, Brother).",
    architecture:
      "Membangun katalog e-commerce dan portal korporat berbasis WordPress & WooCommerce dengan kustomisasi struktur taksonomi multi-kategori, sistem pencarian instan untuk suku cadang & konsumabel resmi, serta integrasi kontak per cabang untuk konsultasi B2B dan servis ritel.",
    bottleneck:
      "Mengoptimalkan performa halaman dan kecepatan indeks pencarian (SEO) untuk ribuan produk perangkat keras dan tinta/toner tanpa membebani query database relasional pada server hosting bersama.",
    impact:
      "Meningkatkan visibilitas organik Google secara signifikan di wilayah Jawa & Bali, mempermudah ribuan pelanggan mengakses informasi produk resmi, promo distributor, dan lokasi service center resmi sejak 1987.",
  },
};
