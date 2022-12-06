import '../styles.css';

import Loading from '@components/Shared/Loading';
import type { AppProps } from 'next/app';
import { lazy, Suspense } from 'react';

const Providers = lazy(() => import('@components/Common/Providers'));

// function SafeHydrate({ children }: any) {
//   return (
//     <div suppressHydrationWarning>
//       {typeof window === 'undefined' ? null : children}
//     </div>
//   )
// }

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        {/* <SafeHydrate> */}
        <Component {...pageProps} />
        {/* </SafeHydrate> */}
      </Providers>
    </Suspense>
  );
};

export default App;
