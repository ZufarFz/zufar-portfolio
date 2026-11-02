import { useState, useRef, useEffect } from 'react';

export function useFloatingWindow() {
  const [isFloating, setIsFloating] = useState<boolean>(false);
  const [isMinimizedFloating, setIsMinimizedFloating] = useState<boolean>(false);
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({
    x: 0,
    y: 0,
    posX: 40,
    posY: 30,
  });

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!isFloating) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea')
    ) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: floatingPos.x,
      posY: floatingPos.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setFloatingPos({
        x: Math.max(10, Math.min(window.innerWidth - 280, dragStartRef.current.posX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 60, dragStartRef.current.posY + dy)),
      });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return {
    isFloating,
    setIsFloating,
    isMinimizedFloating,
    setIsMinimizedFloating,
    floatingPos,
    setFloatingPos,
    handleHeaderMouseDown,
  };
}

