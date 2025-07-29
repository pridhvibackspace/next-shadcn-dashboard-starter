'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ProfileFormValues } from '../../utils/form-schema';

interface ProfessionalInformationStepProps {
  form: UseFormReturn<ProfileFormValues>;
  loading: boolean;
  countries: Array<{ id: string; name: string }>;
  cities: Array<{ id: string; name: string }>;
}

export function ProfessionalInformationStep({
  form,
  loading,
  countries,
  cities
}: ProfessionalInformationStepProps) {
  const {
    control,
    formState: { errors }
  } = form;

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'jobs'
  });

  return (
    <div className='w-full md:inline-block'>
      {fields?.map((field, index) => (
        <Accordion
          type='single'
          collapsible
          defaultValue='item-1'
          key={field.id}
        >
          <AccordionItem value='item-1'>
            <AccordionTrigger
              className={cn(
                'relative no-underline! [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                errors?.jobs?.[index] && 'text-red-700'
              )}
            >
              {`Work Experience ${index + 1}`}

              <Button
                variant='outline'
                size='icon'
                className='absolute right-8'
                onClick={() => remove(index)}
              >
                <IconTrash className='h-4 w-4' />
              </Button>
              {errors?.jobs?.[index] && (
                <span className='alert absolute right-8'>
                  <IconAlertTriangle className='h-4 w-4 text-red-700' />
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={cn(
                  'relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3'
                )}
              >
                <FormField
                  control={form.control}
                  name={`jobs.${index}.jobtitle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job title</FormLabel>
                      <FormControl>
                        <Input type='text' disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`jobs.${index}.employer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer</FormLabel>
                      <FormControl>
                        <Input type='text' disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`jobs.${index}.startdate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type='date' disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`jobs.${index}.enddate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input type='date' disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`jobs.${index}.jobcountry`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job country</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder='Select your job country'
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`jobs.${index}.jobcity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job city</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder='Select your job city'
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      <div className='mt-4 flex justify-center'>
        <Button
          type='button'
          className='flex justify-center'
          size='lg'
          onClick={() =>
            append({
              jobtitle: '',
              employer: '',
              startdate: '',
              enddate: '',
              jobcountry: '',
              jobcity: ''
            })
          }
        >
          Add More
        </Button>
      </div>
    </div>
  );
}
