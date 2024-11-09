"use client";
import { useEffect } from 'react';

import {ScrollManagerProps} from "./../interfaces";

const ScrollManager: React.FC<ScrollManagerProps> = ({ searchParams }) => {
  useEffect(() => {
    // Restore scroll position when searchParams change
    const restoreScroll = () => {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    };

    // Function to save current scroll position
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    // Call restoreScroll to set initial position
    restoreScroll();
    saveScrollPosition();

    // Add event listener to save position on scroll
    window.addEventListener('scroll', saveScrollPosition);

    return () => {
      // Cleanup: Remove scroll event listener and save last position
      window.removeEventListener('scroll', saveScrollPosition);
    };
  }, [JSON.stringify(searchParams)]); // Serialize searchParams for dependency check

  return null; // This component does not render anything
};

export default ScrollManager;
