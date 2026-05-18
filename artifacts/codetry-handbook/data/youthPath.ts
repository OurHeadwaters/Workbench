// The Youth Odyssey — a story-writing journey anchored in the eight tales.
//
// Eight stations across four phases. Each station draws from one tale,
// collects specific details through age-tracked prompts, then hands
// those details to the AI to write the child's own parallel story.
//
// Age tracks:
//   young  — 6-10  — concrete nouns, caregiver-readable, kitchen-sized
//   tween  — 10-14 — independent reader, some complexity, still specific
//   older  — 14-18 — holds nuance, doesn't soften edges

export type AgeTrack = "young" | "tween" | "older";

export type YouthPrompt = {
  id: string;
  question: string;
  placeholder: string;
};

export type YouthPhase = {
  number: number;
  label: string;
  description: string;
};

export type YouthStation = {
  id: string;
  ordinal: number;
  phase: number;
  name: string;
  subtitle: string;
  sourceTaleId: string;
  taleExcerpt: string;
  prompts: {
    young: YouthPrompt[];
    tween: YouthPrompt[];
    older: YouthPrompt[];
  };
  storyInstruction: {
    young: string;
    tween: string;
    older: string;
  };
  authorNote: string;
};

export const YOUTH_PHASES: YouthPhase[] = [
  {
    number: 1,
    label: "Your Kitchen",
    description: "Where what you already know lives",
  },
  {
    number: 2,
    label: "Your People",
    description: "The ones who shaped you without trying",
  },
  {
    number: 3,
    label: "The Hard Thing",
    description: "What was called a weakness",
  },
  {
    number: 4,
    label: "The Crossing",
    description: "What doesn't need permission to begin",
  },
];

