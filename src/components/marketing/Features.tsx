"use client";

import { motion } from "framer-motion";
import { MessageSquare, BarChart3, Target, GraduationCap } from "lucide-react";

const features = [
  {
    title: "AI Doubt Resolution",
    description: "Get instant answers to your course-related questions with our specialized AI assistant.",
    icon: MessageSquare,
    color: "blue",
  },
  {
    title: "Progress Visualization",
    description: "Track your learning journey through modules with an intuitive, real-time dashboard.",
    icon: Target,
    color: "purple",
  },
  {
    title: "Impact Logging",
    description: "Quantify how much time you save at work by applying the AI tools you learn.",
    icon: BarChart3,
    color: "rose",
  },
  {
    title: "Module Repository",
    description: "A structured repository of AI workshops and tools for working professionals.",
    icon: GraduationCap,
    color: "amber",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Everything you need to <span className="text-blue-500">Master AI</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            OutcomeOS provides the infrastructure for a seamless learning experience, focusing on actual outcomes and productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
