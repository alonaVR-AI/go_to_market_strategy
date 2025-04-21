'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface PlayTTSButtonProps {
  text: string;
  className?: string;
}

export default function PlayTTSButton({ text, className = '' }: PlayTTSButtonProps) {
  const [loading, setLoading] = useState(false);

  const playAudio = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioData = await res.arrayBuffer();
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      await audio.play();
      
      // Clean up the URL object after playing
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Failed to play audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={playAudio}
      disabled={loading}
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        loading
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-gray-700 text-blue-400 hover:bg-gray-600'
      } ${className}`}
      title="Play audio"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Play className="h-5 w-5" />
      )}
    </button>
  );
} 