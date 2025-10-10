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
      <Header />
      <main className="animated-gradient">
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
            <div className="flex items-center justify-center w-full relative" style={{ height: '75vh' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-purple-600/20" />
              <div className="relative w-full h-full flex items-center justify-center">
                <CTA />
              </div>
            </div>
            <div className="w-full" style={{ height: '25vh' }}>
              <Footer />
            </div>
          </div>
        </AnimatedSection>
      </main>
      
      <ScrollToTop />
      <SectionNavigator />
    </SmoothScrollProvider>
  )
}

