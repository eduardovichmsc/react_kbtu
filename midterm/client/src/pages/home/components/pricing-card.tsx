import { PATHS } from "@/shared/config/paths";
import type { PricingPackage } from "@/shared/types";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import CustomLink from "@/shared/components/custom-link";

interface PricingCardProps {
  pkg: PricingPackage;
  index: number;
}

export const PricingCard = ({ pkg, index }: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative group flex flex-col justify-between min-h-[600px] border border-white/10 bg-[#0e0d0c] overflow-hidden ${
        pkg.isPopular ? "border-[#bfb3a0]/50" : ""
      }`}
    >
      {/* BACKGROUND IMAGE (Reveals on Hover) */}
      <div className="absolute inset-0 z-0">
        <img
          src={pkg.img}
          alt={pkg.name}
          className="object-cover opacity-20 grayscale group-hover:opacity-40 group-hover:grayscale-0 transition-all duration-700 ease-in-out w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0d0c] via-[#0e0d0c]/80 to-[#0e0d0c]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-3xl font-serif">{pkg.name}</h3>
            {pkg.isPopular && (
              <span className="bg-[#bfb3a0] text-black text-[10px] font-bold uppercase px-2 py-1 tracking-widest">
                Popular
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed min-h-[48px]">
            {pkg.desc}
          </p>
        </div>

        {/* Price */}
        <div className="py-8 border-t border-white/10 border-b mb-8">
          <span className="text-xs text-neutral-500 uppercase tracking-widest block mb-2">
            Бюджет
          </span>
          <p className="text-3xl md:text-4xl text-white">
            {pkg.price}
          </p>
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-12 flex-1">
          {pkg.features.map((feature: string, idx: number) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-sm text-neutral-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#bfb3a0]" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <CustomLink
          to={`${PATHS.home}#${PATHS.anchors.contacts}`}
          className="w-full py-4 border border-white/20 text-xs uppercase tracking-[0.2em] hover:bg-[#bfb3a0] hover:text-black hover:border-[#bfb3a0] transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
        >
          <span>Заказать</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </CustomLink>
      </div>
    </motion.div>
  );
};
