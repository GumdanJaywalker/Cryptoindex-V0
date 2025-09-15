"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NotificationsButtonProps {
  className?: string
}

export function NotificationsButton({ className }: NotificationsButtonProps) {
  const [unread, setUnread] = useState(3)
  const items = [
    { id: 1, title: "Limit filled", desc: "DOG_INDEX @ $1.2345" },
    { id: 2, title: "Gov update", desc: "Rebalance queued (AIIDX)" },
    { id: 3, title: "Referral", desc: "+$12.30 earnings (24h)" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Notifications" aria-haspopup="menu" className={`relative inline-flex items-center justify-center rounded-md border border-slate-700 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 ${className ?? ''}`}>
        <Bell className="w-4.5 h-4.5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-brand text-black text-[10px] leading-4 text-center">
            {unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-slate-900 border border-slate-700 text-white p-1">
        {items.map((n) => (
          <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2">
            <div className="text-sm">{n.title}</div>
            <div className="text-xs text-slate-400">{n.desc}</div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild className="justify-center text-xs text-slate-300 hover:text-white cursor-pointer">
          <a href="/notifications">View all</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationsButton
