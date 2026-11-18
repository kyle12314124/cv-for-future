// CV PDF Generator
// Generates a professional, ATS-friendly one-page A4 CV PDF
// Usage: npm run generate:cv

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('public/cv/Kyle-Joshua-Acosta-CV.pdf');

// Optional profile photo. Drop a JPEG or PNG at one of these paths to include it.
// PDFKit embeds JPEG and PNG only, so other formats must be converted first.
const photoCandidates = ['assets/profile-photo.jpg', 'assets/profile-photo.jpeg', 'assets/profile-photo.png'];
const photoPath = photoCandidates.map((file) => path.resolve(file)).find((file) => fs.existsSync(file)) ?? null;

if (!photoPath) {
  console.warn('⚠️  No profile photo found — generating the CV without one.');
  console.warn(`   Add a JPEG/PNG at ${photoCandidates[0]} and re-run to include it.`);
}

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create PDF document with A4 size and margins
const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  bufferPages: true,
  info: {
    Title: 'Kyle Joshua C. Acosta - CV',
    Author: 'Kyle Joshua C. Acosta',
    Subject: 'Professional CV for Web Development Internship and Junior Frontend Roles',
    Keywords: 'Computer Science, Web Development, Frontend, HTML5, CSS3, JavaScript, TypeScript, Python, C++, React, Vite, Tailwind CSS, Three.js, Node.js, REST APIs, Windows API, CMake, Zydis, Binary Analysis, Reverse Engineering, OpenCode, Claude Code, AI-Assisted Development',
    Producer: 'PDFKit',
    Creator: 'Kyle Joshua C. Acosta Portfolio',
  },
});

// Pipe output to file
const output = fs.createWriteStream(outputPath);
doc.pipe(output);

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

const PAGE_LEFT = 50;
const PAGE_RIGHT = 545;
const PAGE_BOTTOM = doc.page.height - 50;

// Helper functions
const drawLine = (y, color = colors.line, thickness = 0.5) => {
  doc.moveTo(PAGE_LEFT, y).lineTo(PAGE_RIGHT, y).stroke(color, { lineWidth: thickness });
};

// Draws the photo cropped to a square, clipped to a circle, with a hairline ring.
const drawPhoto = (file, x, y, size) => {
  const image = doc.openImage(file);
  const scale = Math.max(size / image.width, size / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size / 2;

  doc.save();
  doc.circle(cx, cy, radius).clip();
  doc.image(file, cx - width / 2, cy - height / 2, { width, height });
  doc.restore();

  doc.save();
  doc.circle(cx, cy, radius).lineWidth(1).strokeColor(colors.line).stroke();
  doc.restore();
};

const addSectionHeader = (title, y) => {
  doc.fontSize(12).font('Helvetica-Bold').fillColor(colors.primary).text(title, PAGE_LEFT, y);
  drawLine(y + 16, colors.accent, 1.5);
  return y + 24;
};

const addBulletPoint = (text, x, y, options = {}) => {
  const { font = 'Helvetica', size = 9, color = colors.text, width = 475, indent = 60 } = options;
  doc.fontSize(size).font(font).fillColor(color);
  doc.text('•', x, y, { width: 15, align: 'left' });
  doc.text(text, x + indent - x, y, { width: width - (indent - x), align: 'left', lineGap: 1.5 });
  return y + doc.heightOfString(text, { width: width - (indent - x), lineGap: 1.5 }) + 2;
};

const addLinkLine = (links, y) => {
  if (!links.length) return y;

  const size = 8;
  const separator = '  •  ';
  let cursor = PAGE_LEFT;

  doc.fontSize(size).font('Helvetica');

  links.forEach((link, index) => {
    if (index > 0) {
      doc.fillColor(colors.lightText).text(separator, cursor, y, { lineBreak: false });
      cursor += doc.widthOfString(separator);
    }

    doc.fillColor(colors.lightText).text(link.label, cursor, y, { lineBreak: false });
    cursor += doc.widthOfString(link.label);

    doc.fillColor(colors.accent).text(link.display, cursor, y, { lineBreak: false, link: link.url });
    cursor += doc.widthOfString(link.display);
  });

  if (cursor > PAGE_RIGHT + 0.5) {
    throw new Error(`Project links exceed the page width by ${(cursor - PAGE_RIGHT).toFixed(1)}pt`);
  }

  return y + 9;
};

// ============ HEADER ============
const PHOTO_SIZE = 70;
const PHOTO_GAP = 16;
const headerTextWidth = photoPath ? PAGE_RIGHT - PAGE_LEFT - PHOTO_SIZE - PHOTO_GAP : PAGE_RIGHT - PAGE_LEFT;

let y = 50;

// Name
doc.fontSize(24).font('Helvetica-Bold').fillColor(colors.primary).text('KYLE JOSHUA C. ACOSTA', PAGE_LEFT, y, { width: headerTextWidth });
y += 26;

// Title/Role
doc.fontSize(12).font('Helvetica').fillColor(colors.accent).text('Computer Science Student  |  Aspiring Web Developer', PAGE_LEFT, y, { width: headerTextWidth });
y += 15;

// Contact info in a clean line
doc.fontSize(9).font('Helvetica').fillColor(colors.lightText);
doc.text('Quezon City, Philippines  •  acostakyle24@gmail.com  •  09836801589', PAGE_LEFT, y, { width: headerTextWidth });
y += 11;
doc.fillColor(colors.accent).text('github.com/kyle12314124', PAGE_LEFT, y, {
  width: headerTextWidth,
  link: 'https://github.com/kyle12314124',
});
y += 13;

// Photo, top-right
if (photoPath) drawPhoto(photoPath, PAGE_RIGHT - PHOTO_SIZE, 50, PHOTO_SIZE);
y = Math.max(y, 50 + (photoPath ? PHOTO_SIZE : 0) + 8);

drawLine(y, colors.line, 1);
y += 12;

// ============ EDUCATION ============
y = addSectionHeader('EDUCATION', y);

const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'Eclaro Academy',
    period: '2023 – Present',
  },
  {
    degree: 'Senior High School — STEM Strand',
    school: 'Eclaro Academy',
    period: '2021 – 2023',
  },
  {
    degree: 'Junior High School',
    school: 'Batasan Hills National High School',
    period: '2017 – 2021',
  },
];