export const YOUTH_STATIONS: YouthStation[] = [

  // ── Phase I — Your Kitchen ─────────────────────────────────────────────────

  {
    id: "youth-the-watcher",
    ordinal: 1,
    phase: 1,
    name: "The Watcher",
    subtitle: "Someone in your life who teaches without a word",
    sourceTaleId: "the-elder-who-sat-at-the-creek",
    taleExcerpt:
      "The old woman had not taught any of them anything. She had just shown them how to stay. You look until you stop looking. And then you see.",
    prompts: {
      young: [
        {
          id: "watcher_name",
          question:
            "Who in your family or community sits quietly and watches things — without making a big deal of it? Write their name.",
          placeholder: "Their name",
        },
        {
          id: "watcher_subject",
          question:
            "What do they watch? A fire, the garden, the water, the road — what is it?",
          placeholder: "What they watch",
        },
        {
          id: "learned_thing",
          question:
            "Write one thing you know because of them — not because they told you, just because you were nearby.",
          placeholder: "What you learned by being close",
        },
      ],
      tween: [
        {
          id: "watcher_name",
          question:
            "Name someone in your life who teaches without explaining. They don't lecture. They just do the thing.",
          placeholder: "Their name",
        },
        {
          id: "watcher_subject",
          question:
            "What do they pay attention to that most people walk right past?",
          placeholder: "What they notice",
        },
        {
          id: "learned_thing",
          question:
            "Describe one thing you know because of them — something you absorbed, not something you were taught.",
          placeholder: "What transferred without words",
        },
        {
          id: "knowledge_name",
          question:
            "If you had to give a name to the kind of knowledge they carry — not a school subject, just a name — what would you call it?",
          placeholder: "A name for what they carry",
        },
      ],
      older: [
        {
          id: "watcher_name",
          question:
            "Name someone whose stillness carries more information than most people's explanations.",
          placeholder: "Their name",
        },
        {
          id: "watcher_subject",
          question:
            "What have they spent years watching, tending, or attending to — the thing most people overlook?",
          placeholder: "What they watch or tend",
        },
        {
          id: "time_to_understand",
          question:
            "How long did it take you to understand that their silence was a form of instruction?",
          placeholder: "Days, years, a moment — be specific",
        },
        {
          id: "learned_thing",
          question:
            "What did you absorb from them that you couldn't have been told — only lived near?",
          placeholder: "What transferred",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person ('you') about a child and the person named in the answers. The watcher sits with the thing they watch, and the child is nearby. Something transfers — not through words, just through presence. Write it as a specific memory with one concrete image. 2 short paragraphs. The last line should feel like a landing.",
      tween:
        "Write a story in second person about a teenager and the person from the answers. The person pays quiet attention to the thing they notice, and the teenager absorbs something from being nearby — not from being taught. The story should carry the specific texture of watching someone who knows how to stay. 3 paragraphs. End with the weight of something understood slowly.",
      older:
        "Write a story in second person about a young person and the watcher in the answers. The young person spent time near this person before understanding what the silence was. The thing transferred — through presence, not instruction — was the thing in the answers. Write it like something you'd tell a much younger person who needed to hear that this kind of learning exists. 4 paragraphs. Don't smooth the edges.",
    },
    authorNote:
      "The deepest learning is not a curriculum. It is proximity to someone who has learned to be still — and the willingness to stay nearby long enough for something to cross over.",
  },

  {
    id: "youth-the-rings",
    ordinal: 2,
    phase: 1,
    name: "The Rings",
    subtitle: "Something handed to you before you understood its weight",
    sourceTaleId: "the-boy-who-counted-the-rings",
    taleExcerpt:
      "How did you know I could do it? the boy asked. His grandfather picked up the knife and folded it closed and handed it back to him. I didn't know, he said. But you did it anyway.",
    prompts: {
      young: [
        {
          id: "the_thing",
          question:
            "Has someone ever handed you something — a tool, a job, a responsibility — before you felt ready for it? What was it?",
          placeholder: "The thing they gave you",
        },
        {
          id: "the_giver",
          question: "Who gave it to you?",
          placeholder: "Their name",
        },
        {
          id: "what_you_found",
          question:
            "What did you figure out about it later — something you didn't understand when you first got it?",
          placeholder: "What you found inside it",
        },
      ],
      tween: [
        {
          id: "the_thing",
          question:
            "Describe something you were given — a task, a tool, a role, a responsibility — before you felt ready for it.",
          placeholder: "The thing entrusted to you",
        },
        {
          id: "the_giver",
          question: "Who gave it to you, and did they explain why?",
          placeholder: "Who and what they said (or didn't say)",
        },
        {
          id: "what_you_found",
          question:
            "What did you discover when you actually did it — something that wouldn't have been visible any other way?",
          placeholder: "What was revealed",
        },
        {
          id: "lesson_name",
          question:
            "If the lesson hidden inside that task had a name — not a school lesson, just a name — what would you call it?",
          placeholder: "A name for what was inside it",
        },
      ],
      older: [
        {
          id: "the_thing",
          question:
            "What were you entrusted with before you could fully hold it — a task, a role, a piece of knowledge, a responsibility?",
          placeholder: "What was placed in your hands",
        },
        {
          id: "the_giver",
          question:
            "Who gave it to you, and what did their giving it without explanation tell you about what they believed?",
          placeholder: "Who, and what their trust implied",
        },
        {
          id: "what_you_found",
          question:
            "What did you find inside it when you finally looked close enough — the rings you didn't know were there?",
          placeholder: "What was layered inside",
        },
        {
          id: "what_it_opened",
          question:
            "What did carrying that thing open in you — what did you become able to do or see that you couldn't before?",
          placeholder: "What it unlocked",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person about a child who was given the thing in the answers by the person named, before they understood it. They carry it and figure something out. 2 paragraphs. Specific and concrete. The ending should hold the feeling of quiet discovery.",
      tween:
        "Write a story in second person about a teenager trusted with the thing in the answers. The person who gave it didn't explain. The teenager does it anyway and finds what's inside. Use the lesson name they gave as the heart of the story. 3 paragraphs with the texture of real labor — not easy, not explained, but real.",
      older:
        "Write a story in second person about a young person who was handed something before they were ready. The giver's silence was itself a message. When they finally did it, they found the rings — the layers they couldn't have been told about. What it opened in them is in the answers. Write it so it carries the weight of being trusted before you felt trustworthy. 4 paragraphs.",
    },
    authorNote:
      "The lesson is never in the telling. It is in the knife handed over without explanation — the counting that gets harder before it gets easier. The one who explains robs the learner of the discovery.",
  },

  // ── Phase II — Your People ─────────────────────────────────────────────────

  {
    id: "youth-the-button",
    ordinal: 3,
    phase: 2,
    name: "The Button",
    subtitle: "A small move that connected you to something real",
    sourceTaleId: "the-button-she-almost-didnt-press",
    taleExcerpt:
      "She pressed it. Nothing happened. The screen didn't change. No confetti. No notification. She put her phone down and went back to watching the ceiling. Four days later, Margaret Swain called her.",
    prompts: {
      young: [
        {
          id: "the_action",
          question:
            "When's a time you did something small — showed up, said yes, pressed a button, knocked on a door — and something real happened after?",
          placeholder: "The small thing you did",
        },
        {
          id: "what_held_back",
          question: "What almost stopped you from doing it?",
          placeholder: "What you almost let stop you",
        },
        {
          id: "who_responded",
          question: "Who showed up or what opened after you did it?",
          placeholder: "What came after",
        },
      ],
      tween: [
        {
          id: "the_action",
          question:
            "Describe a small action you almost didn't take — a reach, a reply, a yes, a show-up. What was it?",
          placeholder: "The thing you almost didn't do",
        },
        {
          id: "what_held_back",
          question:
            "What was the specific thing that almost stopped you — doubt, pride, fear of nothing happening?",
          placeholder: "What held you back",
        },
        {
          id: "why_anyway",
          question: "What made you do it anyway?",
          placeholder: "What pushed you through",
        },
        {
          id: "who_responded",
          question:
            "Who was on the other side of that small move — what person, what opportunity, what door?",
          placeholder: "Who or what responded",
        },
      ],
      older: [
        {
          id: "the_action",
          question:
            "Name a moment when you almost didn't reach out — a call you nearly didn't make, a message you sat on, a room you almost didn't walk into.",
          placeholder: "The thing you almost held back",
        },
        {
          id: "what_held_back",
          question:
            "What was the internal argument against it — the specific voice that said don't?",
          placeholder: "The exact resistance",
        },
        {
          id: "why_anyway",
          question:
            "What finally moved you — was it courage, impatience, someone else, or just deciding to stop deciding?",
          placeholder: "What finally moved you",
        },
        {
          id: "who_responded",
          question:
            "Who responded, and what did that response open — a relationship, an opportunity, a version of yourself you hadn't met?",
          placeholder: "What came through the door you pushed open",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person about a child who almost didn't do the thing in the answers. They almost let the thing that held them back win. But they did it. The person or thing that responded is in the answers. 2 paragraphs. Make the small action feel real and unheroic — just a real move by a real person. End with what came after.",
      tween:
        "Write a story in second person about a teenager who almost didn't make the move in the answers. The thing that held them back was real. What made them do it anyway was real too. Who responded opened something they didn't expect. 3 paragraphs with the specific textures of the answers. The ending should carry the weight of what happens when someone shows up despite not being sure.",
      older:
        "Write a story in second person. The young person in the story almost didn't make the reach in the answers. The internal resistance was specific and real. What finally moved them is in the answers. Who responded opened the thing described in the answers. Write it so the reader understands that the whole arc — everything that came after — balanced on one almost-not-taken step. 4 paragraphs. Don't inflate it. The power is in the smallness.",
    },
    authorNote:
      "Most connections begin with a button pressed without knowing why. The system is built around that moment — because that moment is where it starts, every time.",
  },

  {
    id: "youth-the-word",
    ordinal: 4,
    phase: 2,
    name: "The Word",
    subtitle: "A name from home that the outside world doesn't have",
    sourceTaleId: "the-girl-who-waited-for-the-eagle",
    taleExcerpt:
      "The old woman talked about how her people said trade in a way that also meant you are now inside my story. How they said home in a way that held the river, the season, the name of a grandmother, and a specific kind of light all at once. The girl listened. Then, very quietly, she asked: Would it be alright if I wrote some of these down? The old woman looked at her for a long time. Not yet, she said. Come back.",
    prompts: {
      young: [
        {
          id: "the_word",
          question:
            "What's a word, a name, or a phrase your family or community uses at home that you've never heard anywhere else?",
          placeholder: "The word",
        },
        {
          id: "full_meaning",
          question:
            "What does it really mean — what does it carry that you can't say in one sentence?",
          placeholder: "What it holds",
        },
        {
          id: "who_uses_it",
          question: "Who uses it? When?",
          placeholder: "Who carries it and when",
        },
      ],
      tween: [
        {
          id: "the_word",
          question:
            "Write one word, name, or phrase your family or community uses that doesn't have a real equivalent anywhere else — not in school, not in the news, not online.",
          placeholder: "The word",
        },
        {
          id: "full_meaning",
          question:
            "What does it hold — what would you lose if you had to translate it into plain English?",
          placeholder: "What gets lost in translation",
        },
        {
          id: "who_uses_it",
          question: "Who uses it, and in what moment?",
          placeholder: "Who carries it",
        },
        {
          id: "why_it_matters",
          question:
            "Why does it matter that this word exists — what does it make possible that a translation can't?",
          placeholder: "What the word protects or makes possible",
        },
      ],
      older: [
        {
          id: "the_word",
          question:
            "Name something your family or community calls by a name the outside world doesn't have — a person, a practice, a way of doing things, a feeling. Write the name.",
          placeholder: "The word or name",
        },
        {
          id: "full_meaning",
          question:
            "What would be lost if you had to translate it into a form a grant application or school assignment would accept?",
          placeholder: "What translation destroys",
        },
        {
          id: "who_uses_it",
          question:
            "Who carries this word — who uses it, and what does using it signal about belonging to something?",
          placeholder: "Who carries it and what it marks",
        },
        {
          id: "how_long",
          question:
            "How long have you known this word without knowing that it was something the outside world didn't have?",
          placeholder: "When you realized it was yours specifically",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person about a child who carries the word in the answers. The word is used by the people in the answers. The story shows one moment when the word is used — not explained, just used — and what that use does. 2 paragraphs. Keep it in the kitchen, in the yard, in the boat — wherever this word lives. Don't explain the word; use it.",
      tween:
        "Write a story in second person about a teenager who grew up with the word in the answers. The story shows one moment when they try to explain it to someone outside, fail to translate it, and understand for the first time what it means that there is no translation. What the word protects or makes possible is in the answers. 3 paragraphs. The ending should honor the untranslatability.",
      older:
        "Write a story in second person. The young person in the story has carried the word in the answers for the length of time described without understanding it was irreplaceable. The story shows the moment they realized the word isn't just vocabulary — it's a vessel. What translation destroys is in the answers. What the word marks about belonging is in the answers. 4 paragraphs. Write it like a private record — precise and unperformative.",
    },
    authorNote:
      "A living word in a living community is not a translation waiting to happen. It is a record — specific, located, belonging to the people who carry it. Some of the most important things a community holds together are held in the words that have no English equivalent.",
  },

  // ── Phase III — The Hard Thing ─────────────────────────────────────────────

  {
    id: "youth-the-readiness",
    ordinal: 5,
    phase: 3,
    name: "The Readiness",
    subtitle: "What was called a weakness is a kind of equipment",
    sourceTaleId: "the-girl-who-never-knew",
    taleExcerpt:
      "That a heart worn on the outside is not a weakness. It is a kind of readiness. She just never knew, until then, what she was ready for.",
    prompts: {
      young: [
        {
          id: "the_quality",
          question:
            "What's something about you that people sometimes say is 'too much' — too loud, too quiet, too sensitive, too intense?",
          placeholder: "The thing people call too much",
        },
        {
          id: "what_called",
          question:
            "What word do people use for it — shy, dramatic, spacey, stubborn, something else?",
          placeholder: "The word they use",
        },
        {
          id: "when_it_helped",
          question:
            "Has that thing ever actually helped — you or someone else? Write one time.",
          placeholder: "One time it was the exact right thing",
        },
      ],
      tween: [
        {
          id: "the_quality",
          question:
            "Name something about you that's been called a weakness or 'too much' — a way of feeling, thinking, or moving through the world.",
          placeholder: "The quality",
        },
        {
          id: "what_called",
          question:
            "What label has been put on it — in school, at home, by a doctor, by kids your age?",
          placeholder: "The label",
        },
        {
          id: "when_it_helped",
          question:
            "When did that exact quality turn out to be exactly what the situation needed?",
          placeholder: "The moment it was the right thing",
        },
        {
          id: "new_name",
          question:
            "If it had a different name — not a flaw, not a diagnosis, but a kind of readiness — what would you call it?",
          placeholder: "A truer name for it",
        },
      ],
      older: [
        {
          id: "the_quality",
          question:
            "Name the thing about you that's been framed as a problem — too sensitive, too intense, too strange, too much for the room you were in.",
          placeholder: "The quality that doesn't fit standard rooms",
        },
        {
          id: "what_called",
          question:
            "What did the systems call it — the school, the counselor, the peer group, the family? What was their word?",
          placeholder: "Their word for it",
        },
        {
          id: "when_it_helped",
          question:
            "When did that quality become the exact equipment the situation required? Describe one instance.",
          placeholder: "When it was precisely right",
        },
        {
          id: "new_name",
          question:
            "If you were naming it not as a deficiency but as a specific kind of preparation — what would you call it?",
          placeholder: "Its actual name",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person about a child who carries the quality in the answers. People call it by the label in the answers. The story shows one moment when that quality is exactly what's needed — the instance described in the answers. 2 paragraphs. Don't lecture. Just show the moment.",
      tween:
        "Write a story in second person about a teenager whose quality — named in the answers — has been labeled the way the answers describe. The story shows the moment when it was exactly right. It ends with the new name the teenager gave it. 3 paragraphs. Write it so the reader understands the label was never the whole truth.",
      older:
        "Write a story in second person. The young person carries the quality named in the answers. The systems in their life called it the label in the answers. The moment it was precisely right is in the answers. The actual name for it — the one they gave it — is the one that closes the story. 4 paragraphs. Write it like a record correcting an earlier misdiagnosis. Don't soften what the label cost. Don't inflate the reframe.",
    },
    authorNote:
      "The heart that feels things deeply is the same heart that can hold what breaks other containers. That is not a coincidence. It is architecture — pointing in the wrong direction until the person finds the right room.",
  },

  {
    id: "youth-the-current",
    ordinal: 6,
    phase: 3,
    name: "The Current",
    subtitle: "The thing you were built for vs. the tree you were told to climb",
    sourceTaleId: "the-fish-who-stopped-trying-to-climb",
    taleExcerpt:
      "She had swum down, not up. And in the going down, she had found the whole river. The river gave her what the tree never could. Not a view from above. A knowledge from within.",
    prompts: {
      young: [
        {
          id: "the_current",
          question:
            "What's one thing you do that feels easy — like water feels natural to a fish? Something you don't have to try hard at.",
          placeholder: "The thing that comes naturally",
        },
        {
          id: "the_tree",
          question:
            "Is there something you've spent time trying to be good at because you thought you were supposed to — even though it never felt right?",
          placeholder: "The thing you tried to be instead",
        },
        {
          id: "coming_back",
          question:
            "What helped you find your way back to the thing that's actually yours?",
          placeholder: "What brought you back",
        },
      ],
      tween: [
        {
          id: "the_current",
          question:
            "What were you built for? What thing, when you do it, makes everything go quiet and feel like it's working right?",
          placeholder: "Your current",
        },
        {
          id: "the_tree",
          question:
            "What did you spend time trying to do instead — because it looked like what success was supposed to look like?",
          placeholder: "The tree you tried to climb",
        },
        {
          id: "why_tree",
          question:
            "Why that tree? Whose version of success did it represent?",
          placeholder: "Whose measure you were using",
        },
        {
          id: "coming_back",
          question:
            "What did coming back to your actual current look like — was there a moment, a flood, a person, a decision?",
          placeholder: "What returned you to yourself",
        },
      ],
      older: [
        {
          id: "the_current",
          question:
            "Name the thing you were built for — the current you were made for, not the tree. The thing that, when you're in it, feels like actual movement instead of effort.",
          placeholder: "Your current",
        },
        {
          id: "the_tree",
          question:
            "Describe the tree you spent time climbing. What did it look like from the outside, and why did you think that's where you needed to go?",
          placeholder: "The tree and why it looked right",
        },
        {
          id: "whose_measure",
          question:
            "Whose measure of success was the tree — who was already in it that made it seem like the right direction?",
          placeholder: "Whose version you were chasing",
        },
        {
          id: "coming_back",
          question:
            "Describe the moment you dropped back into the water. What changed — was it a choice, a failure, a flood, or something you didn't plan?",
          placeholder: "The return to water",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person about a child who naturally does the thing in the answers — their current. They tried to do the tree instead, for the reason in the answers. What brought them back is in the answers. 2 paragraphs. The current should feel real and specific — not a metaphor, a real thing the child actually does well.",
      tween:
        "Write a story in second person about a teenager who was built for their current but spent time in the tree in the answers. They used the measure of success named in the answers. The return is in the answers. 3 paragraphs. Write it so the reader feels the difference between effort and movement — the wrongness of the tree and the rightness of the water.",
      older:
        "Write a story in second person. The young person's current is named in the answers. The tree they climbed — why it looked right, whose measure it was — is in the answers. The return to water happened the way described. 4 paragraphs. Don't romanticize the tree-climbing or the return. Write it as it actually goes: sideways, muddy, slower than expected, then suddenly clear.",
    },
    authorNote:
      "The fish who can't climb isn't failing at trees. She's free to swim. Learning that difference is not a single moment of clarity — it is the whole river, moved through over time.",
  },

  // ── Phase IV — The Crossing ─────────────────────────────────────────────────

  {
    id: "youth-the-green",
    ordinal: 7,
    phase: 4,
    name: "The Green",
    subtitle: "The aliveness that doesn't wait for permission",
    sourceTaleId: "the-girl-who-stopped-waiting-for-spring",
    taleExcerpt:
      "It did not ask if it was time. It did not look at the ice on the lake. It grew toward something it could not see yet, through ground that had not softened, in a month that gave it nothing to work with. And yet.",
    prompts: {
      young: [
        {
          id: "waiting_for",
          question:
            "Is there something you've been waiting for before you start — waiting until you're older, until things change, until someone says it's okay?",
          placeholder: "What you've been waiting for",
        },
        {
          id: "permission_expected",
          question: "Who were you expecting to give you permission?",
          placeholder: "Who you were waiting on",
        },
        {
          id: "one_thing_now",
          question:
            "What's one small thing — one thread — you could do today, without waiting?",
          placeholder: "The one small move",
        },
      ],
      tween: [
        {
          id: "waiting_for",
          question:
            "What have you been putting off — something you've been waiting on permission, a season, a grade, a relationship to begin?",
          placeholder: "What you've been deferring",
        },
        {
          id: "permission_expected",
          question:
            "What form were you expecting the permission to come in — an achievement, an age, someone's approval?",
          placeholder: "The permission you expected",
        },
        {
          id: "cost_of_waiting",
          question:
            "What has the waiting cost you — what have you not started that you already knew how to begin?",
          placeholder: "What the waiting cost",
        },
        {
          id: "one_thing_now",
          question:
            "What is the smallest possible move — one that needs no external change to make it?",
          placeholder: "The move that asks nothing to be different first",
        },
      ],
      older: [
        {
          id: "waiting_for",
          question:
            "Name something you've been deferring to a season, a grade, a relationship, a milestone, an age — something you've been holding in reserve.",
          placeholder: "What you've been holding back",
        },
        {
          id: "external_change",
          question:
            "What external change have you been using as a precondition — the thing that has to happen before you can start?",
          placeholder: "The precondition you've been waiting for",
        },
        {
          id: "what_waiting_says",
          question:
            "What has the waiting been protecting you from having to find out?",
          placeholder: "What the waiting keeps you from knowing",
        },
        {
          id: "one_thing_now",
          question:
            "What is the smallest possible move that would not require anything to change except your decision to make it?",
          placeholder: "The move that's already available",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person about a child who has been waiting for the thing in the answers. They were waiting on the person or permission in the answers. The story ends with them making the small move described — in winter, before anything changes. 2 paragraphs. The green thing grows without asking. The child moves before the ice breaks. That's the whole story.",
      tween:
        "Write a story in second person about a teenager who has been deferring the thing in the answers, expecting the permission described. The cost of waiting is in the answers. The small move that doesn't need anything to change first is in the answers. 3 paragraphs. Write it in February — nothing blooming, cold not done. They start anyway. The ending should feel like the exhale before spring, not spring itself.",
      older:
        "Write a story in second person. The young person has been holding something in reserve, waiting for the external change in the answers. What the waiting has been protecting them from knowing is in the answers. The smallest available move is in the answers. 4 paragraphs. Write it like the green thing in the story — not because conditions are right, but because waiting for conditions to be right is itself the problem. Don't resolve it. Just show them starting.",
    },
    authorNote:
      "The drive that needs external permission to feel legitimate is still the drive. It just hasn't trusted itself yet. The February green doesn't wait for the ice to break. It starts. That is what it looks like.",
  },

  {
    id: "youth-the-return",
    ordinal: 8,
    phase: 4,
    name: "The Return",
    subtitle: "What empty hands make possible that full ones can't",
    sourceTaleId: "the-man-who-came-back-with-empty-hands",
    taleExcerpt:
      "Standing at the frozen creek in January, empty-handed, he could feel it. Not arriving. Already here. It had been here the whole time. He had just been somewhere else. The freedom he had been looking for was not a location. It was a permission. And he had always had it.",
    prompts: {
      young: [
        {
          id: "what_sought",
          question:
            "Have you ever looked for something somewhere — in a different school, a different group, a different place — and found out it was actually already home?",
          placeholder: "What you were looking for",
        },
        {
          id: "where_looked",
          question: "Where did you go looking?",
          placeholder: "Where you went",
        },
        {
          id: "what_was_home",
          question:
            "What did you find when you stopped looking far away? What had been there the whole time?",
          placeholder: "What was already there",
        },
      ],
      tween: [
        {
          id: "what_sought",
          question:
            "Describe something you looked for somewhere other than home — recognition, belonging, knowledge, a version of yourself that felt real.",
          placeholder: "What you went looking for",
        },
        {
          id: "where_looked",
          question:
            "Where did you look — what places, programs, groups, or people did you seek it in?",
          placeholder: "Where you searched",
        },
        {
          id: "what_was_home",
          question:
            "When did you find the version of it that had been available at home all along?",
          placeholder: "The moment you found what was already there",
        },
        {
          id: "what_going_gave",
          question:
            "What do you carry back from the looking — what did the going give you that staying never could have?",
          placeholder: "What the going made possible",
        },
      ],
      older: [
        {
          id: "what_sought",
          question:
            "Name something you sought away from your community, your family, or your home ground — recognition, belonging, freedom, a kind of knowledge, a version of yourself.",
          placeholder: "What you went looking for",
        },
        {
          id: "how_far",
          question:
            "How far did you go — in distance, in time, in the distance between who you were and who you were trying to become?",
          placeholder: "How far the going took you",
        },
        {
          id: "what_was_home",
          question:
            "What did you find when you came back — what had been here that you couldn't see before you left?",
          placeholder: "What the return revealed",
        },
        {
          id: "empty_hands",
          question:
            "What do empty hands make possible that full ones couldn't — what are you able to receive now that you came back without what you went to find?",
          placeholder: "What the empty hands allow",
        },
      ],
    },
    storyInstruction: {
      young:
        "Write a story in second person about a child who went looking for the thing in the answers in the place described. They came back. What was already home is in the answers. 2 paragraphs. The kitchen should smell like itself. The story ends before the child knows what to do next — they're just home, and that's a beginning.",
      tween:
        "Write a story in second person about a teenager who sought the thing in the answers in the places described. They found what was already available at home in the moment described. What the going gave them is in the answers. 3 paragraphs. Write it like a return in January — the bush coming up on both sides the same way it always did, and something different in the person driving through it.",
      older:
        "Write a story in second person. The young person sought what's in the answers, went how far is described. When they came back, they found what the answers describe was always there. The empty hands make possible what's in the answers. 4 paragraphs. Write it like the man at the frozen creek — not triumphant, not defeated. Just present, with empty hands, in the place that was always the answer, finally able to receive it. The freedom was never a location.",
    },
    authorNote:
      "Some things have to be looked for far away before you can receive what's close. The leaving is not a mistake. It is part of the knowing. The empty hands are not failure. They are readiness — finally prepared to hold what was here the whole time.",
  },
];

export function getYouthStation(id: string): YouthStation | undefined {
  return YOUTH_STATIONS.find((s) => s.id === id);
}

export function getYouthNeighbors(
  id: string,
): { prev: YouthStation | null; next: YouthStation | null } {
  const idx = YOUTH_STATIONS.findIndex((s) => s.id === id);
  return {
    prev: idx > 0 ? (YOUTH_STATIONS[idx - 1] ?? null) : null,
    next: idx < YOUTH_STATIONS.length - 1 ? (YOUTH_STATIONS[idx + 1] ?? null) : null,
  };
}
