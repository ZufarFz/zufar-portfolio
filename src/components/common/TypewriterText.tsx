import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  name: string;
  lang: 'id' | 'en';
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ name, lang }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const fullText = lang === 'id' 
    ? `HAI, SAYA ${name.toUpperCase()}` 
    : `HELLO, I'M ${name.toUpperCase()}`;

  useEffect(() => {
    const handleTyping = () => {
      const currentText = fullText;

      if (!isDeleting) {
        // Typing
        setDisplayText(currentText.substring(0, displayText.length + 1));
        setTypingSpeed(100);

        if (displayText === currentText) {
          // Stay for 2 seconds before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        setDisplayText(currentText.substring(0, displayText.length - 1));
        setTypingSpeed(50);

        if (displayText === '') {
          setIsDeleting(false);
          setLoopNum(prev => prev + 1);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, fullText, typingSpeed]);

  return (
    <span className="inline-flex items-center">
      {displayText}
      <span className="animate-blink ml-1">|</span>
    </span>
  );
};

export default TypewriterText;
