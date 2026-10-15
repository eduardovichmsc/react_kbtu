import { useRef, useState } from "react";
import { navLinks, socialLinks } from "@/shared/config/paths";
import { BASE } from "@/shared/config/base";
import CustomLink from "@/shared/components/custom-link";

const content = {
  primaryText: "Не пропустите",
  secondaryText: "новые коллекции",
  email: {
    placeholder: "Ваш email",
    submitText: "Подписаться",
  },
};

export default function Footer() {
  const container = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div
      ref={container}
      className="relative min-h-[720px] md:h-[720px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="md:fixed md:bottom-0 min-h-[720px] md:h-[720px] w-full bg-[#0e0d0c] text-[#e3e1dc] flex flex-col px-4 md:px-12 py-12">
        <div className="mx-auto max-w-[1600px] w-full h-full flex flex-col justify-between grow">
          {/* 6 + 2 + 2 + 2 = 12 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 border-b border-white/10 pb-12">
            {/* 6 */}
            <div className="col-span-1 sm:col-span-2 md:col-span-6 flex flex-col justify-between">
              <div>
                <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                  {content.primaryText} <br />{" "}
                  <span className="text-[#bfb3a0] italic">
                    {content.secondaryText}
                  </span>
                  .
                </h3>
              </div>
              <form
                onSubmit={handleSubscribe}
                className="mt-8 md:mt-0 relative max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    subscribed
                      ? "Спасибо за подписку!"
                      : content.email.placeholder
                  }
                  disabled={subscribed}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-lg focus:outline-none focus:border-[#bfb3a0] transition-colors placeholder:text-neutral-500 disabled:opacity-75"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest hover:text-[#bfb3a0] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {subscribed ? "Готово" : content.email.submitText}
                </button>
              </form>
            </div>

            {/* 2 */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0] mb-6 font-mono"></h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                {navLinks.map((item) => (
                  <li key={item.name}>
                    <CustomLink
                      to={item.href}
                      className="hover:text-white transition-all duration-300 inline-block"
                    >
                      {item.name}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2 */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0] mb-6 font-mono"></h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                {socialLinks.map((item) => (
                  <li key={item.name}>
                    <CustomLink
                      to={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-all duration-300 inline-block"
                    >
                      {item.name}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2 */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#bfb3a0] mb-6 font-mono"></h4>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                {BASE.contacts.address.text}
                <br />
                {BASE.contacts.address.time}
              </p>
            </div>
          </div>

          {/* bot */}
          <div className="relative overflow-hidden flex flex-col justify-end pt-8">
            <h2 className="w-full">
              <svg
                viewBox="0 0 100 22"
                className="w-full h-auto fill-[#e3e1dc]"
              >
                <text
                  x="50%"
                  y="18"
                  textAnchor="middle"
                  fontSize="22"
                  fontFamily="serif"
                  fontWeight="bold"
                  letterSpacing="-1"
                >
                  AURA.
                </text>
              </svg>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
