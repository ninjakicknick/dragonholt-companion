import { Award, BookOpen, Clock, Coins, Heart, Map, Plus, Users } from 'lucide-react';
import { DAY_SLOTS } from '../data/gameData';

const timeLabel = (time, max) => {
  if (time <= 0) return 'Morning';
  if (time >= max) return 'End of day';
  const progress = time / max;
  if (progress < 0.34) return 'Morning';
  if (progress < 0.67) return 'Afternoon';
  return 'Evening';
};

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#d2c2a5] bg-white/60 px-3 py-3">
      <Icon size={19} className="text-[#8c2a2a]" />
      <div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c8c8c]">{label}</div><div className="text-lg font-bold text-[#4a3b32]">{value}</div></div>
    </div>
  );
}

export default function SessionScreen({ party, heroes, village, onAdvanceTime, onOpenParty, onOpenHeroes, onOpenVillage }) {
  const maxTime = DAY_SLOTS[village.day] || 8;
  const period = timeLabel(village.time, maxTime);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <section className="overflow-hidden rounded-xl border border-[#c2b29a] bg-[#f8f4e6] shadow-md">
        <div className="bg-[#4a3b32] px-5 py-5 text-[#f8f4e6] sm:px-6">
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d2c2a5]"><Map size={15} /> Current adventure</div>
          <h2 className="text-2xl font-bold sm:text-3xl">Dragonholt Village</h2>
          <div className="mt-2 flex items-center gap-2 text-[#e8e0cc]"><Clock size={17} /><span className="font-semibold">Day {village.day} · {period}</span></div>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6b5849]"><span>Day progress</span><span>{village.time} / {maxTime}</span></div>
          <div className="flex gap-1.5">
            {Array.from({ length: maxTime }).map((_, index) => <div key={index} className={`h-2 flex-1 rounded-full ${index < village.time ? 'bg-[#8c2a2a]' : 'bg-[#d8cdb8]'}`} />)}
          </div>
          <button onClick={onAdvanceTime} disabled={village.time >= maxTime} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#8c2a2a] px-4 py-3 font-bold text-white shadow-sm transition hover:bg-[#6b1e1e] disabled:cursor-not-allowed disabled:opacity-50"><Clock size={18} />{village.time >= maxTime ? 'Day complete' : 'Advance Time'}</button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Award} label="Fame" value={party.fame} />
        <Stat icon={Coins} label="Gold" value={party.gold} />
        <Stat icon={BookOpen} label="Story points" value={party.storyPoints.length} />
        <Stat icon={Users} label="Heroes" value={heroes.length} />
      </section>

      <section className="rounded-xl border border-[#d2c2a5] bg-[#f8f4e6] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c8c8c]">At the table</div><h3 className="text-xl font-bold text-[#4a3b32]">Your heroes</h3></div><button onClick={onOpenHeroes} className="text-sm font-bold text-[#8c2a2a] hover:underline">View all</button></div>
        {heroes.length === 0 ? (
          <button onClick={onOpenHeroes} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#c2b29a] bg-white/50 px-4 py-5 font-bold text-[#6b5849]"><Plus size={18} /> Add your first hero</button>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {heroes.map(hero => {
              const current = hero.currentStamina ?? hero.maxStamina ?? 0;
              const max = hero.maxStamina ?? 0;
              return <button key={hero.id} onClick={onOpenHeroes} className="flex items-center justify-between rounded-lg border border-[#ded2bd] bg-white/60 p-3 text-left hover:bg-white"><div><div className="font-bold text-[#4a3b32]">{hero.name}</div><div className="text-xs text-[#8c8c8c]">{hero.race} · {hero.class}</div></div><div className="flex items-center gap-1.5 font-bold text-[#8c2a2a]"><Heart size={16} /> {current}/{max}</div></button>;
            })}
          </div>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <button onClick={onOpenParty} className="rounded-xl border border-[#d2c2a5] bg-[#f8f4e6] p-4 text-left shadow-sm hover:bg-white"><div className="mb-1 flex items-center gap-2 font-bold text-[#4a3b32]"><BookOpen size={18} className="text-[#8c2a2a]" /> Story & Party</div><p className="text-sm text-[#6b5849]">Story points, party resources, and campaign notes.</p></button>
        <button onClick={onOpenVillage} className="rounded-xl border border-[#d2c2a5] bg-[#f8f4e6] p-4 text-left shadow-sm hover:bg-white"><div className="mb-1 flex items-center gap-2 font-bold text-[#4a3b32]"><Map size={18} className="text-[#8c2a2a]" /> Village Progress</div><p className="text-sm text-[#6b5849]">Heroism, training, meditation, and detailed time tracking.</p></button>
      </section>
    </div>
  );
}
