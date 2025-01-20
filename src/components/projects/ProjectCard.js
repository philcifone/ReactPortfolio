import React from 'react';
import { Github, ExternalLink, FileText, } from 'lucide-react';

const ProjectCard = ({ title, description, image, tags, githubUrl, liveUrl, pdfUrl }) => {
  return (
    <div className="bg-neutral-700 rounded-lg overflow-hidden shadow-lg">
      {image && (
        <div className="w-full h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-display text-center text-gray-200 mb-6">{title}</h3>
        <p className="text-gray-400 mb-6 text-center">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-neutral-600 rounded-full text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-baby-blue hover:text-light-olive"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-baby-blue hover:text-light-olive"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Visit Site</span>
            </a>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-baby-blue hover:text-light-olive"
            >
              <FileText className="w-5 h-5" />
              <span>View PDF</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard ;