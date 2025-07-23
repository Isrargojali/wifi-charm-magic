import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wifi, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WifiPasswordGenerator = () => {
  const [wifiName, setWifiName] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Character transformation mapping
  const transformMap: { [key: string]: string } = {
    'a': '5', '5': 'a',
    'b': '4', '4': 'b', 
    'c': '3', '3': 'c',
    'd': '2', '2': 'd',
    'e': '1', '1': 'e',
    'f': '0', '0': 'f',
    '6': '9', '9': '6',
    '7': '8', '8': '7'
  };

  const generatePassword = () => {
    if (!wifiName.trim()) {
      toast({
        title: "Please enter a WiFi name",
        description: "Enter a WiFi name like 'fh_91cc00' to generate the password",
        variant: "destructive",
      });
      return;
    }

    let processedName = wifiName.toLowerCase().trim();
    
    // Remove fh_ prefix if it exists
    if (processedName.startsWith('fh_')) {
      processedName = processedName.substring(3);
    }
    
    // Transform each character according to the mapping
    let transformed = '';
    for (const char of processedName) {
      transformed += transformMap[char] || char;
    }
    
    // Add wlan prefix
    const password = 'wlan' + transformed;
    setGeneratedPassword(password);
    
    toast({
      title: "Password Generated!",
      description: `Generated password: ${password}`,
    });
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;
    
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Password has been copied to your clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the password manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-full shadow-glow-primary">
              <Wifi className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            WiFi Password Generator
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Transform your WiFi name using our specialized formula to generate the password
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-glow-accent">
          {/* Instructions */}
          <div className="mb-8 p-6 bg-secondary/30 rounded-lg border border-border/30">
            <h3 className="text-lg font-semibold mb-3 text-foreground">🔁 Character Matching Formula:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono">
              <div className="text-accent">a ↔ 5</div>
              <div className="text-accent">b ↔ 4</div>
              <div className="text-accent">c ↔ 3</div>
              <div className="text-accent">d ↔ 2</div>
              <div className="text-accent">e ↔ 1</div>
              <div className="text-accent">f ↔ 0</div>
              <div className="text-accent">6 ↔ 9</div>
              <div className="text-accent">7 ↔ 8</div>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label htmlFor="wifi-name" className="block text-sm font-medium mb-2 text-foreground">
                Enter WiFi Name (e.g., fh_91cc00)
              </label>
              <Input
                id="wifi-name"
                type="text"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                placeholder="fh_91cc00"
                className="text-lg p-4 bg-input/50 border-border/50 focus:ring-primary focus:border-primary"
                onKeyDown={(e) => e.key === 'Enter' && generatePassword()}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generatePassword}
              size="lg"
              className="w-full text-lg py-6 bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 font-semibold"
            >
              Generate Password
            </Button>

            {/* Result Section */}
            {generatedPassword && (
              <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">Generated Password:</h3>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="font-mono text-2xl text-primary bg-background/50 p-4 rounded border border-border/30 break-all">
                  {generatedPassword}
                </div>
              </div>
            )}
          </div>

          {/* Example */}
          <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border/30">
            <h4 className="font-semibold mb-3 text-foreground">📌 Example:</h4>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">
                <strong>WiFi name:</strong> fh_91cc00
              </div>
              <div className="text-muted-foreground">
                <strong>Remove fh_:</strong> 91cc00
              </div>
              <div className="text-muted-foreground">
                <strong>Transform:</strong> 9→6, 1→e, c→3, c→3, 0→f, 0→f
              </div>
              <div className="text-primary font-semibold">
                <strong>Final:</strong> wlan6e33ff
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WifiPasswordGenerator;