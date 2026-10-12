import { BASE } from "@/shared/config/base";
import { motion } from "motion/react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function HomeContacts() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("hello@aura.decor");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contacts"
      className="relative bg-[#0e0d0c] text-[#e3e1dc] px-4 md:px-12 py-32 lg:py-40 z-20"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
        {/* LEFT COLUMN: HEADLINE & INFO */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[1px] bg-[#bfb3a0]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#bfb3a0]">
              Contact
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] mb-12">
            Давайте создадим <br />
            <span className="text-neutral-500 italic">вашу атмосферу</span>.
          </h2>

          <div className="space-y-12">
            {/* Email Copy Interaction */}
            <div className="group cursor-pointer w-fit" onClick={handleCopy}>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2 group-hover:text-white transition-colors">
                Email us
              </p>
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-light border-b border-white/20 pb-1 group-hover:border-[#bfb3a0] transition-colors">
                  {BASE.contacts.email.text}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#1a1918] flex items-center justify-center text-neutral-400 group-hover:scale-110 group-hover:bg-[#bfb3a0] group-hover:text-black transition-all">
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Visit Showroom
              </p>
              <p className="text-xl font-light leading-relaxed max-w-xs text-neutral-300">
                {BASE.contacts.address.text}
                <br />
                {BASE.contacts.address.time}
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: SOCIAL LINKS LIST */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <div className="border-t border-white/10">
            {BASE.contacts.socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-10 border-b border-white/10 hover:border-[#bfb3a0]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-[#bfb3a0] group-hover:text-black group-hover:border-[#bfb3a0] transition-all duration-300">
                    <social.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif text-[#e3e1dc] group-hover:text-[#bfb3a0] transition-colors">
                      {social.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 mt-1 tracking-wider uppercase group-hover:text-white/60 transition-colors">
                      {social.handle}
                    </p>
                  </div>
                </div>

                <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                  <ArrowUpRight className="w-6 h-6 text-neutral-500 transition-transform duration-500 group-hover:text-[#bfb3a0] group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12">
            <p className="text-neutral-500 text-sm leading-relaxed max-w-md">
              Мы всегда на связи в мессенджерах. Напишите нам, чтобы обсудить
              индивидуальный заказ или запросить оптовый прайс-лист.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
