import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import store from "@/store/store";
import { Provider } from "react-redux";
import ReduxProvider from "@/store/Provider";
import Navbar from "@/components/Reuseble/NavBar";
import Footer from "@/components/Reuseble/Footer";
import { TanStackQueryProvider } from "@/queries/TanStackQueryProvider";
type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  // Wait for the locale param (like 'en', 'fr', 'es')
  const { locale } = await params;

  // If the locale is invalid, show 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load translation messages dynamically
  const messages = (await import(`@/message/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <TanStackQueryProvider>
          <ReduxProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster />
            </NextIntlClientProvider>
          </ReduxProvider>
        </TanStackQueryProvider>
      </body>
    </html>
  );
}
