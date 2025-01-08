import React from 'react';
import libaraxiaAlpha from '../images/libaraxiaAlpha.png';
import backblaze from '../images/BLZE.png';
import { ProjectCard, ColorPaletteDemo } from './InteractiveProjectCard';

const Work = () => {
  return (
    <section id="work" className="py-20 bg-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-200">
          Featured Work
        </h2>

        <div className="space-y-16">
          {/* Color Palette Generator */}
          <div className="max-w-4xl mx-auto"
                        title="Random Color Palette Generator" 
>
            <ColorPaletteDemo/>
          </div>

          {/* Other Projects */}
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
              description="Backblaze case study on a cloud migration I spearheaded in order to protect a lifetime of celebrated images by a renowned photographer."
              image={backblaze}
              pdfUrl="https://f001.backblazeb2.com/file/backblaze-b2-case-studies/CS_Steve_McCurry_Studios.pdf"
              tags={["Backups", "Archive", "Photography"]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;