"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is Kompa?",
    answer:
      "Kompa is a unified property data marketplace that lets you find verified comparable data (comps) and send it directly into your existing workflow tools — helping you make faster, smarter decisions without the manual research.",
  },
  {
    question: "How accurate is the data?",
    answer:
      "Every dataset listed on Kompa is verified before it’s allowed onto the marketplace. We review and validate all submissions to ensure only high-quality, trustworthy data is made available to buyers.",
  },
  {
    question: "Can I integrate with my existing software?",
    answer:
      "Yes. Kompa provides secure API integrations that allow you to pull purchased data directly into your existing systems — whether that’s a CRM, analytics platform, or custom-built application. It’s all about making your workflow seamless.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "There’s no free trial — you only pay for what you need. When you find the exact data you’re looking for, you purchase it instantly, no subscriptions or hidden fees involved.",
  },
  {
    question: "Can I list my data on Kompa?",
    answer:
      "Yes. If you own or manage verified property data, you can become a data provider on Kompa. We make it simple to upload, manage, and sell your datasets to a growing audience of professionals.",
  },
  {
    question: "How do payments work for data providers?",
    answer:
      "Kompa operates on a commission-based model. For every sale made through the marketplace, we deduct a 30% platform fee to cover operations, security, and distribution — and you receive the remaining 70% directly.",
  },
]



const FaqItem = ({
  faq,
  isOpen,
  onClick,
}: {
  faq: { question: string; answer: string }
  isOpen: boolean
  onClick: () => void
}) => (
  <div className="border-b border-gray-200 py-6">
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between text-left"
      aria-expanded={isOpen}
    >
      <span className="text-base font-medium text-gray-900">{faq.question}</span>
      <ChevronDown
        className={`h-6 w-6 transform text-gray-500 transition-transform duration-300 ${
          isOpen ? "rotate-180 text-gray-800" : ""
        }`}
        aria-hidden="true"
      />
    </button>
    <div
      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <p className="pt-4 text-base leading-relaxed text-gray-700">
          {faq.answer}
        </p>
      </div>
    </div>
  </div>
)


export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 md:text-base text-sm text-gray-600 max-w-3xl">
            Everything you need to know about how Kompa helps you to find the right comparable data for your project and how you can monetize data already available to you
          </p>
        </div>

    
        <div className="mt-8">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.answer}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
