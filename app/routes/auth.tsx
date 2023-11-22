// import { createClient } from '@supabase/supabase-js'
import { useState } from 'react';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import { json } from '@remix-run/node';
import { createBrowserClient } from '@supabase/ssr';

// const supabase = createClient('<INSERT PROJECT URL>', '<INSERT PROJECT ANON API KEY>')

export const loader = async () => {
  // environment variables may be stored somewhere other than
  // `process.env` in runtimes other than node
  // we need to pipe these Supabase environment variables to the browser
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };
  return json({ env });
};

export default function () {
  const { env } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
  );

  const [params] = useSearchParams();

  return (
    <ClientOnly>
      {() => (
        <div className="flex flex-col mx-auto justify-center space-y-6 sm:w-[350px]">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'apple', 'facebook']}
            redirectTo={`${location.origin}/auth/callback?next=${params.get(
              'next',
            )}`}
          />
        </div>
      )}
    </ClientOnly>
  );
}
