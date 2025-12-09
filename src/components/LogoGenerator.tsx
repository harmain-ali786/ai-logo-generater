import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Loader2, Wand2, RefreshCw, Palette, Type, Shapes, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "tech", label: "Technology & Software", style: "Modern, sleek, digital-inspired with clean lines and tech elements" },
  { value: "finance", label: "Finance & Banking", style: "Professional, trustworthy, corporate with strong geometric shapes" },
  { value: "healthcare", label: "Healthcare & Medical", style: "Clean, caring, professional with soft curves and medical symbols" },
  { value: "food", label: "Food & Restaurant", style: "Appetizing, warm, inviting with culinary elements" },
  { value: "fashion", label: "Fashion & Beauty", style: "Elegant, stylish, sophisticated with refined typography" },
  { value: "fitness", label: "Fitness & Sports", style: "Dynamic, energetic, powerful with athletic elements" },
  { value: "education", label: "Education & Learning", style: "Intellectual, approachable, growth-oriented with academic symbols" },
  { value: "realestate", label: "Real Estate & Property", style: "Solid, trustworthy, premium with architectural elements" },
  { value: "travel", label: "Travel & Tourism", style: "Adventurous, exciting, worldly with travel-inspired elements" },
  { value: "ecommerce", label: "E-commerce & Retail", style: "Modern, accessible, trustworthy shopping experience" },
  { value: "creative", label: "Creative & Design", style: "Artistic, innovative, expressive with creative flair" },
  { value: "consulting", label: "Consulting & Services", style: "Professional, expert, refined business aesthetic" },
  { value: "automotive", label: "Automotive & Transport", style: "Powerful, dynamic, mechanical with motion elements" },
  { value: "entertainment", label: "Entertainment & Media", style: "Fun, engaging, vibrant with entertainment vibes" },
  { value: "nonprofit", label: "Nonprofit & Charity", style: "Compassionate, hopeful, community-focused" },
  { value: "legal", label: "Legal & Law", style: "Authoritative, trustworthy, traditional with legal symbols" },
  { value: "construction", label: "Construction & Engineering", style: "Strong, reliable, industrial with structural elements" },
  { value: "agriculture", label: "Agriculture & Farming", style: "Natural, organic, earthy with farming elements" },
  { value: "gaming", label: "Gaming & Esports", style: "Bold, exciting, modern with gaming aesthetics" },
  { value: "startup", label: "Startup & Innovation", style: "Fresh, disruptive, modern minimalist approach" },
];

const LOGO_STYLES = [
  { value: "minimal", label: "Minimal & Clean", description: "Simple, elegant with lots of white space" },
  { value: "modern", label: "Modern & Bold", description: "Contemporary with strong visual impact" },
  { value: "vintage", label: "Vintage & Retro", description: "Classic, nostalgic with timeless appeal" },
  { value: "playful", label: "Playful & Fun", description: "Friendly, approachable with creative elements" },
  { value: "luxury", label: "Luxury & Premium", description: "High-end, sophisticated elegance" },
  { value: "geometric", label: "Geometric & Abstract", description: "Shapes, patterns, mathematical precision" },
  { value: "handdrawn", label: "Hand-drawn & Artistic", description: "Organic, personal, artisanal feel" },
  { value: "3d", label: "3D & Dimensional", description: "Depth, shadows, realistic appearance" },
  { value: "flat", label: "Flat Design", description: "2D, colorful, no gradients or shadows" },
  { value: "gradient", label: "Gradient & Colorful", description: "Smooth color transitions, vibrant" },
];

const COLOR_SCHEMES = [
  { value: "vibrant", label: "Vibrant & Bold", colors: "bright, saturated, eye-catching colors" },
  { value: "pastel", label: "Soft & Pastel", colors: "light, muted, gentle tones" },
  { value: "monochrome", label: "Monochrome", colors: "single color with various shades" },
  { value: "blackwhite", label: "Black & White", colors: "classic black and white only" },
  { value: "earth", label: "Earth Tones", colors: "browns, greens, natural colors" },
  { value: "ocean", label: "Ocean & Blues", colors: "blues, teals, aqua shades" },
  { value: "sunset", label: "Sunset Warm", colors: "oranges, reds, warm yellows" },
  { value: "forest", label: "Forest Greens", colors: "greens, sage, natural hues" },
  { value: "royal", label: "Royal & Rich", colors: "purples, golds, deep reds" },
  { value: "neon", label: "Neon & Electric", colors: "bright neon, cyberpunk colors" },
];

