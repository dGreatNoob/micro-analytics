import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { DemoPreview } from "@/components/demo-preview"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

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
