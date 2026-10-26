import { Product, Silhouette, Review } from '../types';

export const SILHOUETTES: Silhouette[] = [
  {
    id: 't-shirt',
    name: 'T-Shirt',
    category: 'Heavyweight Boxy Tee',
    basePrice: 1299,
    printPrice: 400,
    icon: 'apparel',
    gsm: '240 GSM 100% Combed Cotton',
    material: 'Heavyweight boxy drop-shoulder cut, bio-washed and pre-shrunk for premium streetwear drape.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 'washed-black', name: 'Washed Black', hex: '#1e1e1e', filterStyle: 'brightness(0.9) contrast(1.1)' },
      { id: 'vintage-bone', name: 'Vintage Bone White', hex: '#eae7df', filterStyle: 'brightness(1.5) contrast(0.9) sepia(0.2)' },
      { id: 'forest-moss', name: 'Forest Moss', hex: '#2d3a2e', filterStyle: 'hue-rotate(85deg) brightness(0.85)' },
      { id: 'dusty-slate', name: 'Dusty Slate', hex: '#4e5b67', filterStyle: 'hue-rotate(180deg) brightness(1.1)' },
      { id: 'rust-brown', name: 'Rust Brown', hex: '#6d3625', filterStyle: 'hue-rotate(330deg) brightness(0.9) saturate(1.2)' },
    ],
    mockupImages: {
      front: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz1y2uYWBENSL_kQoWrQSNO7acytAkxEJZzNjXDYitOUoUpDIeR1BsiOmb1lvmj6n1q4iZIvMN05wEfCtLFODXVdCGmATA5vFsyo3SenCPMzhDPsUOqR3pG-SR7KBfoID96_rdx1enkCvDCWTMWUKzZZg0HjXpY_4dOKjVPKWy1vcefeiQRd6AK5imS8m90kskJets5ATBPBD6-Y-ZiXy3FgUA144pDrJM71OIu2ty4yW0Wy2QDWw',
      back: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9o7ygGtvCYcX_paLNV6KOASb7jAreSRs18MJSOZLfnMlE-wbyEZQuq5_T8nbXAOb-iDVzawJybsG37YobZlUkDP5iAj3V5kz7Y-i8TVZrPZuxIzyCpG2J4xJ7FYSKeys16z8n3Y3QPeuIb-bKQK8LUodncXBhocueCreZ_lD3QdnMDXuSEQ-hc7Y4HgmzYosg57qPHMZcY7-FlzU1W-4HafU8R27AlSreKmW2UbqiFnggeEFF_4',
    },
    printSafeDims: {
      label: 'PRINT-SAFE AREA (12" X 16")',
      widthCm: '30.5 CM',
      heightCm: '40.6 CM',
    },
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    category: 'Dense French Terry Hoodie',
    basePrice: 2499,
    printPrice: 500,
    icon: 'dry_cleaning',
    gsm: '420 GSM 100% French Terry Cotton',
    material: 'Architectural heavyweight drop-shoulder pullover with double-layer hood and heavy ribbed hem.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 'washed-black', name: 'Washed Black', hex: '#1e1e1e' },
      { id: 'vintage-bone', name: 'Vintage Bone White', hex: '#eae7df' },
      { id: 'forest-moss', name: 'Forest Moss', hex: '#2d3a2e' },
      { id: 'dusty-slate', name: 'Dusty Slate', hex: '#4e5b67' },
      { id: 'rust-brown', name: 'Rust Brown', hex: '#6d3625' },
    ],
    mockupImages: {
      front: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpOVbCdhu2RI7R346i35ZbvVi32x9etGxNLP-nv15jx8BBJ1_wZQJLPjd2MtWR9rxBPWNmexXpZCXMf8nmVwTjnkOxIwgiGd_6-7SK74JdSKvB7cax9Y6_xIWwaW7gIH-_SIMou5f4oCjwzQlZBt5Wn1M5pLXozNEwC0Z8rxq0OyMtqKz8L9kzgTDt6s1e33Hi8euietlR24Zz_ii4IdVVzfC-EnqqDFV3IeHztmHQvwZ8SFHHnjw',
      back: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpESsX3dJdDFoXPd5qLcxuF7RQ1jIiFzacK7ecIdRtbaaSM0pWl26TRRxq4wdmygwlQCKQMIF8KpNqD-fglblQCSy0F-UgbcPzQDgsjtXCcPFUrd3znwf73aJOUFYzmr3yRBZ7o74ZLQhTyvDMuOgOxSqqfRI_5G7_CFws1xaQMVFF1dFiWSQ8BySdtfuoAyTFLQpjjH8en8R5HK6MRANklVj2z_9DohhgCN0HK96rBDL6nd6G2Nk',
    },
    printSafeDims: {
      label: 'PRINT-SAFE AREA (12" X 14")',
      widthCm: '30.5 CM',
      heightCm: '35.5 CM',
    },
  },
  {
    id: 'mug',
    name: 'Ceramic Mug',
    category: 'Matte Vessel',
    basePrice: 599,
    printPrice: 200,
    icon: 'coffee',
    gsm: '11oz High-Density Ceramic',
    material: 'Matte tactile glazed stoneware with microwave & dishwasher-safe sub-cure finish.',
    sizes: ['Standard 11oz', 'Oversized 15oz'],
    colors: [
      { id: 'vintage-bone', name: 'Raw Matte Chalk', hex: '#eae7df' },
      { id: 'washed-black', name: 'Matte Pitch', hex: '#1e1e1e' },
      { id: 'dusty-slate', name: 'Stone Grey', hex: '#4e5b67' },
    ],
    mockupImages: {
      front: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcPn4XO3hU-V7FdtFQrivEJBVg8IRx_yg3bgdwrD-uPFHgexkncYh_S4WWeCSVa49REwZGNWVO4z_h1IKvUq3XkefaYJRncnI8OB0KahMrGCkJ4kK69Yl7t4vGaFPMDU_31cZzbfp8j1k0ayFHsKlZgMSIfhP50qrI21MINXDdKVaVw_wiGn0dKUDlCuy8jeB3auT1HSzD_frmfPxH456ZjshEF5MmPH96RX_G6O8fh0b8YwRTrfs',
      back: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcPn4XO3hU-V7FdtFQrivEJBVg8IRx_yg3bgdwrD-uPFHgexkncYh_S4WWeCSVa49REwZGNWVO4z_h1IKvUq3XkefaYJRncnI8OB0KahMrGCkJ4kK69Yl7t4vGaFPMDU_31cZzbfp8j1k0ayFHsKlZgMSIfhP50qrI21MINXDdKVaVw_wiGn0dKUDlCuy8jeB3auT1HSzD_frmfPxH456ZjshEF5MmPH96RX_G6O8fh0b8YwRTrfs',
    },
    printSafeDims: {
      label: 'PRINT-SAFE AREA (8" X 3.5")',
      widthCm: '20.0 CM',
      heightCm: '9.0 CM',
    },
  },
  {
    id: 'cap',
    name: 'Snapback Cap',
    category: 'Unstructured Dad Hat',
    basePrice: 899,
    printPrice: 300,
    icon: 'sports_baseball',
    gsm: '280 GSM Washed Cotton Twill',
    material: 'Low-profile 6-panel unstructured silhouette with brass buckle and custom micro-print.',
    sizes: ['One Size (Adjustable)'],
    colors: [
      { id: 'washed-black', name: 'Washed Black', hex: '#1e1e1e' },
      { id: 'vintage-bone', name: 'Vintage Bone', hex: '#eae7df' },
      { id: 'forest-moss', name: 'Forest Moss', hex: '#2d3a2e' },
    ],
    mockupImages: {
      front: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSS96Sq6AuFSiNN_mRA5r0DtmXeIvIc5WiPjF81epv4WZaTcGTSv5d28cFJqgIGXj4v8mNuIAQ-faUiaQKwIA5WznstYxLk2mPxYksSDi5WZ5VfbW6kINlDdl4tvFWGYJs-Vdgp89DSqXPyhhemv2mSMBpwG7KdiOD630eox6nw7nqSW-QEDs85KN_w0O3_NnXLUO84hVyZIoIrJuolaCx6AzC-TiWeFVdMKe1GkWPVhDZwewSK0g',
      back: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSS96Sq6AuFSiNN_mRA5r0DtmXeIvIc5WiPjF81epv4WZaTcGTSv5d28cFJqgIGXj4v8mNuIAQ-faUiaQKwIA5WznstYxLk2mPxYksSDi5WZ5VfbW6kINlDdl4tvFWGYJs-Vdgp89DSqXPyhhemv2mSMBpwG7KdiOD630eox6nw7nqSW-QEDs85KN_w0O3_NnXLUO84hVyZIoIrJuolaCx6AzC-TiWeFVdMKe1GkWPVhDZwewSK0g',
    },
    printSafeDims: {
      label: 'EMBROIDERY & PRINT AREA (4" X 2.2")',
      widthCm: '10.2 CM',
      heightCm: '5.5 CM',
    },
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-kintsugi',
    title: "'Kintsugi Broken Mindset' Heavy Tee",
    slug: 'kintsugi-broken-mindset',
    price: 1899,
    originalPrice: 2199,
    badge: '240 GSM HEAVY',
    edition: 'Edition 04 / Boxy Cut',
    category: 't-shirt',
    gsm: '240 GSM',
    fit: 'Boxy Drop-Shoulder',
    fabric: '100% Combed Compact Cotton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9fscVt6GrJSN95cILIsDfxU605xJht-_cbYsZ4elH-vX6a2_rN0UDcIWIispWLf6I9029FFtcoO4GeZ2pHLyN-WdZbGcIt-99jMz09hGv48XQHb8cVBUPDmNrjwyJ5A3a30RKjmmQnTvIO09eohhc6RtCzQ0Lj5gHl7u75j1VRyJeKtgSdO1Xs0W01OumRVuK5c3kpRveod-2gwcd3D5k4qD_VAH8Bp0DNZa1bbx7-K6j_7C95Ds',
    colors: [
      { name: 'Washed Black', hex: '#1e1e1e' },
      { name: 'Vintage Bone', hex: '#e8e6df' },
      { name: 'Olive Moss', hex: '#4a5043' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Inspired by Japanese Kintsugi art philosophy where breakage and repair are treated as part of the history of an object rather than something to disguise. Screen printed with high-density gold & bone pigments on 240 GSM pre-shrunk cotton.',
  },
  {
    id: 'prod-offline',
    title: "'Offline Is The New Luxury' Fit Tee",
    slug: 'offline-is-the-new-luxury',
    price: 1699,
    originalPrice: 1999,
    badge: 'BOXY FIT',
    edition: 'Edition 02 / Combed Cotton',
    category: 't-shirt',
    gsm: '240 GSM',
    fit: 'Contemporary Boxy Fit',
    fabric: '100% Bio-Washed Combed Cotton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDouf07IRg1R8fF1MZAQIcg4qtYUPGJZbDjmC0JjaFcZ3ihGL4gWbKqwRj9ppeJuq0oK0Z5p-XwWRqSP83YsSR8miVmfrp6o7SUmu8r1zhNHz4H4NXXISO-90jQORU185e51El9W75flsTs8sNQUUBAZagya-b2cGJfQ5I-U2ukoK8ore286KgMZAuif9_MKex-Fu58z5rKYKm0n75gG1tMDyfmWyN1YgrBgv6Vsx3VlISbHIbFv1c',
    colors: [
      { name: 'Chalk White', hex: '#f4f4f2' },
      { name: 'Slate Gray', hex: '#5f6368' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Sleek bold architectural sans-serif typography across the chest. Reflecting the calm luxury of intentional disconnection. High-density DTF rubberized matte feel.',
  },
  {
    id: 'prod-metropolitan',
    title: "'Metropolitan Chaos' 420 GSM Hoodie",
    slug: 'metropolitan-chaos-hoodie',
    price: 3299,
    originalPrice: 3899,
    badge: 'BESTSELLER',
    edition: 'Edition 01 / French Terry',
    category: 'hoodie',
    gsm: '420 GSM',
    fit: 'Oversized Streetwear Silhouette',
    fabric: '100% Heavy French Terry Looped Cotton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpESsX3dJdDFoXPd5qLcxuF7RQ1jIiFzacK7ecIdRtbaaSM0pWl26TRRxq4wdmygwlQCKQMIF8KpNqD-fglblQCSy0F-UgbcPzQDgsjtXCcPFUrd3znwf73aJOUFYzmr3yRBZ7o74ZLQhTyvDMuOgOxSqqfRI_5G7_CFws1xaQMVFF1dFiWSQ8BySdtfuoAyTFLQpjjH8en8R5HK6MRANklVj2z_9DohhgCN0HK96rBDL6nd6G2Nk',
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Heather Mocha', hex: '#7a6455' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Ultra-dense 420 GSM French Terry loops provide structural silhouette drape and unmatched winter insulation. Subtle architectural linear motifs on the chest and back spine.',
  },
  {
    id: 'prod-zero-exp',
    title: "'Zero Expectations' Typographic Tee",
    slug: 'zero-expectations-tee',
    price: 1499,
    originalPrice: 1799,
    badge: 'RESTOCKED',
    edition: 'Edition 03 / Minimalist Line',
    category: 't-shirt',
    gsm: '240 GSM',
    fit: 'Standard Relaxed Drop-Shoulder',
    fabric: '100% Combed Cotton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBblcrZ0TsHaXwZT5WVSrG3GZGUwVXrAgXhzwfkCIZDL8wqldxHx-jA43ABGuIyhw18LGCVgC_X-16VSBmtp2I5l8ZJq7h3uOEPpSEjrW_fkpbStlynFEnvnFFWnPXsgiexS-IPjQUzcV0qKCBmnhVJwCswsXUEn4DYVA57a-thbWMxgqnQxtDSn3rrqnjQPn8HqgVHk52-Q7gLKgWY5vfqfB9ZzhqV8jo8DWgfRoZ1EltilBswb7g',
    colors: [
      { name: 'Sage Dust', hex: '#99a69b' },
      { name: 'Vintage Black', hex: '#202020' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Micro-minimalist typography positioned below the collarbone. Clean, understated, and resilient through 60+ machine wash cycles.',
  },
];

export const CATEGORIES = [
  {
    id: 'graphic-tees',
    title: 'Graphic T-Shirts',
    subtitle: 'Heavyweight boxy tees',
    gsmBadge: '240 GSM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0u3IwwpJ6lbCwlHLt5wMGxRK-ea4FhG8S7plbyAOvKZA_HwvnsHwTJOv4_eELu6sAyN14nXPKicJUVyO7h4Xsb16FQFXsln2e-grWqARZbISOw1DNF3dshwWwStbrdxk-LdWSnLa9QnoBr9OTpOh_LZ_WWET5mcEPge_ukwF9k2XSWOnVdqP4WC_5EHRj_pG8DWg0OWnSWGPd3W6AF5MaNCBgP2JGFZ9vpNbCGYjtDQttj1vsJzY',
    silhouetteId: 't-shirt',
  },
  {
    id: 'hoodies',
    title: 'Hoodies & Sweats',
    subtitle: 'Dense French Terry',
    gsmBadge: '400 GSM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpOVbCdhu2RI7R346i35ZbvVi32x9etGxNLP-nv15jx8BBJ1_wZQJLPjd2MtWR9rxBPWNmexXpZCXMf8nmVwTjnkOxIwgiGd_6-7SK74JdSKvB7cax9Y6_xIWwaW7gIH-_SIMou5f4oCjwzQlZBt5Wn1M5pLXozNEwC0Z8rxq0OyMtqKz8L9kzgTDt6s1e33Hi8euietlR24Zz_ii4IdVVzfC-EnqqDFV3IeHztmHQvwZ8SFHHnjw',
    silhouetteId: 'hoodie',
  },
  {
    id: 'mugs',
    title: 'Custom Mugs',
    subtitle: 'Ceramic matte vessels',
    gsmBadge: 'Custom Ready',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcPn4XO3hU-V7FdtFQrivEJBVg8IRx_yg3bgdwrD-uPFHgexkncYh_S4WWeCSVa49REwZGNWVO4z_h1IKvUq3XkefaYJRncnI8OB0KahMrGCkJ4kK69Yl7t4vGaFPMDU_31cZzbfp8j1k0ayFHsKlZgMSIfhP50qrI21MINXDdKVaVw_wiGn0dKUDlCuy8jeB3auT1HSzD_frmfPxH456ZjshEF5MmPH96RX_G6O8fh0b8YwRTrfs',
    silhouetteId: 'mug',
  },
  {
    id: 'caps',
    title: 'Printed Caps',
    subtitle: 'Low-profile dad hats',
    gsmBadge: 'Unstructured',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSS96Sq6AuFSiNN_mRA5r0DtmXeIvIc5WiPjF81epv4WZaTcGTSv5d28cFJqgIGXj4v8mNuIAQ-faUiaQKwIA5WznstYxLk2mPxYksSDi5WZ5VfbW6kINlDdl4tvFWGYJs-Vdgp89DSqXPyhhemv2mSMBpwG7KdiOD630eox6nw7nqSW-QEDs85KN_w0O3_NnXLUO84hVyZIoIrJuolaCx6AzC-TiWeFVdMKe1GkWPVhDZwewSK0g',
    silhouetteId: 'cap',
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Arjun K.',
    role: 'Verified Buyer',
    location: 'Bandra West, Mumbai',
    rating: 5,
    text: '"The 240 GSM weight is real. Most brands claim heavyweight and send flimsy fabric, but Shabeena Studio\'s boxy cut holds its drop-shoulder shape even after five washes."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-hzYIdI9gotXlDJ2rvnvR9thuMOWji86VNYkozGYeaD-WizcP-tCoqOvdRkvouYy1U60mtWAynEBX56OM6ZdDzuAXqecJOTAG8aTzKhvw8ivwN_vXAegrWn5EQz_huwJgo8am_dP1MlqXemLMcmMcp23xbXHOzt5BucJVsJhDV1lPRR8i9bXQjQLsIUV31g_cZdTDwFTU7GZmnChcL0Qm_g21vZUxlRuQaNwm730qMvDEyG7yNVA',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-2',
    author: 'Meera Sen',
    role: 'Art Director',
    location: 'Indiranagar, Bengaluru',
    rating: 5,
    text: '"Used their Custom Studio for our design agency\'s annual merch. The vector upload workflow was seamless and the Japanese DTF ink is sharp with zero rubbery peel."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI_XrvQazEF60NKserWBaXVmO8Ksa1izUdKZrj98pg2SE1I6x4ICY761i1sE41YLNzGdBZwIfxGNM025jD_ZdzUGK80o6Jc3U1kFVZW6MSmk8yBOjLwz44Czr4ZjXHGlJ47yHJdfoNNHvTbSOrQtyedEa45W_3xoqkdtnCkSugIebPIjhZ9-gHcW81soEGg-FhsHU2tqEmwFdXRNiLZjmlVaXCrUS1UhSX9ZH3le65Iecy2EgJAi0',
    badge: 'Custom Lab Order',
  },
  {
    id: 'rev-3',
    author: 'Kabir R.',
    role: 'Verified Buyer',
    location: 'Hauz Khas, Delhi NCR',
    rating: 5,
    text: '"Ordered the \'Metropolitan Chaos\' hoodie. The 420 GSM French Terry is dense and luxurious. Delivery to Delhi took just 3 days. Truly world-class craftsmanship."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnjYpnx4hxz5fuem6F-B-_4NDbYPmC05G-dMwZ5glX7drnSQ6jo80KS4a67rddQN8LbOC8dvKIHE59sipiRH4a5fBS2B1eZ-SFoM0D8Gc-d9zcbmQisFIGz6QoeKwibmx5QcgEbUHCEPkJrRPmEU1yjKNhvsk68ZkcgJKQmhJySxbQlwXz-uzK-9NNecAb27UJcXLsNFdDSiWUwv9Irfelzz_qnhgLrxKPjX2gbKuRoB3vjjJQP60',
    badge: 'Verified Buyer',
  },
];

export const PRESET_SYMBOLS = [
  {
    id: 'geometric-grid',
    name: 'Geometric Grid Wireframe',
    category: 'Brutalist Architecture',
    svg: `<svg viewBox="0 0 120 60" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="5" y="5" width="110" height="50" rx="1" />
      <line x1="32.5" y1="5" x2="32.5" y2="55" />
      <line x1="60" y1="5" x2="60" y2="55" />
      <line x1="87.5" y1="5" x2="87.5" y2="55" />
      <line x1="5" y1="30" x2="115" y2="30" />
      <rect x="35" y="8" width="22" height="19" fill="currentColor" fill-opacity="0.25"/>
      <rect x="63" y="33" width="22" height="19" fill="currentColor" fill-opacity="0.25"/>
      <text x="60" y="32" font-family="monospace" font-size="8" fill="currentColor" text-anchor="middle" letter-spacing="2">SHB-240-IND</text>
    </svg>`,
  },
  {
    id: 'kanji-silence',
    name: 'Quiet Strength Crest',
    category: 'Streetwear Graphic',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="50" cy="50" r="42" stroke-dasharray="4 2"/>
      <circle cx="50" cy="50" r="32" />
      <polygon points="50,22 74,68 26,68" stroke="currentColor" fill="currentColor" fill-opacity="0.15"/>
      <circle cx="50" cy="50" r="4" fill="currentColor"/>
      <text x="50" y="86" font-family="monospace" font-size="6" fill="currentColor" text-anchor="middle" letter-spacing="3">NEW DELHI • 2024</text>
    </svg>`,
  },
  {
    id: 'soundwave-barcode',
    name: 'Atelier Vector Barcode',
    category: 'Industrial',
    svg: `<svg viewBox="0 0 140 45" fill="currentColor">
      <rect x="5" y="5" width="3" height="35"/>
      <rect x="11" y="5" width="1.5" height="35"/>
      <rect x="15" y="5" width="4.5" height="35"/>
      <rect x="22" y="5" width="2" height="35"/>
      <rect x="27" y="5" width="1.5" height="35"/>
      <rect x="32" y="5" width="5" height="35"/>
      <rect x="40" y="5" width="2" height="35"/>
      <rect x="45" y="5" width="3.5" height="35"/>
      <rect x="52" y="5" width="1.5" height="35"/>
      <rect x="56" y="5" width="6" height="35"/>
      <rect x="65" y="5" width="2" height="35"/>
      <rect x="70" y="5" width="4" height="35"/>
      <rect x="77" y="5" width="1.5" height="35"/>
      <rect x="82" y="5" width="3.5" height="35"/>
      <rect x="88" y="5" width="5" height="35"/>
      <rect x="96" y="5" width="2" height="35"/>
      <rect x="101" y="5" width="4.5" height="35"/>
      <rect x="108" y="5" width="1.5" height="35"/>
      <rect x="112" y="5" width="3.5" height="35"/>
      <rect x="118" y="5" width="5" height="35"/>
      <rect x="126" y="5" width="2" height="35"/>
      <rect x="131" y="5" width="3" height="35"/>
    </svg>`,
  },
  {
    id: 'studio-starburst',
    name: 'Precision Spark Stamp',
    category: 'Brand Seal',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M50 5 L55 38 L88 20 L65 48 L98 50 L65 52 L88 80 L55 62 L50 95 L45 62 L12 80 L35 52 L2 50 L35 48 L12 20 L45 38 Z" fill="currentColor" fill-opacity="0.1"/>
      <circle cx="50" cy="50" r="10" fill="currentColor"/>
    </svg>`,
  },
];

export const FONT_OPTIONS = [
  { id: 'Monument Extended', name: 'Monument Extended', family: "'Plus Jakarta Sans', sans-serif", weight: '800' },
  { id: 'Editorial Grotesk', name: 'Editorial Grotesk', family: "'Inter', sans-serif", weight: '700' },
  { id: 'Heavy Gothic', name: 'Heavy Gothic', family: "'Space Grotesk', sans-serif", weight: '700' },
  { id: 'Serif Display', name: 'Serif Display', family: 'serif', weight: '700' },
  { id: 'Mono Industrial', name: 'Mono Industrial', family: 'monospace', weight: '600' },
];
