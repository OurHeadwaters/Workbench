export type AgeGroup = "adult" | "teen" | "child";

export type StandbyStatus = "everyday" | "headsup" | "standby";

export type BuiltInRoleId =
  | "fire_keeper"
  | "light_tender"
  | "kitchen_lead"
  | "water_watcher"
  | "first_aid_holder"
  | "animal_tender"
  | "little_navigator"
  | "communication_keeper";

export interface StandbyRole {
  id: string;
  name: string;
  description: string;
  childDescription: string;
  isBuiltIn: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  avatarColor: string;
  roleIds: string[];
  createdAt: string;
}

export interface KitItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  roleId: string;
  lastCheckedDate: string | null;
  lastCheckedById: string | null;
  source?: "scavenged" | "purchased" | "existing";
}

export type ActivityType = "blackout_kit" | "junk_hunt" | "fire_escape" | "gather_round";

export interface ActivityCompletion {
  id: string;
  activityType: ActivityType;
  completedAt: string;
  ledByIds: string[];
  notes?: string;
}

export interface FireEscapeRoom {
  id: string;
  name: string;
  exits: string;
  notes: string;
}

export interface FireEscapePlan {
  rooms: FireEscapeRoom[];
  meetingSpot: string;
  navigatorId: string | null;
  practiceCount: number;
  lastPracticedDate: string | null;
  notes: string;
}

export interface GatherRoundMessage {
  whatWeHave: string;
  whatWeNeed: string;
  whatWeCanOffer: string;
  lastDraftedAt: string | null;
}

export interface HouseholdReadiness {
  status: StandbyStatus;
  roles: StandbyRole[];
  kitItems: KitItem[];
  activitiesCompleted: ActivityCompletion[];
  fireEscapePlan: FireEscapePlan;
  gatherRoundMessage: GatherRoundMessage;
}

export interface GatherState {
  schemaVersion: number;
  familyMembers: FamilyMember[];
  readiness: HouseholdReadiness;
  activeActivity: ActivityType | null;
  onboardingDone: boolean;
}

export const BUILT_IN_ROLES: StandbyRole[] = [
  {
    id: "fire_keeper",
    name: "Fire Keeper",
    description: "Knows where fire starters are, can safely build a small fire for warmth or cooking.",
    childDescription: "I am the Fire Keeper. I know where the fire starters are. I know how to help build a safe fire for warmth and cooking.",
    isBuiltIn: true,
  },
  {
    id: "light_tender",
    name: "Light Tender",
    description: "Manages flashlights, lanterns, candles. Knows where every light source is and keeps batteries fresh.",
    childDescription: "I am the Light Tender. I know where every flashlight and lantern is. I make sure the batteries are fresh.",
    isBuiltIn: true,
  },
  {
    id: "kitchen_lead",
    name: "Kitchen Lead",
    description: "Knows what food and water we have, can plan simple meals without power.",
    childDescription: "I am the Kitchen Lead. I know what food we have. I can help plan meals even when the power is off.",
    isBuiltIn: true,
  },
  {
    id: "water_watcher",
    name: "Water Watcher",
    description: "Tracks water storage, knows how to make water safe, monitors what we have.",
    childDescription: "I am the Water Watcher. I know where our water is stored. I know how to keep water safe to drink.",
    isBuiltIn: true,
  },
  {
    id: "first_aid_holder",
    name: "First Aid Holder",
    description: "Knows where the first aid kit is, what's in it, and basic first aid steps.",
    childDescription: "I am the First Aid Holder. I know where the first aid kit is. I know the basics of helping someone who is hurt.",
    isBuiltIn: true,
  },
  {
    id: "animal_tender",
    name: "Animal Tender",
    description: "Responsible for pets — food, water, calm. Knows the plan for animals if we need to leave.",
    childDescription: "I am the Animal Tender. I take care of our animals. I know their food, their water, and how to keep them calm.",
    isBuiltIn: true,
  },
  {
    id: "little_navigator",
    name: "Little Navigator",
    description: "Knows the fire escape routes, the meeting spot, and helps lead younger kids during a drill.",
    childDescription: "I am the Little Navigator. I know all the ways out of our home. I know where we meet outside. I help lead the little ones.",
    isBuiltIn: true,
  },
  {
    id: "communication_keeper",
    name: "Communication Keeper",
    description: "Knows who to call, has the contact list, and manages the family radio or communication device.",
    childDescription: "I am the Communication Keeper. I know who to call. I know where the contact list is. I help keep everyone connected.",
    isBuiltIn: true,
  },
];

export const AVATAR_COLORS = [
  "#C7613B",
  "#4A6741",
  "#5C7A5C",
  "#8B6914",
  "#5B7BA8",
  "#9B6B9B",
  "#7A5C3A",
  "#4A7A6B",
];

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  blackout_kit: "Blackout Kit Build",
  junk_hunt: "Junk Scavenger Hunt",
  fire_escape: "Fire Escape Plan",
  gather_round: "Gather Round",
};

export const ACTIVITY_DESCRIPTIONS: Record<ActivityType, string> = {
  blackout_kit: "A scavenger-hunt style build of your household blackout kit.",
  junk_hunt: "A playful whole-house sweep to find what you already have.",
  fire_escape: "A room-by-room walk-through to build your family's fire escape plan.",
  gather_round: "Prepare your household's readiness message for the village.",
};
