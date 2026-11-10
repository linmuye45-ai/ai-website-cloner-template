"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/context/i18n-context";
import { LOCALE_META } from "@/lib/ui-dictionary";
import { ZhongJingLogoMark } from "./icons";

export function NavbarHud() {
  const { locale, setLocale, t, openDemoModal } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t.nav.platform, href: "#workbench", highlight: true },
    { label: t.nav.standards, href: "#standards" },
    { label: t.nav.agents, href: "#agents" },
    { label: t.nav.safety, href: "#safety" },
    { label: t.nav.roi, href: "#roi" },
    { label: t.nav.research, href: "#research" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zj-white/95 backdrop-blur-md border-b border-zj-border">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <a
          href="#"
          className="flex items-center gap-3 shrink-0 focus:outline-none"
        >
          <ZhongJingLogoMark className="w-7 h-7" />
          <div className="flex items-center gap-2.5">
            <span className="text-[18px] font-semibold tracking-tight text-zj-ink">
              {t.brandName}
            </span>
            <span className="hidden sm:inline-block h-3.5 w-px bg-zj-border-strong" />
            <span className="hidden sm:inline-block text-[12.5px] text-zj-slate">
              {t.brandSub}
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-[14px]"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                item.highlight
                  ? "inline-flex items-center gap-1.5 font-semibold text-zj-cobalt hover:text-zj-blue py-2"
                  : "text-zj-slate hover:text-zj-ink transition-colors py-2"
              }
            >
              {item.highlight && (
                <span className="w-1.5 h-1.5 rounded-full bg-zj-safe" />
              )}
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Locale Switcher & Department Pilot CTA */}
        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Language Switcher"
            className="inline-flex items-center border border-zj-border rounded-[4px] bg-zj-mist p-0.5"
          >
            {LOCALE_META.map((item) => {
              const active = locale === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLocale(item.code)}
                  title={item.fullLabel}
                  aria-pressed={active}
                  className={`px-2 py-1 text-[11.5px] font-medium rounded-[3px] transition-colors cursor-pointer ${
                    active
                      ? "bg-zj-white text-zj-cobalt shadow-[0_1px_2px_rgba(9,30,58,0.06)]"
                      : "text-zj-muted hover:text-zj-ink"
                  }`}
                >
                  {item.shortLabel}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => openDemoModal()}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-[13.5px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[4px] transition-colors cursor-pointer"
          >
            {t.nav.requestDemo}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Menu"
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 text-zj-ink hover:bg-zj-mist rounded-[4px] cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zj-border bg-zj-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-2 text-[14.5px] font-medium text-zj-ink hover:bg-zj-mist rounded-[4px]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-zj-border">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openDemoModal();
              }}
              className="w-full py-2.5 text-[14px] font-medium text-white bg-zj-cobalt hover:bg-zj-blue rounded-[4px] cursor-pointer"
            >
              {t.nav.requestDemo}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
