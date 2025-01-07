import React from 'react';
import libaraxiaAlpha from '../images/libaraxiaAlpha.png';
import backblaze from '../images/BLZE.png'
import { Github, ExternalLink, FileText } from 'lucide-react';

// ProjectCard component used in Work section
// Updated ProjectCard component with link support
const ProjectCard = ({ title, description, image, tags, githubUrl, liveUrl, pdfUrl }) => (
  <div className="group relative overflow-hidden rounded-lg bg-[#2c2c2c] shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="aspect-w-16 aspect-h-9">
      <img
        src={image}
        alt={title}
        className="w-50 h-64 object-cover transition-transform duration-300 group-hover:scale-105 mx-auto"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-200">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="px-3 py-1 bg-gray-700 text-sm rounded-full text-gray-300">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {githubUrl && (
           <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            <Github size={20} /> View on GitHub
          </a>
        )}
        {liveUrl && (
            <a          
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2"
          >
            <ExternalLink size={20} /> Live Demo
          </a>
        )}
        {pdfUrl && (
          <a
            href="https://f001.backblazeb2.com/file/backblaze-b2-case-studies/CS_Steve_McCurry_Studios.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            <FileText size={20} /> View PDF
          </a>
        )}
      </div>
    </div>
  </div>
);
  
  // Work section component
  const Work = () => (
    <section id="work" className="py-20 bg-[#2c2c2c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-200">Featured Work</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ProjectCard
            title="Libaraxia: A Self Hosted Personal Library Catalog"
            description="A comprehensive digital preservation and catalog system for my personal library, licensed under the GPL for open source usage."
            image={libaraxiaAlpha}
            githubUrl="https://github.com/philcifone/libaraxia"
            tags={["Archive", "Python", "Database Design"]}
          />
          <ProjectCard
            title="Future Proofing a Photographers Legacy"
            description="Case study on a cloud backup solution to protect a lifetime of celebrated images."
            image={backblaze}
            pdfUrl={() => window.open('_blank')}
            tags={["Backups", "Archive", "Photography"]}
          />
        </div>
      </div>
    </section>
  );
  
  export default Work;