const ICON_TYPES = [
  { value: "symbol", label: "Abstract Symbol", description: "Unique abstract mark representing your brand" },
  { value: "lettermark", label: "Lettermark", description: "Stylized initials or letters" },
  { value: "wordmark", label: "Wordmark Only", description: "Brand name with custom typography" },
  { value: "mascot", label: "Mascot/Character", description: "Illustrated character or figure" },
  { value: "emblem", label: "Emblem/Badge", description: "Text inside a shape or frame" },
  { value: "combination", label: "Icon + Text", description: "Symbol paired with brand name" },
  { value: "pictorial", label: "Pictorial Mark", description: "Recognizable image or object" },
];

const FONT_STYLES = [
  { value: "serif", label: "Serif / Classic", description: "Traditional, trustworthy, elegant" },
  { value: "sansserif", label: "Sans-Serif / Modern", description: "Clean, minimal, contemporary" },
  { value: "script", label: "Script / Handwritten", description: "Personal, creative, flowing" },
  { value: "display", label: "Display / Decorative", description: "Unique, attention-grabbing" },
  { value: "slab", label: "Slab Serif / Bold", description: "Strong, impactful, grounded" },
  { value: "geometric", label: "Geometric / Tech", description: "Futuristic, structured, precise" },
];

const LogoGenerator = () => {
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("");
  const [logoStyle, setLogoStyle] = useState("");
  const [colorScheme, setColorScheme] = useState("");
  const [iconType, setIconType] = useState("");
  const [fontStyle, setFontStyle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const buildPromptDetails = () => {
    const parts: string[] = [];
    
    const selectedCategory = CATEGORIES.find(c => c.value === category);
    if (selectedCategory) {
      parts.push(`Business Type: ${selectedCategory.label} - ${selectedCategory.style}`);
    }
    
    const selectedStyle = LOGO_STYLES.find(s => s.value === logoStyle);
    if (selectedStyle) {
      parts.push(`Logo Style: ${selectedStyle.label} - ${selectedStyle.description}`);
    }
    
    const selectedColor = COLOR_SCHEMES.find(c => c.value === colorScheme);
    if (selectedColor) {
      parts.push(`Color Scheme: ${selectedColor.label} using ${selectedColor.colors}`);
    }
    
    const selectedIcon = ICON_TYPES.find(i => i.value === iconType);
    if (selectedIcon) {
      parts.push(`Logo Type: ${selectedIcon.label} - ${selectedIcon.description}`);
    }
    
    const selectedFont = FONT_STYLES.find(f => f.value === fontStyle);
    if (selectedFont) {
      parts.push(`Typography: ${selectedFont.label} - ${selectedFont.description}`);
    }
    
    if (tagline.trim()) {
      parts.push(`Include tagline: "${tagline.trim()}"`);
    }
    
    if (additionalDetails.trim()) {
      parts.push(`Additional requirements: ${additionalDetails.trim()}`);
    }
    
    return parts.join(". ");
  };

  const handleGenerate = async () => {
    if (!brandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }

    setIsGenerating(true);
    setLogoUrl(null);

    const customDetails = buildPromptDetails();

    try {
      const { data, error } = await supabase.functions.invoke('generate-logo', {
        body: { 
          brandName: brandName.trim(),
          customDetails: customDetails,
          tagline: tagline.trim(),
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setLogoUrl(data.imageUrl);
        toast.success("Logo generated successfully!");
      } else {
        throw new Error("No image received");
      }
    } catch (error: unknown) {
      console.error("Error generating logo:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate logo";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = () => {
    if (!logoUrl) return;
    
    const link = document.createElement('a');
    link.href = logoUrl;
    link.download = `${brandName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Logo downloaded!");
  };

  const handleReset = () => {
    setBrandName("");
    setTagline("");
    setCategory("");
    setLogoStyle("");
    setColorScheme("");
    setIconType("");
    setFontStyle("");
    setAdditionalDetails("");
    setLogoUrl(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Input Section */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/20">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Brand Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Brand Name *</Label>
            <Input
              type="text"
              placeholder="Enter your brand name..."
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="h-12 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl"
              disabled={isGenerating}
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Tagline (Optional)</Label>
            <Input
              type="text"
              placeholder="Your slogan or tagline..."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="h-12 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl"
              disabled={isGenerating}
            />
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-accent/20">
            <Palette className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Customize Your Logo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Business Category */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm flex items-center gap-2">
              <Shapes className="w-4 h-4" /> Business Category
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={isGenerating}>
              <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl max-h-[300px] z-50">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="py-3">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Logo Style */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Logo Style
            </Label>
            <Select value={logoStyle} onValueChange={setLogoStyle} disabled={isGenerating}>
              <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Select style..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl max-h-[300px] z-50">
                {LOGO_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="py-3">
                    <div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Scheme */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm flex items-center gap-2">
              <Palette className="w-4 h-4" /> Color Scheme
            </Label>
            <Select value={colorScheme} onValueChange={setColorScheme} disabled={isGenerating}>
              <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Select colors..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl max-h-[300px] z-50">
                {COLOR_SCHEMES.map((color) => (
                  <SelectItem key={color.value} value={color.value} className="py-3">
                    <div>
                      <div className="font-medium">{color.label}</div>
                      <div className="text-xs text-muted-foreground">{color.colors}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Icon Type */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm flex items-center gap-2">
              <Shapes className="w-4 h-4" /> Logo Type
            </Label>
            <Select value={iconType} onValueChange={setIconType} disabled={isGenerating}>
              <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl max-h-[300px] z-50">
                {ICON_TYPES.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value} className="py-3">
                    <div>
                      <div className="font-medium">{icon.label}</div>
                      <div className="text-xs text-muted-foreground">{icon.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Style */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm flex items-center gap-2">
              <Type className="w-4 h-4" /> Typography Style
            </Label>
            <Select value={fontStyle} onValueChange={setFontStyle} disabled={isGenerating}>
              <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Select font..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl max-h-[300px] z-50">
                {FONT_STYLES.map((font) => (
                  <SelectItem key={font.value} value={font.value} className="py-3">
                    <div>
                      <div className="font-medium">{font.label}</div>
                      <div className="text-xs text-muted-foreground">{font.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Additional Details (Optional)</Label>
          <Textarea
            placeholder="Describe any specific elements, themes, or requirements for your logo... (e.g., 'Include a mountain symbol', 'Make it look futuristic', 'Use gold accents')"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="min-h-[100px] bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl resize-none"
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !brandName.trim()}
          className="flex-1 h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 glow-effect"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating your logo...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Logo
            </>
          )}
        </Button>
        
        {logoUrl && (
          <Button
            onClick={handleRegenerate}
            disabled={isGenerating}
            variant="outline"
            className="h-14 px-6 rounded-2xl border-border/50 hover:bg-secondary/50"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Regenerate
          </Button>
        )}
        
        <Button
          onClick={handleReset}
          disabled={isGenerating}
          variant="ghost"
          className="h-14 px-6 rounded-2xl hover:bg-secondary/50"
        >
          Reset All
        </Button>
      </div>

      <p className="text-muted-foreground text-sm text-center">
        Powered by AI • The more details you provide, the better your logo will be
      </p>

      {/* Logo Display Section */}
      <div className="relative">
        <div className="glass-card rounded-3xl p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 animate-pulse-slow">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-spin-slow" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary" />
              </div>
              <p className="text-muted-foreground animate-pulse">Crafting your custom logo...</p>
            </div>
          ) : logoUrl ? (
            <div className="animate-scale-in flex flex-col items-center gap-6 w-full">
              <div className="relative group">
                <img
                  src={logoUrl}
                  alt={`${brandName} logo`}
                  className="max-w-full max-h-[300px] object-contain rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-center pb-4">
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="bg-secondary/90 hover:bg-secondary"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Logo
                  </Button>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 rounded-xl px-8"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PNG
                </Button>
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="rounded-xl border-border/50"
                  disabled={isGenerating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center">
                <Sparkles className="w-8 h-8 opacity-50" />
              </div>
              <p>Your custom logo will appear here</p>
              <p className="text-xs text-center max-w-md">
                Fill in the details above and click "Generate Logo" to create your unique brand identity
              </p>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default LogoGenerator;
