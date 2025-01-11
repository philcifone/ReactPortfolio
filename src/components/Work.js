import React, { useState } from 'react';
import libaraxiaAlpha from '../images/libaraxiaAlpha.png';
import backblaze from '../images/BLZE.png';
import { ProjectCard } from './InteractiveProjectCard';
import RockPaperScissors from './RockPaperScissors';
import WordGame from './WordGame';
import DicewareGenerator from './DicewareGenerator';
import StorageCalculator from './StorageCalculator';
import HangmanGame from './Hangman';
import CocktailFinder from './CocktailFinder';
import { ColorPaletteDemo } from './InteractiveProjectCard';

const TabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
    }`}
  >
    {children}
  </button>
);

const SubTabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-md transition-colors ${
      isActive
        ? 'bg-green-600 text-white'
        : 'bg-neutral-600 text-gray-300 hover:bg-neutral-500'
    }`}
  >
    {children}
  </button>
);

const Work = () => {
  const [activeToolType, setActiveToolType] = useState('utilities');
  const [activeUtility, setActiveUtility] = useState('colorPalette');
  const [activeGame, setActiveGame] = useState('wordGame');

  const toolTypes = [
    { id: 'utilities', label: 'Utilities' },
    { id: 'games', label: 'Games' }
  ];

  const utilities = [
    { id: 'colorPalette', label: 'Color Palette', component: ColorPaletteDemo },
    { id: 'diceware', label: 'Password Generator', component: DicewareGenerator },
    { id: 'storage', label: 'Storage Calculator', component: StorageCalculator },
    { id: 'cocktails', label: 'Cocktail Finder', component: CocktailFinder }
  ];

  const games = [
    { id: 'wordGame', label: 'Word Game', component: WordGame },
    { id: 'rps', label: 'Rock Paper Scissors', component: RockPaperScissors },
    { id: 'hangman', label: 'Hangman', component: HangmanGame }
  ];

  const renderInteractiveContent = () => {
    const currentItems = activeToolType === 'utilities' ? utilities : games;
    const activeItemId = activeToolType === 'utilities' ? activeUtility : activeGame;
    const ActiveComponent = currentItems.find(item => item.id === activeItemId)?.component;

    return (
      <div className="space-y-8">
        {/* Tool type tabs */}
        <div className="flex justify-center gap-4">
          {toolTypes.map(type => (
            <TabButton
              key={type.id}
              isActive={activeToolType === type.id}
              onClick={() => setActiveToolType(type.id)}
            >
              {type.label}
            </TabButton>
          ))}
        </div>

        {/* Sub-tabs */}
        <div className="flex justify-center gap-2 flex-wrap">
          {currentItems.map(item => (
            <SubTabButton
              key={item.id}
              isActive={activeItemId === item.id}
              onClick={() => {
                if (activeToolType === 'utilities') {
                  setActiveUtility(item.id);
                } else {
                  setActiveGame(item.id);
                }
              }}
            >
              {item.label}
            </SubTabButton>
          ))}
        </div>

        {/* Active component */}
        <div className="max-w-4xl mx-auto">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    );
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

          {renderInteractiveContent()}
        </div>
      </div>
    </section>
  );
};

export default Work;