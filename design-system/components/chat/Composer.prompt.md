The chat input card — elevated, rounded-2xl, hover/focus lifts to the floating shadow, slate-600 Send button bottom-right.

```jsx
<Composer onSend={msg => sendMessage(msg)} autoFocus />
```

Auto-grows to 200px; Enter sends, Shift+Enter adds a newline; Send disables while empty. Keep it inside a max-width 768px column.
