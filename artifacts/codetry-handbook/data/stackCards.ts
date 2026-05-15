export interface StackCardStep {
  id: string;
  prompt: string;
}

export interface StackCard {
  id: string;
  category: string;
  question: string;
  context: string;
  steps: StackCardStep[];
}

export const STACK_CARDS: StackCard[] = [
  {
    id: "rename-test",
    category: "Core Discipline",
    question: "What does the rename test check for?",
    context:
      "The rename test is codetry's primary diagnostic. Before accepting a name, you try to rename the thing. If a better name comes easily, the first name was generic. If renaming is difficult — if something would be lost — the name is doing real work.",
    steps: [
      {
        id: "rename-test-1",
        prompt: "In your own words, what question does the rename test ask?",
      },
      {
        id: "rename-test-2",
        prompt: "What does it mean for a name to 'resist' renaming? What quality does that reveal?",
      },
      {
        id: "rename-test-3",
        prompt: "Give an example of a name from your own work or life that would pass the rename test. Why would it resist?",
      },
    ],
  },
  {
    id: "load-bearing-vs-decorative",
    category: "Core Discipline",
    question: "What is the difference between a load-bearing name and a decorative one?",
    context:
      "A load-bearing name carries meaning that would be lost if you replaced it with a synonym. A decorative name could be swapped for a generic term without changing what people understand. The distinction matters because only load-bearing names earn their place in a vocabulary.",
    steps: [
      {
        id: "lbd-1",
        prompt: "How would you explain 'load-bearing' in naming to someone who has never heard the term?",
      },
      {
        id: "lbd-2",
        prompt: "What test could you apply to decide whether a name in your own practice is load-bearing or decorative?",
      },
      {
        id: "lbd-3",
        prompt: "Name one term from this handbook that you think is clearly load-bearing, and explain why.",
      },
    ],
  },
  {
    id: "codetry-vs-ddd",
    category: "Positioning",
    question: "How does codetry differ from Domain-Driven Design?",
    context:
      "Both codetry and DDD take language seriously as a design tool. DDD works inside software systems, building ubiquitous language for technical teams. Codetry works at the practitioner level — it is about how a person names the things that make their specific practice distinct, not about software architecture.",
    steps: [
      {
        id: "ddd-1",
        prompt: "What does DDD mean by 'ubiquitous language'? What is it trying to solve?",
      },
      {
        id: "ddd-2",
        prompt: "Where does codetry's concern with naming begin — and where does DDD's begin? What is each discipline's starting point?",
      },
      {
        id: "ddd-3",
        prompt: "Could a practitioner use codetry without building any software? What does your answer reveal about the two disciplines?",
      },
    ],
  },
  {
    id: "codetry-vs-literate-programming",
    category: "Positioning",
    question: "How does codetry relate to literate programming?",
    context:
      "Literate programming, as Knuth described it, interweaves code and prose so the program reads as a coherent essay. Codetry is interested in a narrower question: whether the names a practitioner assigns to their concepts are precise enough that the practice survives translation — into writing, into conversation, into someone else's hands.",
    steps: [
      {
        id: "lp-1",
        prompt: "What was Knuth's core insight with literate programming? What problem was he solving?",
      },
      {
        id: "lp-2",
        prompt: "Codetry is described as narrower. What is it narrowing to, exactly?",
      },
      {
        id: "lp-3",
        prompt: "What does 'the practice survives translation' mean? Give a concrete example of a practice that might not survive without precise naming.",
      },
    ],
  },
  {
    id: "practitioner-role",
    category: "The Practitioner",
    question: "What makes someone a 'practitioner' in the codetry sense?",
    context:
      "A practitioner is not simply someone who does a thing — it is someone who has developed a vocabulary for how they do it. The practitioner can describe the trade, explain the distinctions, and pass the practice on. The vocabulary is the evidence that the practice is real, not accidental.",
    steps: [
      {
        id: "pr-1",
        prompt: "What separates a practitioner from someone who simply does the same work repeatedly?",
      },
      {
        id: "pr-2",
        prompt: "Why is vocabulary described as evidence that the practice is real? What would its absence suggest?",
      },
      {
        id: "pr-3",
        prompt: "By this definition, are you a practitioner in something right now? What vocabulary do you have — or need to build?",
      },
    ],
  },
  {
    id: "trade-vs-tool",
    category: "The Practitioner",
    question: "What is the distinction between the trade and the tool?",
    context:
      "The trade is the durable practice — the knowledge, the relationships, the judgment a practitioner develops. The tool is the current instrument: the software, the device, the platform. Tools change; the trade persists. Naming the trade correctly means it doesn't disappear when the tool does.",
    steps: [
      {
        id: "tvt-1",
        prompt: "In your own words: what is the trade? What is the tool? Give an example of each from any field.",
      },
      {
        id: "tvt-2",
        prompt: "What happens to a practice when the practitioner can only name the tool, not the trade?",
      },
      {
        id: "tvt-3",
        prompt: "Name one thing you do where you have named the tool but not yet named the trade. What would a trade-level name look like?",
      },
    ],
  },
  {
    id: "jar-kitchen-vocabulary",
    category: "Jar Kitchen",
    question: "What names make up the Jar Kitchen vocabulary set, and what work does each do?",
    context:
      "The Jar Kitchen vocabulary includes: Jarista (the person), Jar Kitchen (the workspace), Seasonal Shelf (the preserved inventory), Harvest Hold (the bulk reserve), Bulk Round (the sourcing cycle), and Preservation Season (the active production period). Each name holds a specific role — they are not interchangeable with generic equivalents.",
    steps: [
      {
        id: "jkv-1",
        prompt: "Without looking, list as many terms from the Jar Kitchen vocabulary as you can recall.",
      },
      {
        id: "jkv-2",
        prompt: "Pick two terms from the set. For each, explain what generic phrase it replaces and what is lost by using the generic instead.",
      },
      {
        id: "jkv-3",
        prompt: "What principle ties the whole vocabulary together? What shared logic connects each name?",
      },
    ],
  },
  {
    id: "jarista",
    category: "Jar Kitchen",
    question: "What does the name 'Jarista' do that 'home preserver' or 'canner' does not?",
    context:
      "Jarista names a practitioner with a specific relationship to preservation as a practice — not a hobbyist, not a nostalgist. The name implies discipline, a vocabulary, and a method. It also implies that the practice is transferable: a Jarista is something another person could become.",
    steps: [
      {
        id: "jarista-1",
        prompt: "What connotations does 'canner' carry? What does it suggest about who does the work and why?",
      },
      {
        id: "jarista-2",
        prompt: "What does 'Jarista' claim that 'home preserver' does not? What is being asserted about the practice?",
      },
      {
        id: "jarista-3",
        prompt: "Can you think of a role in another field where the common name undersells the practice? What would a more load-bearing name look like?",
      },
    ],
  },
  {
    id: "constellation",
    category: "The Constellation",
    question: "What is the constellation, and what does it hold?",
    context:
      "The constellation is the manifest of a practitioner's specific vocabulary: the terms that name the zones, the roles, the primitives, and the tools in their practice. It is not a mission statement or a philosophy. It is the working vocabulary that makes the practice legible — to the practitioner, to collaborators, and to the future.",
    steps: [
      {
        id: "con-1",
        prompt: "How would you describe the constellation to someone who has not read the handbook?",
      },
      {
        id: "con-2",
        prompt: "What is the difference between a mission statement and a constellation? Why does the distinction matter?",
      },
      {
        id: "con-3",
        prompt: "If you were to draft three entries in your own constellation right now — three names specific to your practice — what would they be?",
      },
    ],
  },
  {
    id: "constellation-zones",
    category: "The Constellation",
    question: "What are the constellation zones, and what does each represent?",
    context:
      "The zones organize scale and relationship: Zone 0 is the household (the smallest unit of practice); the Eave is the immediate network; Zone 2 is the community; Zone 3 is the broader ecosystem. Work done in Zone 0 generates the capacity that makes Zone 3 possible. The zones are not a hierarchy — they are a map of how the practice propagates.",
    steps: [
      {
        id: "zones-1",
        prompt: "Describe Zone 0 in your own words. What is it not?",
      },
      {
        id: "zones-2",
        prompt: "The zones are described as a map, not a hierarchy. What is the difference? What would change if they were treated as a hierarchy?",
      },
      {
        id: "zones-3",
        prompt: "Where does most of your current practice live — Zone 0, 1, 2, or 3? What would a move outward require?",
      },
    ],
  },
  {
    id: "fork-mechanic",
    category: "The Constellation",
    question: "What is the fork mechanic, and when does it apply?",
    context:
      "A fork is a deliberate split in the practice — a moment where two versions are allowed to coexist while it is not yet clear which one is right. The fork is not indecision. It is a commitment to running both branches until the question resolves itself through use, not through argument.",
    steps: [
      {
        id: "fork-1",
        prompt: "What is the difference between forking and being undecided?",
      },
      {
        id: "fork-2",
        prompt: "What conditions make a fork appropriate? When would it be a mistake to fork?",
      },
      {
        id: "fork-3",
        prompt: "Is there something in your practice right now that deserves a fork rather than a forced decision? Describe it.",
      },
    ],
  },
  {
    id: "standby-primitive",
    category: "Codetry Primitives",
    question: "What is the Standby primitive, and what posture does it require?",
    context:
      "Standby is the practice of building capacity before it is needed — infrastructure, vocabulary, relationships, skills — so that when the activated state arrives, the practitioner is already positioned to act. Standby is not waiting. It is a specific form of preparation that is only possible during periods of relative ease.",
    steps: [
      {
        id: "standby-1",
        prompt: "How is Standby different from waiting? What does Standby require that waiting does not?",
      },
      {
        id: "standby-2",
        prompt: "What is the 'activated state' that Standby is preparing for? Give an example from the handbook or from your own context.",
      },
      {
        id: "standby-3",
        prompt: "What are you currently in Standby for? What capacity are you building that isn't needed yet?",
      },
    ],
  },
  {
    id: "seven-generation-horizon",
    category: "Codetry Primitives",
    question: "What does the seven-generation horizon framing ask of a practitioner?",
    context:
      "The seven-generation framing — drawn from Haudenosaunee governance — asks that decisions account for consequences seven generations forward. Applied to codetry, it means the names a practitioner chooses, the infrastructure they build, and the vocabulary they develop should be legible and useful beyond their own working life.",
    steps: [
      {
        id: "seven-1",
        prompt: "Where does the seven-generation framing originate, and what was its original purpose?",
      },
      {
        id: "seven-2",
        prompt: "How does codetry apply this framing to naming? What does it demand of a vocabulary?",
      },
      {
        id: "seven-3",
        prompt: "Is there a name or a structure in your practice that you believe would still be useful seven generations from now? What makes it durable?",
      },
    ],
  },
  {
    id: "trust-as-protocol",
    category: "Codetry Primitives",
    question: "What does it mean to treat trust as a protocol rather than a feeling?",
    context:
      "Trust-as-protocol means designing collaboration around explicit, legible agreements — roles, vocabulary, decision rules — rather than relying on personal rapport alone. Protocol-based trust can be transferred to new collaborators, audited, and repaired when broken. Rapport-based trust cannot.",
    steps: [
      {
        id: "trust-1",
        prompt: "What is the difference between trust as a feeling and trust as a protocol? Give an example of each.",
      },
      {
        id: "trust-2",
        prompt: "Why is protocol-based trust more transferable? What can it survive that rapport-based trust cannot?",
      },
      {
        id: "trust-3",
        prompt: "Where in your current collaborations does trust rest on rapport that hasn't been made explicit? What would a protocol version look like?",
      },
    ],
  },
  {
    id: "name-as-infrastructure",
    category: "Core Discipline",
    question: "In what sense is a name infrastructure?",
    context:
      "Infrastructure is what other things are built on top of. A name becomes infrastructure when other people, decisions, and practices depend on it. When a name is infrastructure, changing it has costs — dependencies break. This is why load-bearing names must be chosen carefully: they are harder to revise than they appear at the moment of naming.",
    steps: [
      {
        id: "nai-1",
        prompt: "What makes something 'infrastructure' rather than just a component? What is the defining quality?",
      },
      {
        id: "nai-2",
        prompt: "Give an example from your own work or life of a name that has become infrastructure. What would breaking it cost?",
      },
      {
        id: "nai-3",
        prompt: "If a name is infrastructure, what does that imply about the moment of naming? What does it ask of the practitioner then?",
      },
    ],
  },
  {
    id: "generic-vocabulary-erosion",
    category: "Core Discipline",
    question: "How does generic vocabulary quietly erase a practice?",
    context:
      "When a practitioner stops using their specific vocabulary and defaults to generic equivalents, the precision of the practice leaks away. 'Preserving food' in place of 'Preservation Season' loses the temporal frame. 'Workspace' in place of 'Jar Kitchen' loses the identity. The practice becomes harder to teach, replicate, or defend — not because it changed, but because the language did.",
    steps: [
      {
        id: "gve-1",
        prompt: "Choose one term from the Jar Kitchen vocabulary. Replace it with the most natural generic equivalent. What is lost?",
      },
      {
        id: "gve-2",
        prompt: "Why would a practitioner drift toward generic vocabulary over time? What pressures push in that direction?",
      },
      {
        id: "gve-3",
        prompt: "What is the cost of that drift — for the practitioner, and for anyone trying to learn from them?",
      },
    ],
  },
  {
    id: "practice-vs-project",
    category: "The Practitioner",
    question: "What distinguishes a practice from a project?",
    context:
      "A project has a finish line. A practice does not — it is an ongoing relationship with a domain, a discipline, or a craft. The codetry distinction matters because naming something a practice changes what you build around it: infrastructure, vocabulary, and rhythm rather than milestones and completion.",
    steps: [
      {
        id: "pvp-1",
        prompt: "What does a project have that a practice does not? What does a practice have that a project does not?",
      },
      {
        id: "pvp-2",
        prompt: "How does naming something a 'practice' change what you build around it?",
      },
      {
        id: "pvp-3",
        prompt: "Is there something in your life that you have been treating as a project but is actually a practice? What would the reframe change?",
      },
    ],
  },
  {
    id: "seasonal-shelf",
    category: "Jar Kitchen",
    question: "What is the Seasonal Shelf, and what function does it serve in the Jar Kitchen system?",
    context:
      "The Seasonal Shelf is the preserved inventory maintained by the Jarista — the result of the Preservation Season and the Bulk Round. It is not a pantry in the casual sense. It is a managed reserve that connects the season of abundance (when food is available and cheap) to the season of scarcity (when it is not).",
    steps: [
      {
        id: "ss-1",
        prompt: "What problem does the Seasonal Shelf solve? What would break in the Jar Kitchen system without it?",
      },
      {
        id: "ss-2",
        prompt: "What makes it a 'shelf' rather than just 'stored food'? What does the name claim about how it is managed?",
      },
      {
        id: "ss-3",
        prompt: "Where in your own practice is there a 'shelf' — a managed reserve that connects abundance to scarcity — even if it hasn't been named that way?",
      },
    ],
  },
  {
    id: "bulk-round",
    category: "Jar Kitchen",
    question: "What is the Bulk Round and what discipline does it require?",
    context:
      "The Bulk Round is the sourcing cycle during which the Jarista acquires ingredients in volume — at the right moment in the growing season, from the right suppliers, at scale. It is a defined event, not a continuous activity. Treating it as an event rather than a habit is what makes it manageable.",
    steps: [
      {
        id: "br-1",
        prompt: "Why is calling the sourcing cycle a 'Round' important? What does the name imply about timing?",
      },
      {
        id: "br-2",
        prompt: "What is the difference between treating sourcing as a continuous habit versus a defined event? What does the event frame change?",
      },
      {
        id: "br-3",
        prompt: "Is there a cyclical activity in your practice that would benefit from being named as a Round rather than a habit? What would defining it as an event allow?",
      },
    ],
  },
  {
    id: "practitioner-as-incubator",
    category: "The Practitioner",
    question: "What does it mean for a practitioner to function as an incubator?",
    context:
      "The practitioner who has developed a vocabulary, a method, and a track record can offer something beyond their own output: they can help others develop their practices. The incubation role is named explicitly in the codetry framework because it is a distinct responsibility — not a side effect of doing good work, but a commitment the practitioner makes.",
    steps: [
      {
        id: "pai-1",
        prompt: "What does a practitioner need to have developed before they can function as an incubator?",
      },
      {
        id: "pai-2",
        prompt: "Why is incubation named as a distinct commitment rather than a natural consequence of expertise?",
      },
      {
        id: "pai-3",
        prompt: "Is there a role for you as an incubator — now or in the near future? What would that look like specifically?",
      },
    ],
  },
  {
    id: "vocabulary-as-evidence",
    category: "Core Discipline",
    question: "Why is vocabulary described as evidence that a practice is real?",
    context:
      "A practice that cannot be named — whose methods, phases, roles, and outputs lack specific language — may be real to the practitioner but is invisible to everyone else. Vocabulary is the form in which a practice becomes legible: teachable, auditable, reproducible. Without it, the practice dies with the practitioner.",
    steps: [
      {
        id: "vae-1",
        prompt: "What does it mean for a practice to be 'legible'? Legible to whom, and for what purpose?",
      },
      {
        id: "vae-2",
        prompt: "Can a practice be real without vocabulary? What is the cost of that invisibility?",
      },
      {
        id: "vae-3",
        prompt: "What aspect of your own practice is currently real but not yet legible — not yet named specifically enough to be passed on?",
      },
    ],
  },
  {
    id: "harvest-hold",
    category: "Jar Kitchen",
    question: "What is the Harvest Hold and how does it differ from the Seasonal Shelf?",
    context:
      "The Harvest Hold is the bulk reserve acquired through the Bulk Round — raw materials in volume, before processing. The Seasonal Shelf is the processed, preserved output ready for use. The two names mark different stages in the Jar Kitchen system: acquisition versus completion.",
    steps: [
      {
        id: "hh-1",
        prompt: "At what stage in the Jar Kitchen system does the Harvest Hold exist? What comes before it and what comes after?",
      },
      {
        id: "hh-2",
        prompt: "Why does the distinction between Harvest Hold and Seasonal Shelf matter? What would be lost by using one name for both?",
      },
      {
        id: "hh-3",
        prompt: "In your own practice, are there 'holds' — raw material you've acquired but not yet processed or made ready? What are they?",
      },
    ],
  },
  {
    id: "forward-motion-principle",
    category: "Codetry Primitives",
    question: "What is the 'forward motion is easier to redirect than stillness' principle?",
    context:
      "This principle holds that beginning — even imperfectly, even with incomplete information — creates the conditions for correction. A practice in motion can be steered. A practice that hasn't started cannot. The Jar Kitchen didn't wait for perfect infrastructure; the co-op didn't wait for regulatory clarity. The logic is that starting generates the feedback that planning cannot.",
    steps: [
      {
        id: "fmp-1",
        prompt: "What does 'forward motion is easier to redirect than stillness' mean in practice? What specific situation does it apply to?",
      },
      {
        id: "fmp-2",
        prompt: "What is the risk of applying this principle carelessly? When would you not want to start moving?",
      },
      {
        id: "fmp-3",
        prompt: "Is there something in your practice where stillness is masquerading as planning? What would starting — even imperfectly — reveal?",
      },
    ],
  },
  {
    id: "compounding-asset",
    category: "The Practitioner",
    question: "What makes a skill a 'compounding asset' rather than just a skill?",
    context:
      "A compounding asset is one that grows in value through use — each application makes the next application more effective, faster, or richer. Codetry treats food skills, naming discipline, and community relationships as compounding assets: the longer and more consistently they are practiced, the greater their yield relative to the effort applied.",
    steps: [
      {
        id: "ca-1",
        prompt: "What is the difference between a skill and a compounding asset? What does 'compounding' add?",
      },
      {
        id: "ca-2",
        prompt: "Why is naming discipline described as a compounding asset? How does each name built make the next one easier or better?",
      },
      {
        id: "ca-3",
        prompt: "What is your most valuable compounding asset right now — the practice that has grown most in yield per unit of effort over time?",
      },
    ],
  },
  {
    id: "preservation-season",
    category: "Jar Kitchen",
    question: "What is Preservation Season, and why does naming it as a season matter?",
    context:
      "Preservation Season is the defined period during which the Jarista does the active work of processing, canning, fermenting, and stocking the Seasonal Shelf. Calling it a season is deliberate: seasons are bounded, recurring, and require preparation in advance. The name encodes the discipline — it is not a whenever activity.",
    steps: [
      {
        id: "ps-1",
        prompt: "What does the word 'season' imply about an activity — in contrast to words like 'process', 'project', or 'task'?",
      },
      {
        id: "ps-2",
        prompt: "What preparation does Preservation Season require that a more casual name would not encode?",
      },
      {
        id: "ps-3",
        prompt: "Is there a recurring bounded period in your practice that deserves to be named as a Season? What would naming it change about how you approach it?",
      },
    ],
  },
];
