import { useState } from 'react';
import { useLoaderData, Outlet } from '@remix-run/react';
import { Auth } from '@supabase/auth-ui-react';
// import Sidebar from '~/components/sidebar';
import WSNav from '~/components/ws-nav';

import { json, redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

import {
  createServerClient,
  parse,
  serialize,
  createBrowserClient,
} from '@supabase/ssr';

// this uses Pathless Layout Routes to wrap up all our Supabase logic
// https://remix.run/docs/en/v1/guides/routing#pathless-layout-routes
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // environment variables may be stored somewhere other than
  // `process.env` in runtimes other than node
  // we need to pipe these Supabase environment variables to the browser
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  // We can retrieve the session on the server and hand it to the client.
  // This is used to make sure the session is available immediately upon rendering
  const cookies = parse(request.headers.get('Cookie') ?? '');
  const headers = new Headers();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookies[key],
        set: (key, value, options) =>
          headers.append('Set-Cookie', serialize(key, value, options)),
        remove: (key, options) =>
          headers.append('Set-Cookie', serialize(key, '', options)),
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return redirect(`/auth?next=${request.url}`);
  }

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json(
    {
      env,
      // session
    },
    { headers },
  );
};

const navItems = [
  {
    name: 'Design',
    path: '/ws/design',
  },
  {
    name: 'Edit',
    path: '/ws/edit',
  },
  {
    name: 'Shopping',
    path: '/ws/shopping',
  },
];

export default function () {
  const { env } = useLoaderData<typeof loader>();

  // it is important to create a single instance of Supabase
  // to use across client components - outlet context 👇
  const [supabaseClient] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY),
  );

  return (
    <Auth.UserContextProvider supabaseClient={supabaseClient}>
      <div className="flex flex-col">
        <WSNav navItems={navItems} />
        <Outlet />
      </div>
    </Auth.UserContextProvider>
  );
}
