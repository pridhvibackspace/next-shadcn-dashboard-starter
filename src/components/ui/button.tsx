import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Button variant styles using class-variance-authority
 * 
 * Provides a comprehensive set of button styles with variants for different use cases:
 * - default: Primary button with solid background
 * - destructive: Red/danger button for delete actions
 * - outline: Border button with transparent background
 * - secondary: Muted button for secondary actions
 * - ghost: Minimal button with hover effects
 * - link: Text button that looks like a link
 * 
 * Sizes available: default, sm (small), lg (large), icon (square)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

/**
 * Props for the Button component
 * Extends HTML button props with variant and size options
 */
interface ButtonProps 
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child component instead of button element */
  asChild?: boolean;
}

/**
 * Versatile button component with multiple variants and sizes
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Different sizes (default, sm, lg, icon)
 * - Support for icons with proper spacing
 * - Accessibility features with focus states
 * - Dark mode support
 * - Can render as child component using Radix Slot
 * - Disabled state handling
 * - Form validation state styling
 * 
 * @param props - Component props extending HTML button attributes
 * @param props.variant - Visual style variant (default: 'default')
 * @param props.size - Button size (default: 'default')
 * @param props.asChild - Render as child component instead of button
 * @param props.className - Additional CSS classes
 * @param props...props - All other HTML button attributes
 * @returns JSX element representing the button
 * 
 * @example
 * ```tsx
 * // Basic button
 * <Button>Click me</Button>
 * 
 * // Destructive variant
 * <Button variant="destructive">Delete</Button>
 * 
 * // Button with icon
 * <Button variant="outline" size="sm">
 *   <Icon className="mr-2" />
 *   Save
 * </Button>
 * 
 * // As child (renders as different element)
 * <Button asChild>
 *   <Link href="/profile">Go to Profile</Link>
 * </Button>
 * ```
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
