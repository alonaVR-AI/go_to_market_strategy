import { Suspense } from 'react';
import Chat from './components/Chat';

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0B1B2B]" />}>
      <Chat />
    </Suspense>
  );
}
