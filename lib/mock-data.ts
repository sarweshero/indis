export const servers = [
  { id: "valorant", name: "Valorant Squad", icon: "V", unread: true, boosted: true },
  { id: "esports", name: "E-Sports Arena", icon: "E", unread: false, boosted: true },
  { id: "rpg", name: "RPG Guild", icon: "R", unread: true },
  { id: "indie", name: "Indie Devs", icon: "I", unread: false },
]

export const channelsByServer: Record<string, any> = {
  valorant: {
    sections: [
      {
        title: "Text Channels",
        items: [
          { id: "general", name: "general", icon: "#", unread: true },
          { id: "clips", name: "clips-and-media", icon: "#" },
          { id: "scrims", name: "scrim-planning", icon: "#" },
        ],
      },
      {
        title: "Voice Channels",
        items: [
          { id: "lobby", name: "Lobby", icon: "🔊" },
          { id: "comp", name: "Competitive", icon: "🎧" },
        ],
      },
      { title: "Threads", items: [{ id: "agent", name: "Agent Tier Talk", icon: "🧵" }] },
      { title: "Events", items: [{ id: "weekly", name: "Weekly Tourney", icon: "📅" }] },
    ],
  },
  esports: {
    sections: [{ title: "Text Channels", items: [{ id: "announcements", name: "announcements", icon: "#" }] }],
  },
  rpg: { sections: [{ title: "Text Channels", items: [{ id: "lfg", name: "lfg", icon: "#" }] }] },
  indie: { sections: [{ title: "Text Channels", items: [{ id: "devlog", name: "devlog", icon: "#" }] }] },
}

export const users = [
  { id: "u1", name: "Ava", email: "ava@example.com", status: "🔥 Grinding Ranked", role: "Leader" },
  { id: "u2", name: "Kai", email: "kai@example.com", status: "🎮 Playing Elden Ring", role: "Mod" },
  { id: "u3", name: "Rin", email: "rin@example.com", status: "🟢 Online", role: "Member" },
  { id: "u4", name: "Ezra", email: "ezra@example.com", status: "🟠 Away", role: "Member" },
]

export const messages = [
  {
    id: "m1",
    user: "Ava",
    time: "10:24",
    text: "Queueing up comp. Anyone?",
    status: "Playing Valorant",
    pinned: true,
    media: [{ alt: "rank climb" }, { alt: "highlights" }],
  },
  { id: "m2", user: "Kai", time: "10:25", text: "Dropping in. Patch notes look insane." },
  {
    id: "m3",
    user: "Rin",
    time: "10:26",
    text: "Poll: Map preference?",
    poll: {
      question: "Tonight’s map?",
      options: [
        { label: "Ascent", votes: 3 },
        { label: "Split", votes: 1 },
      ],
    },
  },
]

export const tasks = {
  valorant: {
    columns: [
      {
        id: "todo",
        title: "To Do",
        items: [{ id: "t1", title: "Schedule scrim vs Team Nova", assignee: "Ava", due: "Thu" }],
      },
      {
        id: "doing",
        title: "In Progress",
        items: [{ id: "t2", title: "Review agent comp", assignee: "Rin", due: "Today" }],
      },
      {
        id: "done",
        title: "Done",
        items: [{ id: "t3", title: "Upload VOD analysis", assignee: "Kai", due: "Yesterday" }],
      },
    ],
  },
}

export const events = {
  valorant: [
    { id: "e1", title: "Scrim vs Nova", when: "Thu 8:00 PM", location: "Custom Lobby" },
    { id: "e2", title: "Weekly Tourney", when: "Sat 2:00 PM", location: "E-Sports Arena" },
  ],
}

export const defaultRoles = [
  { id: "Leader", name: "Leader" },
  { id: "Mod", name: "Mod" },
  { id: "Member", name: "Member" },
]

export const rolesByServer: Record<string, { id: string; name: string }[]> = {
  valorant: [...defaultRoles],
  esports: [...defaultRoles],
  rpg: [...defaultRoles],
  indie: [...defaultRoles],
}

export const serverMembers: Record<string, { userId: string; roleId: string }[]> = {
  valorant: [
    { userId: "u1", roleId: "Leader" },
    { userId: "u2", roleId: "Mod" },
    { userId: "u3", roleId: "Member" },
    { userId: "u4", roleId: "Member" },
  ],
  esports: [],
  rpg: [],
  indie: [],
}

export function slugify(input: string) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 32)
}
