'use client';

import { lazy } from 'react';

export const PersonalInformationStep = lazy(() =>
  import('./steps/personal-information-step').then((module) => ({
    default: module.PersonalInformationStep
  }))
);

export const ProfessionalInformationStep = lazy(() =>
  import('./steps/professional-information-step').then((module) => ({
    default: module.ProfessionalInformationStep
  }))
);

export const CompletionStep = lazy(() =>
  import('./steps/completion-step').then((module) => ({
    default: module.CompletionStep
  }))
);
