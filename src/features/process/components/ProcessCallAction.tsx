import React from 'react';
import CallToAction from '@/shared/components/CallToAction';
import { ctaData } from '@/shared/data/ctaData';

export default function ProcessCallAction() {
  return (
    <CallToAction
      title={ctaData.process.title}
      description={ctaData.process.description}
      primaryButtonText={ctaData.process.primaryButtonText}
      primaryButtonLink={ctaData.process.primaryButtonLink}
    />
  );
}
