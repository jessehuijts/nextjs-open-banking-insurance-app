'use server';

import { gql } from '@apollo/client';
import { getClient } from '@/lib/client-side/apollo-wrapper';

async function uploadFileToUrl(file: any, key: string) {
  try {
    const url = process.env.S3_URL;

    const formData = new FormData();
    formData.append('key', '354550316.jpg');
    formData.append('file', file);

    if (url) {
      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

const GENERATE_URL = gql`
  mutation generateUrl($key: String!) {
    generateUrl(key: $key) {
      url
    }
  }
`;

const SUBMIT_CLAIM = gql`
  mutation payoutClaim(
    $description: String!
    $amount: Int!
    $creditorIban: String!
    $creditorName: String!
  ) {
    payoutClaim(
      description: $description
      amount: $amount
      creditorIban: $creditorIban
      creditorName: $creditorName
    ) {
      message
    }
  }
`;

export async function uploadClaim(formData: FormData) {
  const rawFormData = {
    file: formData.get('file'),
    description: formData.get('claim'),
    claimAmount: formData.get('claimAmount'),
    creditorIban: formData.get('iban'),
    creditorName: formData.get('name'),
  };

  const key = crypto.randomUUID();

  try {
    const { data } = await getClient().mutate({
      mutation: GENERATE_URL,
      variables: {
        key,
      },
    });

    await uploadFileToUrl(rawFormData.file, key);

    await getClient().mutate({
      mutation: SUBMIT_CLAIM,
      variables: {
        description: rawFormData.description,
        amount: Number(rawFormData.claimAmount),
        creditorIban: rawFormData.creditorIban,
        creditorName: rawFormData.creditorName,
      },
    });

    const deepCopyData = JSON.parse(JSON.stringify(data));

    return deepCopyData;
  } catch (error) {
    throw error;
  }
}
