import React from 'react';
import CallToAction from '@/shared/components/CallToAction';
import { ctaData } from '@/shared/data/ctaData';

export default function ServicesCTA() {
  return (
    <CallToAction
      title={ctaData.services.title}
      description={ctaData.services.description}
      primaryButtonText={ctaData.services.primaryButtonText}
      primaryButtonLink={ctaData.services.primaryButtonLink}
    />
  );
}
