'use client';
import { Button } from '@/components/atoms/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Loader from '@/components/atoms/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/atoms/alert';
import { MailCheck } from 'lucide-react';
import { FormSchema } from '@/lib/types';
import { uploadClaim } from '@/lib/server-side/uploadFile';
import Image from 'next/image';
import { BsImages } from 'react-icons/bs';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const ClaimFormSchema = z.object({
  claim: z.string().describe('Claim'),
  claimAmount: z.preprocess(
    (args) => (args === '' ? undefined : args),
    z.coerce
      .number({ invalid_type_error: 'Price must be a number' })
      .min(1, 'Claim must be minimally 1 EUR')
      .max(300, 'Claim cannot be larger than 300 EUR')
      .positive('Claim amount must be positive')
  ),
  iban: z.string().describe('IBAN of the customer'),
  name: z.string().describe('Name of the account holder'),
  file: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

const UploadClaim = () => {
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(false);

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return '';
    return searchParams.get('error_description');
  }, [searchParams]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const confirmationAndErrorStyles = useMemo(
    () =>
      clsx('bg-primary', {
        'bg-red-500/10': codeExchangeError,
        'border-red-500/50': codeExchangeError,
        'text-red-700': codeExchangeError,
      }),
    [codeExchangeError]
  );

  const form = useForm<z.infer<typeof ClaimFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ClaimFormSchema),
    defaultValues: {
      claim: '',
      claimAmount: 0,
      file: '',
      iban: '',
      name: '',
    },
  });

  const isLoading = form.formState.isSubmitting;
  async function onSubmit(formData: FormData) {
    const result = JSON.stringify(await uploadClaim(formData));
    setConfirmation(true);
  }

  return (
    <Form {...form}>
      <form
        action={onSubmit}
        onChange={() => {
          if (submitError) setSubmitError('');
        }}
        className='
        .space-x-11
        relative
        mt-20
        flex
        w-full 
        flex-col
        space-y-6
        p-5
        sm:w-[500px]  
        sm:justify-end
        '
      >
        <Link
          href='/'
          className='
          justify-left
          flex
          w-full
          items-center'
        ></Link>
        <FormDescription
          className='
        text-foreground/60'
        >
          Upload your claim here
        </FormDescription>
        {!confirmation && !codeExchangeError && (
          <>
            <FormField
              disabled={isLoading}
              control={form.control}
              name='claim'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='text' placeholder='Claim' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='claimAmount'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='iban'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='text' placeholder='IBAN' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Name of the account holder'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='file'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      name='file'
                      type='file'
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        setSelectedImage(e.target.files?.[0] || null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedImage ? (
              <div
                className='
              absolute
              left-full 
              top-0 
              ml-4 
              w-full 
              p-10
              '
              >
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt='Selected'
                  width='600'
                  height='600'
                />
              </div>
            ) : (
              <div
                className='
              absolute 
              left-full 
              top-0 
              ml-4 
              w-full
              p-10'
              >
                <div
                  className='
                .float-right 
                group 
                flex 
                items-center 
                justify-center 
                rounded-lg 
                border 
                border-transparent
                bg-slate-200 
                p-3 
                px-5 
                py-4
                transition-colors
                hover:border-gray-300
                hover:bg-gray-100
                '
                >
                  <BsImages size={100} />
                </div>
              </div>
            )}
            <Button type='submit' className='w-full p-6' disabled={isLoading}>
              {!isLoading ? 'Submit claim' : <Loader />}
            </Button>
          </>
        )}
        {submitError && <FormMessage>{submitError}</FormMessage>}
        {(confirmation || codeExchangeError) && (
          <>
            <Alert className={confirmationAndErrorStyles}>
              {!codeExchangeError && <MailCheck className='h-4 w-4' />}
              <AlertTitle>
                {codeExchangeError ? 'Invalid Link' : 'Done.'}
              </AlertTitle>
              <AlertDescription>
                {codeExchangeError || 'Successfully submitted the claim.'}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  );
};

export default UploadClaim;
