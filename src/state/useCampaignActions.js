import { DAY_SLOTS } from '../data/gameData';
import { HEROISM_MILESTONES, unlockedTrainingSkills } from '../data/villageRules';

const toggleInList=(items,value)=>items.includes(value)?items.filter(item=>item!==value):[...items,value];
export function useCampaignActions({ heroes, village, adventure, setParty, setHeroes, setAdventure, setVillage, setAchievements }) {
  const toggleStoryPoint=point=>setParty(current=>({...current,storyPoints:toggleInList(current.storyPoints,point)}));
  const advanceTime=()=>setVillage(current=>({...current,time:Math.min(current.time+1,DAY_SLOTS[current.day]||8)}));
  const nextDay=()=>setVillage(current=>({...current,day:Math.min(current.day+1,7),time:0}));
  const updateProgress=(track,value)=>setVillage(current=>({...current,[track]:value}));
  const toggleAchievement=achievement=>setAchievements(current=>toggleInList(current,achievement));
  const updateAdventure=updates=>setAdventure(current=>({...current,...updates}));
  const startAdventure=details=>setAdventure(current=>({title:details.title?.trim()||'Untitled Adventure',location:details.location?.trim()||'',section:'',notes:'',inVillage:Boolean(details.inVillage),history:current.history||[]}));
  const completeAdventure=()=>setAdventure(current=>{
    if(!current.title?.trim()) return current;
    const entry={id:Date.now(),title:current.title,location:current.location,section:current.section,notes:current.notes,completedAt:new Date().toISOString()};
    return {title:'',location:'',section:'',notes:'',inVillage:false,history:[entry,...(current.history||[])]};
  });

  const claimHeroismMilestone=value=>{const reward=HEROISM_MILESTONES.find(item=>item.value===value);if(!reward||village.heroism<value||(village.claimedHeroismMilestones||[]).includes(value))return;setParty(current=>({...current,fame:current.fame+reward.fame}));setHeroes(current=>current.map(hero=>{const baseMaxStamina=(hero.baseMaxStamina??hero.maxStamina??14)+reward.stamina;return{...hero,exp:(hero.exp||0)+reward.xp,baseMaxStamina,maxStamina:baseMaxStamina,currentStamina:reward.stamina?(hero.currentStamina??baseMaxStamina-reward.stamina)+reward.stamina:hero.currentStamina};}));setVillage(current=>({...current,claimedHeroismMilestones:[...(current.claimedHeroismMilestones||[]),value]}));};
  const learnTrainingSkill=(heroId,skill)=>{const hero=heroes.find(item=>item.id===heroId);const unlocked=unlockedTrainingSkills(village);if(!hero||(hero.exp||0)<1||hero.skills.includes(skill)||!unlocked.includes(skill))return false;updateHero(heroId,{exp:hero.exp-1,skills:[...hero.skills,skill]});return true;};
  const createHero=(details={})=>{const baseMaxStamina=details.baseMaxStamina??details.maxStamina??14;const hero={id:Date.now(),name:'New Hero',race:'Human',class:'Wildlander',baseMaxStamina,maxStamina:baseMaxStamina,currentStamina:baseMaxStamina,exp:0,skills:[],disabledSkills:[],items:'',notes:'',...details,baseMaxStamina};setHeroes(current=>[...current,hero]);return hero;};
  const updateHero=(id,updates)=>setHeroes(current=>current.map(hero=>hero.id===id?{...hero,...updates}:hero));
  const deleteHero=id=>setHeroes(current=>current.filter(hero=>hero.id!==id));
  const toggleHeroSkill=(heroId,skill)=>{const hero=heroes.find(item=>item.id===heroId);if(hero)updateHero(heroId,{skills:toggleInList(hero.skills,skill)});};
  const toggleDisabledSkill=(heroId,skill)=>{const hero=heroes.find(item=>item.id===heroId);if(hero)updateHero(heroId,{disabledSkills:toggleInList(hero.disabledSkills,skill)});};
  return{toggleStoryPoint,advanceTime,nextDay,updateProgress,toggleAchievement,updateAdventure,startAdventure,completeAdventure,claimHeroismMilestone,learnTrainingSkill,createHero,updateHero,deleteHero,toggleHeroSkill,toggleDisabledSkill};
}
