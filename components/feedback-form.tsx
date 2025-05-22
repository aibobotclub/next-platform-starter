'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert } from './ui/alert';
import { Card } from './ui/card';

const feedbackFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  message: z.string().min(10, 'Feedback content must be at least 10 characters'),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function FeedbackForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append('form-name', 'feedback');

      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (res.status === 200) {
        reset();
        return { status: 'success' as const };
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } catch (error) {
      return {
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Submission failed, please try again later',
      };
    }
  };

  return (
    <div className="w-full md:max-w-md">
      <Card title="Feedback">
        <form
          name="feedback"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 align-center"
        >
          <input type="hidden" name="form-name" value="feedback" />
          
          <div className="flex flex-col gap-1">
            <input
              {...register('name')}
              type="text"
              placeholder="Name"
              className="input"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              {...register('email')}
              type="email"
              placeholder="Email (optional)"
              className="input"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              {...register('message')}
              type="text"
              placeholder="Feedback content"
              className="input"
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <span className="text-sm text-red-500">{errors.message.message}</span>
            )}
          </div>

          <button
            className="btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </Card>
    </div>
  );
} 