education.forEach((edu, idx) => {
  // Period on left, degree on right
  doc.fontSize(9.5).font('Helvetica').fillColor(colors.lightText).text(edu.period, PAGE_LEFT, y, { width: 110, align: 'right' });
  doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text(edu.degree, 170, y, { width: 375 });
  y += 12;
  doc.fontSize(9.5).font('Helvetica').fillColor(colors.secondary).text(edu.school, 170, y, { width: 375 });
  y += 11;
  if (edu.details) {
    doc.fontSize(8.5).font('Helvetica').fillColor(colors.text).text(edu.details, 170, y, { width: 375, lineGap: 1 });
    y += doc.heightOfString(edu.details, { width: 375, lineGap: 1 }) + 2;
  }
  if (idx < education.length - 1) y += 4;
});

y += 5;

// ============ TECHNICAL SKILLS ============
y = addSectionHeader('TECHNICAL SKILLS', y);

const skills = [
  { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'C++', 'HTML5', 'CSS3'] },
  { category: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS', 'Three.js', 'React Three Fiber', 'Drei', 'Zustand'] },
  { category: 'Backend & APIs', items: ['Node.js (basic)', 'REST APIs', 'Open-Meteo API', 'Formspree', 'JSON'] },
  { category: 'Systems', items: ['Windows API', 'ctypes', 'Tkinter', 'CMake', 'Zydis', 'Binary Analysis', 'Reverse Engineering'] },
  { category: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code', 'npm', 'Cloudflare Pages'] },
  { category: 'AI Coding Agents', items: ['OpenCode', 'Claude Code'] },
  { category: 'Strengths', items: ['Fast learner', 'Adaptability', 'Problem-solving', 'Continuous learning'] },
];

skills.forEach((skill) => {
  const items = skill.items.join(', ');
  doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.secondary).text(skill.category + ':', PAGE_LEFT, y, { width: 120 });
  doc.fontSize(9).font('Helvetica').fillColor(colors.text).text(items, 170, y, { width: 375, lineGap: 1 });
  y += doc.heightOfString(items, { width: 375, lineGap: 1 }) + 1.5;
});

y += 3;

// ============ AI-ASSISTED DEVELOPMENT ============
y = addSectionHeader('AI-ASSISTED DEVELOPMENT', y);

doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.secondary).text('OpenCode  •  Claude Code', PAGE_LEFT, y);
y += 11;

const aiExperience = 'Used both AI coding agents across my web and systems projects for AI-assisted programming, code generation, debugging, code refactoring, project implementation, code analysis, and development workflow automation.';
doc.fontSize(8.5).font('Helvetica').fillColor(colors.text).text(aiExperience, PAGE_LEFT, y, { width: PAGE_RIGHT - PAGE_LEFT, lineGap: 1 });
y += doc.heightOfString(aiExperience, { width: PAGE_RIGHT - PAGE_LEFT, lineGap: 1 }) + 2;

y += 5;

// ============ PROJECTS ============
y = addSectionHeader('SELECTED PROJECTS', y);

