"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LaunchSuccessModalProps {
  open: boolean;
  onClose: () => void;
  indexName: string;
  ticker: string;
}

export default function LaunchSuccessModal({
  open,
  onClose,
  indexName,
  ticker,
}: LaunchSuccessModalProps) {
  const router = useRouter();

  const handleShare = () => {
    const shareText = `Created ${indexName} (${ticker}) index successfully!`;
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(shareText);
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleViewPortfolio = () => {
    // Clear any drafts and navigate to portfolio page
    localStorage.removeItem("launch-draft");
    router.push("/portfolio");
    onClose();
  };

  const handleCreateAnother = () => {
    // Clear drafts and stay on launch page
    localStorage.removeItem("launch-draft");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-md border-slate-700">
        <VisuallyHidden>
          <DialogTitle>Index Launch Success</DialogTitle>
        </VisuallyHidden>
        <div className="text-center py-4">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Index Launched Successfully!</h2>
            <p className="text-slate-400">
              Your {indexName} ({ticker}) index is now live and trading.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Share Button */}
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Index
            </Button>

            {/* Primary Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleViewPortfolio}
                className={cn(
                  "flex-1 bg-brand text-slate-950 font-medium hover:bg-brand/90",
                  "transition-all"
                )}
              >
                View Portfolio
              </Button>
              <Button
                onClick={handleCreateAnother}
                variant="outline"
                className="flex-1 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Create Another
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
