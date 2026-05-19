import { useState, useRef, useEffect } from "react";
import { TrailArtGallery } from "@/components/TrailArtGallery";
import { YouthTrailMap } from "@/components/YouthTrailMap";

/* ── Types ──────────────────────────────────────────────────────────────── */

type AgeTrack = "young" | "tween" | "older";

type Prompt = {
  id: string;
  question: string;
  placeholder: string;
};

type StationData = {
  ordinal: number;
  phase: number;
  name: string;
  subtitle: string;
  excerpt: string;
  sourceTale: string;
  prompts: { young: Prompt[]; tween: Prompt[]; older: Prompt[] };
  storyInstruction: { young: string; tween: string; older: string };
};

/* ── Youth path data ────────────────────────────────────────────────────── */

const YOUTH_PHASES = [
  { n: 1, label: "Your Kitchen",   desc: "Where what you already know lives" },
  { n: 2, label: "Your People",    desc: "The ones who shaped you without trying" },
  { n: 3, label: "The Hard Thing", desc: "What was called a weakness" },
  { n: 4, label: "The Crossing",   desc: "What doesn't need permission to begin" },
];

const YOUTH_STATIONS: StationData[] = [
  {
    ordinal: 1, phase: 1,
    name: "The Watcher",
    subtitle: "Someone in your life who teaches without a word",
    excerpt: "She had just shown them how to stay. You look until you stop looking. And then you see.",
    sourceTale: "The Elder Who Sat at the Creek",
    prompts: {
      young: [
        { id: "watcher_name", question: "Who in your family or community sits quietly and watches things — without making a big deal of it? Write their name.", placeholder: "Their name" },
        { id: "watcher_subject", question: "What do they watch? A fire, the garden, the water, the road — what is it?", placeholder: "What they watch" },
        { id: "learned_thing", question: "Write one thing you know because of them — not because they told you, just because you were nearby.", placeholder: "What you learned by being close" },
      ],
      tween: [
        { id: "watcher_name", question: "Name someone in your life who teaches without explaining. They don't lecture. They just do the thing.", placeholder: "Their name" },
        { id: "watcher_subject", question: "What do they pay attention to that most people walk right past?", placeholder: "What they notice" },
        { id: "learned_thing", question: "Describe one thing you know because of them — something you absorbed, not something you were taught.", placeholder: "What transferred without words" },
        { id: "knowledge_name", question: "If you had to give a name to the kind of knowledge they carry — not a school subject, just a name — what would you call it?", placeholder: "A name for what they carry" },
      ],
      older: [
        { id: "watcher_name", question: "Name someone whose stillness carries more information than most people's explanations.", placeholder: "Their name" },
        { id: "watcher_subject", question: "What have they spent years watching, tending, or attending to — the thing most people overlook?", placeholder: "What they watch or tend" },
        { id: "time_to_understand", question: "How long did it take you to understand that their silence was a form of instruction?", placeholder: "Days, years, a moment — be specific" },
        { id: "learned_thing", question: "What did you absorb from them that you couldn't have been told — only lived near?", placeholder: "What transferred" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person ('you') about a child and the person named in the answers. The watcher sits with the thing they watch, and the child is nearby. Something transfers — not through words, just through presence. Write it as a specific memory with one concrete image. 2 short paragraphs. The last line should feel like a landing.",
      tween: "Write a story in second person about a teenager and the person from the answers. The person pays quiet attention to the thing they notice, and the teenager absorbs something from being nearby — not from being taught. The story should carry the specific texture of watching someone who knows how to stay. 3 paragraphs. End with the weight of something understood slowly.",
      older: "Write a story in second person about a young person and the watcher in the answers. The young person spent time near this person before understanding what the silence was. The thing transferred — through presence, not instruction — was the thing in the answers. Write it like something you'd tell a much younger person who needed to hear that this kind of learning exists. 4 paragraphs. Don't smooth the edges.",
    },
  },
  {
    ordinal: 2, phase: 1,
    name: "The Rings",
    subtitle: "Something handed to you before you understood its weight",
    excerpt: "I didn't know, he said. But you did it anyway.",
    sourceTale: "The Boy Who Counted the Rings",
    prompts: {
      young: [
        { id: "the_thing", question: "Has someone ever handed you something — a tool, a job, a responsibility — before you felt ready for it? What was it?", placeholder: "The thing they gave you" },
        { id: "the_giver", question: "Who gave it to you?", placeholder: "Their name" },
        { id: "what_you_found", question: "What did you figure out about it later — something you didn't understand when you first got it?", placeholder: "What you found inside it" },
      ],
      tween: [
        { id: "the_thing", question: "Describe something you were given — a task, a tool, a role, a responsibility — before you felt ready for it.", placeholder: "The thing entrusted to you" },
        { id: "the_giver", question: "Who gave it to you, and did they explain why?", placeholder: "Who and what they said (or didn't say)" },
        { id: "what_you_found", question: "What did you discover when you actually did it — something that wouldn't have been visible any other way?", placeholder: "What was revealed" },
        { id: "lesson_name", question: "If the lesson hidden inside that task had a name — not a school lesson, just a name — what would you call it?", placeholder: "A name for what was inside it" },
      ],
      older: [
        { id: "the_thing", question: "What were you entrusted with before you could fully hold it — a task, a role, a piece of knowledge, a responsibility?", placeholder: "What was placed in your hands" },
        { id: "the_giver", question: "Who gave it to you, and what did their giving it without explanation tell you about what they believed?", placeholder: "Who, and what their trust implied" },
        { id: "what_you_found", question: "What did you find inside it when you finally looked close enough — the rings you didn't know were there?", placeholder: "What was layered inside" },
        { id: "what_it_opened", question: "What did carrying that thing open in you — what did you become able to do or see that you couldn't before?", placeholder: "What it unlocked" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person about a child who was given the thing in the answers by the person named, before they understood it. They carry it and figure something out. 2 paragraphs. Specific and concrete. The ending should hold the feeling of quiet discovery.",
      tween: "Write a story in second person about a teenager trusted with the thing in the answers. The person who gave it didn't explain. The teenager does it anyway and finds what's inside. Use the lesson name they gave as the heart of the story. 3 paragraphs with the texture of real labor — not easy, not explained, but real.",
      older: "Write a story in second person about a young person who was handed something before they were ready. The giver's silence was itself a message. When they finally did it, they found the rings — the layers they couldn't have been told about. What it opened in them is in the answers. Write it so it carries the weight of being trusted before you felt trustworthy. 4 paragraphs.",
    },
  },
  {
    ordinal: 3, phase: 2,
    name: "The Button",
    subtitle: "A small move that connected you to something real",
    excerpt: "She pressed it. Nothing happened. Four days later, Margaret Swain called her.",
    sourceTale: "The Button She Almost Didn't Press",
    prompts: {
      young: [
        { id: "the_action", question: "When's a time you did something small — showed up, said yes, pressed a button, knocked on a door — and something real happened after?", placeholder: "The small thing you did" },
        { id: "what_held_back", question: "What almost stopped you from doing it?", placeholder: "What you almost let stop you" },
        { id: "who_responded", question: "Who showed up or what opened after you did it?", placeholder: "What came after" },
      ],
      tween: [
        { id: "the_action", question: "Describe a small action you almost didn't take — a reach, a reply, a yes, a show-up. What was it?", placeholder: "The thing you almost didn't do" },
        { id: "what_held_back", question: "What was the specific thing that almost stopped you — doubt, pride, fear of nothing happening?", placeholder: "What held you back" },
        { id: "why_anyway", question: "What made you do it anyway?", placeholder: "What pushed you through" },
        { id: "who_responded", question: "Who was on the other side of that small move — what person, what opportunity, what door?", placeholder: "Who or what responded" },
      ],
      older: [
        { id: "the_action", question: "Name a moment when you almost didn't reach out — a call you nearly didn't make, a message you sat on, a room you almost didn't walk into.", placeholder: "The thing you almost held back" },
        { id: "what_held_back", question: "What was the internal argument against it — the specific voice that said don't?", placeholder: "The exact resistance" },
        { id: "why_anyway", question: "What finally moved you — was it courage, impatience, someone else, or just deciding to stop deciding?", placeholder: "What finally moved you" },
        { id: "who_responded", question: "Who responded, and what did that response open — a relationship, an opportunity, a version of yourself you hadn't met?", placeholder: "What came through the door you pushed open" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person about a child who almost didn't do the thing in the answers. They almost let the thing that held them back win. But they did it. The person or thing that responded is in the answers. 2 paragraphs. Make the small action feel real and unheroic — just a real move by a real person. End with what came after.",
      tween: "Write a story in second person about a teenager who almost didn't make the move in the answers. The thing that held them back was real. What made them do it anyway was real too. Who responded opened something they didn't expect. 3 paragraphs with the specific textures of the answers. The ending should carry the weight of what happens when someone shows up despite not being sure.",
      older: "Write a story in second person. The young person in the story almost didn't make the reach in the answers. The internal resistance was specific and real. What finally moved them is in the answers. Who responded opened the thing described in the answers. Write it so the reader understands that the whole arc — everything that came after — balanced on one almost-not-taken step. 4 paragraphs. Don't inflate it. The power is in the smallness.",
    },
  },
  {
    ordinal: 4, phase: 2,
    name: "The Word",
    subtitle: "A name from home that the outside world doesn't have",
    excerpt: "How her people said home in a way that held the river, the season, a grandmother's name, and a specific kind of light all at once.",
    sourceTale: "The Girl Who Waited for the Eagle",
    prompts: {
      young: [
        { id: "the_word", question: "What's a word, a name, or a phrase your family or community uses at home that you've never heard anywhere else?", placeholder: "The word" },
        { id: "full_meaning", question: "What does it really mean — what does it carry that you can't say in one sentence?", placeholder: "What it holds" },
        { id: "who_uses_it", question: "Who uses it? When?", placeholder: "Who carries it and when" },
      ],
      tween: [
        { id: "the_word", question: "Write one word, name, or phrase your family or community uses that doesn't have a real equivalent anywhere else — not in school, not in the news, not online.", placeholder: "The word" },
        { id: "full_meaning", question: "What does it hold — what would you lose if you had to translate it into plain English?", placeholder: "What gets lost in translation" },
        { id: "who_uses_it", question: "Who uses it, and in what moment?", placeholder: "Who carries it" },
        { id: "why_it_matters", question: "Why does it matter that this word exists — what does it make possible that a translation can't?", placeholder: "What the word protects or makes possible" },
      ],
      older: [
        { id: "the_word", question: "Name something your family or community calls by a name the outside world doesn't have — a person, a practice, a way of doing things, a feeling. Write the name.", placeholder: "The word or name" },
        { id: "full_meaning", question: "What would be lost if you had to translate it into a form a grant application or school assignment would accept?", placeholder: "What translation destroys" },
        { id: "who_uses_it", question: "Who carries this word — who uses it, and what does using it signal about belonging to something?", placeholder: "Who carries it and what it marks" },
        { id: "how_long", question: "How long have you known this word without knowing that it was something the outside world didn't have?", placeholder: "When you realized it was yours specifically" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person about a child who carries the word in the answers. The word is used by the people in the answers. The story shows one moment when the word is used — not explained, just used — and what that use does. 2 paragraphs. Keep it in the kitchen, in the yard, in the boat — wherever this word lives. Don't explain the word; use it.",
      tween: "Write a story in second person about a teenager who grew up with the word in the answers. The story shows one moment when they try to explain it to someone outside, fail to translate it, and understand for the first time what it means that there is no translation. What the word protects or makes possible is in the answers. 3 paragraphs. The ending should honor the untranslatability.",
      older: "Write a story in second person. The young person in the story has carried the word in the answers for the length of time described without understanding it was irreplaceable. The story shows the moment they realized the word isn't just vocabulary — it's a vessel. What translation destroys is in the answers. What the word marks about belonging is in the answers. 4 paragraphs. Write it like a private record — precise and unperformative.",
    },
  },
  {
    ordinal: 5, phase: 3,
    name: "The Readiness",
    subtitle: "What was called a weakness is a kind of equipment",
    excerpt: "A heart worn on the outside is not a weakness. It is a kind of readiness.",
    sourceTale: "The Girl Who Never Knew",
    prompts: {
      young: [
        { id: "the_quality", question: "What's something about you that people sometimes say is 'too much' — too loud, too quiet, too sensitive, too intense?", placeholder: "The thing people call too much" },
        { id: "what_called", question: "What word do people use for it — shy, dramatic, spacey, stubborn, something else?", placeholder: "The word they use" },
        { id: "when_it_helped", question: "Has that thing ever actually helped — you or someone else? Write one time.", placeholder: "One time it was the exact right thing" },
      ],
      tween: [
        { id: "the_quality", question: "Name something about you that's been called a weakness or 'too much' — a way of feeling, thinking, or moving through the world.", placeholder: "The quality" },
        { id: "what_called", question: "What label has been put on it — in school, at home, by a doctor, by kids your age?", placeholder: "The label" },
        { id: "when_it_helped", question: "When did that exact quality turn out to be exactly what the situation needed?", placeholder: "The moment it was the right thing" },
        { id: "new_name", question: "If it had a different name — not a flaw, not a diagnosis, but a kind of readiness — what would you call it?", placeholder: "A truer name for it" },
      ],
      older: [
        { id: "the_quality", question: "Name the thing about you that's been framed as a problem — too sensitive, too intense, too strange, too much for the room you were in.", placeholder: "The quality that doesn't fit standard rooms" },
        { id: "what_called", question: "What did the systems call it — the school, the counselor, the peer group, the family? What was their word?", placeholder: "Their word for it" },
        { id: "when_it_helped", question: "When did that quality become the exact equipment the situation required? Describe one instance.", placeholder: "When it was precisely right" },
        { id: "new_name", question: "If you were naming it not as a deficiency but as a specific kind of preparation — what would you call it?", placeholder: "Its actual name" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person about a child who carries the quality in the answers. People call it by the label in the answers. The story shows one moment when that quality is exactly what's needed — the instance described in the answers. 2 paragraphs. Don't lecture. Just show the moment.",
      tween: "Write a story in second person about a teenager whose quality — named in the answers — has been labeled the way the answers describe. The story shows the moment when it was exactly right. It ends with the new name the teenager gave it. 3 paragraphs. Write it so the reader understands the label was never the whole truth.",
      older: "Write a story in second person. The young person carries the quality named in the answers. The systems in their life called it the label in the answers. The moment it was precisely right is in the answers. The actual name for it — the one they gave it — is the one that closes the story. 4 paragraphs. Write it like a record correcting an earlier misdiagnosis. Don't soften what the label cost. Don't inflate the reframe.",
    },
  },
  {
    ordinal: 6, phase: 3,
    name: "The Current",
    subtitle: "The thing you were built for vs. the tree you were told to climb",
    excerpt: "The freedom was never up the tree. The child took a stone home without knowing why.",
    sourceTale: "The Fish Who Stopped Trying to Climb",
    prompts: {
      young: [
        { id: "the_current", question: "What's one thing you do that feels easy — like water feels natural to a fish? Something you don't have to try hard at.", placeholder: "The thing that comes naturally" },
        { id: "the_tree", question: "Is there something you've spent time trying to be good at because you thought you were supposed to — even though it never felt right?", placeholder: "The thing you tried to be instead" },
        { id: "coming_back", question: "What helped you find your way back to the thing that's actually yours?", placeholder: "What brought you back" },
      ],
      tween: [
        { id: "the_current", question: "What were you built for? What thing, when you do it, makes everything go quiet and feel like it's working right?", placeholder: "Your current" },
        { id: "the_tree", question: "What did you spend time trying to do instead — because it looked like what success was supposed to look like?", placeholder: "The tree you tried to climb" },
        { id: "why_tree", question: "Why that tree? Whose version of success did it represent?", placeholder: "Whose measure you were using" },
        { id: "coming_back", question: "What did coming back to your actual current look like — was there a moment, a flood, a person, a decision?", placeholder: "What returned you to yourself" },
      ],
      older: [
        { id: "the_current", question: "Name the thing you were built for — the current you were made for, not the tree. The thing that, when you're in it, feels like actual movement instead of effort.", placeholder: "Your current" },
        { id: "the_tree", question: "Describe the tree you spent time climbing. What did it look like from the outside, and why did you think that's where you needed to go?", placeholder: "The tree and why it looked right" },
        { id: "whose_measure", question: "Whose measure of success was the tree — who was already in it that made it seem like the right direction?", placeholder: "Whose version you were chasing" },
        { id: "coming_back", question: "Describe the moment you dropped back into the water. What changed — was it a choice, a failure, a flood, or something you didn't plan?", placeholder: "The return to water" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person about a child who naturally does the thing in the answers — their current. They tried to do the tree instead, for the reason in the answers. What brought them back is in the answers. 2 paragraphs. The current should feel real and specific — not a metaphor, a real thing the child actually does well.",
      tween: "Write a story in second person about a teenager who was built for their current but spent time in the tree in the answers. They used the measure of success named in the answers. The return is in the answers. 3 paragraphs. Write it so the reader feels the difference between effort and movement — the wrongness of the tree and the rightness of the water.",
      older: "Write a story in second person. The young person's current is named in the answers. The tree they climbed — why it looked right, whose measure it was — is in the answers. The return to water happened the way described. 4 paragraphs. Don't romanticize the tree-climbing or the return. Write it as it actually goes: sideways, muddy, slower than expected, then suddenly clear.",
    },
  },
  {
    ordinal: 7, phase: 4,
    name: "The Green",
    subtitle: "The aliveness that doesn't wait for permission",
    excerpt: "She had stopped waiting for the season to change. She walked outside anyway.",
    sourceTale: "The Girl Who Stopped Waiting for Spring",
    prompts: {
      young: [
        { id: "waiting_for", question: "Is there something you've been waiting for before you start — waiting until you're older, until things change, until someone says it's okay?", placeholder: "What you've been waiting for" },
        { id: "permission_expected", question: "Who were you expecting to give you permission?", placeholder: "Who you were waiting on" },
        { id: "one_thing_now", question: "What's one small thing — one thread — you could do today, without waiting?", placeholder: "The one small move" },
      ],
      tween: [
        { id: "waiting_for", question: "What have you been putting off — something you've been waiting on permission, a season, a grade, a relationship to begin?", placeholder: "What you've been deferring" },
        { id: "permission_expected", question: "What form were you expecting the permission to come in — an achievement, an age, someone's approval?", placeholder: "The permission you expected" },
        { id: "cost_of_waiting", question: "What has the waiting cost you — what have you not started that you already knew how to begin?", placeholder: "What the waiting cost" },
        { id: "one_thing_now", question: "What is the smallest possible move — one that needs no external change to make it?", placeholder: "The move that asks nothing to be different first" },
      ],
      older: [
        { id: "waiting_for", question: "Name something you've been deferring to a season, a grade, a relationship, a milestone, an age — something you've been holding in reserve.", placeholder: "What you've been holding back" },
        { id: "external_change", question: "What external change have you been using as a precondition — the thing that has to happen before you can start?", placeholder: "The precondition you've been waiting for" },
        { id: "what_waiting_says", question: "What has the waiting been protecting you from having to find out?", placeholder: "What the waiting keeps you from knowing" },
        { id: "one_thing_now", question: "What is the smallest possible move that would not require anything to change except your decision to make it?", placeholder: "The move that's already available" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person about a child who has been waiting for the thing in the answers. They were waiting on the person or permission in the answers. The story ends with them making the small move described — in winter, before anything changes. 2 paragraphs. The green thing grows without asking. The child moves before the ice breaks. That's the whole story.",
      tween: "Write a story in second person about a teenager who has been deferring the thing in the answers, expecting the permission described. The cost of waiting is in the answers. The small move that doesn't need anything to change first is in the answers. 3 paragraphs. Write it in February — nothing blooming, cold not done. They start anyway. The ending should feel like the exhale before spring, not spring itself.",
      older: "Write a story in second person. The young person has been holding something in reserve, waiting for the external change in the answers. What the waiting has been protecting them from knowing is in the answers. The smallest available move is in the answers. 4 paragraphs. Write it like the green thing in the story — not because conditions are right, but because waiting for conditions to be right is itself the problem. Don't resolve it. Just show them starting.",
    },
  },
  {
    ordinal: 8, phase: 4,
    name: "The Return",
    subtitle: "What empty hands make possible that full ones can't",
    excerpt: "He came back with nothing anyone could see — and found that was exactly what had been needed.",
    sourceTale: "The Man Who Came Back with Empty Hands",
    prompts: {
      young: [
        { id: "what_sought", question: "Have you ever looked for something somewhere — in a different school, a different group, a different place — and found out it was actually already home?", placeholder: "What you were looking for" },
        { id: "where_looked", question: "Where did you go looking?", placeholder: "Where you went" },
        { id: "what_was_home", question: "What did you find when you stopped looking far away? What had been there the whole time?", placeholder: "What was already there" },
      ],
      tween: [
        { id: "what_sought", question: "Describe something you looked for somewhere other than home — recognition, belonging, knowledge, a version of yourself that felt real.", placeholder: "What you went looking for" },
        { id: "where_looked", question: "Where did you look — what places, programs, groups, or people did you seek it in?", placeholder: "Where you searched" },
        { id: "what_was_home", question: "When did you find the version of it that had been available at home all along?", placeholder: "The moment you found what was already there" },
        { id: "what_going_gave", question: "What do you carry back from the looking — what did the going give you that staying never could have?", placeholder: "What the going made possible" },
      ],
      older: [
        { id: "what_sought", question: "Name something you sought away from your community, your family, or your home ground — recognition, belonging, freedom, a kind of knowledge, a version of yourself.", placeholder: "What you went looking for" },
        { id: "how_far", question: "How far did you go — in distance, in time, in the distance between who you were and who you were trying to become?", placeholder: "How far the going took you" },
        { id: "what_was_home", question: "What did you find when you came back — what had been here that you couldn't see before you left?", placeholder: "What the return revealed" },
        { id: "empty_hands", question: "What do empty hands make possible that full ones couldn't — what are you able to receive now that you came back without what you went to find?", placeholder: "What the empty hands allow" },
      ],
    },
    storyInstruction: {
      young: "Write a story in second person about a child who went looking for the thing in the answers in the place described. They came back. What was already home is in the answers. 2 paragraphs. The kitchen should smell like itself. The story ends before the child knows what to do next — they're just home, and that's a beginning.",
      tween: "Write a story in second person about a teenager who sought the thing in the answers in the places described. They found what was already available at home in the moment described. What the going gave them is in the answers. 3 paragraphs. Write it like a return in January — the bush coming up on both sides the same way it always did, and something different in the person driving through it.",
      older: "Write a story in second person. The young person sought what's in the answers, went how far is described. When they came back, they found what the answers describe was always there. The empty hands make possible what's in the answers. 4 paragraphs. Write it like the man at the frozen creek — not triumphant, not defeated. Just present, with empty hands, in the place that was always the answer, finally able to receive it. The freedom was never a location.",
    },
  },
];

/* ── Story generation state ─────────────────────────────────────────────── */

type StoryStatus = "idle" | "loading" | "success" | "error";

type StoryState = {
  status: StoryStatus;
  story?: string;
  error?: string;
};

const AGE_TRACKS: { value: AgeTrack; label: string; note: string }[] = [
  { value: "young", label: "Young",  note: "Ages 6–10"  },
  { value: "tween", label: "Tween",  note: "Ages 10–14" },
  { value: "older", label: "Older",  note: "Ages 14–18" },
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export function StoryPage() {
  const [openStation, setOpenStation] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [ageTracks, setAgeTracks] = useState<Record<number, AgeTrack>>({});
  const [answers, setAnswers] = useState<Record<number, Record<string, string>>>({});
  const [storyStates, setStoryStates] = useState<Record<number, StoryState>>({});

  const getAgeTrack = (ordinal: number): AgeTrack => ageTracks[ordinal] ?? "tween";

  const getAnswer = (ordinal: number, promptId: string) =>
    answers[ordinal]?.[promptId] ?? "";

  const setAnswer = (ordinal: number, promptId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [ordinal]: { ...(prev[ordinal] ?? {}), [promptId]: value },
    }));
  };

  const setStoryState = (ordinal: number, state: StoryState) => {
    setStoryStates((prev) => ({ ...prev, [ordinal]: state }));
  };

  const handlePhaseClick = (n: number) => {
    setActivePhase(n);
    const el = phaseRefs.current[n - 1];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleStationToggle = (ordinal: number) => {
    setOpenStation((prev) => (prev === ordinal ? null : ordinal));
  };

  const handleGenerate = async (station: StationData) => {
    const track = getAgeTrack(station.ordinal);
    const prompts = station.prompts[track];
    const answeredPrompts = prompts.map((p) => ({
      question: p.question,
      answer: getAnswer(station.ordinal, p.id),
    }));

    const hasAnswers = answeredPrompts.some((p) => p.answer.trim() !== "");
    if (!hasAnswers) return;

    setStoryState(station.ordinal, { status: "loading" });

    try {
      const res = await fetch("/media/youth-path/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stationName: station.name,
          ageTrack: track,
          instruction: station.storyInstruction[track],
          answeredPrompts,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStoryState(station.ordinal, {
          status: "error",
          error: (data as { error?: string }).error ?? "Something went wrong. Try again.",
        });
        return;
      }

      const data = await res.json() as { story?: string };
      setStoryState(station.ordinal, {
        status: "success",
        story: data.story ?? "",
      });
    } catch {
      setStoryState(station.ordinal, {
        status: "error",
        error: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  };

  const handleWriteAnother = (ordinal: number) => {
    setStoryState(ordinal, { status: "idle" });
    setAnswers((prev) => ({ ...prev, [ordinal]: {} }));
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: "#fdf8f0" }}
    >
      {/* ══════════════════════════════════════════════ HERO ══ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "58vw", maxHeight: 560 }}
      >
        <img
          src="/story/hero-banner.jpg"
          alt="A warm boreal forest trail at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,20,14,0.78) 0%, rgba(14,30,20,0.55) 35%, rgba(14,30,20,0.42) 55%, rgba(14,30,20,0.82) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 110% 100% at 50% 100%, transparent 40%, rgba(6,16,10,0.45) 100%)",
          }}
        />

        <div
          className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 pb-10 pt-20"
          style={{ minHeight: "inherit" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <a
              href="/"
              className="font-mono text-[8px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{ color: "rgba(212,160,23,0.55)" }}
            >
              ourheadwaters.ca
            </a>
            <span className="font-mono text-[8px]" style={{ color: "rgba(212,160,23,0.28)" }}>/</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: "rgba(212,160,23,0.55)" }}>
              The Youth Odyssey
            </span>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.32em] mb-3" style={{ color: "rgba(212,160,23,0.88)" }}>
            A Headwaters Journey
          </p>
          <h1
            className="font-serif leading-[1.1] mb-3"
            style={{
              color: "#f4ede0",
              fontSize: "clamp(2rem, 6vw, 3.4rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 20px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            The Youth Odyssey
          </h1>
          <p
            className="font-serif italic mb-4"
            style={{
              color: "rgba(244,237,224,0.88)",
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              maxWidth: "38ch",
              textShadow: "0 1px 10px rgba(0,0,0,0.6)",
            }}
          >
            4 phases · 8 stations · your own story at the end.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "Ages 6–10", note: "caregiver-led" },
              { label: "Ages 10–14", note: "independent" },
              { label: "Ages 14–18", note: "full depth" },
            ].map(({ label, note }) => (
              <span
                key={label}
                className="font-mono text-[8px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(244,237,224,0.12)",
                  border: "1px solid rgba(244,237,224,0.22)",
                  color: "rgba(244,237,224,0.6)",
                }}
              >
                {label} · {note}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════ SOPHIE'S WATERCOLOUR ══ */}
      <TrailArtGallery />

      {/* ══════════════════════════════════════════ TRAIL MAP ══ */}

      <section
        className="w-full overflow-hidden"
        style={{ borderTop: "1px solid rgba(31,61,46,0.10)", borderBottom: "1px solid rgba(31,61,46,0.10)" }}
        data-testid="youth-trail-map-section"
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: "#0d1d15", borderBottom: "1px solid rgba(244,237,224,0.07)" }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.28em]"
            style={{ color: "rgba(244,237,224,0.3)" }}>
            Youth Odyssey · Trail Map
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(212,160,23,0.45)" }}>
            Tap a phase to read it ↓
          </span>
        </div>
        <YouthTrailMap
          currentPhase={activePhase}
          onPhaseClick={handlePhaseClick}
        />
      </section>

      {/* ── Phase journal cards (dark boreal) ── */}
      <section
        style={{
          background: "linear-gradient(to bottom, #16261e 0%, #1a2e24 60%, #162535 100%)",
          paddingTop: 48,
          paddingBottom: 64,
        }}
        data-testid="youth-phase-cards"
      >
        <div className="max-w-[44rem] mx-auto px-4 sm:px-8 space-y-12">

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(212,160,23,0.18)" }} />
            <p className="font-mono text-[8.5px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(212,160,23,0.55)" }}>
              The Trail
            </p>
            <div className="flex-1 h-px" style={{ background: "rgba(212,160,23,0.18)" }} />
          </div>

          {YOUTH_PHASES.map((phase, phaseIdx) => {
            const phaseAccents = ["#c97c2e", "#d4a017", "#b85a3e", "#7ab3cc"];
            const accent  = phaseAccents[phaseIdx] ?? "#d4a017";
            const isPhaseActive = activePhase === phase.n;
            const stations = YOUTH_STATIONS.filter((s) => s.phase === phase.n);

            return (
              <div
                key={phase.n}
                ref={(el) => { phaseRefs.current[phaseIdx] = el; }}
                data-testid={`youth-phase-${phase.n}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-[8px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-sm"
                    style={{
                      background: `${accent}1a`,
                      color: isPhaseActive ? accent : `${accent}cc`,
                      border: `1px solid ${accent}35`,
                    }}
                  >
                    Phase {String(phase.n).padStart(2, "0")}
                  </span>
                  <div className="flex-1 h-px" style={{ background: `${accent}18` }} />
                  <button
                    onClick={() => handlePhaseClick(phase.n)}
                    className="font-mono text-[8px] uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
                    style={{ color: isPhaseActive ? accent : "rgba(244,237,224,0.25)" }}
                  >
                    {isPhaseActive ? "↑ on map" : "show on map ↑"}
                  </button>
                </div>

                <h2
                  className="font-serif mb-1"
                  style={{
                    fontSize: "clamp(1.45rem, 4.5vw, 2rem)",
                    color: "#f4ede0",
                    fontWeight: 500,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.15,
                  }}
                >
                  {phase.label}
                </h2>
                <p
                  className="font-serif italic mb-6"
                  style={{ color: `${accent}aa`, fontSize: "14px", lineHeight: 1.6 }}
                >
                  {phase.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stations.map((station) => {
                    const isOpen = openStation === station.ordinal;
                    const track = getAgeTrack(station.ordinal);
                    const storyState = storyStates[station.ordinal] ?? { status: "idle" };
                    const prompts = station.prompts[track];
                    const allAnswered = prompts.every(
                      (p) => getAnswer(station.ordinal, p.id).trim() !== ""
                    );

                    return (
                      <div
                        key={station.ordinal}
                        className="rounded-xl overflow-hidden transition-all duration-200"
                        style={{
                          background: isOpen
                            ? "rgba(244,237,224,0.07)"
                            : "rgba(244,237,224,0.04)",
                          border: isOpen
                            ? `1.5px solid ${accent}50`
                            : "1.5px solid rgba(244,237,224,0.09)",
                          boxShadow: isOpen
                            ? `0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px ${accent}18`
                            : "0 1px 8px rgba(0,0,0,0.25)",
                          gridColumn: isOpen ? "1 / -1" : undefined,
                        }}
                        data-testid={`youth-station-${station.ordinal}`}
                      >
                        {/* ── Card header (always clickable) ── */}
                        <button
                          className="w-full text-left"
                          onClick={() => handleStationToggle(station.ordinal)}
                          aria-expanded={isOpen}
                        >
                          <div
                            className="flex items-stretch"
                            style={{ borderLeft: `3px solid ${isOpen ? accent : `${accent}55`}` }}
                          >
                            <div className="px-4 py-4 flex-1">
                              <span
                                className="font-mono text-[7.5px] uppercase tracking-[0.26em] block mb-2"
                                style={{ color: isOpen ? accent : `${accent}88` }}
                              >
                                Station {String(station.ordinal).padStart(2, "0")}
                              </span>

                              <p
                                className="font-serif mb-1.5"
                                style={{
                                  fontSize: "clamp(1.05rem, 3.5vw, 1.2rem)",
                                  color: "#f4ede0",
                                  fontWeight: 500,
                                  letterSpacing: "-0.01em",
                                  lineHeight: 1.2,
                                }}
                              >
                                {station.name}
                              </p>

                              <p
                                className="font-serif italic"
                                style={{
                                  fontSize: "13px",
                                  color: "rgba(244,237,224,0.52)",
                                  lineHeight: 1.55,
                                }}
                              >
                                {station.subtitle}
                              </p>

                              {!isOpen && (
                                <p
                                  className="font-mono text-[7px] uppercase tracking-[0.18em] mt-3"
                                  style={{ color: "rgba(244,237,224,0.20)" }}
                                >
                                  Tap to write your story →
                                </p>
                              )}
                            </div>
                          </div>
                        </button>

                        {/* ── Expanded content ── */}
                        {isOpen && (
                          <div className="px-4 pb-6">
                            {/* Excerpt */}
                            <div className="mt-1 mb-5">
                              <div className="h-px mb-4" style={{ background: `${accent}30` }} />
                              <p
                                className="font-serif italic"
                                style={{
                                  fontSize: "14px",
                                  color: "rgba(244,237,224,0.88)",
                                  lineHeight: 1.78,
                                }}
                              >
                                "{station.excerpt}"
                              </p>
                              <p
                                className="font-mono text-[7.5px] uppercase tracking-[0.18em] mt-3"
                                style={{ color: `${accent}70` }}
                              >
                                From: {station.sourceTale}
                              </p>
                            </div>

                            {/* ── Story generation panel ── */}
                            {storyState.status === "success" ? (
                              /* Story display */
                              <StoryDisplay
                                story={storyState.story ?? ""}
                                stationName={station.name}
                                accent={accent}
                                onWriteAnother={() => handleWriteAnother(station.ordinal)}
                              />
                            ) : (
                              <>
                                {/* Age track selector */}
                                <div className="mb-5">
                                  <p
                                    className="font-mono text-[7.5px] uppercase tracking-[0.22em] mb-2.5"
                                    style={{ color: "rgba(244,237,224,0.35)" }}
                                  >
                                    Choose your age track
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {AGE_TRACKS.map((t) => {
                                      const isSelected = track === t.value;
                                      return (
                                        <button
                                          key={t.value}
                                          onClick={() =>
                                            setAgeTracks((prev) => ({
                                              ...prev,
                                              [station.ordinal]: t.value,
                                            }))
                                          }
                                          className="flex flex-col items-start px-3 py-2 rounded-lg transition-all"
                                          style={{
                                            background: isSelected
                                              ? `${accent}22`
                                              : "rgba(244,237,224,0.05)",
                                            border: isSelected
                                              ? `1.5px solid ${accent}70`
                                              : "1.5px solid rgba(244,237,224,0.12)",
                                          }}
                                        >
                                          <span
                                            className="font-mono text-[8px] uppercase tracking-[0.18em]"
                                            style={{
                                              color: isSelected
                                                ? accent
                                                : "rgba(244,237,224,0.5)",
                                            }}
                                          >
                                            {t.label}
                                          </span>
                                          <span
                                            className="font-mono text-[7px] tracking-[0.08em]"
                                            style={{ color: "rgba(244,237,224,0.28)" }}
                                          >
                                            {t.note}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Prompt form */}
                                <div className="space-y-4 mb-5">
                                  {prompts.map((prompt, idx) => (
                                    <div key={prompt.id}>
                                      <label
                                        className="block font-serif mb-2"
                                        style={{
                                          fontSize: "13px",
                                          color: "rgba(244,237,224,0.75)",
                                          lineHeight: 1.55,
                                        }}
                                      >
                                        <span
                                          className="font-mono text-[7px] uppercase tracking-[0.2em] mr-2"
                                          style={{ color: `${accent}70` }}
                                        >
                                          {String(idx + 1).padStart(2, "0")}
                                        </span>
                                        {prompt.question}
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={getAnswer(station.ordinal, prompt.id)}
                                        onChange={(e) =>
                                          setAnswer(station.ordinal, prompt.id, e.target.value)
                                        }
                                        placeholder={prompt.placeholder}
                                        className="w-full rounded-lg resize-none font-serif text-sm outline-none transition-all"
                                        style={{
                                          background: "rgba(0,0,0,0.25)",
                                          border: `1px solid rgba(244,237,224,0.12)`,
                                          color: "#f4ede0",
                                          padding: "10px 12px",
                                          lineHeight: 1.6,
                                          fontSize: "13px",
                                        }}
                                        onFocus={(e) => {
                                          e.target.style.borderColor = `${accent}60`;
                                        }}
                                        onBlur={(e) => {
                                          e.target.style.borderColor = "rgba(244,237,224,0.12)";
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>

                                {/* Error state */}
                                {storyState.status === "error" && (
                                  <p
                                    className="font-mono text-[8px] mb-3 rounded-lg px-3 py-2"
                                    style={{
                                      color: "#e8725a",
                                      background: "rgba(232,114,90,0.08)",
                                      border: "1px solid rgba(232,114,90,0.18)",
                                    }}
                                  >
                                    {storyState.error ?? "Something went wrong. Try again."}
                                  </p>
                                )}

                                {/* Submit button */}
                                <button
                                  onClick={() => handleGenerate(station)}
                                  disabled={storyState.status === "loading" || !allAnswered}
                                  className="font-mono text-[8.5px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-lg transition-all"
                                  style={{
                                    background:
                                      storyState.status === "loading" || !allAnswered
                                        ? "rgba(244,237,224,0.06)"
                                        : accent,
                                    color:
                                      storyState.status === "loading" || !allAnswered
                                        ? "rgba(244,237,224,0.3)"
                                        : "#0d1d15",
                                    cursor:
                                      storyState.status === "loading" || !allAnswered
                                        ? "default"
                                        : "pointer",
                                    border:
                                      storyState.status === "loading" || !allAnswered
                                        ? `1px solid rgba(244,237,224,0.10)`
                                        : "none",
                                  }}
                                >
                                  {storyState.status === "loading"
                                    ? "Writing your story…"
                                    : "Write my story →"}
                                </button>

                                {!allAnswered && storyState.status !== "loading" && (
                                  <p
                                    className="font-mono text-[7px] mt-2"
                                    style={{ color: "rgba(244,237,224,0.22)" }}
                                  >
                                    Answer all the prompts above to unlock your story.
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════ ARTIST SUBMIT ══ */}
      <section
        className="max-w-[44rem] mx-auto px-6 sm:px-8 pb-6"
        id="submit-art-story"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(31,61,46,0.10)" }}
        >
          <div
            className="px-6 py-4"
            style={{ background: "rgba(31,61,46,0.04)", borderBottom: "1px solid rgba(31,61,46,0.08)" }}
          >
            <p className="font-mono text-[8.5px] uppercase tracking-[0.24em]" style={{ color: "rgba(31,61,46,0.38)" }}>
              Pebbles left on the trail
            </p>
          </div>
          <div className="px-6 py-7">
            <p
              className="font-serif mb-2"
              style={{
                color: "#1f3d2e",
                fontSize: "clamp(1rem, 3vw, 1.1rem)",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              Are you an artist from a community this trail passes through?
            </p>
            <p
              className="font-serif mb-5"
              style={{ color: "rgba(31,61,46,0.6)", fontSize: "clamp(0.9rem, 2.4vw, 1rem)", lineHeight: 1.75 }}
            >
              Any medium. Any format. When your work is here, people on the trail can tip
              you using community tokens.
            </p>
            <a
              href="mailto:bobbie@ourheadwaters.ca?subject=Youth%20Odyssey%20Art%20Submission"
              className="inline-flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
              style={{ color: "#b85a3e" }}
            >
              Submit your work → bobbie@ourheadwaters.ca
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ ODYSSEY CTA ══ */}
      <section className="max-w-[44rem] mx-auto px-6 sm:px-8 text-center pb-20">
        <div className="h-px w-16 mx-auto mb-8" style={{ background: "rgba(31,61,46,0.14)" }} />
        <p
          className="font-mono text-[8.5px] uppercase tracking-[0.3em] mb-3"
          style={{ color: "rgba(31,61,46,0.35)" }}
        >
          Ready for the practitioner path?
        </p>
        <p
          className="font-serif italic mb-6"
          style={{
            color: "#1f3d2e",
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            lineHeight: 1.6,
          }}
        >
          The Odyssey is the same journey for people who are already
          building — 5 phases, 20 stations, at your own pace.
        </p>
        <a
          href="/odyssey"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] px-6 py-3 rounded-sm transition-all hover:opacity-85"
          style={{ background: "#1f3d2e", color: "#f4ede0" }}
        >
          Begin the Odyssey →
        </a>
      </section>
    </main>
  );
}

/* ── Story display sub-component ────────────────────────────────────────── */

function StoryDisplay({
  story,
  stationName,
  accent,
  onWriteAnother,
}: {
  story: string;
  stationName: string;
  accent: string;
  onWriteAnother: () => void;
}) {
  const [isReading, setIsReading] = useState(false);
  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [speechSupported]);

  const paragraphs = story
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  function handleReadAloud() {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(paragraphs.join(" "));
    utterance.rate = 0.92;
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  }

  function handleStop() {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsReading(false);
  }

  return (
    <div>
      <div className="h-px mb-5" style={{ background: `${accent}30` }} />

      <div
        className="rounded-xl px-5 py-6 mb-5"
        style={{
          background: "rgba(244,237,224,0.06)",
          border: `1px solid ${accent}25`,
        }}
      >
        <p
          className="font-mono text-[7.5px] uppercase tracking-[0.22em] mb-4"
          style={{ color: `${accent}80` }}
        >
          {stationName} · Your Story
        </p>
        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="font-serif"
              style={{
                fontSize: "15px",
                color: "rgba(244,237,224,0.90)",
                lineHeight: 1.82,
                letterSpacing: "0.005em",
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 flex-wrap">
        <button
          onClick={onWriteAnother}
          className="font-mono text-[8.5px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
          style={{ color: `${accent}cc` }}
        >
          Write another →
        </button>

        {speechSupported && (
          isReading ? (
            <button
              onClick={handleStop}
              className="font-mono text-[8.5px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
              style={{ color: `${accent}99` }}
            >
              Stop ◼
            </button>
          ) : (
            <button
              onClick={handleReadAloud}
              className="font-mono text-[8.5px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
              style={{ color: `${accent}99` }}
            >
              Read aloud →
            </button>
          )
        )}
      </div>
    </div>
  );
}
