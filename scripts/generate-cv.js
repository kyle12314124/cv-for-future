// CV PDF Generator
// Generates a professional, ATS-friendly one-page A4 CV PDF
// Usage: node scripts/generate-cv.js

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('public/cv/Kyle-Joshua-Acosta-CV.pdf');

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create PDF document with A4 size and margins
const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  info: {
    Title: 'Kyle Joshua C. Acosta - CV',
    Author: 'Kyle Joshua C. Acosta',
    Subject: 'Professional CV for IT Internship and Junior Developer Roles',
    Keywords: 'Computer Science, Software Development, Web Development, TypeScript, React, Python',
    Producer: 'PDFKit',
    Creator: 'Kyle Joshua C. Acosta Portfolio',
  },
});

// Pipe output to file
doc.pipe(fs.createWriteStream(outputPath));

// Color palette (professional, subtle accent)
const colors = {
  primary: '#1a1a2e',      // Dark navy for headers
  secondary: '#2d3748',    // Medium dark for subheaders
  accent: '#2563eb',       // Professional blue accent
  text: '#374151',         // Body text
  lightText: '#6b7280',    // Muted text
  line: '#e5e7eb',         // Divider lines
  background: '#ffffff',   // White background
};

// Helper functions
const drawLine = (y, color = colors.line, thickness = 0.5) => {
  doc.moveTo(50, y).lineTo(545, y).stroke(color, { lineWidth: thickness });
};

const addSectionHeader = (title, y) => {
  doc.fontSize(12).font('Helvetica-Bold').fillColor(colors.primary).text(title, 50, y);
  drawLine(y + 16, colors.accent, 1.5);
  return y + 24;
};

const addBodyText = (text, x, y, options = {}) => {
  const {
    font = 'Helvetica',
    size = 10,
    color = colors.text,
    width = 495,
    align = 'left',
    lineGap = 2,
  } = options;
  doc.fontSize(size).font(font).fillColor(color).text(text, x, y, { width, align, lineGap });
  return y + doc.heightOfString(text, { width, lineGap }) + 4;
};

const addBulletPoint = (text, x, y, options = {}) => {
  const { font = 'Helvetica', size = 9.5, color = colors.text, width = 475, indent = 60 } = options;
  doc.fontSize(size).font(font).fillColor(color);
  // Bullet character
  doc.text('•', x, y, { width: 15, align: 'left' });
  doc.text(text, x + indent - x, y, { width: width - (indent - x), align: 'left', lineGap: 1.5 });
  return y + doc.heightOfString(text, { width: width - (indent - x), lineGap: 1.5 }) + 2;
};

// ============ HEADER ============
let y = 50;

// Name
doc.fontSize(24).font('Helvetica-Bold').fillColor(colors.primary).text('KYLE JOSHUA C. ACOSTA', 50, y);
y += 30;

// Title/Role
doc.fontSize(12).font('Helvetica').fillColor(colors.accent).text('Computer Science Student  |  Aspiring Software Developer', 50, y);
y += 20;

// Contact info in a clean line
doc.fontSize(9).font('Helvetica').fillColor(colors.lightText);
const contactItems = [
  'Quezon City, Philippines',
  'acostakyle24@gmail.com',
  '09836801589',
  'github.com/kyle12314124',
];
doc.text(contactItems.join('  •  '), 50, y, { width: 495, align: 'center' });
y += 22;

drawLine(y, colors.line, 1);
y += 14;

// ============ EDUCATION ============
y = addSectionHeader('EDUCATION', y);

const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'Eclaro Academy',
    period: '2023 – Present',
    details: 'Current student. Building foundational knowledge in programming, data structures, algorithms, and software development principles.',
  },
  {
    degree: 'Senior High School — STEM Strand',
    school: 'Eclaro Academy',
    period: '2021 – 2023',
    details: 'Science, Technology, Engineering, and Mathematics track.',
  },
  {
    degree: 'Junior High School',
    school: 'Batasan Hills National High School',
    period: '2017 – 2021',
  },
  {
    degree: 'Elementary School',
    school: 'San Diego Elementary School',
    period: '2011 – 2017',
  },
];

education.forEach((edu, idx) => {
  // Period on left, degree on right
  doc.fontSize(9.5).font('Helvetica').fillColor(colors.lightText).text(edu.period, 50, y, { width: 110, align: 'right' });
  doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text(edu.degree, 170, y, { width: 375 });
  y += 14;
  doc.fontSize(9.5).font('Helvetica').fillColor(colors.secondary).text(edu.school, 170, y, { width: 375 });
  y += 12;
  if (edu.details) {
    doc.fontSize(9).font('Helvetica').fillColor(colors.text).text(edu.details, 170, y, { width: 375, lineGap: 1.5 });
    y += doc.heightOfString(edu.details, { width: 375, lineGap: 1.5 }) + 4;
  }
  if (idx < education.length - 1) y += 6;
});

y += 6;

// ============ TECHNICAL SKILLS ============
y = addSectionHeader('TECHNICAL SKILLS', y);

