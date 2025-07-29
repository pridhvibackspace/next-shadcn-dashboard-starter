import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonalInformationStep } from '../personal-information-step';
import { ProfileFormValues, profileSchema } from '../../../utils/form-schema';

// Mock the form context
const MockFormProvider = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
    }
  });

  return <form>{children}</form>;
};

const mockCountries = [{ id: 'us', name: 'United States' }];
const mockCities = [{ id: 'ny', name: 'New York' }];

describe('PersonalInformationStep', () => {
  it('renders all form fields', () => {
    const form = {
      control: {} as any,
      formState: { errors: {} }
    } as any;

    render(
      <MockFormProvider>
        <PersonalInformationStep
          form={form}
          loading={false}
          countries={mockCountries}
          cities={mockCities}
        />
      </MockFormProvider>
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    const form = {
      control: {} as any,
      formState: { errors: {} }
    } as any;

    render(
      <MockFormProvider>
        <PersonalInformationStep
          form={form}
          loading={true}
          countries={mockCountries}
          cities={mockCities}
        />
      </MockFormProvider>
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
