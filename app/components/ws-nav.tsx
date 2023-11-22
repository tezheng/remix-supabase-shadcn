import { Link, useLocation } from '@remix-run/react'
import { Auth } from '@supabase/auth-ui-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Separator } from '~/components/ui/separator';
import {
  RiNotificationLine,
  RiQuestionLine,
  RiSearchLine,
} from 'react-icons/ri/index.js';

import { cn } from "~/lib/utils"


function UserNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { user } = Auth.useUser();
  const { user_metadata } = user || {};
  const { name, email, avatar_url } = user_metadata || {};

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar_url} alt={name} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <span className="ml-auto text-xs opacity-60">
                3000 credits
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MainNav({ className, navItems }: {
  className: string,
  navItems: Array<{
    name: string,
    path: string,
    icon?: string,
  }>,
}) {
  const { pathname } = useLocation();

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map(({name, path, icon }) => (
        <Link
          key={name}
          to={path}
          className={cn(
            "text-sm transition-colors",
            pathname === path
              ? "font-bold"
              : "font-medium text-muted-foreground hover:underline hover:text-primary"
          )}
        >
          {icon && (
            <span className="mr-2">
              <img src={icon} alt="" className="w-5 h-5" />
            </span>
          )}
          {name}
        </Link>
      ))}
    </nav>
  )
}

export default function WSNav({ navItems }: {
  navItems: Parameters<typeof MainNav>[0]['navItems'],
}) {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <h2 className="text-3xl font-bold tracking-tight">Logo</h2>
        <Separator className="ml-4" orientation="vertical"/>
        {navItems && <MainNav className="mx-6" navItems={navItems} />}
        <div className="ml-auto flex items-center">
          <Button variant="ghost">
            <RiSearchLine size={'1.3em'}/>
          </Button>
          <Button variant="ghost">
            <RiQuestionLine size={'1.3em'}/>
          </Button>
          <Button variant="ghost">
            <RiNotificationLine size={'1.3em'}/>
          </Button>
          <UserNav className="pl-4"/>
        </div>
      </div>
    </header>
  );
}
