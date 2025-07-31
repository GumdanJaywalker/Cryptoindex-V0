'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function TradingPanel() {
  return (
    <div className="bg-background">
      <div className="px-3 pt-2.5 space-y-3 bg-background">
        {/* Long/Short Toggle */}
        <Tabs defaultValue="long" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="long" className="text-emerald-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              Long
            </TabsTrigger>
            <TabsTrigger value="short" className="text-red-400 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <TrendingDown className="w-4 h-4 mr-1" />
              Short
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="long" className="space-y-3 mt-3">
            {/* Order Type */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Order Type</label>
              <Select defaultValue="market">
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="market" className="text-popover-foreground focus:bg-accent">Market</SelectItem>
                  <SelectItem value="limit" className="text-popover-foreground focus:bg-accent">Limit</SelectItem>
                  <SelectItem value="stop" className="text-popover-foreground focus:bg-accent">Stop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Leverage */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Leverage</label>
              <div className="flex items-center space-x-2">
                <Input defaultValue="10x" readOnly className="flex-1 bg-muted border-border text-foreground" />
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">Adj</Button>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price</label>
              <Input defaultValue="1.2345" placeholder="Market Price" className="bg-muted border-border text-foreground" />
            </div>

            {/* Size */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Size</label>
              <div className="flex space-x-1">
                <Input placeholder="0" className="flex-1 bg-muted border-border text-foreground" />
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">25%</Button>
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">50%</Button>
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">100%</Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded p-3 space-y-2 border border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Est. Liq. Price</span>
                <span className="text-card-foreground">$0.8234</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Margin</span>
                <span className="text-card-foreground">$123.45</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Fee</span>
                <span className="text-card-foreground">$0.62</span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
              Open Long Position
            </Button>
          </TabsContent>
          
          <TabsContent value="short" className="space-y-3 mt-3">
            {/* Similar content for Short */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Order Type</label>
              <Select defaultValue="market">
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="market" className="text-popover-foreground focus:bg-accent">Market</SelectItem>
                  <SelectItem value="limit" className="text-popover-foreground focus:bg-accent">Limit</SelectItem>
                  <SelectItem value="stop" className="text-popover-foreground focus:bg-accent">Stop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Leverage</label>
              <div className="flex items-center space-x-2">
                <Input defaultValue="10x" readOnly className="flex-1 bg-muted border-border text-foreground" />
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">Adj</Button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price</label>
              <Input defaultValue="1.2345" placeholder="Market Price" className="bg-muted border-border text-foreground" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Size</label>
              <div className="flex space-x-1">
                <Input placeholder="0" className="flex-1 bg-muted border-border text-foreground" />
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">25%</Button>
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">50%</Button>
                <Button variant="outline" size="sm" className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent">100%</Button>
              </div>
            </div>

            <div className="bg-card rounded p-3 space-y-2 border border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Est. Liq. Price</span>
                <span className="text-card-foreground">$1.8234</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Margin</span>
                <span className="text-card-foreground">$123.45</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Fee</span>
                <span className="text-card-foreground">$0.62</span>
              </div>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20">
              Open Short Position
            </Button>
          </TabsContent>
        </Tabs>

        {/* Account Info - 여백 추가! */}
        <div className="border-t border-border pt-3 pb-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="text-foreground">$8,234.12</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Margin Used</span>
            <span className="text-foreground">$1,146.83</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Free Margin</span>
            <span className="text-foreground">$7,087.29</span>
          </div>
        </div>
      </div>
    </div>
  )
}
