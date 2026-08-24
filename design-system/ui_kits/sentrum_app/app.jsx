// Sentrum app root — shell layout + fake chat state machine
function SentrumApp() {
  const [collapsed, setCollapsed] = React.useState(false)
  const [messages, setMessages] = React.useState([])
  const [thinking, setThinking] = React.useState(false)
  const [conversations, setConversations] = React.useState([
    { id: 'c1', title: 'Contract expiries 2026' },
    { id: 'c2', title: 'Eredivisie U21 strikers' },
  ])
  const [activeId, setActiveId] = React.useState(null)

  const send = text => {
    setMessages(prev => [...prev, { role: 'user', text }])
    setThinking(true)
    if (messages.length === 0) {
      const id = 'c' + Date.now()
      setConversations(prev => [{ id, title: text.slice(0, 32) }, ...prev])
      setActiveId(id)
    }
    setTimeout(() => {
      setThinking(false)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          prose: window.CANNED_ANSWER.prose,
          table: { columns: window.CANNED_ANSWER.columns, rows: window.CANNED_ANSWER.rows },
          followUps: window.CANNED_ANSWER.followUps,
        },
      ])
    }, 1600)
  }

  const newChat = () => {
    setMessages([])
    setThinking(false)
    setActiveId(null)
  }

  return (
    <div className="app-shell">
      <window.AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        onNewChat={newChat}
        conversations={conversations}
        activeId={activeId}
        onSelect={id => setActiveId(id)}
      />
      <main className="app-main">
        <window.ChatScreen messages={messages} thinking={thinking} onSend={send} />
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<SentrumApp />)
