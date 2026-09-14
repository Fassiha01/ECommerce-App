import React, { useState } from 'react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterCode';
import { X, Copy, Check, Download, FileCode, Terminal, Smartphone } from 'lucide-react';
import JSZip from 'jszip';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const projectFolder = zip.folder('lumina_studio_flutter_app');

      // Add files
      FLUTTER_PROJECT_FILES.forEach((file) => {
        projectFolder?.file(file.path, file.code);
      });

      // Add README
      projectFolder?.file(
        'README.md',
        `# Lumina Studio (Flutter & Dart for Android, iOS & Web)

Production-ready Flutter 3+ mobile app project with interactive product detail views, photography & acoustics galleries, dynamic delivery location changing, and express checkout.

## Run on Localhost / Web (Chrome)
\`\`\`bash
# 1. Scaffold web files for your local Flutter SDK
flutter create . --platforms=web

# 2. Get packages
flutter pub get

# 3. Run on Chrome
flutter run -d chrome --web-renderer html
\`\`\`
*(Tip: \`--web-renderer html\` ensures all network product imagery and photography render smoothly without CanvasKit CORS restrictions on localhost)*

### If Localhost stays on Loading Spinner:
Run \`flutter create . --platforms=web\` and then \`flutter run -d chrome --web-renderer html\`. This regenerates the web bootstrap files for your exact Flutter SDK version.

## Run on Android
\`\`\`bash
flutter pub get
flutter run -d android
\`\`\`

## Run on iOS
\`\`\`bash
flutter pub get
flutter run -d ios
\`\`\`
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'lumina_studio_flutter_app.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div
      id="flutter-code-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="flutter-code-modal"
        className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Flutter & Dart Source Code</h3>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30">
                  Dart 3.x • Material 3
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Native cross-platform mobile codebase for Android and iOS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="download-zip-btn"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling...' : 'Download .ZIP'}</span>
            </button>
            <button
              id="close-flutter-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Layout (Files sidebar + Code preview) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-3 overflow-y-auto shrink-0 space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-1 block">
              Project Structure
            </span>

            {FLUTTER_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-400 font-semibold border-l-2 border-cyan-400'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-600 font-sans">
                    {file.language}
                  </span>
                </button>
              );
            })}

            {/* Quick Run Commands */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 px-2 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" /> Run On Devices
              </span>
              <div className="bg-slate-900 rounded p-2 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Smartphone className="w-3 h-3" /> Android:
                </div>
                <div className="text-slate-400 pl-4">flutter run -d android</div>
                <div className="flex items-center gap-1.5 text-blue-400 pt-1">
                  <Smartphone className="w-3 h-3" /> iOS:
                </div>
                <div className="text-slate-400 pl-4">flutter run -d ios</div>
              </div>
            </div>
          </div>

          {/* Code Viewer Stage */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* Tab title & copy action */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/30">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="text-slate-500">flutter_ecommerce_app/</span>
                <span className="text-cyan-400 font-bold">{selectedFile.path}</span>
              </div>
              <button
                id="copy-dart-code-btn"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-4 custom-scroll font-mono text-xs leading-relaxed text-slate-300">
              <pre>
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
