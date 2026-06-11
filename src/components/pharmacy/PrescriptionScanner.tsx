import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Search, Check, FileText, Plus, Eye, ShoppingCart, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { medicines } from './PharmacyData';
import Tesseract from 'tesseract.js';

interface PrescriptionScannerProps {
  onAddMedicationToCart: (id: string) => void;
}

interface LensHotspot {
  id: string;
  name: string;
  dosage: string;
  inStock: boolean;
  x: string;
  y: string;
  category: string;
  price: number;
  notInPharmacy?: boolean;
}

const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({ onAddMedicationToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [step, setStep] = useState<'upload' | 'scanning' | 'results'>('upload');
  const [hotspots, setHotspots] = useState<LensHotspot[]>([]);
  const [addedHotspotIds, setAddedHotspotIds] = useState<string[]>([]);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [pendingHotspot, setPendingHotspot] = useState<{ x: string; y: string } | null>(null);
  const [manualSearch, setManualSearch] = useState('');
  const [searchResults, setSearchResults] = useState<typeof medicines>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const [scanProgress, setScanProgress] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep('upload');
  };

  const startScan = () => {
    if (!previewUrl) return;
    setStep('scanning');
    setScanProgress('Initializing OCR engine...');

    Tesseract.recognize(
      previewUrl,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            setScanProgress(`Scanning text: ${Math.round(m.progress * 100)}%`);
          } else {
            setScanProgress('Processing prescription image...');
          }
        }
      }
    ).then(({ data: { text } }) => {
      console.log("OCR Extracted Text:", text);
      const detected: LensHotspot[] = [];

      // Clean and tokenize the OCR text
      const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, " "); // replace non-alphanumeric with spaces
      const tokens = cleanText.toLowerCase().split(/\s+/).filter(t => t.length > 3);

      const ignoreWords = new Set([
        'prescription', 'prescriptions', 'scanner', 'scan', 'scanned', 'image', 'photo', 
        'pic', 'picture', 'file', 'upload', 'doctor', 'patient', 'report', 'meds', 
        'medication', 'medicines', 'treatment', 'pharmacy', 'health', 'mate', 
        'interaction', 'main', 'latest', 'copy', 'final', 'test', 'demo', 'sample',
        'take', 'capsule', 'capsules', 'tablet', 'tablets', 'daily', 'times', 'three',
        'twice', 'with', 'food', 'every', 'hours', 'needed', 'pain', 'exceed', 'onset',
        'severe', 'headache', 'migraine', 'repeat', 'once', 'after', 'testing', 'purposes',
        'only', 'clinic', 'general', 'city', 'date', 'registration', 'sharma', 'doctor',
        'for', 'and', 'the', 'of', 'at', 'in', 'to', 'not', 'caps', 'tabs', 'dose', 'dosage',
        'use', 'used', 'morning', 'night', 'afternoon', 'evening', 'meal', 'meals', 'before',
        'after', 'water', 'milk', 'days', 'weeks', 'months', 'year', 'years', 'clinic', 'hospital',
        'medical', 'care', 'center', 'name', 'age', 'sex', 'gender', 'weight', 'date', 'signature',
        'sign', 'address', 'phone', 'contact', 'email', 'number', 'no', 'tel', 'fax', 'lic', 'reg'
      ]);

      const addedIds: string[] = [];
      const notInStockNames: string[] = [];
      const notInPharmacyNames: string[] = [];
      const matchedTokens = new Set<string>();

      // Look for matches inside the catalog based on the OCR text tokens
      let matchCount = 0;
      medicines.forEach(m => {
        const parts = m.name.toLowerCase().split(' ');
        const mainName = parts[0]; // e.g. "amoxicillin"
        
        if (mainName.length > 3 && tokens.some(token => token.includes(mainName) || mainName.includes(token))) {
          detected.push({
            id: m.id,
            name: m.name,
            dosage: parts.slice(1).join(' ') || 'As prescribed',
            inStock: m.inStock,
            x: `${15 + (matchCount * 22) % 70}%`,
            y: `${20 + (matchCount * 18) % 60}%`,
            category: m.category,
            price: m.price
          });
          matchCount++;

          // Mark matching token
          tokens.forEach(token => {
            if (token.includes(mainName) || mainName.includes(token)) {
              matchedTokens.add(token);
            }
          });

          // Add to cart if in stock
          if (m.inStock) {
            onAddMedicationToCart(m.id);
            addedIds.push(m.id);
          } else {
            notInStockNames.push(m.name);
          }
        }
      });

      // Find tokens that didn't match any medicine in catalog and are not ignore words or contain digits
      tokens.forEach(token => {
        const hasDigits = /\d/.test(token);
        if (!matchedTokens.has(token) && !ignoreWords.has(token) && !hasDigits) {
          const capitalized = token.charAt(0).toUpperCase() + token.slice(1);
          notInPharmacyNames.push(capitalized);

          // Add a hotspot for the out-of-catalog medicine so the user can inspect it
          detected.push({
            id: `not-in-pharmacy-${token}`,
            name: capitalized,
            dosage: 'Not Available',
            inStock: false,
            notInPharmacy: true,
            x: `${15 + (matchCount * 22) % 70}%`,
            y: `${20 + (matchCount * 18) % 60}%`,
            category: 'Prescription',
            price: 0
          });
          matchCount++;
        }
      });

      setHotspots(detected);
      setAddedHotspotIds(addedIds);
      setActiveHotspotId(detected[0]?.id || null);
      setStep('results');
      setPendingHotspot(null);
      
      // Notify user of scan results
      if (addedIds.length > 0) {
        const addedNames = addedIds.map(id => medicines.find(m => m.id === id)?.name).join(', ');
        toast.success(
          language === 'hi' ? `स्कैन पूरा हुआ! कार्ट में जोड़ा गया: ${addedNames}` :
          language === 'ta' ? `ஸ்கேன் முடிந்தது! கார்டில் சேர்க்கப்பட்டது: ${addedNames}` :
          `Scan complete! Detected and added to cart: ${addedNames}`
        );
      }

      if (notInStockNames.length > 0) {
        toast.warning(
          language === 'hi' ? `आउट ऑफ स्टॉक: ${notInStockNames.join(', ')}` :
          language === 'ta' ? `இருப்பில் இல்லை: ${notInStockNames.join(', ')}` :
          `Out of stock: ${notInStockNames.join(', ')} (Present on prescription but not available).`
        );
      }

      if (notInPharmacyNames.length > 0) {
        toast.error(
          language === 'hi' ? `फार्मेसी में नहीं है: ${notInPharmacyNames.join(', ')}` :
          language === 'ta' ? `மருந்தகத்தில் இல்லை: ${notInPharmacyNames.join(', ')}` :
          `Not present in online pharmacy: ${notInPharmacyNames.join(', ')}`
        );
      }

      if (detected.length === 0) {
        toast.info(
          language === 'hi' ? 'कोई स्वचालित मिलान नहीं। दवा को चिन्हित करने के लिए तस्वीर पर टैप करें।' :
          language === 'ta' ? 'தானியங்கி பொருத்தம் இல்லை. மருந்து அடையாளம் காண படத்தில் தட்டவும்.' :
          'No automatic matches. Tap anywhere on the image to locate & tag your medicine.'
        );
      }
    }).catch(err => {
      console.error("OCR Scan failed, falling back to mock file-name detection", err);
      // Fallback: Perform simulated/mock scan using filename
      const detected: LensHotspot[] = [];
      const lowerFileName = fileName.toLowerCase();
      let matchCount = 0;
      medicines.forEach(m => {
        const parts = m.name.toLowerCase().split(' ');
        const mainName = parts[0];
        if (mainName.length > 3 && lowerFileName.includes(mainName)) {
          detected.push({
            id: m.id,
            name: m.name,
            dosage: parts.slice(1).join(' ') || 'As prescribed',
            inStock: m.inStock,
            x: `${15 + (matchCount * 22) % 70}%`,
            y: `${20 + (matchCount * 18) % 60}%`,
            category: m.category,
            price: m.price
          });
          matchCount++;
          if (m.inStock) {
            onAddMedicationToCart(m.id);
          }
        }
      });
      setHotspots(detected);
      setStep('results');
      toast.error("OCR scanning failed. Fallback to file name detection.");
    });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only place tag if clicking direct overlay elements, preventing click events on hotspot nodes from triggering a new placement
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains('lens-overlay-wrapper')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const y = `${((e.clientY - rect.top) / rect.height) * 100}%`;
    
    setPendingHotspot({ x, y });
    setActiveHotspotId(null);
    setManualSearch('');
    setSearchResults([]);
  };

  const handleHotspotClick = (hotspot: LensHotspot) => {
    setActiveHotspotId(hotspot.id);
    
    if (hotspot.notInPharmacy) {
      toast.error(`${hotspot.name} is not present in our online pharmacy.`);
      return;
    }

    if (hotspot.inStock) {
      if (addedHotspotIds.includes(hotspot.id)) {
        toast.info(`${hotspot.name} is already in your cart.`);
      } else {
        onAddMedicationToCart(hotspot.id);
        setAddedHotspotIds(prev => [...prev, hotspot.id]);
        toast.success(`${hotspot.name} added directly to cart!`);
      }
    } else {
      toast.error(`${hotspot.name} is OUT OF STOCK right now.`);
    }
  };

  const handleAddTaggedMed = (med: typeof medicines[0]) => {
    if (!pendingHotspot) return;

    const parts = med.name.split(' ');
    const newHotspot: LensHotspot = {
      id: med.id,
      name: med.name,
      dosage: parts.slice(1).join(' ') || 'As prescribed',
      inStock: med.inStock,
      x: pendingHotspot.x,
      y: pendingHotspot.y,
      category: med.category,
      price: med.price
    };

    setHotspots(prev => [...prev, newHotspot]);
    setActiveHotspotId(med.id);
    setPendingHotspot(null);
    setManualSearch('');
    setSearchResults([]);

    if (med.inStock) {
      onAddMedicationToCart(med.id);
      setAddedHotspotIds(prev => [...prev, med.id]);
      toast.success(`${med.name} verified in pharmacy and added directly to cart!`);
    } else {
      toast.error(`${med.name} is detected but it is OUT OF STOCK right now.`);
    }
  };

  const handleManualSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualSearch(val);
    if (val.trim().length > 1) {
      const filtered = medicines.filter(m => 
        m.name.toLowerCase().includes(val.toLowerCase()) && 
        !hotspots.some(h => h.id === m.id)
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFileName('');
    setStep('upload');
    setHotspots([]);
    setAddedHotspotIds([]);
    setActiveHotspotId(null);
    setPendingHotspot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const dialogTitle =
    language === 'hi' ? 'गूगल लेंस प्रिस्क्रिप्शन स्कैनर' :
    language === 'ta' ? 'கூகிள் லென்ஸ் மருந்து ஸ்கேனர்' :
    'Google Lens Prescription Scanner';

  const activeHotspot = hotspots.find(h => h.id === activeHotspotId);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scanLaser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        .scanner-laser-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 4px;
          background: #3b82f6;
          box-shadow: 0 0 12px 3px rgba(59, 130, 246, 0.8);
          animation: scanLaser 2.5s ease-in-out infinite;
          z-index: 10;
        }
        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .lens-ring-outer {
          animation: ringPulse 1.8s cubic-bezier(0.25, 0, 0, 1) infinite;
        }
      `}} />

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          clearPreview();
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-2 items-center border-health-blue text-health-blue hover:bg-health-blue/10 rounded-full px-5 py-5 shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            {dialogTitle}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl dark:bg-gray-800 dark:text-white max-h-[92vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Eye className="h-5 w-5 text-health-blue" />
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>

          {step === 'upload' && (
            <div className="space-y-6 pt-2">
              <div className="flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="relative border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-2 max-h-[350px] flex items-center justify-center w-full shadow-inner">
                    <img
                      src={previewUrl}
                      alt="Prescription preview"
                      className="max-h-[330px] rounded-xl object-contain shadow-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4 h-8 w-8 rounded-full shadow-lg"
                      onClick={clearPreview}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 w-full text-center hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-health-blue" />
                    </div>
                    <div className="max-w-md">
                      <p className="font-semibold text-lg mb-1">Upload Your Prescription</p>
                      <p className="text-sm text-muted-foreground">
                        Our Google Lens engine lets you identify medicine tags on the image, verifying their stock level in the store.
                      </p>
                    </div>
                    <div className="flex justify-center mt-2">
                      <label htmlFor="prescription-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 bg-health-blue hover:bg-health-blue/90 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                          <Upload className="h-4 w-4" />
                          Choose Prescription Image
                        </div>
                      </label>
                    </div>
                    <input
                      id="prescription-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {previewUrl && (
                <Button
                  onClick={startScan}
                  className="w-full bg-health-blue hover:bg-health-blue/90 text-white py-6 rounded-full text-lg shadow-lg flex items-center justify-center font-semibold transition-all duration-300"
                >
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
                  Analyze with Google Lens
                </Button>
              )}
            </div>
          )}

          {step === 'scanning' && (
            <div className="space-y-6 pt-2">
              <div className="relative border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 p-2 max-h-[350px] flex items-center justify-center w-full shadow-2xl">
                <img
                  src={previewUrl!}
                  alt="Scanning"
                  className="max-h-[330px] rounded-xl object-contain opacity-40 blur-[2px]"
                />
                <div className="scanner-laser-line" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-black/80 border border-blue-500/40 text-blue-400 font-semibold px-8 py-4 rounded-full text-sm animate-pulse shadow-2xl flex items-center gap-3">
                    <div className="h-3 w-3 bg-blue-500 rounded-full animate-ping"></div>
                    {scanProgress}
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground animate-pulse font-medium">
                Detecting prescription medications and matching with real-time stock levels...
              </div>
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left side: Google Lens Image Viewer (7 cols) */}
                <div className="md:col-span-7 flex flex-col">
                  <div className="relative border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 flex items-center justify-center shadow-inner h-[380px]">
                    <div 
                      className="relative max-h-[360px] max-w-full flex items-center justify-center lens-overlay-wrapper cursor-crosshair"
                      onClick={handleImageClick}
                    >
                      <img
                        src={previewUrl!}
                        alt="Prescription preview"
                        className="max-h-[360px] rounded-xl object-contain select-none pointer-events-none"
                      />
                      
                      {/* Google Lens Overlays */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="relative w-full h-full">
                          {hotspots.map((hotspot) => {
                            const isActive = hotspot.id === activeHotspotId;
                            const isAdded = addedHotspotIds.includes(hotspot.id);
                            
                            // Determine color scheme
                            let color = 'bg-blue-500';
                            let ringColor = 'border-blue-500';
                            
                            if (isActive) {
                              color = hotspot.notInPharmacy ? 'bg-red-500' : hotspot.inStock ? 'bg-emerald-500' : 'bg-rose-500';
                              ringColor = hotspot.notInPharmacy ? 'border-red-500' : hotspot.inStock ? 'border-emerald-500' : 'border-rose-500';
                            } else if (isAdded) {
                              color = 'bg-emerald-500';
                              ringColor = 'border-emerald-500';
                            } else if (hotspot.notInPharmacy) {
                              color = 'bg-red-500';
                              ringColor = 'border-red-500';
                            } else if (!hotspot.inStock) {
                              color = 'bg-amber-500';
                              ringColor = 'border-amber-500';
                            }

                            return (
                              <div
                                key={hotspot.id}
                                style={{ top: hotspot.y, left: hotspot.x }}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20"
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent triggering new hotspot placement
                                  setActiveHotspotId(hotspot.id);
                                  setPendingHotspot(null);
                                }}
                              >
                                {/* Pulse Effect */}
                                <div className={`absolute -inset-3 rounded-full border-2 ${ringColor} lens-ring-outer opacity-70`} />
                                
                                {/* Bounding Highlight Box around text */}
                                <div className={`absolute left-4 -top-3 whitespace-nowrap bg-black/85 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg border border-white/10 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 ${isActive ? 'opacity-100 scale-105 border-blue-400' : 'opacity-60'}`}>
                                  <span>{hotspot.name}</span>
                                  {isAdded && <Check className="h-3 w-3 text-emerald-400" />}
                                  {hotspot.notInPharmacy && <span className="text-[9px] px-1 bg-red-500/20 text-red-300 rounded ml-1 font-bold">Not in Pharmacy</span>}
                                  {!hotspot.notInPharmacy && !hotspot.inStock && <span className="text-[9px] px-1 bg-rose-500/20 text-rose-300 rounded ml-1 font-bold">Out of Stock</span>}
                                </div>

                                {/* Pulsing Dot */}
                                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${color} group-hover:scale-125 transition-transform duration-200`} />
                              </div>
                            );
                          })}

                          {/* Render pending click hotspot placeholder */}
                          {pendingHotspot && (
                            <div
                              style={{ top: pendingHotspot.y, left: pendingHotspot.x }}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                            >
                              <div className="absolute -inset-3 rounded-full border-2 border-yellow-400 lens-ring-outer opacity-80" />
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-yellow-400 shadow-md animate-ping" />
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-yellow-400 shadow-md absolute inset-0" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm border border-white/10 select-none pointer-events-none">
                      <Eye className="h-3.5 w-3.5 text-health-blue" />
                      <span>Google Lens: Tap document text to place tag and identify</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Google Lens Inspector Panel (5 cols) */}
                <div className="md:col-span-5 flex flex-col h-[380px] justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-700">
                      <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <Sparkles className="h-4 w-4 text-health-blue" />
                      </div>
                      <h4 className="font-bold text-md text-slate-800 dark:text-slate-200">
                        Lens Inspection
                      </h4>
                    </div>

                    {/* Dynamic state selector */}
                    {pendingHotspot ? (
                      <div className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 bg-blue-50/55 dark:bg-blue-900/10 space-y-3.5 shadow-sm animate-scale-in">
                        <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                          <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            Identify Medicine
                          </h5>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => setPendingHotspot(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Search the online store to link the medicine written at this location on the prescription:
                        </p>
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search medicine name..."
                            value={manualSearch}
                            onChange={handleManualSearchChange}
                            className="pl-9 pr-4 rounded-lg bg-white dark:bg-slate-900 h-9 text-xs"
                            autoFocus
                          />
                        </div>
                        
                        {/* Autocomplete list */}
                        {searchResults.length > 0 ? (
                          <div className="border rounded-lg bg-white dark:bg-slate-900 max-h-[140px] overflow-y-auto divide-y dark:divide-slate-800 shadow-sm">
                            {searchResults.map((med) => (
                              <button
                                key={med.id}
                                onClick={() => handleAddTaggedMed(med)}
                                className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex justify-between items-center"
                              >
                                <div className="min-w-0 flex-1 pr-2">
                                  <p className="font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                    {med.name}
                                    {!med.inStock && <span className="text-[9px] bg-rose-100 text-rose-600 px-1 rounded font-bold shrink-0">Out of Stock</span>}
                                  </p>
                                  <p className="text-muted-foreground text-[10px] truncate">{med.category} • ₹{med.price}</p>
                                </div>
                                <Plus className="h-4 w-4 text-health-blue shrink-0" />
                              </button>
                            ))}
                          </div>
                        ) : manualSearch.trim().length > 1 ? (
                          <p className="text-[11px] text-center text-muted-foreground py-2.5 bg-white dark:bg-slate-900 rounded border">No medicines found in catalog.</p>
                        ) : null}
                      </div>
                    ) : activeHotspot ? (
                      <div className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/30 space-y-4 shadow-sm animate-scale-in">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-100 dark:bg-blue-900/30 text-health-blue px-2 py-0.5 rounded-full">
                            {activeHotspot.category}
                          </span>
                          <h5 className="font-bold text-lg text-slate-900 dark:text-white mt-1">
                            {activeHotspot.name}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-0.5">{activeHotspot.dosage}</p>
                        </div>

                        {/* Status Check Card */}
                        {activeHotspot.notInPharmacy ? (
                          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                            <div className="text-xs">
                              <p className="font-semibold">Not in Online Pharmacy</p>
                              <p className="opacity-90">This medicine is not present in our online pharmacy catalog.</p>
                            </div>
                          </div>
                        ) : activeHotspot.inStock ? (
                          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                            <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                            <div className="text-xs">
                              <p className="font-semibold">Present in Pharmacy Catalog</p>
                              <p className="opacity-90">In Stock (Price: ₹{activeHotspot.price})</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-300">
                            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                            <div className="text-xs">
                              <p className="font-semibold">Out of Stock</p>
                              <p className="opacity-90">Verified in pharmacy, but not available right now.</p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {activeHotspot.notInPharmacy ? (
                          <div className="text-center p-3 rounded-xl border border-red-200 bg-red-50/20 text-red-600 dark:text-red-400 text-xs font-semibold">
                            ⚠️ This medicine is not present in the online pharmacy
                          </div>
                        ) : activeHotspot.inStock ? (
                          addedHotspotIds.includes(activeHotspot.id) ? (
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5 shadow-sm font-semibold flex items-center justify-center gap-2" disabled>
                              <Check className="h-4 w-4" />
                              Added to Cart
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleHotspotClick(activeHotspot)}
                              className="w-full bg-health-blue hover:bg-health-blue/90 text-white rounded-xl py-5 shadow-sm font-semibold flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add Directly to Cart
                            </Button>
                          )
                        ) : (
                          <div className="text-center p-3 rounded-xl border border-rose-200 bg-rose-50/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                            ⚠️ This medicine is not in stock right now
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-xl p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2 h-[200px]">
                        <Eye className="h-8 w-8 text-slate-400" />
                        <span>Tap a dot to inspect or click anywhere on the prescription to place a new tag.</span>
                      </div>
                    )}
                  </div>

                  {/* Summary progress checklist */}
                  {hotspots.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border">
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5 px-1">
                        <span>DETECTED MEDICINES</span>
                        <span>{addedHotspotIds.length + hotspots.filter(h => !h.inStock).length} / {hotspots.length} RESOLVED</span>
                      </div>
                      <div className="flex gap-2">
                        {hotspots.map((h) => {
                          const isAdded = addedHotspotIds.includes(h.id);
                          const isActive = h.id === activeHotspotId;
                          let bg = 'bg-slate-200 dark:bg-slate-800';
                          if (isAdded) bg = 'bg-emerald-500';
                          else if (h.notInPharmacy) bg = 'bg-red-500';
                          else if (!h.inStock) bg = 'bg-rose-500';
                          
                          return (
                            <button
                              key={h.id}
                              className={`flex-1 h-2.5 rounded-full transition-all ${bg} ${isActive ? 'ring-2 ring-blue-500 scale-y-125' : 'border border-transparent'}`}
                              onClick={() => {
                                setActiveHotspotId(h.id);
                                setPendingHotspot(null);
                              }}
                              title={`${h.name} (${h.notInPharmacy ? 'Not in Pharmacy' : h.inStock ? 'In Stock' : 'Out of Stock'})`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex gap-3 border-t pt-4 dark:border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => setStep('upload')}
                  className="w-1/3 rounded-full py-5 border-slate-200 dark:border-slate-700"
                >
                  Scan Different File
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-2/3 bg-health-blue hover:bg-health-blue/90 text-white rounded-full py-5 font-semibold text-md shadow-md"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrescriptionScanner;
