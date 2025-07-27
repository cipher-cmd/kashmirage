import { Linkedin, Github } from 'lucide-react';
import { VscVercel } from 'react-icons/vsc';

export default function Footer() {
  return (
    <footer
      id="footer"
      className="w-full bg-black/40 backdrop-blur-2xl py-12 px-4"
    >
      <div className="container mx-auto text-center text-gray-300">
        <h3 className="text-2xl font-bold text-white mb-4">
          Created by{' '}
          <span className="text-orange-500">Syed Furqaan Andrabi</span>
        </h3>
        <p className="mb-6">Connect with me on social media:</p>
        <div className="flex justify-center items-center gap-8 mb-8">
          <a
            href="https://www.linkedin.com/in/sfurqan6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
          >
            <Linkedin size={32} />
          </a>
          <a
            href="https://github.com/cipher-cmd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
          >
            <Github size={32} />
          </a>
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} KashMirage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
