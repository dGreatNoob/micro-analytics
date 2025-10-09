import { Header } from "@/components/marketing/header"
import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { DemoPreview } from "@/components/marketing/demo-preview"
import { Pricing } from "@/components/marketing/pricing"
import { Testimonials } from "@/components/marketing/testimonials"
import { CTA } from "@/components/marketing/cta"
import { Footer } from "@/components/marketing/footer"
import { ScrollToTop } from "@/components/marketing/scroll-to-top"

export default function Home() {
  return (
    <main className="min-h-screen animated-gradient">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <DemoPreview />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
      <ScrollToTop />
    </main>
  )
}

