# Sentrum app UI kit

Interactive recreation of the core Sentrum surface: the nested-panel shell, the
sidebar (brand header, New chat, collapsible nav sections, recent chats, user
row + attribution) and the chat flow (welcome screen → send → typing indicator
→ assistant reply with data table and follow-up chips).

Source of truth: `app/[slug]/dashboard-layout-client.tsx`,
`components/chat/sidebar/ChatSidebar.tsx`, `components/chat/welcome/WelcomeScreen.tsx`
and `components/chat/Message.tsx` in Ginger-Samba-Sports/sentrum.

Interactions that work:

- Send a message (composer or a "For you" prompt row) → typing indicator → canned answer
- Follow-up chips re-send
- "New chat" / logo click resets to the welcome screen
- Sidebar collapse / expand toggle
- Collapsible nav sections

Omitted on purpose (not recreated, no invention): command palette / search,
prompt library drawer, dashboards, modals, dark-mode toggle.
