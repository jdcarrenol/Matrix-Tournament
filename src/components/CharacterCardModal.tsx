import React, { useState, useRef } from 'react';
import { DeckMechanic, Duelist, Era } from '../types/tournament';
import { soundEffects } from '../utils/audio';
import { autocompleteDuelistLore, formatStandardCharacterCard } from '../utils/aiCompletion';
import { 
  Shield, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  X, 
  Copy, 
  Wand2, 
  Image as ImageIcon,
  Edit2
} from 'lucide-react';

interface CharacterCardModalProps {
  duelist: Duelist | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (duelist: Duelist) => void;
  initialMode?: 'VIEW' | 'EDIT' | 'CREATE';
}

export const CharacterCardModal: React.FC<CharacterCardModalProps> = ({
  duelist,
  isOpen,
  onClose,
  onSave,
  initialMode = 'VIEW'
}) => {
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>(initialMode === 'CREATE' ? 'EDIT' : initialMode);

  // Form Fields
  const [name, setName] = useState(duelist?.name || '');
  const [alias, setAlias] = useState(duelist?.alias || '');
  const [era, setEra] = useState<Era>(duelist?.era || 'DM');
  const [archetype, setArchetype] = useState(duelist?.archetype || '');
  const [secondaryDeck, setSecondaryDeck] = useState(duelist?.secondaryDeck || '');
  const [specialAnimeCard, setSpecialAnimeCard] = useState(duelist?.specialAnimeCard || '');
  const [aceMonster, setAceMonster] = useState(duelist?.aceMonster || '');
  const [avatarUrl, setAvatarUrl] = useState(duelist?.avatarUrl || '');
  const [avatarIcon, setAvatarIcon] = useState(duelist?.avatarIcon || '🎴');
  const [quote, setQuote] = useState(duelist?.quote || '');
  const [badgeStatus, setBadgeStatus] = useState(duelist?.badgeStatus || 'Activo');
  const [mechanic, setMechanic] = useState<DeckMechanic>(duelist?.mechanic || 'Híbrido Moderno');

  const [copiedText, setCopiedText] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [photoTab, setPhotoTab] = useState<'URL' | 'UPLOAD'>('URL');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when duelist changes or modal opens
  React.useEffect(() => {
    if (duelist) {
      setName(duelist.name);
      setAlias(duelist.alias);
      setEra(duelist.era);
      setArchetype(duelist.archetype);
      setSecondaryDeck(duelist.secondaryDeck || '');
      setSpecialAnimeCard(duelist.specialAnimeCard || '');
      setAceMonster(duelist.aceMonster);
      setAvatarUrl(duelist.avatarUrl || '');
      setAvatarIcon(duelist.avatarIcon || '🎴');
      setQuote(duelist.quote || '');
      setBadgeStatus(duelist.badgeStatus || 'Activo');
      setMechanic(duelist.mechanic || 'Híbrido Moderno');
      setMode(initialMode === 'CREATE' ? 'EDIT' : initialMode);
    } else {
      setName('');
      setAlias('');
      setEra('DM');
      setArchetype('');
      setSecondaryDeck('');
      setSpecialAnimeCard('');
      setAceMonster('');
      setAvatarUrl('');
      setAvatarIcon('🎴');
      setQuote('');
      setBadgeStatus('Activo');
      setMechanic('Híbrido Moderno');
      setMode('EDIT');
    }
  }, [duelist, initialMode, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload (converts to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Autocomplete Lore
  const handleAiAutocomplete = () => {
    if (!name.trim()) return;

    soundEffects.playClick();
    setAiLoading(true);

    setTimeout(() => {
      const lore = autocompleteDuelistLore(name.trim());
      if (lore.alias) setAlias(lore.alias);
      if (lore.era) setEra(lore.era);
      if (lore.archetype) setArchetype(lore.archetype);
      if (lore.secondaryDeck) setSecondaryDeck(lore.secondaryDeck);
      if (lore.specialAnimeCard) setSpecialAnimeCard(lore.specialAnimeCard);
      if (lore.aceMonster) setAceMonster(lore.aceMonster);
      if (lore.avatarIcon) setAvatarIcon(lore.avatarIcon);
      if (lore.quote) setQuote(lore.quote);
      if (lore.badgeStatus) setBadgeStatus(lore.badgeStatus);
      if (lore.mechanic) setMechanic(lore.mechanic);

      soundEffects.playVictory();
      setAiLoading(false);
    }, 350);
  };

  const currentPreviewDuelist: Duelist = {
    id: duelist?.id || `custom_${Date.now()}`,
    name: name.trim() || 'Nuevo Duelista',
    alias: alias.trim() || 'Duelista Legendario',
    era,
    archetype: archetype.trim() || 'Estrategia Desconocida',
    secondaryDeck: secondaryDeck.trim() || undefined,
    specialAnimeCard: specialAnimeCard.trim() || undefined,
    aceMonster: aceMonster.trim() || 'Monstruo As Por Definir',
    avatarIcon,
    avatarUrl: avatarUrl.trim() || undefined,
    quote: quote.trim() || '¡Que comience el duelo!',
    badgeStatus,
    mechanic,
    description: duelist?.description || 'Ficha técnica oficial registrada en el MCT.',
    isCustom: duelist?.isCustom ?? true,
    isEdited: true
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !archetype.trim()) return;

    soundEffects.playVictory();
    onSave(currentPreviewDuelist);
    onClose();
  };

  const handleCopyCardText = () => {
    const cardText = formatStandardCharacterCard(currentPreviewDuelist);
    navigator.clipboard.writeText(cardText).then(() => {
      soundEffects.playClick();
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#080d1e] border-2 border-cyan-500/60 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-auto relative">
        {/* Top Header with Mode Switcher & Copy */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="text-cyan-400" size={18} />
            <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
              FICHA TÉCNICA ESTÁNDAR PRO :: {mode === 'EDIT' ? 'EDICIÓN EN VIVO' : 'VISTA OFICIAL'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'VIEW' ? (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setMode('EDIT');
                }}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-cyan-950 text-cyan-300 border border-cyan-700 hover:bg-cyan-900 cursor-pointer"
              >
                <Edit2 size={12} />
                <span>Editar Ficha</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setMode('VIEW');
                }}
                className="px-3 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Ver Tarjeta
              </button>
            )}

            <button
              onClick={handleCopyCardText}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Copiar Ficha Técnica en Formato Texto"
            >
              {copiedText ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedText ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 1. VISUAL CARD UI (Structured strictly under the requested format) */}
        <div className="rounded-xl border border-cyan-500/40 bg-[#070b17] overflow-hidden shadow-lg">
          {/* Header row: Shield, Name, and Alias */}
          <div className="p-4 bg-slate-900/90 border-b border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <span className="text-base sm:text-lg font-black text-white tracking-wide truncate">
                  [{currentPreviewDuelist.name.toUpperCase()}]
                </span>
                {currentPreviewDuelist.badgeStatus === 'Cabecera de Serie' && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950 border border-amber-500 text-amber-300 font-bold">
                    👑 Cabecera
                  </span>
                )}
                {currentPreviewDuelist.badgeStatus === 'Arquetipo Especial del Anime' && (
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-950 border border-purple-500 text-purple-300 font-bold">
                    🔮 Anime
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-300 mt-1 pl-7 flex items-center gap-1.5">
                <span>🏷️ Apodo / Título:</span>
                <span className="italic text-cyan-300 font-medium">"{currentPreviewDuelist.alias}"</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                {currentPreviewDuelist.era}
              </span>
            </div>
          </div>

          {/* Middle row: Avatar / Photo Render */}
          <div className="p-4 border-b border-cyan-500/20 bg-black/40 flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-cyan-400/50 bg-slate-900 shrink-0 flex items-center justify-center relative shadow-md shadow-cyan-950">
              {currentPreviewDuelist.avatarUrl ? (
                <img
                  src={currentPreviewDuelist.avatarUrl}
                  alt={currentPreviewDuelist.name}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarUrl('')}
                />
              ) : (
                <span className="text-4xl">{currentPreviewDuelist.avatarIcon}</span>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <span>🖼️ Foto / Avatar:</span>
                <span className="text-slate-400 font-normal">
                  {currentPreviewDuelist.avatarUrl ? 'Render Oficial Cargado' : 'Avatar Simulado del Sistema'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                *(El usuario puede subir un archivo de imagen, pegar un enlace directo o solicitar un avatar generado)*
              </p>
              {currentPreviewDuelist.quote && (
                <div className="text-[11px] text-amber-200/90 pt-1 truncate">
                  💬 "{currentPreviewDuelist.quote}"
                </div>
              )}
            </div>
          </div>

          {/* Bottom row: Generación, Arquetipos (Principal y Secundarios/Especiales) y Monstruo As */}
          <div className="p-4 space-y-2.5 text-xs bg-[#070b17]">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-semibold text-white">⏳ Generación / Era:</span>
              <span className="text-cyan-400 font-mono">[{currentPreviewDuelist.era}]</span>
            </div>

            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>⚔️ Arquetipos (Personalizables):</span>
              </div>
              <div className="pl-4 space-y-1">
                <div className="text-slate-200 flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">• Principal:</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-100 font-medium">
                    {currentPreviewDuelist.archetype}
                  </span>
                </div>
                <div className="text-slate-200 flex items-center gap-1">
                  <span className="text-purple-400 font-bold">• Secundarios / Especiales:</span>
                  <span className="bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/60 text-purple-200 font-medium">
                    {[currentPreviewDuelist.secondaryDeck, currentPreviewDuelist.specialAnimeCard].filter(Boolean).join(' · ') || 'Estándar'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-200 pt-1 border-t border-slate-800/80">
              <span className="font-bold text-white">🐉 Monstruo As:</span>
              <span className="bg-slate-900 px-2.5 py-0.5 rounded border border-amber-500/40 text-amber-300 font-bold">
                {currentPreviewDuelist.aceMonster}
              </span>
            </div>
          </div>
        </div>

        {/* 2. LIVE EDIT FORM (Visible when in EDIT mode) */}
        {mode === 'EDIT' && (
          <form onSubmit={handleSave} className="space-y-3.5 pt-2 border-t border-slate-800 text-xs">
            {/* Name + AI Autocomplete Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
              <div className="flex-1">
                <label className="block text-slate-300 font-semibold mb-1">
                  🛡️ Nombre del Personaje
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej: Yugi Muto, Marik Ishtar, Seto Kaiba, Valon..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 text-sm font-semibold"
                />
              </div>

              <button
                type="button"
                onClick={handleAiAutocomplete}
                disabled={!name.trim() || aiLoading}
                className="px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer shrink-0 disabled:opacity-50"
                title="Completar Apodo, Era, Arquetipos y Monstruo As automáticamente con IA"
              >
                <Sparkles size={14} className={aiLoading ? 'animate-spin' : ''} />
                <span>{aiLoading ? 'Analizando Lore...' : '✨ Autocompletar con IA'}</span>
              </button>
            </div>

            {/* Apodo / Título */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                🏷️ Apodo / Título
              </label>
              <input
                type="text"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                placeholder="Ej: El Faraón Anónimo / Amo de los Juegos"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Carga y Edición de Foto / Avatar */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white font-bold flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-cyan-400" />
                  <span>🖼️ Foto / Avatar del Personaje</span>
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPhotoTab('URL')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      photoTab === 'URL' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Enlace / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoTab('UPLOAD')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      photoTab === 'UPLOAD' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Subir Archivo
                  </button>
                </div>
              </div>

              {photoTab === 'URL' ? (
                <div className="flex items-center gap-2">
                  <LinkIcon size={14} className="text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="Pegar URL de render o imagen (https://... o ruta local)"
                    className="w-full px-3 py-1.5 bg-black/60 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-slate-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 text-xs font-medium cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>Seleccionar Archivo de Foto</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {avatarUrl ? '✅ Foto cargada con éxito en el sistema' : 'Sube PNG, JPG o WEBP'}
                  </span>
                </div>
              )}
            </div>

            {/* Generación / Era & Estado */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ⏳ Generación / Era
                </label>
                <select
                  value={era}
                  onChange={e => setEra(e.target.value as Era)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="DM">DM (Duel Monsters)</option>
                  <option value="GX">GX</option>
                  <option value="5D's">5D's</option>
                  <option value="ZEXAL">ZEXAL</option>
                  <option value="ARC-V">ARC-V</option>
                  <option value="VRAINS">VRAINS</option>
                  <option value="SEVENS">SEVENS</option>
                  <option value="Go RUSH!!">Go RUSH!!</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  👑 Insignia Oficial
                </label>
                <select
                  value={badgeStatus}
                  onChange={e => setBadgeStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Activo">🟢 Activo Oficial</option>
                  <option value="Cabecera de Serie">👑 Cabecera de Serie</option>
                  <option value="Soporte Moderno">⚡ Soporte Moderno</option>
                  <option value="Arquetipo Especial del Anime">🔮 Especial del Anime</option>
                </select>
              </div>
            </div>

            {/* ⚔️ Arquetipos (Personalizables) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ⚔️ Arquetipo Principal
                </label>
                <input
                  type="text"
                  required
                  value={archetype}
                  onChange={e => setArchetype(e.target.value)}
                  placeholder="Ej: Mago Oscuro / Quimera Ilusión"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  🔮 Secundarios / Especiales (Horus, Orichalcos, etc.)
                </label>
                <input
                  type="text"
                  value={secondaryDeck}
                  onChange={e => setSecondaryDeck(e.target.value)}
                  placeholder="Ej: Horus Engine, El Sello de Orichalcos..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* 🐉 Monstruo As & Quote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  🐉 Monstruo As
                </label>
                <input
                  type="text"
                  required
                  value={aceMonster}
                  onChange={e => setAceMonster(e.target.value)}
                  placeholder="Ej: Mago Oscuro / Dragón Blanco de O.A."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  💬 Frase Icónica de Duelo
                </label>
                <input
                  type="text"
                  value={quote}
                  onChange={e => setQuote(e.target.value)}
                  placeholder="Ej: ¡Confío en el corazón de las cartas!"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold shadow-lg shadow-cyan-950 flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} strokeWidth={3} />
                <span>Guardar Ficha Técnica</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
