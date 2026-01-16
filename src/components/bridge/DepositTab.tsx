import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Copy, Download, AlertTriangle, Loader2, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivacyVault, saveDepositNote, serializeDepositNote } from "@/hooks/usePrivacyVault";
import { useToast } from "@/hooks/use-toast";
import type { DepositNote } from "@/lib/zkProofs";
import { getTokenBySymbol, formatTokenAmount, getPoolStats } from "@/lib/tokens";
import { hapticFeedback } from "@/lib/utils";

// Solana logo URL
const SOL_LOGO = "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

interface DepositTabProps {
  isConnected: boolean;
  onConnect: () => void;
}

export const DepositTab = ({ isConnected, onConnect }: DepositTabProps) => {
  const [amount, setAmount] = useState("");
  const [selectedDenom, setSelectedDenom] = useState<number | null>(null);
  const [secretNote, setSecretNote] = useState("");
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(0);
  const [depositNote, setDepositNote] = useState<DepositNote | null>(null);
  const [useCustomAmount, setUseCustomAmount] = useState(false);

  const { generateSecrets, deposit, getBalance, isLoading } = usePrivacyVault();
  const { toast } = useToast();

  // SOL token config
  const currentToken = useMemo(() => getTokenBySymbol("SOL"), []);
  const poolStats = useMemo(() => currentToken ? getPoolStats(currentToken) : null, [currentToken]);

  // Generate denominations for SOL
  const DENOMINATIONS = useMemo(() => {
    if (!currentToken || !poolStats) return [];
    return currentToken.denominations.map(value => ({
      value,
      label: `${formatTokenAmount(value, currentToken)} SOL`,
      anonymitySet: `~${poolStats.anonymitySet[value.toString()] || 100}`,
    }));
  }, [currentToken, poolStats]);

  // Fetch balance on mount and when connection changes
  useEffect(() => {
    if (isConnected) {
      getBalance().then(setBalance).catch(console.error);
    } else {
      setBalance(0);
    }
  }, [isConnected, getBalance]);

  const generateSecretNote = useCallback(async () => {
    const depositAmount = parseFloat(amount) || 0.1;
    setIsGenerating(true);

    try {
      const note = await generateSecrets(depositAmount);
      setDepositNote(note);
      const displayNote = `tetsuo-vault-${note.commitment.slice(0, 16)}...`;
      setSecretNote(displayNote);

      hapticFeedback('success');
      toast({
        title: "Secret Note Generated",
        description: "Your ZK commitment has been created. Save it before depositing!",
      });
    } catch (error) {
      console.error("Failed to generate secrets:", error);
      hapticFeedback('error');
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [amount, generateSecrets, toast]);

  const handleCopy = async () => {
    if (!depositNote) return;
    const fullNote = serializeDepositNote(depositNote);
    await navigator.clipboard.writeText(fullNote);
    setCopied(true);
    hapticFeedback('light');
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Full secret note copied to clipboard." });
  };

  const handleDownload = () => {
    if (!depositNote) return;
    const fullNote = serializeDepositNote(depositNote);
    const blob = new Blob([fullNote], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tetsuo-vault-note-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "Secret note saved to file." });
  };

  const handleMax = () => {
    const maxAmount = Math.max(0, balance - 0.01);
    setAmount(maxAmount.toFixed(4));
  };

  const handleDeposit = async () => {
    if (!isConnected) {
      onConnect();
      return;
    }

    if (!depositNote) {
      toast({ title: "Generate Note First", description: "Please generate a secret note before depositing.", variant: "destructive" });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid deposit amount.", variant: "destructive" });
      return;
    }

    if (depositAmount > balance) {
      toast({ title: "Insufficient Balance", description: "You don't have enough SOL for this deposit.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await deposit(depositAmount);
      saveDepositNote(result.note);
      hapticFeedback('success');
      toast({ title: "Deposit Successful!", description: `${depositAmount} SOL deposited. Transaction: ${result.signature?.slice(0, 8)}...` });
      const newBalance = await getBalance();
      setBalance(newBalance);
      setAmount("");
      setSecretNote("");
      setDepositNote(null);
    } catch (error) {
      console.error("Deposit error:", error);
      hapticFeedback('error');
      toast({ title: "Deposit Failed", description: error instanceof Error ? error.message : "Unknown error occurred", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDenomSelect = (value: number) => {
    hapticFeedback('light');
    setSelectedDenom(value);
    setAmount(value.toString());
    setUseCustomAmount(false);
    setSecretNote("");
    setDepositNote(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        {/* Token Display - SOL only with official icon */}
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <img src={SOL_LOGO} alt="SOL" className="w-8 h-8 rounded-full" />
            <div>
              <span className="font-semibold text-lg text-foreground">SOL</span>
              <span className="text-muted-foreground/80 text-sm ml-2">Solana</span>
            </div>
          </div>
        </div>

        {/* Fixed Denomination Pools */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Shield className="h-4 w-4" />
            <span>Select Pool (Fixed amounts for better privacy)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DENOMINATIONS.map((denom) => (
              <motion.button
                key={denom.value}
                onClick={() => handleDenomSelect(denom.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedDenom === denom.value && !useCustomAmount
                    ? "border-primary bg-primary/10"
                    : "border-muted/50 bg-muted/20 hover:border-muted"
                }`}
              >
                <div className="text-lg font-bold text-foreground">{denom.label}</div>
                <div className="text-xs text-foreground/60">{denom.anonymitySet} deposits</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Amount Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/70">Or enter custom amount</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setUseCustomAmount(!useCustomAmount);
              if (!useCustomAmount) {
                setSelectedDenom(null);
                setAmount("");
              }
            }}
            className={`h-6 px-2 text-xs ${useCustomAmount ? "text-primary" : "text-foreground/60"}`}
          >
            {useCustomAmount ? "Using Custom" : "Custom"}
          </Button>
        </div>

        {/* Amount Input (collapsible) */}
        <AnimatePresence>
          {useCustomAmount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/30 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between text-sm text-foreground/70">
                <span>Custom Amount</span>
                <Button variant="ghost" size="sm" onClick={handleMax} className="h-6 px-2 text-xs text-primary hover:text-primary/80">
                  MAX
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(',', '.');
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                      setSelectedDenom(null);
                    }
                  }}
                  className="bg-transparent border-0 text-2xl font-medium flex-1 p-0 h-auto focus-visible:ring-0 rounded-none text-foreground"
                />
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                  <img src={SOL_LOGO} alt="SOL" className="w-6 h-6 rounded-full" />
                  <span className="font-medium text-foreground">SOL</span>
                </div>
              </div>
              <div className="text-xs text-foreground/80">Custom amounts have smaller anonymity sets</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Balance Display */}
        <div className="bg-muted/30 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/70">Balance:</span>
            <span className="font-mono text-sm text-foreground">
              {currentToken ? formatTokenAmount(balance, currentToken) : balance.toFixed(4)} SOL
            </span>
          </div>
        </div>

        {/* Generate Secret Note Button */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button onClick={generateSecretNote} disabled={isGenerating} variant="outline" className="w-full h-12 font-semibold border-dashed border-2">
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating ZK Commitment...</>
            ) : (
              "GENERATE SECRET NOTE"
            )}
          </Button>
        </motion.div>

        {/* Secret Note Display */}
        <AnimatePresence>
          {secretNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/30 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Your Secret Note</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsNoteVisible(!isNoteVisible)} className="h-8 w-8 p-0">
                    {isNoteVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="font-mono text-sm bg-muted/50 rounded-lg p-3 break-all text-foreground">
                {isNoteVisible ? (depositNote ? serializeDepositNote(depositNote) : secretNote) : "••••••••••••••••••••••••••••••"}
              </div>
              {depositNote && (
                <div className="text-xs text-foreground/60">
                  <p>Commitment: {depositNote.commitment.slice(0, 20)}...</p>
                  <p>Amount: {depositNote.amount} SOL</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning Message */}
        <div className="flex items-start gap-3 bg-muted/30 border border-border/40 rounded-xl p-4">
          <AlertTriangle className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">
            <strong className="text-foreground font-semibold">Save this note!</strong> Required to withdraw. We cannot recover it.
          </p>
        </div>
      </div>

      {/* Deposit Button */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-4">
        <Button
          onClick={handleDeposit}
          disabled={isProcessing || isLoading || (!secretNote && isConnected)}
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 glow-button uppercase tracking-wide"
        >
          {isProcessing || isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</>
          ) : isConnected ? "DEPOSIT" : "Connect Wallet"}
        </Button>
      </motion.div>
    </div>
  );
};
