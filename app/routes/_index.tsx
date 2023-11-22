import { useState } from 'react';
import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import { Button } from '~/components/ui/button';

import { json, type MetaFunction } from '@remix-run/node';
import { createBrowserClient } from '@supabase/ssr';

export const meta: MetaFunction = () => [
  { title: 'SpatiaStudio Design' },
  { name: 'description', content: 'Welcome to SpatiaStudio' },
];

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
  const nav = useNavigate();

  const { env } = useLoaderData<typeof loader>();

  // it is important to create a single instance of Supabase
  // to use across client components - outlet context 👇
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
  );

  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => nav('/ws/design')}>Start Design</Button>
      <Outlet context={{ supabase }} />
    </div>
  );
}
