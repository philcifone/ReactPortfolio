import React from 'react';
import { Archive, Terminal, Camera, Code, Pen, BookOpen } from 'lucide-react';

// Skill card component for About section
const SkillCard = ({ Icon, title, description }) => (
    <div className="p-6 space-y-4 bg-[#2c2c2c] rounded-lg hover:transform hover:scale-105 transition-all duration-300">
    <Icon size={40} className="mx-auto text-green-400" />
    <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
    <p className="text-gray-400">{description}</p>
    </div>
    );
    // About section with your diverse skill set
    const About = () => (
    <section id="about" className="py-20 bg-[#424242]">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-center mb-16 text-gray-200">About Me</h2>
    <div className="grid md:grid-cols-3 gap-8">
    <SkillCard
    Icon={Archive}
    title="Digital Archivist"
    description="Preserving digital heritage and making information accessible for future generations."
    />
    <SkillCard
    Icon={Terminal}
    title="Linux Enthusiast"
    description="Command line warrior, open-source advocate, and system tinkerer extraordinaire."
    />
    <SkillCard
    Icon={Camera}
    title="Visual Artist"
    description="Capturing moments and creating digital art that tells stories."
    />
    <SkillCard
    Icon={Code}
    title="Amateur Programmer"
    description="Building tools and solving problems with code, one bug at a time."
    />
    <SkillCard
    Icon={Pen}
    title="Writer"
    description="Crafting narratives across technical documentation and creative writing."
    />
    <SkillCard
    Icon={BookOpen}
    title="Lifelong Learner"
    description="Constantly exploring the intersection of technology, literature, art, and preservation."
    />
    </div>
    </div>
    </section>
    );

export default About;