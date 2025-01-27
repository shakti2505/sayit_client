import React from "react";


const Footer: React.FC = () => {
  return (
    // <footer className="p-6 bg-gray-900 text-white">
    //   <div className="flex justify-between">
    //     <div>
    //       <div>© 2024 QuickChat. All rights reserved.</div>
    //       <div className="space-x-4 mt-2">
    //         <Link to="/privacy policy">Privacy Policy</Link>
    //         <Link to="">Terms of Service</Link>
    //       </div>
    //     </div>
    //     <div className="space-y-4">
    //       <Input
    //         placeholder="Subscribe to our newsletter"
    //         className="bg-gray-800 border-none"
    //       />
    //       <Button>Subscribe</Button>
    //     </div>
    //   </div>
    // </footer>
     <footer className="border-grid border-t border-gray-500 py-6 md:px-8 md:py-0 bg-background">
     <div className="container-wrapper">
       <div className="container py-4">
         <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
           Built by{" "}
           <a
             href="/"
             target="_blank"
             rel="noreferrer"
             className="font-medium underline underline-offset-4"
           >
             Shakti
           </a>
           . The source code is available on{" "}
           <a
             href="/"
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
