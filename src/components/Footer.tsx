// src/components/Footer.tsx

import { Linkedin, Github } from 'lucide-react';
import { VscGithubInverted } from 'react-icons/vsc'; // Corrected Icon Import

export default function Footer() {
  return (
    <footer
      id="footer"
      className="w-full bg-black/40 backdrop-blur-2xl py-8 px-4 text-center text-gray-400"
    >
      <div className="container mx-auto">
        <div className="flex justify-center items-center gap-6 mb-4">
          <a
            href="https://www.linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition-colors"
          >
            <Linkedin size={28} />
          </a>
          <a
            href="https://github.com/cipher-cmd"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition-colors"
          >
            <Github size={28} />
          </a>
        </div>
        <p>Developed and designed by Furqan</p>
        <p>
          &copy; {new Date().getFullYear()} KashMirage. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
