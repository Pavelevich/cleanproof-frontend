import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Clipboard, Loader2, Check, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { usePrivacyVault } from "@/hooks/usePrivacyVault";
import { useToast } from "@/hooks/use-toast";
import { hapticFeedback } from "@/lib/utils";

// Relayer configuration
const RELAYER_FEE_PERCENT = 0.5;

interface WithdrawTabProps {
  isConnected: boolean;
  walletAddress?: string;
  onConnect: () => void;
}

export const WithdrawTab = ({ isConnected, walletAddress, onConnect }: WithdrawTabProps) => {
  const [secretNote, setSecretNote] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [useConnectedWallet, setUseConnectedWallet] = useState(false);
  const [useRelayer, setUseRelayer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { withdraw, isLoading } = usePrivacyVault();
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipientAddress(text);
      hapticFeedback('light');
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSecretNote(content);
        hapticFeedback('success');
        toast({ title: "Note Loaded", description: `Loaded secret note from ${file.name}` });
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      onConnect();
      return;
    }

    if (!secretNote) {
      toast({ title: "Missing Secret Note", description: "Please paste or upload your secret note.", variant: "destructive" });
      return;
    }

    const recipient = useConnectedWallet && walletAddress ? walletAddress : recipientAddress;
    if (!recipient) {
      toast({ title: "Missing Recipient", description: "Please enter a recipient address or use your connected wallet.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      toast({ title: "Generating ZK Proof...", description: "This may take 30-60 seconds. Please wait." });
      const result = await withdraw(secretNote, recipient);

      if (result.success) {
        setWithdrawSuccess(true);
        hapticFeedback('success');
        toast({ title: "Withdrawal Successful!", description: `ZK proof verified. Funds sent to ${recipient.slice(0, 8)}...` });

        setTimeout(() => {
          setSecretNote("");
          setRecipientAddress("");
          setWithdrawSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      hapticFeedback('error');
      toast({ title: "Withdrawal Failed", description: error instanceof Error ? error.message : "Unknown error occurred", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        {/* Secret Note Textarea */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
          <span className="text-sm font-medium text-foreground">Secret Note</span>
          <Textarea
            placeholder="Paste your secret note JSON here..."
            value={secretNote}
            onChange={(e) => setSecretNote(e.target.value)}
            className="bg-muted/50 border-0 min-h-[100px] resize-none focus-visible:ring-0 font-mono text-xs text-foreground"
          />
          <div className="flex justify-center">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.json" className="hidden" />
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="text-foreground/70 hover:text-foreground">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
          <span className="text-sm font-medium text-foreground">Recipient Address</span>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Solana address..."
              value={useConnectedWallet && walletAddress ? walletAddress : recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              disabled={useConnectedWallet && isConnected}
              className="bg-muted/50 border-0 flex-1 focus-visible:ring-2 focus-visible:ring-ring font-mono text-sm text-foreground rounded-lg"
            />
            <Button variant="ghost" size="sm" onClick={handlePaste} disabled={useConnectedWallet && isConnected} className="text-foreground/70 hover:text-foreground">
              <Clipboard className="h-4 w-4 mr-1" />
              Paste
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useWallet"
              checked={useConnectedWallet}
              onCheckedChange={(checked) => setUseConnectedWallet(checked as boolean)}
              disabled={!isConnected}
            />
            <label htmlFor="useWallet" className="text-sm text-foreground/80 cursor-pointer">
              Use connected wallet
            </label>
          </div>
        </div>

        {/* Success Message */}
        {withdrawSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/10 border border-primary/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-foreground">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Withdrawal Complete!</span>
            </div>
            <p className="text-sm text-foreground/80 mt-1">Your ZK proof was verified and funds have been sent.</p>
          </motion.div>
        )}

        {/* Relayer Option */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Use Relayer</span>
            </div>
            <Checkbox
              id="useRelayer"
              checked={useRelayer}
              onCheckedChange={(checked) => setUseRelayer(checked as boolean)}
            />
          </div>
          <div className="text-xs text-foreground/60 space-y-1">
            <p>Relayer pays gas fees for maximum privacy.</p>
            <p className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              Fee: {RELAYER_FEE_PERCENT}% of withdrawal amount
            </p>
          </div>
          {useRelayer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-muted/30 border border-border/30 rounded-lg p-2 text-xs text-foreground/80"
            >
              Relayer mode: Your recipient address won't appear as the transaction payer
            </motion.div>
          )}
        </div>
      </div>

      {/* Withdraw Button */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-4">
        <Button
          onClick={handleWithdraw}
          disabled={isProcessing || isLoading || (!secretNote && isConnected)}
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 glow-button uppercase tracking-wide"
        >
          {isProcessing || isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Generating ZK Proof...</>
          ) : isConnected ? "WITHDRAW PRIVATELY" : "Connect Wallet"}
        </Button>
      </motion.div>
    </div>
  );
};
