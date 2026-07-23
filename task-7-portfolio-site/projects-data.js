// single source of truth for the Projects page.
// projects.js reads this array and builds cards from it —
// nothing here is hardcoded as HTML.

const PROJECTS = [
  {
    title: 'AI Resume Analyzer',
    description: 'NLP-powered tool that scores and gives feedback on resumes using sentence-transformers, with a Streamlit interface.',
    tags: ['Python', 'Streamlit', 'NLP', 'MySQL'],
    link: 'https://github.com/MalaikaFatima/ai-resume-analyzer'
  },
  {
    title: 'Multi-Vendor Service Marketplace',
    description: 'Role-based platform with separate Customer, Provider, and Admin dashboards, JWT authentication, and a full booking flow.',
    tags: ['Laravel 12', 'React', 'JWT', 'MySQL'],
    link: 'https://github.com/MalaikaFatima/Multi-Vendor-Service-Marketplace'
  },
  {
    title: 'Vendor Management & Quotation System',
    description: 'A system for managing vendor quotations end to end, built with Laravel Sanctum auth and a React front end.',
    tags: ['Laravel 12', 'Sanctum', 'React'],
    link: 'https://github.com/MalaikaFatima/Vendor-Management-and-Quotation-System'
  },
  {
    title: 'Restaurant Management System',
    description: 'A database-driven restaurant ordering and management system built as a PostgreSQL/DBA coursework project.',
    tags: ['PostgreSQL', 'Flask'],
    link: 'https://github.com/MalaikaFatima/restaurant-management-PostgreSQL'
  }
];
