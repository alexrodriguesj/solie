import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/floating";
import { BannerProvider } from "@/contexts/BannerContext";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerProvider disabled>
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
    </BannerProvider>
  );
}
