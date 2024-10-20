import {
  User2,
  LucideMail,
  UploadCloudIcon,
  BarChartHorizontalBig,
} from 'lucide-react';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40"></div>
      <div className='mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left'>
        <a
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          target='_blank'
        >
          <div className='flex items-center space-x-2'>
            <User2 className='h-6 w-6' />
            <h2 className='font-assistant text-2xl font-semibold'>
              Account{' '}
              <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
                -&gt;
              </span>
            </h2>
          </div>
          <p className='max-w-[30ch] font-assistant text-sm opacity-50'>
            Profile, account settings and more
          </p>
        </a>
        <a
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          target='_blank'
        >
          <div className='flex items-center space-x-2'>
            <LucideMail className='h-6 w-6' />
            <h2 className='font-assistant text-2xl font-semibold'>
              Inbox{' '}
              <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
                -&gt;
              </span>
            </h2>
          </div>
          <p className='max-w-[30ch] font-assistant text-sm opacity-50'>
            All inbox mesages
          </p>
        </a>
        <a
          href='/uploadClaim'
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
        >
          <div className='flex items-center space-x-2'>
            <UploadCloudIcon className='h-6 w-6' />
            <h2 className='font-assistant text-2xl font-semibold'>
              Upload claim{' '}
              <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
                -&gt;
              </span>
            </h2>
          </div>
          <p className='max-w-[30ch] font-assistant text-sm opacity-50'>
            Upload your claim here.
          </p>
        </a>
        <a
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          target='_blank'
        >
          <div className='flex items-center space-x-2'>
            <BarChartHorizontalBig className='h-6 w-6' />
            <h2 className='font-assistant text-2xl font-semibold'>
              View status{' '}
              <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
                -&gt;
              </span>
            </h2>
          </div>
          <p className='max-w-[30ch] text-balance font-assistant text-sm opacity-50'>
            View the status of your claim here
          </p>
        </a>
      </div>
    </main>
  );
}
