import React from 'react';
import CallToAction from '@/shared/components/CallToAction';
import { ctaData } from '@/shared/data/ctaData';

export default function AboutCTA() {
  return (
    <CallToAction
      title={ctaData.about.title}
      description={ctaData.about.description}
      primaryButtonText={ctaData.about.primaryButtonText}
      primaryButtonLink={ctaData.about.primaryButtonLink}
    />
  );
}
