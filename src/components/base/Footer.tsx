import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-grid border-t border-gray-500 py-6 md:px-8 md:py-0 bg-background">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://shakti-kashyap.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shakti
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/shakti2505"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
