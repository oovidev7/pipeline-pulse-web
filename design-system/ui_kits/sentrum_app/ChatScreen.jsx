// Sentrum chat surface — welcome screen + conversation flow
// Recreation of components/chat/welcome/WelcomeScreen.tsx and components/chat/Message.tsx
const {
  Logo,
  Composer,
  PromptRow,
  UserMessage,
  FollowUpChips,
  TypingIndicator,
  DataTable,
} = window.SentrumDesignSystem_fd9502

const FEATURED_PROMPTS = [
  {
    category: 'Squad planning',
    text: 'Which of our contracts expire in the next 12 months?',
  },
  {
    category: 'Recruitment',
    text: 'Top U21 strikers by goals per 90 in the Eredivisie this season',
  },
  {
    category: 'Performance',
    text: 'How does our pressing intensity compare with the league average?',
  },
]

const CANNED_ANSWER = {
  prose:
    'Here are the top U21 strikers in the Eredivisie by goals per 90 this season (minimum 900 minutes played). I filtered to players born after June 2004 and ranked by non-penalty goals per 90.',
  columns: [
    { key: 'player', label: 'Player' },
    { key: 'club', label: 'Club' },
    { key: 'age', label: 'Age', numeric: true, align: 'right' },
    { key: 'mins', label: 'Mins', numeric: true, align: 'right' },
    { key: 'g90', label: 'Goals/90', numeric: true, align: 'right' },
  ],
  rows: [
    { player: 'J. van den Berg', club: 'Feyenoord', age: 19, mins: '1,840', g90: '0.68' },
    { player: 'M. Okafor', club: 'AZ Alkmaar', age: 20, mins: '2,210', g90: '0.61' },
    { player: 'T. Lindqvist', club: 'FC Twente', age: 20, mins: '1,560', g90: '0.52' },
    { player: 'D. Carvalho', club: 'PSV', age: 19, mins: '1,120', g90: '0.48' },
  ],
  followUps: [
    { label: 'Only left-footed players' },
    { label: 'Add expected goals' },
    { label: 'Compare with Belgian Pro League' },
  ],
}

function WelcomeView({ onSend, onPick }) {
  return (
    <div className="welcome">
      <div className="welcome-fade">
        <Logo variant="icon" size="lg" />
      </div>
      <h1 className="snt-display welcome-fade" style={{ fontSize: 36, margin: '16px 0 8px' }}>
        What's new, Anna?
      </h1>
      <p className="welcome-sub welcome-fade">
        Ask anything, or pick one of today's starting points.
      </p>
      <div className="welcome-col welcome-fade">
        <Composer onSend={onSend} autoFocus />
      </div>
      <div className="welcome-col" style={{ marginTop: 28 }}>
        <div className="snt-microlabel welcome-fade" style={{ marginBottom: 12 }}>
          For you, this week
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {FEATURED_PROMPTS.map((p, i) => (
            <div key={i} className="welcome-fade">
              <PromptRow category={p.category} text={p.text} onClick={onPick} />
            </div>
          ))}
        </div>
      </div>
      <p className="welcome-disclaimer">Sentrum can make mistakes. Check important info.</p>
    </div>
  )
}

function ConversationView({ messages, thinking, onSend }) {
  const endRef = React.useRef(null)
  React.useEffect(() => {
    const el = endRef.current
    if (el && el.parentElement) {
      const scroller = el.closest('.chat-scroll')
      if (scroller) scroller.scrollTop = scroller.scrollHeight
    }
  }, [messages, thinking])

  return (
    <div className="conversation">
      <div className="chat-scroll">
        <div className="chat-col">
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} style={{ marginBottom: 24 }}>
                <UserMessage>{m.text}</UserMessage>
              </div>
            ) : (
              <div key={i} className="assistant-msg" style={{ marginBottom: 24 }}>
                <p className="assistant-prose">{m.prose}</p>
                {m.table && (
                  <div className="table-shell">
                    <DataTable columns={m.table.columns} rows={m.table.rows} onRowClick={() => {}} />
                  </div>
                )}
                {m.followUps && (
                  <FollowUpChips suggestions={m.followUps} onSelect={q => onSend(q)} />
                )}
              </div>
            )
          )}
          {thinking && (
            <div style={{ marginBottom: 24 }}>
              <TypingIndicator />
            </div>
          )}
          <div ref={endRef}></div>
        </div>
      </div>
      <div className="composer-dock">
        <div className="chat-col">
          <Composer onSend={onSend} />
        </div>
      </div>
    </div>
  )
}

function ChatScreen({ messages, thinking, onSend }) {
  if (messages.length === 0) {
    return <WelcomeView onSend={onSend} onPick={onSend} />
  }
  return <ConversationView messages={messages} thinking={thinking} onSend={onSend} />
}

Object.assign(window, { ChatScreen, CANNED_ANSWER })
