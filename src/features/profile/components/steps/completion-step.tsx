'use client';

interface CompletionStepProps {
  data: any;
}

export function CompletionStep({ data }: CompletionStepProps) {
  return (
    <div>
      <h1>Completed</h1>
      <pre className='whitespace-pre-wrap'>{JSON.stringify(data)}</pre>
    </div>
  );
}
