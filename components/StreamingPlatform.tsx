import { PlayIcon } from "lucide-react";
import Image from "next/image";

const getStreamingPlatformInfo = (streaming: string) => {
  const lowerStreaming = streaming.toLowerCase();
  
  if (lowerStreaming.includes('netflix')) {
    return { 
      logo: '/assets/netflix.png', 
      name: 'Netflix',
      bg: 'bg-red-50', 
      border: 'border-red-200' 
    };
  } else if (lowerStreaming.includes('amazon') || lowerStreaming.includes('prime')) {
    return { 
      logo: '/assets/prime.png', 
      name: 'Prime Video',
      bg: 'bg-blue-50', 
      border: 'border-blue-200' 
    };
  } else if (lowerStreaming.includes('hulu')) {
    return { 
      logo: '/assets/hulu.svg', 
      name: 'Hulu',
      bg: 'bg-green-50', 
      border: 'border-green-200' 
    };
  } else if (lowerStreaming.includes('hbo')) {
    return { 
      logo: '/assets/hbo.png', 
      name: 'HBO Max',
      bg: 'bg-white', 
      border: 'border-zinc-700' 
    };
  } else if (lowerStreaming.includes('apple')) {
    return { 
      logo: '/assets/apple.png', 
      name: 'Apple TV+',
      bg: 'bg-gray-50', 
      border: 'border-gray-200' 
    };
  } else {
    return { 
      logo: null, 
      name: streaming,
      bg: 'bg-gray-50', 
      border: 'border-gray-200' 
    };
  }
};

export default function StreamingPlatform({ streaming }: { streaming: string }) {
  const platformInfo = getStreamingPlatformInfo(streaming);
  
  // Early return if no logo (not available on major platforms)
  if (!platformInfo.logo) {
    return null;
  }

  return (
    <div className="flex items-center">
      <PlayIcon className="w-4 h-4 mr-2 text-gray-500" />
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${platformInfo.bg} ${platformInfo.border}`}>
        <Image src={platformInfo.logo} alt={platformInfo.name} width={24} height={24} className="object-contain" />
      </div>
    </div>
  );
}