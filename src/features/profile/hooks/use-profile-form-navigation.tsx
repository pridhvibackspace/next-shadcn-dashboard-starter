'use client';

import { useState } from 'react';
import { SubmitHandler, UseFormReturn, useFieldArray } from 'react-hook-form';
import { ProfileFormValues } from '../utils/form-schema';

interface UseProfileFormNavigationProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function useProfileFormNavigation({
  form
}: UseProfileFormNavigationProps) {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});

  const { control } = form;
  const { fields } = useFieldArray({
    control,
    name: 'jobs'
  });

  const processForm: SubmitHandler<ProfileFormValues> = (formData) => {
    setData(formData);
  };

  type FieldName = keyof ProfileFormValues;

  const steps = [
    {
      id: 'Step 1',
      name: 'Personal Information',
      fields: ['firstname', 'lastname', 'email', 'contactno', 'country', 'city']
    },
    {
      id: 'Step 2',
      name: 'Professional Informations',
      fields: fields
        ?.map((_, index) => [
          `jobs.${index}.jobtitle`,
          `jobs.${index}.employer`,
          `jobs.${index}.startdate`,
          `jobs.${index}.enddate`,
          `jobs.${index}.jobcountry`,
          `jobs.${index}.jobcity`
        ])
        .flat()
    },
    { id: 'Step 3', name: 'Complete' }
  ];

  const next = async () => {
    const currentFields = steps[currentStep].fields;

    const output = await form.trigger(currentFields as FieldName[], {
      shouldFocus: true
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return {
    currentStep,
    previousStep,
    steps,
    data,
    next,
    prev,
    processForm
  };
}
