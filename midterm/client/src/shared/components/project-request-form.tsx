import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Phone,
  MessageSquare,
} from "lucide-react";
import { api } from "@/shared/api/api-client";

interface FormState {
  name: string;
  phone: string;
  preferredContact: "WhatsApp" | "Telegram" | "Звонок";
  message: string;
}

const initialFormState: FormState = {
  name: "",
  phone: "",
  preferredContact: "WhatsApp",
  message: "",
};

interface FormErrors {
  name?: string;
  phone?: string;
}

interface SubmittedData {
  ticketNumber: string;
  name: string;
  preferredContact: string;
}

export const ProjectRequestForm = ({
  className = "",
  onSuccess,
}: {
  className?: string;
  onSuccess?: () => void;
}) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
    if (errorStatus) {
      setErrorStatus(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Укажите имя (от 2 символов)";
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!form.phone.trim() || !phoneRegex.test(form.phone.trim())) {
      newErrors.phone = "Введите номер телефона (например, +7 700 123 45 67)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorStatus(null);

    try {
      const res = await api.sendContactRequest({
        name: form.name.trim(),
        phone: form.phone.trim(),
        type: "QUOTE",
        message: `[Связь через: ${form.preferredContact}] ${form.message.trim() ? "— " + form.message.trim() : ""}`,
      });

      if (!res || !res.success) {
        throw new Error("Не удалось отправить заявку. Попробуйте еще раз.");
      }

      const ticket = `AUR-${(res.data?.id ?? Date.now()).toString().slice(-4)}`;
      setSubmittedData({
        ticketNumber: ticket,
        name: form.name.trim(),
        preferredContact: form.preferredContact,
      });

      setForm(initialFormState);
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при отправке. Пожалуйста, повторите.";
      setErrorStatus(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setForm(initialFormState);
    setErrors({});
    setErrorStatus(null);
  };

  return (
    <div
      className={`relative p-6 sm:p-8 md:p-10 bg-white/[0.015] border border-white/10 backdrop-blur-sm ${className}`}
    >
      <AnimatePresence mode="wait">
        {submittedData ? (
          /* SUCCESS STATE */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="py-8 text-center flex flex-col items-center justify-center space-y-5"
          >
            <div className="w-14 h-14 rounded-full bg-[#bfb3a0]/10 border border-[#bfb3a0]/30 flex items-center justify-center text-[#bfb3a0]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-sm">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#bfb3a0]">
                Заявка #{submittedData.ticketNumber}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-[#e3e1dc]">
                Спасибо, {submittedData.name}!
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                Декоратор Aura изучит ваш запрос и напишет вам в{" "}
                <span className="text-[#bfb3a0]">{submittedData.preferredContact}</span>{" "}
                в течение 15 минут.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-2 inline-flex items-center gap-2 py-3 px-6 border border-white/20 text-[#e3e1dc] text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Отправить еще одну
            </button>
          </motion.div>
        ) : (
          /* EXPRESS FORM */
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Header */}
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-[#e3e1dc]">
                Связаться с нами
              </h3>
            </div>

            {/* Error Notification */}
            {errorStatus && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-950/30 border border-red-500/20 text-red-300 text-xs"
              >
                {errorStatus}
              </motion.div>
            )}

            {/* Two-Column Inputs: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Мария или Арман"
                  className={`w-full bg-[#0e0d0c]/80 border py-3 px-3.5 text-xs text-[#e3e1dc] placeholder:text-neutral-600 focus:outline-none transition-colors ${
                    errors.name
                      ? "border-red-500/80 focus:border-red-400"
                      : "border-white/10 focus:border-[#bfb3a0]"
                  }`}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone / Messenger */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400">
                  Телефон / WhatsApp
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+7 (700) 000-00-00"
                  className={`w-full bg-[#0e0d0c]/80 border py-3 px-3.5 text-xs text-[#e3e1dc] placeholder:text-neutral-600 focus:outline-none transition-colors ${
                    errors.phone
                      ? "border-red-500/80 focus:border-red-400"
                      : "border-white/10 focus:border-[#bfb3a0]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-[10px] text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Preference Chips */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Где удобнее ответить?</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "WhatsApp", icon: MessageSquare },
                    { id: "Telegram", icon: Send },
                    { id: "Звонок", icon: Phone },
                  ] as const
                ).map(({ id, icon: Icon }) => {
                  const isSelected = form.preferredContact === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleChange("preferredContact", id)}
                      className={`py-2 px-2 text-xs tracking-wider border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#bfb3a0]/15 text-[#bfb3a0] border-[#bfb3a0]"
                          : "bg-transparent text-neutral-400 border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Comment / Request */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Пожелания</span>
                <span className="text-[10px] text-neutral-500">
                  опционально
                </span>
              </label>
              <textarea
                rows={2}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Площадь помещения, ресторан, квартира или нужные предметы..."
                className="w-full bg-[#0e0d0c]/80 border border-white/10 py-2.5 px-3.5 text-xs text-[#e3e1dc] placeholder:text-neutral-600 focus:outline-none focus:border-[#bfb3a0] transition-colors resize-none min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Отправить</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectRequestForm;
