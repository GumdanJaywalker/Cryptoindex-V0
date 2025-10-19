"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = string | { label: string; value: string };

interface DropdownProps {
  options: Option[];
  value?: string;
  onChange: (v: string) => void;
  align?: "left" | "right";
  buttonClassName?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  align = "right",
  buttonClassName = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number; w: number } | null>(null);

  const list = useMemo(
    () =>
      options.map((o) =>
        typeof o === "string" ? { label: o, value: o } : { label: o.label, value: o.value }
      ),
    [options]
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onClick = (e: MouseEvent) => {
      if (!btnRef.current) return;
      const target = e.target as Node;
      const portalEl = document.getElementById("dropdown-portal");

      // Close if clicking outside of button or portal
      if (!btnRef.current.contains(target) && (!portalEl || !portalEl.contains(target))) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const openMenu = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({
      x: r.left + (align === "left" ? 0 : r.width),
      y: r.bottom + window.scrollY,
      w: r.width,
    });
    setOpen(true);
  };

  const selected = list.find((o) => o.value === value) || list[0];

  return (
    <>
      <button
        ref={btnRef}
        onClick={open ? () => setOpen(false) : openMenu}
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg px-3 py-2",
          "bg-slate-900 border border-slate-700 text-white",
          "hover:bg-slate-800 transition-colors",
          buttonClassName
        )}
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform text-slate-400",
            open && "rotate-180"
          )}
        />
      </button>

      {open && pos && typeof document !== "undefined"
        ? createPortal(
            <div
              id="dropdown-portal"
              className="absolute z-[300]"
              style={{
                left: align === "left" ? pos.x : pos.x - Math.max(220, pos.w),
                top: pos.y + 4, // Add small gap
              }}
            >
              <div className={cn(
                "w-[220px] max-h-60 overflow-auto rounded-lg p-1",
                "bg-slate-900/95 backdrop-blur-md border border-slate-700",
                "shadow-lg shadow-black/50"
              )}>
                {list.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      o.value === selected?.value
                        ? "bg-brand text-slate-950 font-medium"
                        : "text-white hover:bg-slate-800"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
