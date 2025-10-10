import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for personal projects",
    features: [
      "5,000 pageviews/month",
      "1 website",
      "Real-time analytics",
      "7-day data retention",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For indie devs and small businesses",
    features: [
      "100k pageviews/month",
      "10 websites",
      "Real-time analytics",
      "Unlimited data retention",
      "Priority support",
      "Custom events",
      "API access",
    ],
    cta: "Upgrade",
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "For growing companies",
    features: [
      "500k+ pageviews/month",
      "Unlimited websites",
      "Real-time analytics",
      "Unlimited data retention",
      "Priority support",
      "Custom events",
      "API access",
      "White-label reports",
      "Team collaboration",
    ],
    cta: "Upgrade",
    popular: false,
  },
]

export function Pricing() {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col gap-4">
          <div className="text-center max-w-3xl mx-auto pb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-balance text-white">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-gray-300 text-pretty">
              Start free, upgrade when you need to. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto pb-6 w-full">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative flex flex-col glass border-white/20 ${
                  plan.popular ? "glow scale-105" : ""
                } transition-all duration-300 hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-violet-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold glow">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-300">{plan.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 py-3">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs leading-snug text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700 glow-hover"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Need more than 500k pageviews?{" "}
              <a href="#contact" className="text-blue-400 hover:underline font-medium">
                Contact us for enterprise pricing
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
