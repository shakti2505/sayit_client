import React from "react";
import conversationImage from "../../assets/images/conversation.jpg";

const HeroSection: React.FC = () => {

  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background">
      <h1 className="text-5xl font-extrabold mb-4 text-foreground">
        Seamless Chat Links for Instant Communication
      </h1>
      <p className="text-xl mb-8 text-muted-foreground">
        SayIt lets you create secure chat links effortlessly, making it easy to
        start conversations instantly.
      </p>
      {/* <a href="/dashboard">
        <Button>Get Started</Button>
      </a> */}

      <div className="mt-12 w-full max-w-5xl flex justify-center">
        <img
          src={conversationImage}
          loading="lazy"
          alt="Illustration"
          className="w-full h-auto bg-black"
        />
      </div>
    </section>
  );
};

export default HeroSection;
