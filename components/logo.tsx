'use client';

import Link from 'next/link';
import { Truck } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
        <Truck className="w-5 h-5 text-white" />
      </div>
      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">TransitOps</span>
    </Link>
  );
}
