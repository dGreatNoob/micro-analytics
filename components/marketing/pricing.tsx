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
    <div className="w-full h-full relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-300 text-pretty leading-relaxed">
            Start free, upgrade when you need to. No hidden fees, no surprises. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col glass border-white/20 ${
                plan.popular ? "glow scale-105" : ""
              } transition-all duration-300 hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-violet-600 text-white px-4 py-1 rounded-full text-sm font-semibold glow">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-base text-gray-300">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700 glow-hover"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-300">
            Need more than 500k pageviews?{" "}
            <a href="#contact" className="text-blue-400 hover:underline font-medium">
              Contact us for enterprise pricing
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