const projects = [
  {
    name: 'RoomCraft — 3D Interior Design Planner',
    type: 'Personal Project',
    description: 'Browser-based 3D planner for arranging furniture, saving layouts, and exporting JSON or screenshots.',
    technologies: 'React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Zustand',
    links: [
      { label: 'Live Demo:', display: 'https://roomcraft-3d-demo.pages.dev/', url: 'https://roomcraft-3d-demo.pages.dev/' },
      { label: 'GitHub:', display: 'https://github.com/kyle12314124/roomcraft-3d-interior-planner', url: 'https://github.com/kyle12314124/roomcraft-3d-interior-planner' },
    ],
  },
  {
    name: 'Automated Payroll System with Chatbot',
    type: 'Academic Project',
    description: 'Web payroll prototype for employee management, salary computation, and chatbot assistance.',
    technologies: 'HTML, CSS, JavaScript',
    links: [],
  },
  {
    name: 'Weather Advisory System',
    type: 'Academic Project',
    description: 'React weather dashboard using the Open-Meteo REST API for forecasts, charts, advisories, and saved locations.',
    technologies: 'React, TypeScript, Vite, Open-Meteo API',
    links: [
      { label: 'Live Demo:', display: 'https://weather-advisory-system.pages.dev/', url: 'https://weather-advisory-system.pages.dev/' },
      { label: 'GitHub:', display: 'https://github.com/kyle12314124/weather-advisory-system', url: 'https://github.com/kyle12314124/weather-advisory-system' },
    ],
  },
  {
    name: 'Personal CV Portfolio Website',
    type: 'Personal Project',
    description: 'Responsive TypeScript and Vite portfolio with scroll animations, a contact form, and a generated PDF CV.',
    technologies: 'Vite, TypeScript, HTML, CSS, JavaScript',
    links: [
      { label: 'Live Demo:', display: 'https://cvnikyle.netlify.app/', url: 'https://cvnikyle.netlify.app/' },
      { label: 'GitHub:', display: 'https://github.com/kyle12314124/cv-for-future', url: 'https://github.com/kyle12314124/cv-for-future' },
    ],
  },
  {
    name: 'Healthcare Management System (HCMS)',
    type: 'Academic Project',
    description: 'Tkinter desktop prototype for authentication, patient records, and appointment scheduling with JSON storage.',
    technologies: 'Python, Tkinter, ttk, Pillow, tkcalendar',
    links: [],
  },
  {
    name: 'CS2 Systems Experiment',
    type: 'Systems & Experiments',
    description: 'Read-only Python overlay using ctypes and the Windows API to read CS2 process memory and render a Tkinter overlay.',
    technologies: 'Python, ctypes, Windows API, Tkinter, ReadProcessMemory',
    links: [
      { label: 'GitHub:', display: 'https://github.com/kyle12314124/cheatnigg4z', url: 'https://github.com/kyle12314124/cheatnigg4z' },
    ],
  },
  {
    name: 'Blood Strike Systems Experiment',
    type: 'Systems & Experiments',
    description: 'C++ offset dumper that analyses the running process or a PE file and decodes instructions with Zydis.',
    technologies: 'C++, Windows API, CMake, Zydis, PE Analysis, Reverse Engineering',
    links: [
      { label: 'GitHub:', display: 'https://github.com/kyle12314124/cheatnigg4z2', url: 'https://github.com/kyle12314124/cheatnigg4z2' },
    ],
  },
];

projects.forEach((project, idx) => {
  // Project name on the left, type on the right
  doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text(project.name, PAGE_LEFT, y, { width: 360 });
  doc.fontSize(8).font('Helvetica-Oblique').fillColor(colors.lightText).text(project.type, PAGE_LEFT, y, { width: PAGE_RIGHT - PAGE_LEFT, align: 'right' });
  y += 12;

  doc.fontSize(8.5).font('Helvetica').fillColor(colors.text).text(project.description, PAGE_LEFT, y, { width: PAGE_RIGHT - PAGE_LEFT, lineGap: 1 });
  y += doc.heightOfString(project.description, { width: PAGE_RIGHT - PAGE_LEFT, lineGap: 1 }) + 1;

  // Technologies
  doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.secondary).text('Technologies: ', PAGE_LEFT, y, { continued: true });
  doc.font('Helvetica').fillColor(colors.text).text(project.technologies);
  y += 12;

  // Links
  y = addLinkLine(project.links, y);

  if (idx < projects.length - 1) {
    y += 1.5;
    drawLine(y, colors.line, 0.3);
    y += 1.5;
  }
});

y += 2;

// ============ FOOTER ============
const footerText = 'References available upon request.  Generated from github.com/kyle12314124/cv-for-future';
// Set the font explicitly: heightOfString uses the current font, and the last
// project may leave it at a different size depending on whether it has links.
doc.fontSize(8).font('Helvetica');
const footerHeight = doc.heightOfString(footerText, { width: PAGE_RIGHT - PAGE_LEFT, lineGap: 1.5 });
const slack = PAGE_BOTTOM - (y + 5 + footerHeight);

if (slack < 0) {
  throw new Error(`CV content overflows the one-page layout by ${(-slack).toFixed(1)}pt`);
}

drawLine(y, colors.line, 0.5);
y += 5;
doc.fontSize(8).font('Helvetica').fillColor(colors.lightText).text(footerText, PAGE_LEFT, y, {
  width: PAGE_RIGHT - PAGE_LEFT,
  align: 'center',
  lineGap: 1.5,
});

// Finalize PDF
const pageCount = doc.bufferedPageRange().count;
if (pageCount !== 1) {
  throw new Error(`Expected a one-page CV, but generated ${pageCount} pages`);
}

doc.end();

output.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`✅ CV PDF generated successfully!`);
  console.log(`   Path: ${outputPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`   Pages: ${pageCount} (A4)`);
  console.log(`   Space left at bottom: ${slack.toFixed(1)}pt`);
});

output.on('error', (err) => {
  console.error('❌ Error writing CV PDF:', err);
  process.exit(1);
});
