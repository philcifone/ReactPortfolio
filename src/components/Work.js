import React, { useState } from 'react';
import libaraxiaAlpha from '../images/libaraxiaAlpha.png';
import backblaze from '../images/BLZE.png';
import { ProjectCard, ColorPaletteDemo } from './InteractiveProjectCard';
import RockPaperScissors from './RockPaperScissors';
import WordGame from './WordGame'
import DicewareGenerator from './DicewareGenerator';
import StorageCalculator from './StorageCalculator';
import HangmanGame from './Hangman';

// Tab management component
const TabView = ({ activeTab, setActiveTab, tabs }) => (
  <div className="flex gap-2 mb-8">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex-1 py-3 rounded-lg transition-colors ${
          activeTab === tab.id
            ? 'bg-blue-600 text-white'
            : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const Work = () => {
  const [activeToolsTab, setActiveToolsTab] = useState('utilities');
  
  const toolsTabs = [
    { id: 'utilities', label: 'Utilities' },
    { id: 'games', label: 'Games' }
  ];

  const renderToolsContent = () => {
    switch (activeToolsTab) {
      case 'utilities':
        return (
          <div className="space-y-16">
            <div className="max-w-4xl mx-auto">
              <ColorPaletteDemo />
            </div>
            <div className="max-w-4xl mx-auto">
              <DicewareGenerator />
            </div>
            <div className="max-w-4xl mx-auto">
              <StorageCalculator />
            </div>
          </div>
        );
      case 'games':
        return (
          <div className="space-y-16">
            <div className="max-w-4xl mx-auto">
              <WordGame />
            </div>
            <div className="max-w-4xl mx-auto">
              <RockPaperScissors />
            </div>
            <div className="max-w-4xl mx-auto">
              <HangmanGame />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="work" className="py-20 bg-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Projects Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-200">
            Featured Projects
          </h2>
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

        {/* Interactive Tools Section */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-200">
            Interactive Zone
          </h2>
          <p className="text-xl text-center mb-12 text-gray-400">
            Explore these utilities and games - take a break, have some fun!
          </p>

          <TabView 
            activeTab={activeToolsTab}
            setActiveTab={setActiveToolsTab}
            tabs={toolsTabs}
          />

          {renderToolsContent()}
        </div>
      </div>
    </section>
  );
};

export default Work;