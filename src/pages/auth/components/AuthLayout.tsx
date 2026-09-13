import type { ReactNode } from 'react';
import logoBeiraLinha from '@/assets/logo-beira-linha.png';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { EnterAsButtons } from './EnterAsButtons';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  isAluno?: boolean;
  isAdmin?: boolean;
  onEnterAsStudent?: () => void;
  onEnterAsMonitor?: () => void;
  onEnterAsAdmin?: () => void;
};

export const AuthLayout = ({
  title,
  description,
  isAluno,
  isAdmin,
  onEnterAsStudent,
  onEnterAsMonitor,
  onEnterAsAdmin,
  children,
  footer,
}: AuthLayoutProps) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-primary px-4 py-8">
    <div className="mb-6 flex items-center gap-3">
      <div className="h-10 w-20 shrink-0 overflow-hidden rounded-md bg-white">
        <img
          src={logoBeiraLinha}
          alt="logo"
          className="size-full object-contain"
        />
      </div>
      <p className="select-none font-montserrat text-lg font-semibold text-white sm:text-2xl">
        Beira Linha Play
      </p>
    </div>

    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <h1 className="font-fredoka text-2xl font-semibold text-primary-dark">
          {title}
        </h1>
        <CardDescription className="font-montserrat">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {onEnterAsStudent && onEnterAsMonitor && (
          <EnterAsButtons
            isAluno={Boolean(isAluno)}
            isAdmin={Boolean(isAdmin)}
            onEnterAsStudent={onEnterAsStudent}
            onEnterAsMonitor={onEnterAsMonitor}
            onEnterAsAdmin={onEnterAsAdmin}
          />
        )}
        {children}
        {footer && (
          <p className="text-center text-sm text-muted-foreground font-montserrat">
            {footer}
          </p>
        )}
      </CardContent>
    </Card>
  </div>
);
