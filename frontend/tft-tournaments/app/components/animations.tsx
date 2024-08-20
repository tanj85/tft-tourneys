"use client";
// components/BobAnimation.js
import { motion } from "framer-motion";

const BobAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="flex justify-center items-center"
      initial={{ opacity: 0, scale: 0.8 }} // Start with opacity 0 and scale down
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -10, 0], // Bobbing effect after initial animation
      }}
      transition={{
        opacity: { duration: 0.5, ease: "easeOut" }, // Fade-in duration
        scale: { duration: 0.5, ease: "easeOut" }, // Grow duration
        y: {
          duration: 2, // Duration of one cycle of the bobbing animation
          ease: "easeInOut", // Smooth easing for bobbing
          repeat: Infinity, // Repeat the bobbing animation indefinitely
          repeatType: "loop", // Loop the animation
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const Bob2 = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="flex justify-center items-center"
      initial={{ opacity: 0, scale: 0.8 }} // Initial state when the element is out of view
      whileInView={{
        opacity: 1,
        scale: 1,
        y: [0, -10, 0], // Bobbing effect after fade-in and grow
      }}
      transition={{
        opacity: { duration: 0.5, ease: "easeOut" }, // Fade-in duration
        scale: { duration: 0.5, ease: "easeOut" }, // Grow duration
        y: {
          duration: 2, // Duration of one cycle of the bobbing animation
          ease: "easeInOut", // Smooth easing for bobbing
          repeat: Infinity, // Repeat the bobbing animation indefinitely
          repeatType: "loop", // Loop the animation
        },
      }}
      viewport={{ once: false }} // Trigger the animation every time the element comes into view
    >
      {children}
    </motion.div>
  );
};

const FlyIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: "-100px", scale: 0.8 }} // Start with a smaller scale and off-screen
      whileInView={{ opacity: 1, x: 0, scale: 1 }} // Grow to full size and slide into position
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation
      viewport={{ once: true }} // Animation occurs every time the element comes into view
    >
      {children}
    </motion.div>
  );
};

const FlyInRight = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: "100px", scale: 0.8 }} // Start with a smaller scale and off-screen
      whileInView={{ opacity: 1, x: 0, scale: 1 }} // Grow to full size and slide into position
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation
      viewport={{ once: true }} // Animation occurs every time the element comes into view
    >
      {children}
    </motion.div>
  );
};

const FlyInBot = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100px", scale: 0.8 }} // Start with a smaller scale and off-screen
      whileInView={{ opacity: 1, y: 0, scale: 1 }} // Grow to full size and slide into position
      transition={{
        duration: 0.5, // Smooth animation duration
        ease: "easeOut", // Easing function
        delay, // Delay before the animation starts
      }}
      viewport={{ once: true }} // Animation occurs only the first time the element comes into view
    >
      {children}
    </motion.div>
  );
};

export { BobAnimation, Bob2, FlyIn, FlyInRight, FlyInBot };
