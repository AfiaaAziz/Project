import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">

              <span className="ml-2 text-xl font-medium">goodpix.org</span>
            </div>
            <p className="text-orange-100 text-sm font-light">
              Goodpix LLC<br />
              info@goodpix.org
            </p>
            <p className="text-orange-100 text-xs mt-4 font-light">
              © 2025 all rights reserved
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">HOW IT WORKS</h3>
            <ul className="space-y-2 text-orange-100 text-sm font-light">
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How GoodPix Works</Link></li>
              <li><Link to="/common-questions" className="hover:text-white transition-colors">10 Common Questions</Link></li>
              <li><Link to="/why-goodpix" className="hover:text-white transition-colors">Why GoodPix</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">PLAN YOUR FUNDRAISER</h3>
            <ul className="space-y-2 text-orange-100 text-sm font-light">
              <li><Link to="/fundraising" className="hover:text-white transition-colors">Fundraising</Link></li>
              <li><Link to="/ideas" className="hover:text-white transition-colors">Ideas</Link></li>
              <li><Link to="/tips" className="hover:text-white transition-colors">Fundraising Tips</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">GOODPIX</h3>
            <ul className="space-y-2 text-orange-100 text-sm font-light">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;