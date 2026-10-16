import { ClipboardList, Handshake, Layers, MessageSquare, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react";
import { whyChooseUs } from "@/content/home";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons: Record<string, LucideIcon> = {
  trained: UserCheck,
  plans: ClipboardList,
  safety: ShieldCheck,
  sectors: Layers,
  communication: MessageSquare,
  relationships: Handshake,
};

/** 3×2 grid with hairline separators rather than boxed cards (PROMPT.md §3, fix 8). */
export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="section-y bg-surface">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            id="why-title"
            eyebrow={whyChooseUs.eyebrow}
            title={whyChooseUs.title}
            description={whyChooseUs.description}
          />
        </Reveal>
        {/* 1px gaps over a border-coloured background draw the internal hairlines. */}
        <ul className="grid gap-px self-start bg-border sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
          {whyChooseUs.items.map((item, index) => (
            <li key={item.id} className="bg-surface py-7 sm:p-7">
              <Reveal delay={index * 0.06}>
                <Icon icon={icons[item.id] ?? ShieldCheck} size={24} className="text-gold-ink" />
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-1.5 text-[15px] text-ink-muted">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
