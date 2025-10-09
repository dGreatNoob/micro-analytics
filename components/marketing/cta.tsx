import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Ready to respect your visitors&apos; privacy?
          </h2>
          <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed">
            Join thousands of indie developers and small businesses using Microlytics. Start your free trial today—no
            credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-base w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#docs">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base bg-transparent w-full sm:w-auto"
              >
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