const skills = [
  { category: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'HTML5', 'CSS3'] },
  { category: 'Frameworks & Libraries', items: ['React', 'React Three Fiber', 'Drei', 'Three.js', 'Vite', 'Node.js (basic)'] },
  { category: 'Tools & Practices', items: ['Git', 'GitHub', 'npm', 'VS Code', 'REST APIs', 'JSON', 'Responsive Design'] },
  { category: 'State Management', items: ['Zustand', 'React Context', 'React Hooks'] },
  { category: 'Desktop / Other', items: ['Python Tkinter', 'tkcalendar', 'Pillow (PIL)'] },
];

skills.forEach((skill, idx) => {
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(colors.secondary).text(skill.category + ':', 50, y, { width: 120 });
  doc.fontSize(9.5).font('Helvetica').fillColor(colors.text).text(skill.items.join(', '), 170, y, { width: 375, lineGap: 1.5 });
  y += doc.heightOfString(skill.items.join(', '), { width: 375, lineGap: 1.5 }) + 4;
});

y += 6;

// ============ PERSONAL STRENGTHS ============
y = addSectionHeader('PERSONAL STRENGTHS', y);

const strengths = [
  'Fast Learner — Quickly grasp unfamiliar concepts and technologies',
  'Adaptability — Flexible in changing environments and approaches',
  'Problem-Solving — Analytical mindset for working through technical challenges',
  'Continuous Learning — Self-motivated to expand technical knowledge',
];

strengths.forEach((strength) => {
  y = addBulletPoint(strength, 50, y);
});

y += 6;

// ============ PROJECTS ============
y = addSectionHeader('SELECTED PROJECTS', y);

const projects = [
  {
    name: 'RoomCraft — 3D Interior Design Planner',
    type: 'Personal Project',
    description: 'Browser-based 3D interior design application enabling users to arrange furniture, customize layouts, save designs locally, export projects as JSON, and capture screenshots.',
    technologies: 'React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Zustand',
    links: 'Live: roomcraft-3d-demo.pages.dev  •  GitHub: github.com/kyle12314124/roomcraft-3d-interior-planner',
  },
  {
    name: 'Healthcare Management System (HCMS)',
    type: 'Academic Project',
    description: 'Desktop application prototype for healthcare management with user authentication, patient records, and appointment scheduling using JSON-based data storage.',
    technologies: 'Python, Tkinter, ttk, Pillow, tkcalendar',
    links: 'N/A (Academic prototype)',
  },
  {
    name: 'Automated Payroll System with Chatbot',
    type: 'Academic Project',
    description: 'Web-based payroll system prototype featuring employee management, salary computation, and a chatbot interface for user assistance.',
    technologies: 'HTML, CSS, JavaScript',
    links: 'N/A (Academic prototype)',
  },
  {
    name: 'Weather Advisory System',
    type: 'Academic Project',
    description: 'System providing weather-related advisory information with location-based alerts and forecast display.',
    technologies: 'HTML, CSS, JavaScript (verify implementation details)',
    links: 'N/A (Academic prototype)',
  },
  {
    name: 'Personal CV Portfolio Website',
    type: 'Personal Project',
    description: 'Responsive personal portfolio website presenting background, technical skills, projects, and contact information with modern animations and accessibility features.',
    technologies: 'Vite, TypeScript, HTML, CSS, JavaScript',
    links: 'Live: cvnikyle.netlify.app  •  GitHub: github.com/kyle12314124/cv-for-future',
  },
];

projects.forEach((project, idx) => {
  // Check if we need a new page (shouldn't happen for one page, but safety check)
  if (y > 720) {
    doc.addPage();
    y = 50;
  }

  // Project name and type
  doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text(project.name, 50, y, { width: 495 });
  y += 14;

  // Type and description
  doc.fontSize(9).font('Helvetica-Oblique').fillColor(colors.lightText).text(project.type, 50, y, { width: 495 });
  y += 12;

  doc.fontSize(9).font('Helvetica').fillColor(colors.text).text(project.description, 50, y, { width: 495, lineGap: 1.5 });
  y += doc.heightOfString(project.description, { width: 495, lineGap: 1.5 }) + 4;

  // Technologies
  doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.secondary).text('Technologies: ', 50, y, { continued: true });
  doc.font('Helvetica').fillColor(colors.text).text(project.technologies);
  y += 13;

  // Links
  if (project.links !== 'N/A (Academic prototype)') {
    doc.fontSize(8.5).font('Helvetica').fillColor(colors.accent).text(project.links, 50, y, { width: 495 });
    y += 12;
  }

  if (idx < projects.length - 1) {
    y += 6;
    drawLine(y, colors.line, 0.3);
    y += 8;
  }
});

y += 10;

// ============ FOOTER ============
drawLine(y, colors.line, 0.5);
y += 8;
doc.fontSize(8).font('Helvetica').fillColor(colors.lightText).text(
  'References available upon request.  This CV was generated from the portfolio source code at github.com/kyle12314124/cv-for-future',
  50,
  y,
  { width: 495, align: 'center' }
);

// Finalize PDF
doc.end();

doc.on('end', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✅ CV PDF generated successfully!`);
  console.log(`   Path: ${outputPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`   Pages: 1 (A4)`);
});

doc.on('error', (err) => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});