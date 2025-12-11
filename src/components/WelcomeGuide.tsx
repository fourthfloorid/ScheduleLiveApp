import { Info, X } from 'lucide-react';
import { useState } from 'react';

export default function WelcomeGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#dbeafe] border border-[#3b82f6] rounded-xl p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-2 md:gap-3 flex-1 min-w-0">
          <Info className="size-4 md:size-5 text-[#2563eb] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-[#1e40af] mb-2 text-sm md:text-base">Welcome to Live Schedule App!</h3>
            <div className="text-[#1e3a8a] space-y-1 text-xs md:text-sm">
              <p>To get started:</p>
              <ul className="list-disc list-inside ml-1 md:ml-2 space-y-1">
                <li>Create an account by clicking &quot;Sign up&quot;</li>
                <li>Choose your role: <strong>Host</strong> or <strong>Admin</strong></li>
                <li><strong>Hosts</strong> can submit schedules (min 2 sessions/day)</li>
                <li><strong>Admins</strong> can manage brands, rooms, and assign hosts</li>
              </ul>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-[#bfdbfe] rounded transition-colors flex-shrink-0 touch-manipulation"
        >
          <X className="size-4 text-[#1e40af]" />
        </button>
      </div>
    </div>
  );
}