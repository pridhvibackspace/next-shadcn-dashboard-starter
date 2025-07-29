'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { profileSchema, type ProfileFormValues } from '../utils/form-schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconTrash } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfileFormNavigation } from '../hooks/use-profile-form-navigation';
import { StepIndicator } from './step-indicator';
import { FormNavigation } from './form-navigation';
import {
  PersonalInformationStep,
  ProfessionalInformationStep,
  CompletionStep
} from './lazy-steps';

interface ProfileFormType {
  initialData: any | null;
}

const ProfileCreateForm: React.FC<ProfileFormType> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const title = initialData ? 'Edit product' : 'Create Your Profile';
  const description = initialData
    ? 'Edit a product.'
    : 'To create your resume, we first need some basic information about you.';

  const defaultValues = {
    jobs: [
      {
        jobtitle: '',
        employer: '',
        startdate: '',
        enddate: '',
        jobcountry: '',
        jobcity: ''
      }
    ]
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: 'onChange'
  });

  const { currentStep, steps, data, next, prev, processForm } =
    useProfileFormNavigation({ form });

  const countries = [{ id: 'wow', name: 'india' }];
  const cities = [{ id: '2', name: 'kerala' }];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Suspense fallback={<div>Loading personal information form...</div>}>
            <PersonalInformationStep
              form={form}
              loading={loading}
              countries={countries}
              cities={cities}
            />
          </Suspense>
        );
      case 1:
        return (
          <Suspense
            fallback={<div>Loading professional information form...</div>}
          >
            <ProfessionalInformationStep
              form={form}
              loading={loading}
              countries={countries}
              cities={cities}
            />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<div>Loading completion summary...</div>}>
            <CompletionStep data={data} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={() => setOpen(true)}
          >
            <IconTrash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />

      <StepIndicator steps={steps} currentStep={currentStep} />

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className='w-full space-y-8'
        >
          <div
            className={cn(
              currentStep === 1
                ? 'w-full md:inline-block'
                : 'gap-8 md:grid md:grid-cols-3'
            )}
          >
            {renderStepContent()}
          </div>
        </form>
      </Form>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={next}
        onPrev={prev}
      />
    </>
  );
};

export default ProfileCreateForm;
