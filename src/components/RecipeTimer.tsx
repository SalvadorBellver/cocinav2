import React, { useState, useEffect } from 'react';
import { Loader2, Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  duration: number; // in minutes
  onComplete?: () => void;
}

export const RecipeTimer = ({ duration, onComplete }: Props) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      reset();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium tabular-nums">
        {formatTime(timeLeft)}
      </div>
      <button
        onClick={toggleTimer}
        className="btn p-1.5 rounded-lg text-primary-600 hover:bg-primary-50"
      >
        {isRunning ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5" />
        )}
      </button>
      {timeLeft !== duration * 60 && (
        <button
          onClick={reset}
          className="btn p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};