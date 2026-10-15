import { BASE } from "@/shared/config/base";
import { PATHS } from "@/shared/config/paths";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Plus, Minus, ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "Как устроена примерка предметов в интерьере?",
    answer:
      "Мы предоставляем услугу выездной примерки в Алматы: наш декоратор привезет до 5 выбранных позиций (вазы, светильники, текстиль, скульптуры), чтобы вы могли оценить фактуру, цвет и масштаб непосредственно при вашем освещении.",
  },
  {
    id: 2,
    question: "Сроки и условия бережной доставки",
    answer:
      "По Алматы доставляем в день заказа или на следующий рабочий день собственной службой. По Казахстану и СНГ отправляем в усиленной защитной упаковке со 100% страховкой груза (от 2 до 5 рабочих дней).",
  },
  {
    id: 3,
    question: "Сертификация и рекомендации по уходу",
    answer:
      "Каждый предмет ручной работы снабжен паспортом изделия с указанием происхождения материалов (травертин, мрамор, латунь, массив) и подробной инструкцией по бережному уходу.",
  },
];

export default function HomeContacts() {
  const [copied, setCopied] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(BASE.contacts.email.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id={PATHS.anchors.contacts}
      className="relative bg-[#0e0d0c] text-[#e3e1dc] px-4 md:px-12 py-32 lg:py-40 z-20"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[1px] bg-[#bfb3a0]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0]">
              Контакты
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] mb-12">
            Давайте создадим <br />
            <span className="text-neutral-500 italic">вашу атмосферу.</span>
          </h2>

          <div className="space-y-12">
            {/* Email Copy Interaction */}
            <div className="group cursor-pointer w-fit" onClick={handleCopy}>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2 group-hover:text-white transition-colors">
                Связаться с нами
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
                Место нахождения
              </p>
              <p className="text-xl font-light leading-relaxed max-w-xs text-neutral-300">
                {BASE.contacts.address.text}
                <br />
                {BASE.contacts.address.time}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0]">
              Частые вопросы
            </span>
          </div>

          <div className="divide-y divide-white/10 border-b border-white/10">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="py-6">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between text-left group cursor-pointer gap-4"
                  >
                    <span
                      className={`text-lg md:text-xl font-serif transition-colors duration-200 ${
                        isOpen
                          ? "text-[#bfb3a0]"
                          : "text-[#e3e1dc] group-hover:text-white"
                      }`}
                    >
                      {item.question}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-neutral-400 group-hover:border-[#bfb3a0] group-hover:text-white transition-all">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 text-[#bfb3a0]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.33, 1, 0.68, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-sm text-neutral-400 leading-relaxed font-light">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Остались вопросы?
            </span>
            <div className="flex items-center gap-3">
              {BASE.contacts.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/10 text-xs text-neutral-300 hover:text-white hover:border-[#bfb3a0] transition-colors flex items-center gap-2"
                >
                  <social.icon className="w-3.5 h-3.5 text-[#bfb3a0]" />
                  <span>{social.name}</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
