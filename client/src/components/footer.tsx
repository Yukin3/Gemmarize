import { Link, useLocation } from "react-router-dom";
import { IconZodiacGemini, IconBrandGithub, IconBrandLinkedin, IconWorld, IconCircleLetterD } from '@tabler/icons-react';


export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/"; 

  return (
    <footer className="bg-muted/30 border-t py-8">
        {isHomePage ? (
          //Home page footer
          <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <IconZodiacGemini className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Gemmarize</span>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary">
                Terms
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Gemmarize. All rights reserved.
          </div>
          {/* Social Media Row */}
          <div className="mt-4 flex justify-center gap-6">
            <a href="https://github.com/Yukin3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconBrandGithub className="h-6 w-6 text-primary dark:text-gray-300" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconBrandLinkedin className="h-6 w-6 text-primary dark:text-blue-600" />
            </a>
            <a href="https://yukin3.github.io/PersonalPortfolio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconWorld className="h-6 w-6 text-primary dark:text-stone-400" />
            </a>
            <a href="https://devpost.com/Yukin3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconCircleLetterD className="h-6 w-6 text-primary dark:text-cyan-800" />
            </a>
          </div>
        </div>
        ) : (
          // Site pages footer
          <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconZodiacGemini className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Gemmarize</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Gemmarize. All rights reserved.
          </p>

          {/* Social Media Row */}
          <div className="mt-4 flex justify-center gap-6">
            <a href="https://github.com/Yukin3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconBrandGithub className="h-6 w-6 text-primary dark:text-gray-300" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconBrandLinkedin className="h-6 w-6 text-primary dark:text-blue-600" />
            </a>
            <a href="https://yukin3.github.io/PersonalPortfolio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconWorld className="h-6 w-6 text-primary dark:text-stone-400" />
            </a>
            <a href="https://devpost.com/Yukin3" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <IconCircleLetterD className="h-6 w-6 text-primary dark:text-cyan-800" />
            </a>
          </div>
        </div>
        )}
    </footer>
  );
}
