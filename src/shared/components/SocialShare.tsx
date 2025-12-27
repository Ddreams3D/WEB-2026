'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Send } from '@/lib/icons';
import {
  getTransitionClasses,
  getIconClasses,
} from '../styles';
import { analytics } from '../utils/analytics';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export default function SocialShare({
  url,
  title,
  description,
}: SocialShareProps) {
  const [isSharing, setIsSharing] = useState<string | null>(null);

  const handleShare = useCallback(
    (platform: string) => {
      setIsSharing(platform);
      analytics.social(platform, 'share', url);

      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          `${title}\n\n${description}\n\n${url}`
        )}`,
      };

      const popup = window.open(
        shareUrls[platform as keyof typeof shareUrls],
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );

      // Reset sharing state after a delay
      setTimeout(() => setIsSharing(null), 1000);

      // Focus the popup if it was successfully opened
      if (popup) {
        popup.focus();
      }
    },
    [url, title, description]
  );

  const handleFollow = useCallback((platform: string) => {
    analytics.social(platform, 'follow', platform);

    const followUrls = {
      facebook: 'https://www.facebook.com/DesignsandDreamings',
      instagram: 'https://www.instagram.com/ddreams3d/',
      tiktok: 'https://www.tiktok.com/@ddreams3d',
    };

    const popup = window.open(
      followUrls[platform as keyof typeof followUrls],
      '_blank',
      'noopener,noreferrer'
    );
    if (popup) {
      popup.focus();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Compartir */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
          Compartir
        </h3>
        <div className="flex gap-4">
          <Button
            onClick={() => handleShare('facebook')}
            disabled={isSharing === 'facebook'}
            variant="gradient"
            size="icon"
            className="rounded-full shadow-lg hover:scale-105"
            aria-label="Compartir en Facebook"
          >
            <Facebook className={getIconClasses('md')} />
          </Button>
          <Button
            onClick={() => handleShare('twitter')}
            disabled={isSharing === 'twitter'}
            variant="gradient"
            size="icon"
            className="rounded-full shadow-lg hover:scale-105"
            aria-label="Compartir en Twitter"
          >
            <Twitter className={getIconClasses('md')} />
          </Button>
          <Button
            onClick={() => handleShare('whatsapp')}
            disabled={isSharing === 'whatsapp'}
            variant="gradient"
            size="icon"
            className="rounded-full shadow-lg hover:scale-105"
            aria-label="Compartir en WhatsApp"
          >
            <Send className={getIconClasses('md')} />
          </Button>
        </div>
      </div>

      {/* Seguir */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
          Síguenos
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => handleFollow('facebook')}
            variant="gradient"
            className="gap-2 shadow-lg hover:scale-105"
            aria-label="Seguir en Facebook"
          >
            <Facebook className="h-5 w-5" aria-hidden="true" />
            Facebook
          </Button>
          <Button
            onClick={() => handleFollow('instagram')}
            variant="gradient"
            className="gap-2 shadow-lg hover:scale-105"
            aria-label="Seguir en Instagram"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
            Instagram
          </Button>
          <Button
            onClick={() => handleFollow('tiktok')}
            variant="gradient"
            className="gap-2 shadow-lg hover:scale-105"
            aria-label="Seguir en TikTok"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            TikTok
          </Button>
        </div>
      </div>
    </div>
  );
}
