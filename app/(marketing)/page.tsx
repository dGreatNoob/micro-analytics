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
import { SmoothScrollProvider } from "@/lib/smooth-scroll"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { SectionNavigator } from "@/components/marketing/section-navigator"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="animated-gradient overflow-hidden">
        <Header />
        
        <div className="relative">
          <AnimatedSection id="section-0" className="relative">
            <Hero />
          </AnimatedSection>
          
          <AnimatedSection id="section-1" className="relative">
            <Features />
          </AnimatedSection>
          
          <AnimatedSection id="section-2" className="relative">
            <HowItWorks />
          </AnimatedSection>
          
          <AnimatedSection id="section-3" className="relative">
            <DemoPreview />
          </AnimatedSection>
          
          <AnimatedSection id="section-4" className="relative">
            <Pricing />
          </AnimatedSection>
          
          <AnimatedSection id="section-5" className="relative">
            <Testimonials />
          </AnimatedSection>
          
          <AnimatedSection id="section-6" className="relative">
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center w-full">
                <CTA />
              </div>
              <Footer />
            </div>
          </AnimatedSection>
        </div>
        
        <ScrollToTop />
        <SectionNavigator />
      </main>
    </SmoothScrollProvider>
  )
}

