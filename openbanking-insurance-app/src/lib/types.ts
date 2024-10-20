import { z } from 'zod';

export const FormSchema = z.object({
  claim: z.string().describe('Claim'),
  claimAmount: z.preprocess(
    (args) => (args === '' ? undefined : args),
    z.coerce
      .number({ invalid_type_error: 'Price must be a number' })
      .min(1, 'Claim must be minimally 1 EUR')
      .max(300, 'Claim cannot be larger than 300 EUR')
      .positive('Claim amount must be positive')
  ),
  file: z.any(),
});

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe('Workspace Name')
    .min(1, 'Workspace name must be min of 1 character'),
  logo: z.any(),
});

export const UploadBannerFormSchema = z.object({
  banner: z.string().describe('Banner Image'),
});
