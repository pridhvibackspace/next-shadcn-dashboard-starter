'use client';

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
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../../utils/form-schema';

interface PersonalInformationStepProps {
  form: UseFormReturn<ProfileFormValues>;
  loading: boolean;
  countries: Array<{ id: string; name: string }>;
  cities: Array<{ id: string; name: string }>;
}

export function PersonalInformationStep({
  form,
  loading,
  countries,
  cities
}: PersonalInformationStepProps) {
  return (
    <div className='gap-8 md:grid md:grid-cols-3'>
      <FormField
        control={form.control}
        name='firstname'
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input disabled={loading} placeholder='John' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='lastname'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input disabled={loading} placeholder='Doe' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                placeholder='johndoe@gmail.com'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='contactno'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input
                type='number'
                placeholder='Enter you contact number'
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='country'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
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
                    placeholder='Select a country'
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
        name='city'
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
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
                    placeholder='Select a city'
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
  );
}
