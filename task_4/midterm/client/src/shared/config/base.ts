import { MessageCircle, Send } from "lucide-react";
import type { SocialLink } from "../types";

export interface BaseConfig {
  logo: {
    text: string;
  };
  contacts: {
    address: {
      text: string;
      time: string;
    };
    email: {
      text: string;
    };
    socialLinks: SocialLink[];
  };
}

export const BASE: BaseConfig = {
  logo: {
    text: "Aura",
  },
  contacts: {
    address: {
      text: "Almaty, Dostyk Ave 42",
      time: "Mon-Fri, 10:00 — 19:00",
    },
    email: {
      text: "hello@aura.decor",
    },
    socialLinks: [
      {
        id: 1,
        name: "WhatsApp",
        handle: "+7 (700) 123-45-67",
        link: "https://wa.me/77001234567",
        icon: MessageCircle,
      },
      {
        id: 2,
        name: "Telegram",
        handle: "@aura_manager",
        link: "https://t.me/username",
        icon: Send,
      },
    ],
  },
};
