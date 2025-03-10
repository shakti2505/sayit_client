import React from "react";
import { Card } from "../ui/card";
import user1 from "../../assets/images/user1.png";
import user2 from "../../assets/images/user2.png";

const UserReview: React.FC = () => {
  return (
    <section className="p-12 bg-background">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
        What Our Users Say
      </h2>
      <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6">
        <Card className="p-6 text-center bg-background shadow-xl">
          <p className="text-lg text-foreground">
            “SayIt is a game-changer! The fastest way to start a chat.”
          </p>
          <div className="mt-4">
            <img
              src={user1}
              alt="User 1"
              className="w-12 h-12 rounded-full mx-auto"
            />
            <div className="mt-2 text-foreground">John Doe, Developer</div>
          </div>
        </Card>
        <Card className="p-6 text-center bg-background shadow-xl">
          <p className="text-lg text-foreground">
            “The encryption is top-notch. I feel secure using SayIt.”
          </p>
          <div className="mt-4">
            <img
              src={user2}
              alt="User 2"
              className="w-12 h-12 rounded-full mx-auto"
            />
            <div className="mt-2 text-foreground">Jane Smith, Designer</div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default UserReview;
