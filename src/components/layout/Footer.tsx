import { Github, LinkedinIcon } from 'lucide-react';
import React from 'react';
import { Pokeball } from '../icons/Pokeball';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="bg-red-600  p-1 rounded-full mr-2">
              <Pokeball className="w-8 h-8 " />
              </span>
              PokéExplorer
            </h2>
            <p className="text-sm mt-2">
              Data provided by{' '}
              <a 
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                PokéAPI
              </a>
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a 
                href="https://github.com/Omianju"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/devansh-tiwari-3708aa24b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <LinkedinIcon size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PokéExplorer. All rights reserved.</p>
          <p className="mt-1">Made with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;