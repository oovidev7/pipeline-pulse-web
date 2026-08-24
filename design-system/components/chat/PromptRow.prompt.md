Suggested-prompt row from the chat welcome screen — fills the composer rather than sending directly.

```jsx
<PromptRow
  category="Squad planning"
  text="Which of our contracts expire in the next 12 months?"
  onClick={fillComposer}
/>
```

On hover the sparkles chip inverts to slate-800. Stack rows in a `display:grid; gap:8px` column under a "For you, this week" microlabel.
