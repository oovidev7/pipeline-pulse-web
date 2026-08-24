/* @ds-bundle: {"format":3,"namespace":"SentrumDesignSystem_fd9502","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"SentrumAttribution","sourcePath":"components/brand/SentrumAttribution.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Composer","sourcePath":"components/chat/Composer.jsx"},{"name":"FollowUpChips","sourcePath":"components/chat/FollowUpChips.jsx"},{"name":"PromptRow","sourcePath":"components/chat/PromptRow.jsx"},{"name":"TypingIndicator","sourcePath":"components/chat/TypingIndicator.jsx"},{"name":"UserMessage","sourcePath":"components/chat/UserMessage.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Skeleton","sourcePath":"components/display/Skeleton.jsx"},{"name":"Tabs","sourcePath":"components/display/Tabs.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Label","sourcePath":"components/forms/Label.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"SidebarNavItem","sourcePath":"components/navigation/SidebarNavItem.jsx"},{"name":"SidebarSection","sourcePath":"components/navigation/SidebarSection.jsx"},{"name":"Eyebrow","sourcePath":"components/profile/Eyebrow.jsx"},{"name":"PercentileBar","sourcePath":"components/profile/PercentileBar.jsx"},{"name":"Pitch","sourcePath":"components/profile/Pitch.jsx"},{"name":"StatCard","sourcePath":"components/profile/StatCard.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"5c21a30895cf","components/brand/SentrumAttribution.jsx":"b1c78d955384","components/buttons/Button.jsx":"5423cf35f3b6","components/chat/Composer.jsx":"48e0542e0211","components/chat/FollowUpChips.jsx":"4c731b97f7a1","components/chat/PromptRow.jsx":"93dd31778272","components/chat/TypingIndicator.jsx":"7df681e9b116","components/chat/UserMessage.jsx":"43cfaaa09fb4","components/data/DataTable.jsx":"78a6cd6c5015","components/display/Avatar.jsx":"8d0850bcd8be","components/display/Badge.jsx":"58d172df5aee","components/display/Card.jsx":"a0dfdad903b1","components/display/Skeleton.jsx":"a555608e2be3","components/display/Tabs.jsx":"c54d908de7af","components/forms/Input.jsx":"078747c74b43","components/forms/Label.jsx":"10da1517ca68","components/forms/Switch.jsx":"2af5b9f25b10","components/forms/Textarea.jsx":"d12c591f0e98","components/navigation/SidebarNavItem.jsx":"fab6893072d2","components/navigation/SidebarSection.jsx":"1cce201192b4","components/profile/Eyebrow.jsx":"07922df54c54","components/profile/PercentileBar.jsx":"2c41436103ff","components/profile/Pitch.jsx":"c9b1908ddffc","components/profile/StatCard.jsx":"e61a68cd2b7b","ui_kits/sentrum_app/AppSidebar.jsx":"b4df8216cb10","ui_kits/sentrum_app/ChatScreen.jsx":"b72212169d0a","ui_kits/sentrum_app/app.jsx":"288c2d46e212","ui_kits/sentrum_player_profile/CareerTab.jsx":"eca8c6ecccef","ui_kits/sentrum_player_profile/OverviewTab.jsx":"754628a5ad49","ui_kits/sentrum_player_profile/PerformanceTab.jsx":"45a97fc4cdaf","ui_kits/sentrum_player_profile/PlayerHero.jsx":"e99b81a5ffe5","ui_kits/sentrum_player_profile/app.jsx":"301fff8f6bcc","ui_kits/sentrum_team_profile/OverviewCards.jsx":"5a1ca5f1dd6a","ui_kits/sentrum_team_profile/OverviewCards2.jsx":"381cf61209e5","ui_kits/sentrum_team_profile/SquadAndTable.jsx":"9577b5d4b449","ui_kits/sentrum_team_profile/TeamHeader.jsx":"f2e4494d4a35","ui_kits/sentrum_team_profile/app.jsx":"acf91ceae375"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SentrumDesignSystem_fd9502 = window.SentrumDesignSystem_fd9502 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
const ICON_SIZES = {
  xs: 12,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48
};
const TEXT_SIZES = {
  xs: 12,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 30
};
function IconMark({
  px,
  color
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 123 90",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      width: px,
      height: px * (90 / 123),
      display: 'block'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8.89046 72.4424C4.32273 72.4424 0.557129 76.208 0.557129 80.7757C0.557129 85.3435 4.32273 89.1091 8.89046 89.1091C13.4582 89.1091 17.2238 85.3435 17.2238 80.7757C17.2238 76.208 13.4582 72.4424 8.89046 72.4424Z",
    fill: color
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M114.443 0.223633C109.875 0.223633 106.109 3.98923 106.109 8.55697C106.109 13.1247 109.875 16.8903 114.443 16.8903C119.01 16.8903 122.776 13.1247 122.776 8.55697C122.776 3.98923 119.01 0.223633 114.443 0.223633Z",
    fill: color
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M29.7237 0.223633C15.229 0.223633 3.33301 12.1195 3.33301 26.6143C3.33301 41.109 15.2289 53.005 29.7237 53.005H93.6143C99.1143 53.005 103.338 57.229 103.338 62.729C103.338 68.229 99.1143 72.453 93.6143 72.453L28.333 72.4425C23.7653 72.4425 19.9997 76.2081 19.9997 80.7759C19.9997 85.3436 23.7653 89.1092 28.333 89.1092H93.609C108.104 89.1092 120 77.2134 120 62.7186C120 48.2239 108.104 36.3279 93.609 36.3279H29.7183C24.2183 36.3279 19.9943 32.1039 19.9943 26.6039C19.9943 21.1039 24.2183 16.8799 29.7183 16.8799L94.9997 16.8903C99.5674 16.8903 103.333 13.1247 103.333 8.55697C103.333 3.98923 99.5674 0.223633 94.9997 0.223633H29.7237Z",
    fill: color
  }));
}

/**
 * Sentrum logo — stylized "S" mark plus lowercase "sentrum" wordmark (Outfit medium).
 */
function Logo({
  variant = 'full',
  size = 'md',
  theme = 'light',
  className,
  style
}) {
  const color = theme === 'dark' ? '#ffffff' : 'var(--slate-900, #0f172a)';
  const iconPx = ICON_SIZES[size] || ICON_SIZES.md;
  const textPx = TEXT_SIZES[size] || TEXT_SIZES.md;
  const wordmark = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      letterSpacing: '-0.025em',
      fontSize: textPx,
      color,
      lineHeight: 1
    }
  }, "sentrum");
  if (variant === 'icon') {
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      style: style
    }, /*#__PURE__*/React.createElement(IconMark, {
      px: iconPx,
      color: color
    }));
  }
  if (variant === 'wordmark') {
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      style: style
    }, wordmark);
  }
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement(IconMark, {
    px: iconPx,
    color: color
  }), wordmark);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/SentrumAttribution.jsx
try { (() => {
/**
 * "Powered by Sentrum" attribution row — sits at the bottom of tenant-branded
 * chrome at reduced opacity so it never competes with the tenant's own brand.
 */
function SentrumAttribution({
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '4px 16px 12px',
      opacity: 0.5,
      transition: 'opacity 0.2s ease',
      ...style
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '0.9',
    onMouseLeave: e => e.currentTarget.style.opacity = '0.5'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--slate-500)'
    }
  }, "powered by"), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "icon",
    size: "xs"
  }), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "wordmark",
    size: "xs"
  }));
}
Object.assign(__ds_scope, { SentrumAttribution });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SentrumAttribution.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sentrum button — shadcn-derived. Primary is near-black stone; `accent` is the
 * slate-600 used for the chat Send CTA.
 */
function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}) {
  const cls = ['snt-btn', `snt-btn--${variant}`, size !== 'default' ? `snt-btn--${size}` : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls
  }, props), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/chat/Composer.jsx
try { (() => {
const SendIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m21.854 2.147-10.94 10.939"
}));

/**
 * Chat composer — the rounded-2xl elevated input card with the slate Send CTA.
 * Submits on Enter (Shift+Enter for newline).
 */
function Composer({
  placeholder = 'Ask anything about your football data…',
  onSend,
  autoFocus = false,
  className = '',
  style
}) {
  const [value, setValue] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + 'px';
    }
  }, [value]);
  const submit = () => {
    if (!value.trim()) return;
    if (onSend) onSend(value.trim());
    setValue('');
  };
  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `snt-composer ${className}`,
    style: style
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: ref,
    rows: 2,
    value: value,
    autoFocus: autoFocus,
    placeholder: placeholder,
    onChange: e => setValue(e.target.value),
    onKeyDown: onKeyDown
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "snt-btn snt-btn--accent",
    disabled: !value.trim(),
    onClick: submit
  }, /*#__PURE__*/React.createElement(SendIcon, null), "Send")));
}
Object.assign(__ds_scope, { Composer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/Composer.jsx", error: String((e && e.message) || e) }); }

// components/chat/FollowUpChips.jsx
try { (() => {
const CornerIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "m15 10 5 5-5 5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 4v7a4 4 0 0 0 4 4h12"
}));

/**
 * "Keep exploring" follow-up suggestion chips, shown under assistant replies.
 */
function FollowUpChips({
  suggestions,
  onSelect,
  label = 'Keep exploring',
  className = '',
  style
}) {
  if (!suggestions || suggestions.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      borderTop: '1px solid var(--surface-inset)',
      paddingTop: 16,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "snt-microlabel",
    style: {
      color: 'var(--text-faint)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, suggestions.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "snt-chip",
    onClick: onSelect ? () => onSelect(s.query || s.label) : undefined
  }, /*#__PURE__*/React.createElement(CornerIcon, null), s.label))));
}
Object.assign(__ds_scope, { FollowUpChips });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/FollowUpChips.jsx", error: String((e && e.message) || e) }); }

// components/chat/PromptRow.jsx
try { (() => {
const SparklesIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M20 3v4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M22 5h-4"
}));
const ArrowRightIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14"
}), /*#__PURE__*/React.createElement("path", {
  d: "m12 5 7 7-7 7"
}));

/**
 * Recommended-prompt row from the chat welcome screen ("For you, this week").
 * Sparkles icon chip, uppercase category, prompt text, "Edit & ask" CTA.
 */
function PromptRow({
  category,
  text,
  onClick,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `snt-prompt-row ${className}`,
    style: style,
    onClick: onClick ? () => onClick(text) : undefined,
    "aria-label": `Edit and ask: ${text}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "snt-prompt-row__icon"
  }, /*#__PURE__*/React.createElement(SparklesIcon, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, category && /*#__PURE__*/React.createElement("span", {
    className: "snt-microlabel",
    style: {
      display: 'block'
    }
  }, category), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 4,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-body)'
    }
  }, text)), /*#__PURE__*/React.createElement("span", {
    className: "snt-prompt-row__cta"
  }, "Edit & ask", /*#__PURE__*/React.createElement(ArrowRightIcon, null)));
}
Object.assign(__ds_scope, { PromptRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/PromptRow.jsx", error: String((e && e.message) || e) }); }

// components/chat/TypingIndicator.jsx
try { (() => {
/**
 * Typing indicator — the Sentrum "S" mark pulsing in slate-500 with a soft
 * glow, shown while the assistant is thinking. CSS recreation of the app's
 * framer-motion AnimatedLogo.
 */
function TypingIndicator({
  size = 32,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      position: 'relative',
      width: size,
      height: size,
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes snt-typing-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes snt-typing-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes snt-typing-part {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .snt-typing * { animation: none !important; opacity: 1 !important; }
        }
      `), /*#__PURE__*/React.createElement("div", {
    className: "snt-typing",
    style: {
      width: '100%',
      height: '100%',
      animation: 'snt-typing-scale 2s ease-in-out infinite'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: 'rgb(100 116 139 / 0.2)',
      filter: 'blur(6px)',
      animation: 'snt-typing-glow 2s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 123 90",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      position: 'relative',
      width: '100%',
      height: '100%'
    },
    "aria-label": "Sentrum is thinking"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8.89046 72.4424C4.32273 72.4424 0.557129 76.208 0.557129 80.7757C0.557129 85.3435 4.32273 89.1091 8.89046 89.1091C13.4582 89.1091 17.2238 85.3435 17.2238 80.7757C17.2238 76.208 13.4582 72.4424 8.89046 72.4424Z",
    fill: "var(--slate-500)",
    style: {
      animation: 'snt-typing-part 2s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M114.443 0.223633C109.875 0.223633 106.109 3.98923 106.109 8.55697C106.109 13.1247 109.875 16.8903 114.443 16.8903C119.01 16.8903 122.776 13.1247 122.776 8.55697C122.776 3.98923 119.01 0.223633 114.443 0.223633Z",
    fill: "var(--slate-500)",
    style: {
      animation: 'snt-typing-part 2s ease-in-out 0.2s infinite'
    }
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M29.7237 0.223633C15.229 0.223633 3.33301 12.1195 3.33301 26.6143C3.33301 41.109 15.2289 53.005 29.7237 53.005H93.6143C99.1143 53.005 103.338 57.229 103.338 62.729C103.338 68.229 99.1143 72.453 93.6143 72.453L28.333 72.4425C23.7653 72.4425 19.9997 76.2081 19.9997 80.7759C19.9997 85.3436 23.7653 89.1092 28.333 89.1092H93.609C108.104 89.1092 120 77.2134 120 62.7186C120 48.2239 108.104 36.3279 93.609 36.3279H29.7183C24.2183 36.3279 19.9943 32.1039 19.9943 26.6039C19.9943 21.1039 24.2183 16.8799 29.7183 16.8799L94.9997 16.8903C99.5674 16.8903 103.333 13.1247 103.333 8.55697C103.333 3.98923 99.5674 0.223633 94.9997 0.223633H29.7237Z",
    fill: "var(--slate-500)",
    style: {
      animation: 'snt-typing-part 2s ease-in-out 0.4s infinite'
    }
  }))));
}
Object.assign(__ds_scope, { TypingIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/TypingIndicator.jsx", error: String((e && e.message) || e) }); }

// components/chat/UserMessage.jsx
try { (() => {
const UserIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    width: 16,
    height: 16
  },
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "7",
  r: "4"
}));

/**
 * User chat message — gray bubble with the avatar inside. Assistant replies
 * render as plain prose with no bubble; only user messages get this container.
 */
function UserMessage({
  children,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `snt-user-bubble ${className}`,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "snt-avatar"
  }, /*#__PURE__*/React.createElement(UserIcon, null)), /*#__PURE__*/React.createElement("p", null, children));
}
Object.assign(__ds_scope, { UserMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/UserMessage.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
/**
 * Data table — uppercase micro-label headers, tabular numerals, optional
 * clickable rows. The standard rendering for query results in chat.
 */
function DataTable({
  columns,
  rows,
  onRowClick,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("table", {
    className: `snt-table ${onRowClick ? 'snt-table--clickable' : ''} ${className}`,
    style: style
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(col => /*#__PURE__*/React.createElement("th", {
    key: col.key,
    style: col.align === 'right' ? {
      textAlign: 'right'
    } : undefined
  }, col.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    onClick: onRowClick ? () => onRowClick(row, i) : undefined
  }, columns.map(col => /*#__PURE__*/React.createElement("td", {
    key: col.key,
    className: col.numeric ? 'snt-num' : undefined,
    style: col.align === 'right' ? {
      textAlign: 'right'
    } : undefined
  }, row[col.key]))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
/** Avatar — image or initials fallback in a gray circle. */
function Avatar({
  src,
  alt = '',
  fallback,
  size = 32,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `snt-avatar ${className}`,
    style: {
      width: size,
      height: size,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt
  }) : /*#__PURE__*/React.createElement("span", null, fallback));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Compact status badge. */
function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `snt-badge snt-badge--${variant} ${className}`
  }, props), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
/**
 * Sentrum card — rounded-xl bordered surface with header/content/footer slots.
 */
function Card({
  title,
  description,
  footer,
  children,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `snt-card ${className}`,
    style: style
  }, (title || description) && /*#__PURE__*/React.createElement("div", {
    className: "snt-card__header"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "snt-card__title"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "snt-card__desc"
  }, description)), children && /*#__PURE__*/React.createElement("div", {
    className: "snt-card__content"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "snt-card__footer"
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Skeleton.jsx
try { (() => {
/** Loading skeleton — pulsing muted block. Size with style/className. */
function Skeleton({
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `snt-skeleton ${className}`,
    style: style
  });
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/display/Tabs.jsx
try { (() => {
/**
 * Tabs — muted pill list with white active segment (controlled or uncontrolled).
 */
function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className = '',
  style
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].value));
  const active = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    if (onValueChange) onValueChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `snt-tabs__list ${className}`,
    style: style,
    role: "tablist"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.value,
    type: "button",
    role: "tab",
    "aria-selected": active === t.value,
    className: "snt-tabs__trigger",
    "data-active": active === t.value ? 'true' : 'false',
    onClick: () => select(t.value)
  }, t.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Sentrum text input — 36px, subtle border, ring focus. */
function Input({
  className = '',
  ...props
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: `snt-input ${className}`
  }, props));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Label.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Form field label — 14px medium. */
function Label({
  children,
  className = '',
  ...props
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    className: `snt-label ${className}`
  }, props), children);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Label.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toggle switch (controlled or uncontrolled). 32×18px pill; primary fill when on.
 */
function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ...props
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    if (onCheckedChange) onCheckedChange(!on);
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": on,
    className: "snt-switch",
    "data-checked": on ? 'true' : 'false',
    onClick: toggle,
    disabled: disabled,
    style: disabled ? {
      opacity: 0.5,
      cursor: 'not-allowed'
    } : undefined
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "snt-switch__thumb"
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Sentrum multi-line textarea. */
function Textarea({
  className = '',
  ...props
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: `snt-textarea ${className}`
  }, props));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNavItem.jsx
try { (() => {
/**
 * Sidebar navigation row — small icon + 14px label; gray pill when active.
 */
function SidebarNavItem({
  icon,
  label,
  active = false,
  onClick,
  href,
  className = '',
  style
}) {
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, {
    type: href ? undefined : 'button',
    href: href,
    className: `snt-nav-item ${className}`,
    "data-active": active ? 'true' : 'false',
    onClick: onClick,
    style: style
  }, icon, label);
}
Object.assign(__ds_scope, { SidebarNavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNavItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarSection.jsx
try { (() => {
const ChevronIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "snt-nav-section__chevron",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "m9 18 6-6-6-6"
}));

/**
 * Collapsible sidebar section — header row (icon + title + chevron) that
 * toggles a list of SidebarNavItems.
 */
function SidebarSection({
  icon,
  title,
  defaultOpen = true,
  children,
  className = '',
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "snt-nav-section",
    "data-open": open ? 'true' : 'false',
    onClick: () => setOpen(!open)
  }, icon, title, /*#__PURE__*/React.createElement(ChevronIcon, null)), open && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      paddingLeft: 8
    }
  }, children));
}
Object.assign(__ds_scope, { SidebarSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarSection.jsx", error: String((e && e.message) || e) }); }

// components/profile/Eyebrow.jsx
try { (() => {
/**
 * Eyebrow — mono, uppercase, heavy-tracked section label with an optional
 * emerald dot. Marks every section of the v2 player profile.
 */
function Eyebrow({
  children,
  dot = true,
  size = 'default',
  className,
  style
}) {
  const sm = size === 'sm';
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      textTransform: 'uppercase',
      color: 'var(--zinc-500)',
      fontSize: sm ? 9 : 10,
      letterSpacing: sm ? '0.18em' : '0.22em',
      lineHeight: 1.4,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'var(--emerald-500)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/profile/PercentileBar.jsx
try { (() => {
function tierColor(percentile) {
  if (percentile >= 90) return 'var(--tier-elite)';
  if (percentile >= 75) return 'var(--tier-above-avg)';
  if (percentile >= 50) return 'var(--tier-average)';
  if (percentile >= 25) return 'var(--tier-below-avg)';
  return 'var(--tier-low)';
}

/**
 * PercentileBar — thin tier-colored bar; width = clamped percentile,
 * color = tier (≥90 elite green … <25 red).
 */
function PercentileBar({
  percentile,
  className,
  style
}) {
  const clamped = Math.max(0, Math.min(100, percentile));
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      height: 4,
      width: '100%',
      overflow: 'hidden',
      borderRadius: 2,
      background: 'var(--zinc-100)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      borderRadius: 2,
      width: `${clamped}%`,
      background: tierColor(clamped)
    }
  }));
}
Object.assign(__ds_scope, { PercentileBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/PercentileBar.jsx", error: String((e && e.message) || e) }); }

// components/profile/Pitch.jsx
try { (() => {
// Coordinates in 220 × 130 viewBox, attacking-right convention.
const POSITION_COORDS = {
  GK: {
    x: 14,
    y: 65
  },
  LB: {
    x: 38,
    y: 28
  },
  CB: {
    x: 38,
    y: 65
  },
  RB: {
    x: 38,
    y: 102
  },
  LM: {
    x: 75,
    y: 28
  },
  CM: {
    x: 75,
    y: 65
  },
  RM: {
    x: 75,
    y: 102
  },
  AM: {
    x: 110,
    y: 65
  },
  LW: {
    x: 152,
    y: 22
  },
  ST: {
    x: 175,
    y: 65
  },
  RW: {
    x: 152,
    y: 108
  }
};
function dotRadius(percentage) {
  const pct = Math.max(0, Math.min(100, percentage == null ? 33 : percentage));
  return 4 + Math.sqrt(pct / 100) * 12;
}

/**
 * Pitch — compact position visualisation from the player profile hero.
 * Navy striped field, white hairline markings, emerald dots sized by
 * share of minutes; the primary position gets a halo + direction arrow.
 */
function Pitch({
  width = 220,
  primary,
  dots = [],
  attacking = 'right',
  rounded = 4,
  className,
  ariaLabel
}) {
  const height = Math.round(width * 130 / 220);
  const mirrorX = x => attacking === 'right' ? x : 220 - x;
  const glowId = `pitch-glow-${primary || 'none'}-${attacking}`;
  const primaryCoords = primary ? POSITION_COORDS[primary] : null;
  const primaryDot = primary ? dots.find(d => d.position === primary) : null;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 220 130",
    width: width,
    height: height,
    role: ariaLabel ? 'img' : undefined,
    "aria-label": ariaLabel,
    "aria-hidden": ariaLabel ? undefined : true,
    className: className,
    style: {
      borderRadius: rounded,
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: glowId
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#10b981",
    stopOpacity: "0.6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#10b981",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "220",
    height: "130",
    fill: "#1e3a5f"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.06"
  }, Array.from({
    length: 10
  }).map((_, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: i * 22,
    y: 0,
    width: 11,
    height: 130,
    fill: "white"
  }))), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(255,255,255,0.78)",
    strokeWidth: "1",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "219",
    height: "129"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "110",
    y1: "0",
    x2: "110",
    y2: "130"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "65",
    r: "14"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "65",
    r: "0.9",
    fill: "rgba(255,255,255,0.78)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "26",
    width: "34",
    height: "78"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "47",
    width: "12",
    height: "36"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "186",
    y: "26",
    width: "34",
    height: "78"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "208",
    y: "47",
    width: "12",
    height: "36"
  })), primaryCoords && /*#__PURE__*/React.createElement("circle", {
    cx: mirrorX(primaryCoords.x),
    cy: primaryCoords.y,
    r: dotRadius(primaryDot ? primaryDot.percentage : undefined) + 10,
    fill: `url(#${glowId})`
  }), dots.map(dot => {
    const coords = POSITION_COORDS[dot.position];
    if (!coords) return null;
    const isPrimary = dot.position === primary;
    return /*#__PURE__*/React.createElement("circle", {
      key: `dot-${dot.position}`,
      cx: mirrorX(coords.x),
      cy: coords.y,
      r: dotRadius(dot.percentage),
      fill: "#10b981",
      stroke: isPrimary ? 'white' : 'rgba(255,255,255,0.55)',
      strokeWidth: isPrimary ? 1.6 : 0.9
    });
  }), primaryCoords && (() => {
    const r = dotRadius(primaryDot ? primaryDot.percentage : undefined);
    const x = mirrorX(primaryCoords.x);
    const y = primaryCoords.y;
    const dir = attacking === 'right' ? 1 : -1;
    const stemStart = x + dir * (r + 3);
    const stemEnd = stemStart + dir * 13;
    const headBack = stemEnd - dir * 3;
    return /*#__PURE__*/React.createElement("g", {
      stroke: "rgba(255,255,255,0.7)",
      strokeWidth: "1",
      fill: "none",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("line", {
      x1: stemStart,
      y1: y,
      x2: stemEnd,
      y2: y
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${headBack} ${y - 3} L ${stemEnd} ${y} L ${headBack} ${y + 3}`
    }));
  })());
}
Object.assign(__ds_scope, { Pitch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/Pitch.jsx", error: String((e && e.message) || e) }); }

// components/profile/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatCard — plain bordered card primitive from the v2 player profile.
 * No decorative chrome; hover lifts the border color.
 */
function StatCard({
  children,
  emphasis = false,
  className,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const border = hover ? 'var(--zinc-400)' : emphasis ? 'var(--zinc-300)' : 'var(--zinc-200)';
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 8,
      border: `1px solid ${border}`,
      background: '#fff',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/StatCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_app/AppSidebar.jsx
try { (() => {
// Sentrum app sidebar — recreation of components/chat/sidebar/ChatSidebar.tsx
const {
  Logo,
  SentrumAttribution,
  SidebarSection,
  SidebarNavItem
} = window.SentrumDesignSystem_fd9502;

// Lucide icon helper (icons render via lucide.createIcons on an effect)
function LIcon({
  name,
  size = 14
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      window.lucide.createIcons({
        root: ref.current.parentElement || undefined
      });
    }
  });
  return /*#__PURE__*/React.createElement("i", {
    ref: ref,
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      flexShrink: 0
    }
  });
}
function AppSidebar({
  collapsed,
  onToggle,
  onNewChat,
  conversations,
  activeId,
  onSelect
}) {
  if (collapsed) {
    return /*#__PURE__*/React.createElement("aside", {
      className: "app-sidebar app-sidebar--collapsed"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 8px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      title: "Expand sidebar",
      onClick: onToggle
    }, /*#__PURE__*/React.createElement(LIcon, {
      name: "panel-left-open",
      size: 16
    }))), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn icon-btn--wide",
      title: "New chat",
      onClick: onNewChat
    }, /*#__PURE__*/React.createElement(LIcon, {
      name: "square-pen",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      className: "collapsed-icons"
    }, /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      title: "My Dashboard"
    }, /*#__PURE__*/React.createElement(LIcon, {
      name: "layout-dashboard",
      size: 20
    })), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      title: "My Club(s)"
    }, /*#__PURE__*/React.createElement(LIcon, {
      name: "shield",
      size: 20
    })), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      title: "Scouting"
    }, /*#__PURE__*/React.createElement(LIcon, {
      name: "clipboard-list",
      size: 20
    })), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      title: "Recruitment"
    }, /*#__PURE__*/React.createElement(LIcon, {
      name: "crosshair",
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 10,
        opacity: 0.4
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      variant: "icon",
      size: "xs"
    })));
  }
  return /*#__PURE__*/React.createElement("aside", {
    className: "app-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: "brand-btn",
    title: "New chat",
    onClick: onNewChat
  }, /*#__PURE__*/React.createElement(Logo, {
    size: "md"
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    title: "Collapse sidebar",
    onClick: onToggle
  }, /*#__PURE__*/React.createElement(LIcon, {
    name: "panel-left-close",
    size: 16
  }))), /*#__PURE__*/React.createElement("button", {
    className: "new-chat-btn",
    onClick: onNewChat
  }, /*#__PURE__*/React.createElement(LIcon, {
    name: "square-pen",
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, "New chat")), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-scroll"
  }, /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "layout-dashboard"
    }),
    label: "My Dashboard",
    style: {
      padding: '8px'
    }
  }), /*#__PURE__*/React.createElement(SidebarSection, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "shield",
      size: 16
    }),
    title: "My Club(s)",
    defaultOpen: false
  }, /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "users"
    }),
    label: "Squad"
  }), /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "calendar-clock"
    }),
    label: "Fixtures"
  })), /*#__PURE__*/React.createElement(SidebarSection, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "clipboard-list",
      size: 16
    }),
    title: "Scouting",
    defaultOpen: false
  }, /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "file-text"
    }),
    label: "Reports"
  }), /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "file-plus"
    }),
    label: "New Report"
  })), /*#__PURE__*/React.createElement(SidebarSection, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "crosshair",
      size: 16
    }),
    title: "Recruitment",
    defaultOpen: false
  }, /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "layout-grid"
    }),
    label: "Board"
  }), /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "list"
    }),
    label: "Short Lists"
  })), /*#__PURE__*/React.createElement(SidebarSection, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "users",
      size: 16
    }),
    title: "Shadow Teams",
    defaultOpen: false
  }, /*#__PURE__*/React.createElement(SidebarNavItem, {
    icon: /*#__PURE__*/React.createElement(LIcon, {
      name: "shield"
    }),
    label: "All Teams"
  })), conversations.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "snt-microlabel",
    style: {
      padding: '0 8px',
      marginBottom: 6
    }
  }, "Recent"), conversations.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: "snt-nav-item",
    "data-active": c.id === activeId ? 'true' : 'false',
    onClick: () => onSelect(c.id),
    style: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'left'
    }
  }, c.title)))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "snt-avatar",
    style: {
      width: 28,
      height: 28,
      fontSize: 11
    }
  }, "AK"), /*#__PURE__*/React.createElement("span", {
    className: "user-email"
  }, "anna@club.com")), /*#__PURE__*/React.createElement(SentrumAttribution, null)));
}
Object.assign(window, {
  AppSidebar,
  LIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_app/AppSidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_app/ChatScreen.jsx
try { (() => {
// Sentrum chat surface — welcome screen + conversation flow
// Recreation of components/chat/welcome/WelcomeScreen.tsx and components/chat/Message.tsx
const {
  Logo,
  Composer,
  PromptRow,
  UserMessage,
  FollowUpChips,
  TypingIndicator,
  DataTable
} = window.SentrumDesignSystem_fd9502;
const FEATURED_PROMPTS = [{
  category: 'Squad planning',
  text: 'Which of our contracts expire in the next 12 months?'
}, {
  category: 'Recruitment',
  text: 'Top U21 strikers by goals per 90 in the Eredivisie this season'
}, {
  category: 'Performance',
  text: 'How does our pressing intensity compare with the league average?'
}];
const CANNED_ANSWER = {
  prose: 'Here are the top U21 strikers in the Eredivisie by goals per 90 this season (minimum 900 minutes played). I filtered to players born after June 2004 and ranked by non-penalty goals per 90.',
  columns: [{
    key: 'player',
    label: 'Player'
  }, {
    key: 'club',
    label: 'Club'
  }, {
    key: 'age',
    label: 'Age',
    numeric: true,
    align: 'right'
  }, {
    key: 'mins',
    label: 'Mins',
    numeric: true,
    align: 'right'
  }, {
    key: 'g90',
    label: 'Goals/90',
    numeric: true,
    align: 'right'
  }],
  rows: [{
    player: 'J. van den Berg',
    club: 'Feyenoord',
    age: 19,
    mins: '1,840',
    g90: '0.68'
  }, {
    player: 'M. Okafor',
    club: 'AZ Alkmaar',
    age: 20,
    mins: '2,210',
    g90: '0.61'
  }, {
    player: 'T. Lindqvist',
    club: 'FC Twente',
    age: 20,
    mins: '1,560',
    g90: '0.52'
  }, {
    player: 'D. Carvalho',
    club: 'PSV',
    age: 19,
    mins: '1,120',
    g90: '0.48'
  }],
  followUps: [{
    label: 'Only left-footed players'
  }, {
    label: 'Add expected goals'
  }, {
    label: 'Compare with Belgian Pro League'
  }]
};
function WelcomeView({
  onSend,
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "welcome"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-fade"
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "icon",
    size: "lg"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "snt-display welcome-fade",
    style: {
      fontSize: 36,
      margin: '16px 0 8px'
    }
  }, "What's new, Anna?"), /*#__PURE__*/React.createElement("p", {
    className: "welcome-sub welcome-fade"
  }, "Ask anything, or pick one of today's starting points."), /*#__PURE__*/React.createElement("div", {
    className: "welcome-col welcome-fade"
  }, /*#__PURE__*/React.createElement(Composer, {
    onSend: onSend,
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "welcome-col",
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "snt-microlabel welcome-fade",
    style: {
      marginBottom: 12
    }
  }, "For you, this week"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, FEATURED_PROMPTS.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "welcome-fade"
  }, /*#__PURE__*/React.createElement(PromptRow, {
    category: p.category,
    text: p.text,
    onClick: onPick
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "welcome-disclaimer"
  }, "Sentrum can make mistakes. Check important info."));
}
function ConversationView({
  messages,
  thinking,
  onSend
}) {
  const endRef = React.useRef(null);
  React.useEffect(() => {
    const el = endRef.current;
    if (el && el.parentElement) {
      const scroller = el.closest('.chat-scroll');
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }
  }, [messages, thinking]);
  return /*#__PURE__*/React.createElement("div", {
    className: "conversation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-col"
  }, messages.map((m, i) => m.role === 'user' ? /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(UserMessage, null, m.text)) : /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "assistant-msg",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "assistant-prose"
  }, m.prose), m.table && /*#__PURE__*/React.createElement("div", {
    className: "table-shell"
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: m.table.columns,
    rows: m.table.rows,
    onRowClick: () => {}
  })), m.followUps && /*#__PURE__*/React.createElement(FollowUpChips, {
    suggestions: m.followUps,
    onSelect: q => onSend(q)
  }))), thinking && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(TypingIndicator, null)), /*#__PURE__*/React.createElement("div", {
    ref: endRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: "composer-dock"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-col"
  }, /*#__PURE__*/React.createElement(Composer, {
    onSend: onSend
  }))));
}
function ChatScreen({
  messages,
  thinking,
  onSend
}) {
  if (messages.length === 0) {
    return /*#__PURE__*/React.createElement(WelcomeView, {
      onSend: onSend,
      onPick: onSend
    });
  }
  return /*#__PURE__*/React.createElement(ConversationView, {
    messages: messages,
    thinking: thinking,
    onSend: onSend
  });
}
Object.assign(window, {
  ChatScreen,
  CANNED_ANSWER
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_app/ChatScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_app/app.jsx
try { (() => {
// Sentrum app root — shell layout + fake chat state machine
function SentrumApp() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [thinking, setThinking] = React.useState(false);
  const [conversations, setConversations] = React.useState([{
    id: 'c1',
    title: 'Contract expiries 2026'
  }, {
    id: 'c2',
    title: 'Eredivisie U21 strikers'
  }]);
  const [activeId, setActiveId] = React.useState(null);
  const send = text => {
    setMessages(prev => [...prev, {
      role: 'user',
      text
    }]);
    setThinking(true);
    if (messages.length === 0) {
      const id = 'c' + Date.now();
      setConversations(prev => [{
        id,
        title: text.slice(0, 32)
      }, ...prev]);
      setActiveId(id);
    }
    setTimeout(() => {
      setThinking(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        prose: window.CANNED_ANSWER.prose,
        table: {
          columns: window.CANNED_ANSWER.columns,
          rows: window.CANNED_ANSWER.rows
        },
        followUps: window.CANNED_ANSWER.followUps
      }]);
    }, 1600);
  };
  const newChat = () => {
    setMessages([]);
    setThinking(false);
    setActiveId(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(window.AppSidebar, {
    collapsed: collapsed,
    onToggle: () => setCollapsed(c => !c),
    onNewChat: newChat,
    conversations: conversations,
    activeId: activeId,
    onSelect: id => setActiveId(id)
  }), /*#__PURE__*/React.createElement("main", {
    className: "app-main"
  }, /*#__PURE__*/React.createElement(window.ChatScreen, {
    messages: messages,
    thinking: thinking,
    onSend: send
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(SentrumApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_player_profile/CareerTab.jsx
try { (() => {
// Career tab — recreation of player-v2/tabs/CareerTab.tsx
// Totals strip · club timeline · season-by-season · market value · injuries.
const {
  Eyebrow: CrEyebrow,
  StatCard: CrStatCard
} = window.SentrumDesignSystem_fd9502;
const crMono = (size, color = 'var(--zinc-700)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra
});
const crTh = right => ({
  ...crMono(9, 'var(--zinc-500)', {
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase'
  }),
  textAlign: right ? 'right' : 'left'
});
const crOutfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra
});
function crBadge(kind) {
  const styles = {
    emerald: {
      border: '1px solid #a7f3d0',
      background: 'var(--emerald-50)',
      color: 'var(--emerald-700)'
    },
    amber: {
      border: '1px solid #fde68a',
      background: '#fffbeb',
      color: '#b45309'
    }
  };
  return {
    borderRadius: 2,
    padding: '2px 6px',
    ...crMono(9, undefined, {
      fontWeight: 600
    }),
    ...styles[kind]
  };
}
function availabilityTier(pct) {
  if (pct >= 90) return {
    text: 'var(--emerald-600)',
    bar: 'var(--emerald-500)'
  };
  if (pct >= 75) return {
    text: 'var(--emerald-700)',
    bar: 'var(--emerald-400)'
  };
  if (pct >= 60) return {
    text: '#d97706',
    bar: '#fbbf24'
  };
  return {
    text: '#dc2626',
    bar: '#f87171'
  };
}

/* ---- Totals strip ---- */
function CareerTotals({
  totals
}) {
  const cards = [{
    label: 'Career apps',
    value: totals.apps,
    caption: 'all comps'
  }, {
    label: 'Minutes',
    value: totals.minutes,
    caption: totals.minPerApp + ' / app'
  }, {
    label: 'Goals',
    value: totals.goals,
    caption: totals.goalsPer90 + ' / 90'
  }, {
    label: 'Assists',
    value: totals.assists,
    caption: totals.assistsPer90 + ' / 90'
  }, {
    label: 'Clubs',
    value: totals.clubs,
    caption: '+ ' + totals.youthClubs + ' youth'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 8
    }
  }, cards.map(c => /*#__PURE__*/React.createElement(CrStatCard, {
    key: c.label,
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement(CrEyebrow, {
    size: "sm",
    dot: false
  }, c.label), /*#__PURE__*/React.createElement("div", {
    style: crOutfit(24, {
      marginTop: 4
    })
  }, c.value), c.caption && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 11,
      color: 'var(--zinc-500)'
    }
  }, c.caption))));
}

/* ---- Club timeline ---- */
const TIMELINE_COLS = '110px 1fr 120px 110px 70px 60px 60px';
function ClubTimeline({
  clubs
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(CrEyebrow, null, "Career timeline")), /*#__PURE__*/React.createElement(CrStatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: TIMELINE_COLS,
      gap: 12,
      alignItems: 'center',
      borderBottom: '1px solid var(--zinc-200)',
      background: 'rgba(250,250,250,0.6)',
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "From \u2014 To"), /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Club"), /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Type"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "Fee"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "Apps"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "G"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "A")), clubs.map((club, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "match-row",
    style: {
      display: 'grid',
      gridTemplateColumns: TIMELINE_COLS,
      gap: 12,
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: i < clubs.length - 1 ? '1px solid var(--zinc-100)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: crMono(12)
  }, club.range), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20,
      width: 20,
      flexShrink: 0,
      borderRadius: '50%',
      border: '1px solid var(--zinc-200)',
      background: 'var(--zinc-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...crMono(7, 'var(--zinc-600)', {
        fontWeight: 700
      })
    }
  }, club.code), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: 'var(--zinc-900)'
    }
  }, club.name), club.current && /*#__PURE__*/React.createElement("span", {
    style: crBadge('emerald')
  }, "CURRENT")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--zinc-700)'
    }
  }, club.type), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      ...crMono(14)
    }
  }, club.fee || '—'), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      ...crMono(14, 'var(--zinc-900)')
    }
  }, club.apps != null ? club.apps : '—'), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      ...crMono(14, 'var(--zinc-900)')
    }
  }, club.goals != null ? club.goals : '—'), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      ...crMono(14, 'var(--zinc-900)')
    }
  }, club.assists != null ? club.assists : '—')))));
}

/* ---- Season-by-season ---- */
const SEASON_COLS = '90px 1.2fr 1fr 60px 70px 50px 50px 70px 40px 40px';
function SeasonTable({
  seasonStats,
  currentSeason
}) {
  const [selected, setSelected] = React.useState('all');
  const seasons = [...new Set(seasonStats.map(s => s.season))];
  const filtered = selected === 'all' ? seasonStats : seasonStats.filter(s => s.season === selected);
  const totals = filtered.reduce((acc, r) => ({
    apps: acc.apps + r.apps,
    minutes: acc.minutes + r.minutes,
    goals: acc.goals + r.goals,
    assists: acc.assists + r.assists,
    y: acc.y + r.y,
    r: acc.r + r.r
  }), {
    apps: 0,
    minutes: 0,
    goals: 0,
    assists: 0,
    y: 0,
    r: 0
  });
  const ga90 = totals.minutes > 0 ? ((totals.goals + totals.assists) / totals.minutes * 90).toFixed(2) : '—';
  const numCell = (v, opts = {}) => /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      ...crMono(14, opts.color || 'var(--zinc-700)', {
        fontWeight: opts.bold ? 600 : 400
      })
    }
  }, v);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(CrEyebrow, null, "Season-by-season \xB7 ", selected === 'all' ? 'All competitions' : selected), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: selected,
    "aria-label": "Season filter",
    onChange: e => setSelected(e.target.value),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      borderRadius: 6,
      border: '1px solid var(--zinc-200)',
      background: '#fff',
      padding: '6px 28px 6px 12px',
      ...crMono(11, 'var(--zinc-700)', {
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }),
      cursor: 'pointer',
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All seasons"), seasons.map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }, s))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      top: '50%',
      right: 8,
      width: 14,
      height: 14,
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--zinc-400)'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })))), /*#__PURE__*/React.createElement(CrStatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: SEASON_COLS,
      gap: 12,
      alignItems: 'center',
      borderBottom: '1px solid var(--zinc-200)',
      background: 'rgba(250,250,250,0.6)',
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Season"), /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Competition"), /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Club"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "Apps"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "Mins"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "G"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "A"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "G+A/90"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "Y"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "R")), filtered.map((s, i) => {
    const rowGa90 = s.minutes > 0 ? ((s.goals + s.assists) / s.minutes * 90).toFixed(2) : '—';
    const highlight = selected === 'all' && s.season === currentSeason;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "match-row",
      style: {
        display: 'grid',
        gridTemplateColumns: SEASON_COLS,
        gap: 12,
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: '1px solid var(--zinc-100)',
        background: highlight ? 'rgba(236,253,245,0.2)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: crMono(12, 'var(--zinc-900)', {
        fontWeight: highlight ? 600 : 400
      })
    }, s.season), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: 'var(--zinc-900)'
      }
    }, s.competition), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: 'var(--zinc-700)'
      }
    }, s.club), numCell(s.apps, {
      color: 'var(--zinc-900)'
    }), numCell(s.minutes.toLocaleString(), {
      color: 'var(--zinc-900)'
    }), numCell(s.goals, {
      color: s.goals > 0 ? 'var(--emerald-600)' : 'var(--zinc-700)',
      bold: s.goals > 0
    }), numCell(s.assists, {
      color: s.assists > 0 ? 'var(--emerald-600)' : 'var(--zinc-700)',
      bold: s.assists > 0
    }), numCell(rowGa90, {
      color: 'var(--zinc-900)',
      bold: true
    }), numCell(s.y, {
      color: 'var(--zinc-500)'
    }), numCell(s.r, {
      color: 'var(--zinc-500)'
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: SEASON_COLS,
      gap: 12,
      alignItems: 'center',
      borderTop: '1px solid var(--zinc-200)',
      background: 'rgba(250,250,250,0.4)',
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 3',
      ...crMono(10, 'var(--zinc-500)', {
        letterSpacing: '0.18em',
        textTransform: 'uppercase'
      })
    }
  }, selected === 'all' ? 'Career totals' : 'Totals'), numCell(totals.apps, {
    color: 'var(--zinc-950)',
    bold: true
  }), numCell(totals.minutes.toLocaleString(), {
    color: 'var(--zinc-950)',
    bold: true
  }), numCell(totals.goals, {
    color: 'var(--zinc-950)',
    bold: true
  }), numCell(totals.assists, {
    color: 'var(--zinc-950)',
    bold: true
  }), numCell(ga90, {
    color: 'var(--zinc-950)',
    bold: true
  }), numCell(totals.y, {
    color: 'var(--zinc-500)',
    bold: true
  }), numCell(totals.r, {
    color: 'var(--zinc-500)',
    bold: true
  }))));
}

/* ---- Market value full-width chart ---- */
function MarketValueFull({
  history,
  currentValue
}) {
  const W = 800,
    H = 200,
    PL = 50,
    PR = 20,
    PT = 20,
    PB = 28;
  const cw = W - PL - PR,
    ch = H - PT - PB;
  const max = Math.max(...history.map(p => p.value));
  const xFor = i => PL + i / (history.length - 1) * cw;
  const yFor = v => PT + (1 - v / max) * ch;
  const line = history.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(p.value)}`).join(' ');
  const area = `${line} L${xFor(history.length - 1)},${PT + ch} L${xFor(0)},${PT + ch} Z`;
  const grid = [0, 0.5, 1].map(f => ({
    y: PT + f * ch,
    label: '€' + ((1 - f) * max).toFixed(0) + 'M'
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(CrEyebrow, null, "Market value \xB7 full history")), /*#__PURE__*/React.createElement(CrStatCard, {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: crOutfit(24)
  }, currentValue), /*#__PURE__*/React.createElement("span", {
    style: crMono(10, 'var(--zinc-400)')
  }, "Transfermarkt-style estimate \xB7 seasons")), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%',
      display: 'block'
    },
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: "#e4e4e7",
    strokeWidth: "0.5"
  }, grid.map((g, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: PL,
    y1: g.y,
    x2: W - PR,
    y2: g.y
  }))), /*#__PURE__*/React.createElement("g", {
    fontFamily: "ui-monospace, monospace",
    fontSize: "10",
    fill: "#a1a1aa"
  }, grid.map((g, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: PL - 10,
    y: g.y + 3,
    textAnchor: "end"
  }, g.label))), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "cr-mv-fill",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#10b981",
    stopOpacity: "0.12"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#10b981",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#cr-mv-fill)"
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: "#10b981",
    strokeWidth: "2.5"
  }), history.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: xFor(i),
    cy: yFor(p.value),
    r: "3.5",
    fill: "#10b981",
    stroke: "#fff",
    strokeWidth: "1.5"
  })), /*#__PURE__*/React.createElement("g", {
    fontFamily: "ui-monospace, monospace",
    fontSize: "9",
    fill: "#a1a1aa",
    textAnchor: "middle"
  }, history.map((p, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xFor(i),
    y: H - 8
  }, p.label))))));
}

/* ---- Injuries ---- */
const INJURY_COLS = '170px 1fr 110px 60px 80px';
function InjuryRecord({
  injuries,
  availability
}) {
  const totalDays = injuries.reduce((s, i) => s + i.days, 0);
  const avg = injuries.length ? Math.round(totalDays / injuries.length) : 0;
  const allRecovered = injuries.every(i => i.recovered);
  const totalsCell = (label, value) => /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(CrEyebrow, {
    size: "sm",
    dot: false,
    style: {
      justifyContent: 'center'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: crOutfit(18, {
      marginTop: 4
    })
  }, value));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(CrEyebrow, null, "Injury record"), /*#__PURE__*/React.createElement("span", {
    style: crBadge(allRecovered ? 'emerald' : 'amber')
  }, allRecovered ? 'CURRENTLY AVAILABLE' : 'INJURED')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(CrStatCard, {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(CrEyebrow, {
    size: "sm",
    dot: false,
    style: {
      marginBottom: 16
    }
  }, "Availability by season"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, availability.map(a => {
    const tier = availabilityTier(a.pct);
    return /*#__PURE__*/React.createElement("div", {
      key: a.season
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 6,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: crMono(11, 'var(--zinc-500)', {
        letterSpacing: '0.18em',
        textTransform: 'uppercase'
      })
    }, a.season), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...crOutfit(15),
        color: tier.text
      }
    }, a.pct.toFixed(1), "%"), /*#__PURE__*/React.createElement("span", {
      style: crMono(10, 'var(--zinc-400)', {
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      })
    }, "\xB7 ", a.days, "d out"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 8,
        overflow: 'hidden',
        borderRadius: 9999,
        background: 'var(--zinc-100)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        background: tier.bar,
        width: a.pct + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        background: 'rgba(251,191,36,0.8)',
        width: 100 - a.pct + '%'
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
      borderTop: '1px solid var(--zinc-100)',
      paddingTop: 16
    }
  }, totalsCell('Total', totalDays + 'd'), totalsCell('Spells', injuries.length), totalsCell('Avg', avg + 'd'))), /*#__PURE__*/React.createElement(CrStatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: INJURY_COLS,
      gap: 16,
      alignItems: 'center',
      borderBottom: '1px solid var(--zinc-200)',
      background: 'rgba(250,250,250,0.6)',
      padding: '10px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Dates"), /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Type"), /*#__PURE__*/React.createElement("div", {
    style: crTh()
  }, "Status"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "Days"), /*#__PURE__*/React.createElement("div", {
    style: crTh(true)
  }, "Matches")), injuries.map((injury, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: INJURY_COLS,
      gap: 16,
      alignItems: 'center',
      padding: '12px 20px',
      borderBottom: i < injuries.length - 1 ? '1px solid var(--zinc-100)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      whiteSpace: 'nowrap',
      ...crMono(12)
    }
  }, injury.dates), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--zinc-900)'
    }
  }, injury.type), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: crBadge(injury.recovered ? 'emerald' : 'amber')
  }, injury.recovered ? 'RECOVERED' : 'ACTIVE')), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      ...crMono(14, 'var(--zinc-900)')
    }
  }, injury.days), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      ...crMono(14, 'var(--zinc-900)')
    }
  }, injury.matches))))));
}
function CareerTab({
  data,
  marketValueHistory,
  currentValue
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CareerTotals, {
    totals: data.totals
  }), /*#__PURE__*/React.createElement(ClubTimeline, {
    clubs: data.clubs
  }), /*#__PURE__*/React.createElement(SeasonTable, {
    seasonStats: data.seasonStats,
    currentSeason: data.currentSeason
  }), /*#__PURE__*/React.createElement(MarketValueFull, {
    history: marketValueHistory,
    currentValue: currentValue
  }), /*#__PURE__*/React.createElement(InjuryRecord, {
    injuries: data.injuries,
    availability: data.availability
  }));
}
Object.assign(window, {
  CareerTab
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_player_profile/CareerTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_player_profile/OverviewTab.jsx
try { (() => {
// Player profile Overview tab — recreation of player-v2/tabs/OverviewTab.tsx
// sections: verdict, quick stats, performance snapshot, squad context,
// position heatmap + market value, upcoming fixtures.
const {
  Eyebrow: OvEyebrow,
  StatCard: OvStatCard,
  PercentileBar: OvPercentileBar,
  Pitch: OvPitch
} = window.SentrumDesignSystem_fd9502;
function tierTextColor(p) {
  if (p >= 75) return 'var(--emerald-600)';
  if (p >= 50) return '#ca8a04';
  if (p >= 25) return '#ea580c';
  return '#dc2626';
}
const outfitNum = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra
});
function SectionHeader({
  label,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, null, label), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    className: "ov-action",
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--zinc-500)',
      padding: 0
    }
  }, action, " \u2192"));
}

/* ---- 1. Scouting verdict ---- */
function ScoutingVerdict({
  verdict
}) {
  return /*#__PURE__*/React.createElement(OvStatCard, {
    emphasis: true,
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, null, "Scouting verdict \xB7 synthesized from ", verdict.reportCount, " reports"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      margin: '10px 0 0',
      fontSize: 20,
      lineHeight: 1.375,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--zinc-950)'
    }
  }, verdict.headline), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 0',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--zinc-600)'
    }
  }, verdict.body), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      color: 'var(--zinc-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Most recent"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: 'var(--zinc-700)'
    }
  }, verdict.mostRecent), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-300)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      border: 'none',
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--zinc-700)',
      fontFamily: 'var(--font-sans)'
    }
  }, "View all reports \u2192"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      borderLeft: '1px solid var(--zinc-200)',
      paddingLeft: 24,
      display: 'flex',
      gap: 20
    }
  }, verdict.grades.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label,
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, {
    size: "sm",
    dot: false,
    style: {
      justifyContent: 'center'
    }
  }, g.label), /*#__PURE__*/React.createElement("div", {
    style: outfitNum(30, {
      marginTop: 4
    })
  }, g.value))))));
}

/* ---- 2. Season quick stats ---- */
function SeasonQuickStats({
  contextLabel,
  stats
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
    label: contextLabel,
    action: "Change season"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8
    }
  }, stats.map(stat => /*#__PURE__*/React.createElement(OvStatCard, {
    key: stat.label,
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, {
    size: "sm",
    dot: false
  }, stat.label), stat.chip && /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 2,
      background: 'var(--emerald-50)',
      padding: '2px 6px',
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.05em',
      color: 'var(--emerald-700)'
    }
  }, stat.chip)), /*#__PURE__*/React.createElement("div", {
    style: outfitNum(24, {
      marginTop: 4
    })
  }, stat.value), stat.caption && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 11,
      color: 'var(--zinc-500)'
    }
  }, stat.caption)))));
}

/* ---- 3. Performance snapshot ---- */
function MetricRow({
  metric
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-700)'
    }
  }, metric.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--zinc-950)'
    }
  }, metric.displayValue, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-400)'
    }
  }, "\xB7"), ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: tierTextColor(metric.percentile)
    }
  }, "P", Math.round(metric.percentile)))), /*#__PURE__*/React.createElement(OvPercentileBar, {
    percentile: metric.percentile,
    style: {
      marginTop: 6
    }
  }));
}
function PerformanceSnapshot({
  technical,
  physical,
  technicalContext,
  physicalContext,
  onFullPerformance
}) {
  const col = (title, context, metrics) => /*#__PURE__*/React.createElement(OvStatCard, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, {
    size: "sm",
    dot: false
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--zinc-400)'
    }
  }, context)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, metrics.map(m => /*#__PURE__*/React.createElement(MetricRow, {
    key: m.label,
    metric: m
  }))));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
    label: "Performance snapshot",
    action: "Full performance",
    onAction: onFullPerformance
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, col('Technical · Impect', technicalContext, technical), col('Physical · SkillCorner', physicalContext, physical)));
}

/* ---- 4. Squad context (3 mini leaderboards) ---- */
function SquadContext({
  contextLabel,
  leaderboards,
  onFullComparison
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
    label: contextLabel,
    action: "Full comparison",
    onAction: onFullComparison
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8
    }
  }, leaderboards.map(board => /*#__PURE__*/React.createElement(OvStatCard, {
    key: board.metricLabel,
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, {
    size: "sm",
    dot: false
  }, board.metricLabel), /*#__PURE__*/React.createElement("div", {
    style: outfitNum(18)
  }, "#", board.playerRank, ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 400,
      color: 'var(--zinc-500)'
    }
  }, "/", board.totalPlayers))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, board.entries.map(entry => /*#__PURE__*/React.createElement("div", {
    key: entry.rank,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums',
      color: entry.me ? 'var(--emerald-700)' : 'var(--zinc-400)'
    }
  }, entry.rank, "."), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: entry.me ? 500 : 400,
      color: entry.me ? 'var(--emerald-700)' : 'var(--zinc-700)'
    }
  }, entry.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums',
      fontWeight: entry.me ? 600 : 400,
      color: entry.me ? 'var(--zinc-950)' : 'var(--zinc-700)'
    }
  }, entry.value))))))));
}

/* ---- 5. Position map + market value chart ---- */
function MarketValueMiniChart({
  history
}) {
  // history: [{ label, value }] — simple step-free polyline, emerald
  const w = 280,
    h = 120,
    pad = 8;
  const max = Math.max(...history.map(p => p.value));
  const min = Math.min(...history.map(p => p.value));
  const x = i => pad + i / (history.length - 1) * (w - pad * 2);
  const y = v => h - pad - (v - min) / (max - min || 1) * (h - pad * 2);
  const points = history.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const last = history[history.length - 1];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    style: {
      width: '100%',
      height: 'auto',
      display: 'block'
    },
    "aria-label": "Market value history"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: `${x(0)},${h - pad} ${points} ${x(history.length - 1)},${h - pad}`,
    fill: "var(--emerald-50)",
    stroke: "none",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: points,
    fill: "none",
    stroke: "var(--emerald-500)",
    strokeWidth: "2",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x(history.length - 1),
    cy: y(last.value),
    r: "3.5",
    fill: "var(--emerald-500)",
    stroke: "#fff",
    strokeWidth: "1.5"
  }));
}
function PositionAndValue({
  player
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '3fr 2fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(OvStatCard, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, {
    size: "sm",
    dot: false
  }, "Positions played"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--zinc-400)'
    }
  }, player.positionMinutes, " min \xB7 ", player.positionMatches, " matches")), /*#__PURE__*/React.createElement(OvPitch, {
    width: 430,
    primary: player.primaryPosition,
    dots: player.positionDots,
    ariaLabel: player.positionsLabel
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, player.positionDots.map(d => /*#__PURE__*/React.createElement("span", {
    key: d.position,
    style: {
      fontSize: 11,
      color: 'var(--zinc-600)',
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--emerald-500)',
      marginRight: 5
    }
  }), d.position, " ", d.percentage, "%")))), /*#__PURE__*/React.createElement(OvStatCard, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, {
    size: "sm",
    dot: false
  }, "Market value"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--zinc-400)'
    }
  }, "5 seasons")), /*#__PURE__*/React.createElement("div", {
    style: outfitNum(24, {
      marginBottom: 10
    })
  }, player.marketValue), /*#__PURE__*/React.createElement(MarketValueMiniChart, {
    history: player.marketValueHistory
  })));
}

/* ---- 6. Upcoming fixtures ---- */
function UpcomingFixtures({
  fixtures
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeader, {
    label: "Upcoming fixtures"
  }), /*#__PURE__*/React.createElement(OvStatCard, null, fixtures.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 16px',
      borderBottom: i < fixtures.length - 1 ? '1px solid var(--zinc-100)' : 'none',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--zinc-500)',
      width: 88,
      flexShrink: 0,
      fontVariantNumeric: 'tabular-nums'
    }
  }, f.date), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 500,
      color: 'var(--zinc-900)'
    }
  }, f.match), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--zinc-500)'
    }
  }, f.competition), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "snt-btn snt-btn--outline snt-btn--sm",
    style: {
      flexShrink: 0
    }
  }, "Add to calendar")))));
}

/* ---- Tab placeholder (verbatim pattern from PlayerProfileV2.tsx) ---- */
function TabPlaceholder({
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 6,
      border: '1px dashed var(--zinc-300)',
      background: 'rgba(250,250,250,0.3)',
      padding: 48,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(OvEyebrow, {
    dot: false,
    style: {
      justifyContent: 'center'
    }
  }, label, " tab"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: 'var(--zinc-500)'
    }
  }, "Content pending \u2014 landing in upcoming tasks."));
}
function OverviewTab({
  player,
  onFullPerformance,
  onFullComparison
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(ScoutingVerdict, {
    verdict: player.verdict
  }), /*#__PURE__*/React.createElement(SeasonQuickStats, {
    contextLabel: player.seasonContextLabel,
    stats: player.quickStats
  }), /*#__PURE__*/React.createElement(PerformanceSnapshot, {
    technical: player.technicalMetrics,
    physical: player.physicalMetrics,
    technicalContext: player.technicalContext,
    physicalContext: player.physicalContext,
    onFullPerformance: onFullPerformance
  }), /*#__PURE__*/React.createElement(SquadContext, {
    contextLabel: player.squadContextLabel,
    leaderboards: player.leaderboards,
    onFullComparison: onFullComparison
  }), /*#__PURE__*/React.createElement(PositionAndValue, {
    player: player
  }), /*#__PURE__*/React.createElement(UpcomingFixtures, {
    fixtures: player.fixtures
  }));
}
Object.assign(window, {
  OverviewTab,
  TabPlaceholder
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_player_profile/OverviewTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_player_profile/PerformanceTab.jsx
try { (() => {
// Performance tab — recreation of player-v2/tabs/PerformanceTab.tsx
// Sub-tabs (Combined/Technical/Physical), filters, polar pizzas, ranked
// metric lists, match history table, season trend chart.
const {
  Eyebrow: PfEyebrow,
  StatCard: PfStatCard,
  PercentileBar: PfPercentileBar
} = window.SentrumDesignSystem_fd9502;
function pfTierColor(p) {
  if (p >= 90) return '#22c55e';
  if (p >= 75) return '#4ade80';
  if (p >= 50) return '#eab308';
  if (p >= 25) return '#f97316';
  return '#ef4444';
}
function pfTierText(p) {
  if (p >= 75) return 'var(--emerald-600)';
  if (p >= 50) return '#ca8a04';
  if (p >= 25) return '#ea580c';
  return '#dc2626';
}
const pfMono = (size, color = 'var(--zinc-700)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra
});

/* ---- Sub-tab bar (underline style) ---- */
function SubTabBar({
  tabs,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, tabs.map(tab => {
    const isActive = tab.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      role: "tab",
      type: "button",
      "aria-selected": isActive,
      onClick: () => onChange(tab.id),
      className: isActive ? '' : 'subtab-idle',
      style: {
        position: 'relative',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: '0 0 12px',
        marginBottom: -1,
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 500,
        color: isActive ? 'var(--zinc-950)' : 'var(--zinc-500)',
        borderBottom: isActive ? '2px solid var(--zinc-950)' : '2px solid transparent'
      }
    }, tab.label);
  }));
}

/* ---- Mono select (filters + metric picker) ---- */
function MonoSelect({
  value,
  onChange,
  options,
  ariaLabel
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    "aria-label": ariaLabel,
    onChange: e => onChange(e.target.value),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      borderRadius: 6,
      border: '1px solid var(--zinc-200)',
      background: '#fff',
      padding: '6px 28px 6px 12px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--zinc-700)',
      cursor: 'pointer',
      outline: 'none'
    }
  }, options.map(opt => /*#__PURE__*/React.createElement("option", {
    key: opt.value,
    value: opt.value
  }, opt.label))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      top: '50%',
      right: 8,
      width: 14,
      height: 14,
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--zinc-400)'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
}

/* ---- Polar bar (pizza) chart — port of PolarBarChart.tsx, static ---- */
function PolarBarChart({
  data,
  size = 340
}) {
  const center = size / 2;
  const outerRadius = size * 0.36;
  const innerRadius = size * 0.14;
  const labelRadius = size * 0.5;
  const count = data.length;
  const anglePerSegment = 2 * Math.PI / count;
  const gapAngle = 0.04;
  const segments = data.map((item, index) => {
    const startAngle = index * anglePerSegment - Math.PI / 2 + gapAngle / 2;
    const endAngle = (index + 1) * anglePerSegment - Math.PI / 2 - gapAngle / 2;
    const midAngle = (startAngle + endAngle) / 2;
    const barRadius = innerRadius + (outerRadius - innerRadius) * (item.percentile / 100);
    return {
      ...item,
      startAngle,
      endAngle,
      midAngle,
      barRadius,
      color: pfTierColor(item.percentile)
    };
  });
  const arc = (innerR, outerR, startAngle, endAngle) => {
    const isx = center + innerR * Math.cos(startAngle);
    const isy = center + innerR * Math.sin(startAngle);
    const iex = center + innerR * Math.cos(endAngle);
    const iey = center + innerR * Math.sin(endAngle);
    const osx = center + outerR * Math.cos(startAngle);
    const osy = center + outerR * Math.sin(startAngle);
    const oex = center + outerR * Math.cos(endAngle);
    const oey = center + outerR * Math.sin(endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${isx} ${isy} L ${osx} ${osy} A ${outerR} ${outerR} 0 ${large} 1 ${oex} ${oey} L ${iex} ${iey} A ${innerR} ${innerR} 0 ${large} 0 ${isx} ${isy} Z`;
  };
  const labelPos = midAngle => {
    const x = center + labelRadius * Math.cos(midAngle);
    const y = center + labelRadius * Math.sin(midAngle);
    const deg = midAngle * 180 / Math.PI + 90;
    let anchor = 'middle';
    if (deg > 45 && deg < 135) anchor = 'start';else if (deg > 225 && deg < 315) anchor = 'end';
    return {
      x,
      y,
      anchor
    };
  };
  const padding = size * 0.12;
  const totalSize = size + padding * 2;
  return /*#__PURE__*/React.createElement("svg", {
    width: totalSize,
    height: totalSize,
    viewBox: `${-padding} ${-padding} ${totalSize} ${totalSize}`,
    style: {
      overflow: 'visible',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: center,
    cy: center,
    r: outerRadius,
    fill: "none",
    stroke: "var(--zinc-200)",
    strokeWidth: "1"
  }), [25, 50, 75, 100].map(pct => /*#__PURE__*/React.createElement("circle", {
    key: pct,
    cx: center,
    cy: center,
    r: innerRadius + (outerRadius - innerRadius) * (pct / 100),
    fill: "none",
    stroke: "var(--zinc-200)",
    strokeWidth: "0.5",
    strokeDasharray: "2,4"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: center,
    cy: center,
    r: innerRadius,
    fill: "var(--zinc-50)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: center,
    cy: center,
    r: innerRadius,
    fill: "none",
    stroke: "var(--zinc-200)",
    strokeWidth: "1"
  }), segments.map(seg => /*#__PURE__*/React.createElement("path", {
    key: `track-${seg.metric}`,
    d: arc(innerRadius, outerRadius, seg.startAngle, seg.endAngle),
    fill: "var(--zinc-100)"
  })), segments.map(seg => /*#__PURE__*/React.createElement("path", {
    key: `bar-${seg.metric}`,
    d: arc(innerRadius, seg.barRadius, seg.startAngle, seg.endAngle),
    fill: seg.color
  }, /*#__PURE__*/React.createElement("title", null, `${seg.fullName}: ${seg.rawValue} ${seg.unit || 'p90'} · P${Math.round(seg.percentile)}`))), segments.map(seg => {
    const x1 = center + innerRadius * Math.cos(seg.startAngle);
    const y1 = center + innerRadius * Math.sin(seg.startAngle);
    const x2 = center + outerRadius * Math.cos(seg.startAngle);
    const y2 = center + outerRadius * Math.sin(seg.startAngle);
    return /*#__PURE__*/React.createElement("line", {
      key: `div-${seg.metric}`,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: "#fff",
      strokeWidth: "1.5"
    });
  }), segments.map(seg => {
    const {
      x,
      y,
      anchor
    } = labelPos(seg.midAngle);
    return /*#__PURE__*/React.createElement("g", {
      key: `label-${seg.metric}`
    }, /*#__PURE__*/React.createElement("text", {
      x: x,
      y: y - 6,
      textAnchor: anchor,
      dominantBaseline: "middle",
      style: {
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.05em',
        fill: 'var(--zinc-600)',
        fontFamily: 'var(--font-sans)',
        textTransform: 'uppercase'
      }
    }, seg.metric), /*#__PURE__*/React.createElement("text", {
      x: x,
      y: y + 6,
      textAnchor: anchor,
      dominantBaseline: "middle",
      style: {
        fontSize: 8,
        fill: 'var(--zinc-500)',
        fontFamily: 'var(--font-mono)'
      }
    }, seg.rawValue, " ", seg.unit || 'p90'));
  }), /*#__PURE__*/React.createElement("text", {
    x: center,
    y: center - 4,
    textAnchor: "middle",
    style: {
      fontSize: 7,
      fontWeight: 600,
      letterSpacing: '0.1em',
      fill: 'var(--zinc-600)',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-sans)'
    }
  }, "Percentile"), /*#__PURE__*/React.createElement("text", {
    x: center,
    y: center + 6,
    textAnchor: "middle",
    style: {
      fontSize: 7,
      fill: 'var(--zinc-500)',
      fontFamily: 'var(--font-sans)'
    }
  }, "Rank"));
}
function LegendChip({
  color,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      width: 8,
      borderRadius: 2,
      background: color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-500)',
      fontSize: 10
    }
  }, label));
}
function PerformancePizza({
  title,
  subtitle,
  data,
  compositePercentile,
  size = 300
}) {
  return /*#__PURE__*/React.createElement(PfStatCard, {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PfEyebrow, {
    size: "sm",
    dot: false
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      ...pfMono(10, 'var(--zinc-400)')
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      lineHeight: 1,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--zinc-950)'
    }
  }, "P", Math.round(compositePercentile)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      ...pfMono(9, 'var(--emerald-600)')
    }
  }, "AVG PERCENTILE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PolarBarChart, {
    data: data,
    size: size
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(LegendChip, {
    color: "#22c55e",
    label: "Elite \u226590"
  }), /*#__PURE__*/React.createElement(LegendChip, {
    color: "#4ade80",
    label: "75+"
  }), /*#__PURE__*/React.createElement(LegendChip, {
    color: "#eab308",
    label: "50+"
  }), /*#__PURE__*/React.createElement(LegendChip, {
    color: "#f97316",
    label: "25+"
  }), /*#__PURE__*/React.createElement(LegendChip, {
    color: "#ef4444",
    label: "Low"
  })));
}

/* ---- Ranked metric list ---- */
function TopMetricsList({
  title,
  subtitle,
  metrics
}) {
  const sorted = [...metrics].sort((a, b) => b.percentile - a.percentile);
  return /*#__PURE__*/React.createElement(PfStatCard, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(PfEyebrow, {
    size: "sm",
    dot: false
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: pfMono(10, 'var(--zinc-400)')
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, sorted.map(metric => /*#__PURE__*/React.createElement("div", {
    key: metric.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-700)'
    }
  }, metric.label, metric.subLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      fontSize: 12,
      color: 'var(--zinc-400)'
    }
  }, metric.subLabel)), /*#__PURE__*/React.createElement("span", {
    style: pfMono(14, 'var(--zinc-950)', {
      fontWeight: 600
    })
  }, metric.displayValue, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-400)'
    }
  }, "\xB7"), ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: pfTierText(metric.percentile)
    }
  }, "P", Math.round(metric.percentile)))), /*#__PURE__*/React.createElement(PfPercentileBar, {
    percentile: metric.percentile,
    style: {
      marginTop: 4
    }
  })))));
}

/* ---- Match history table ---- */
function MatchHistoryTable({
  matches,
  mode
}) {
  const showTech = mode === 'combined' || mode === 'technical';
  const showPhys = mode === 'combined' || mode === 'physical';
  const techCols = showTech ? ' 60px 60px 70px' : '';
  const physCols = showPhys ? ' 70px 70px 70px' : '';
  const gridTemplate = `80px 1fr 130px 50px${techCols}${physCols}`;
  const Th = ({
    children,
    right
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      ...pfMono(9, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase'
      }),
      textAlign: right ? 'right' : 'left'
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(PfEyebrow, null, "Match-by-match \xB7 last 8 played")), /*#__PURE__*/React.createElement(PfStatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: gridTemplate,
      gap: 12,
      alignItems: 'center',
      borderBottom: '1px solid var(--zinc-200)',
      background: 'rgba(250,250,250,0.6)',
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement(Th, null, "Date"), /*#__PURE__*/React.createElement(Th, null, "Opponent"), /*#__PURE__*/React.createElement(Th, null, "Comp"), /*#__PURE__*/React.createElement(Th, {
    right: true
  }, "Min"), showTech && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Th, {
    right: true
  }, "G+A"), /*#__PURE__*/React.createElement(Th, {
    right: true
  }, "Drib"), /*#__PURE__*/React.createElement(Th, {
    right: true
  }, "xG+xA")), showPhys && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Th, {
    right: true
  }, "Speed"), /*#__PURE__*/React.createElement(Th, {
    right: true
  }, "Sprints"), /*#__PURE__*/React.createElement(Th, {
    right: true
  }, "Dist"))), matches.map((m, i) => {
    const standout = m.ga >= 2 || m.xgxa >= 0.5;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "match-row",
      style: {
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        gap: 12,
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: i < matches.length - 1 ? '1px solid var(--zinc-100)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: pfMono(12)
    }, m.date), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        minWidth: 0,
        alignItems: 'center',
        gap: 8,
        fontSize: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 500,
        color: 'var(--zinc-900)'
      }
    }, m.opponent), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        borderRadius: 2,
        background: 'var(--zinc-100)',
        padding: '1px 4px',
        ...pfMono(9, 'var(--zinc-600)', {
          fontWeight: 600
        })
      }
    }, m.home ? 'H' : 'A'), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        borderRadius: 2,
        background: '#f0fdfa',
        padding: '1px 4px',
        ...pfMono(9, '#0f766e', {
          fontWeight: 600
        })
      }
    }, m.pos)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--zinc-600)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, m.comp), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        ...pfMono(14)
      }
    }, m.min), showTech && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        ...pfMono(14, standout ? 'var(--emerald-600)' : 'var(--zinc-700)', {
          fontWeight: standout ? 600 : 400
        })
      }
    }, m.gaDisplay), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        ...pfMono(14, 'var(--zinc-900)')
      }
    }, m.drib), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        ...pfMono(14, m.xgxa >= 0.5 ? 'var(--emerald-600)' : 'var(--zinc-900)', {
          fontWeight: m.xgxa >= 0.5 ? 600 : 400
        })
      }
    }, m.xgxa.toFixed(2))), showPhys && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        ...pfMono(14, 'var(--zinc-900)')
      }
    }, m.speed.toFixed(1)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        ...pfMono(14, 'var(--zinc-900)')
      }
    }, m.sprints), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        ...pfMono(14, 'var(--zinc-900)')
      }
    }, m.dist.toFixed(1))));
  })));
}

/* ---- Season trend chart ---- */
function SeasonTrendChart({
  series,
  mode
}) {
  const prefix = mode === 'physical' ? 'phys_' : mode === 'technical' ? 'tech_' : null;
  const available = prefix ? series.filter(s => s.id.startsWith(prefix)) : series;
  const [selectedId, setSelectedId] = React.useState(available[0] ? available[0].id : null);
  const active = available.find(s => s.id === selectedId) || available[0];
  if (!active) return null;
  const decimals = active.decimals != null ? active.decimals : 2;
  const values = active.points.map(p => p.value);
  const maxV = Math.max(...values, active.peerMedian != null ? active.peerMedian : -Infinity);
  const minV = Math.min(...values, active.peerMedian != null ? active.peerMedian : Infinity, 0);
  const range = maxV - minV || 1;
  const W = 800,
    H = 220,
    PL = 50,
    PR = 20,
    PT = 20,
    PB = 30;
  const cw = W - PL - PR,
    ch = H - PT - PB;
  const xFor = i => active.points.length === 1 ? PL + cw / 2 : PL + i / (active.points.length - 1) * cw;
  const yFor = v => PT + (1 - (v - minV) / range) * ch;
  const linePath = active.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(p.value)}`).join(' ');
  const areaPath = `${linePath} L${xFor(active.points.length - 1)},${PT + ch} L${xFor(0)},${PT + ch} Z`;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    y: PT + f * ch,
    label: (maxV - f * range).toFixed(decimals)
  }));
  const high = Math.max(...values),
    low = Math.min(...values);
  const highIdx = values.indexOf(high),
    lowIdx = values.indexOf(low);
  const delta = values[values.length - 1] - values[0];
  const unit = active.unit || '';
  const stat = (label, val, ctx, color) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: pfMono(9, 'var(--zinc-400)', {
      letterSpacing: '0.18em',
      textTransform: 'uppercase'
    })
  }, label), ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      ...pfMono(11, color || 'var(--zinc-950)', {
        fontWeight: 600
      })
    }
  }, val), ' ', ctx && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--zinc-500)'
    }
  }, ctx));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(PfEyebrow, null, "Season trend \xB7 ", active.label), available.length > 1 && /*#__PURE__*/React.createElement(MonoSelect, {
    ariaLabel: "Trend metric",
    value: active.id,
    onChange: setSelectedId,
    options: available.map(s => ({
      value: s.id,
      label: s.label
    }))
  })), /*#__PURE__*/React.createElement(PfStatCard, {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: '100%',
      display: 'block'
    },
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: "#e4e4e7",
    strokeWidth: "0.5"
  }, gridLines.map((g, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: PL,
    y1: g.y,
    x2: W - PR,
    y2: g.y
  }))), /*#__PURE__*/React.createElement("g", {
    fontFamily: "ui-monospace, monospace",
    fontSize: "10",
    fill: "#a1a1aa"
  }, gridLines.map((g, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: PL - 10,
    y: g.y + 3,
    textAnchor: "end"
  }, g.label))), active.peerMedian != null && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: PL,
    y1: yFor(active.peerMedian),
    x2: W - PR,
    y2: yFor(active.peerMedian),
    stroke: "#a1a1aa",
    strokeWidth: "1",
    strokeDasharray: "4 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: W - PR,
    y: yFor(active.peerMedian) - 3,
    textAnchor: "end",
    fontFamily: "ui-monospace, monospace",
    fontSize: "9",
    fill: "#71717a"
  }, "Peer median \xB7 ", active.peerMedian.toFixed(decimals))), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "pf-trend-fill",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#10b981",
    stopOpacity: "0.12"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#10b981",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: areaPath,
    fill: "url(#pf-trend-fill)"
  }), /*#__PURE__*/React.createElement("path", {
    d: linePath,
    fill: "none",
    stroke: "#10b981",
    strokeWidth: "2.5"
  }), active.points.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: xFor(i),
    cy: yFor(p.value),
    r: "3",
    fill: "#10b981"
  })), /*#__PURE__*/React.createElement("g", {
    fontFamily: "ui-monospace, monospace",
    fontSize: "9",
    fill: "#a1a1aa",
    textAnchor: "middle"
  }, active.points.map((p, i) => i % 2 === 0 ? /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xFor(i),
    y: H - 8
  }, p.month) : null))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 16,
      borderTop: '1px solid var(--zinc-100)',
      paddingTop: 12,
      fontSize: 11
    }
  }, stat('Season high', `${high.toFixed(decimals)}${unit}`, active.points[highIdx].contextLabel), stat('Low', `${low.toFixed(decimals)}${unit}`, active.points[lowIdx].contextLabel), stat('Trend', `${delta >= 0 ? '↗ +' : '↘ '}${delta.toFixed(decimals)}${unit}`, null, delta >= 0 ? 'var(--emerald-600)' : 'var(--zinc-700)'))));
}

/* ---- Performance tab root ---- */
function PerformanceTab({
  data
}) {
  const [mode, setMode] = React.useState('combined');
  const [season, setSeason] = React.useState('2025/26');
  const [comp, setComp] = React.useState('Eredivisie');
  const [vsPos, setVsPos] = React.useState('ST');
  const techComposite = data.technicalPizza.reduce((a, d) => a + d.percentile, 0) / data.technicalPizza.length;
  const physComposite = data.physicalPizza.reduce((a, d) => a + d.percentile, 0) / data.physicalPizza.length;
  const showTech = mode === 'combined' || mode === 'technical';
  const showPhys = mode === 'combined' || mode === 'physical';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      borderBottom: '1px solid var(--zinc-200)'
    }
  }, /*#__PURE__*/React.createElement(SubTabBar, {
    tabs: [{
      id: 'combined',
      label: 'Combined'
    }, {
      id: 'technical',
      label: 'Technical'
    }, {
      id: 'physical',
      label: 'Physical'
    }],
    active: mode,
    onChange: setMode
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement(MonoSelect, {
    ariaLabel: "Season",
    value: season,
    onChange: setSeason,
    options: [{
      value: '2025/26',
      label: '2025/26'
    }, {
      value: '2024/25',
      label: '2024/25'
    }, {
      value: '2023/24',
      label: '2023/24'
    }]
  }), /*#__PURE__*/React.createElement(MonoSelect, {
    ariaLabel: "Competition",
    value: comp,
    onChange: setComp,
    options: [{
      value: 'Eredivisie',
      label: 'Eredivisie'
    }, {
      value: 'KNVB Beker',
      label: 'KNVB Beker'
    }]
  }), /*#__PURE__*/React.createElement(MonoSelect, {
    ariaLabel: "Compared position",
    value: vsPos,
    onChange: setVsPos,
    options: [{
      value: 'ST',
      label: 'vs ST'
    }, {
      value: 'LW',
      label: 'vs LW'
    }]
  }))), mode === 'combined' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(PerformancePizza, {
    title: "Technical \xB7 Impect",
    subtitle: data.technicalSubtitle,
    data: data.technicalPizza,
    compositePercentile: techComposite
  }), /*#__PURE__*/React.createElement(PerformancePizza, {
    title: "Physical \xB7 SkillCorner",
    subtitle: data.physicalSubtitle,
    data: data.physicalPizza,
    compositePercentile: physComposite
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(PfEyebrow, null, "Top metrics \xB7 ranked by percentile vs peers")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(TopMetricsList, {
    title: "Technical \xB7 Impect",
    subtitle: data.technicalContextLabel,
    metrics: data.technicalMetrics
  }), /*#__PURE__*/React.createElement(TopMetricsList, {
    title: "Physical \xB7 SkillCorner",
    subtitle: data.physicalContextLabel,
    metrics: data.physicalMetrics
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(PerformancePizza, {
    title: showTech ? 'Technical · Impect' : 'Physical · SkillCorner',
    subtitle: showTech ? data.technicalSubtitle : data.physicalSubtitle,
    data: showTech ? data.technicalPizza : data.physicalPizza,
    compositePercentile: showTech ? techComposite : physComposite
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(PfEyebrow, null, "Top metrics \xB7 ranked by percentile vs peers"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(TopMetricsList, {
    title: showTech ? 'Technical · Impect' : 'Physical · SkillCorner',
    subtitle: showTech ? data.technicalContextLabel : data.physicalContextLabel,
    metrics: showTech ? data.technicalMetrics : data.physicalMetrics
  })))), /*#__PURE__*/React.createElement(MatchHistoryTable, {
    matches: data.matchHistory,
    mode: mode
  }), /*#__PURE__*/React.createElement(SeasonTrendChart, {
    series: data.trendSeries,
    mode: mode
  }));
}
Object.assign(window, {
  PerformanceTab
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_player_profile/PerformanceTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_player_profile/PlayerHero.jsx
try { (() => {
// Player profile hero + tab nav — recreation of player-v2/Hero.tsx + TabNav.tsx
const {
  Eyebrow,
  Pitch
} = window.SentrumDesignSystem_fd9502;
const PlusIcon = ({
  size = 14
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    width: size,
    height: size
  },
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 5v14"
}));
function HeroActionButton({
  label,
  variant,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const primary = variant === 'primary';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 32,
      borderRadius: 6,
      padding: '0 12px',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      border: primary ? '1px solid transparent' : '1px solid var(--zinc-200)',
      background: primary ? hover ? 'var(--zinc-800)' : 'var(--zinc-950)' : hover ? 'var(--zinc-50)' : '#fff',
      color: primary ? '#fff' : 'var(--zinc-900)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(PlusIcon, null), label);
}
function PlayerHero({
  player
}) {
  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--zinc-500)',
    lineHeight: 1,
    fontFamily: 'var(--font-sans)'
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderBottom: '1px solid var(--zinc-200)',
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 76,
      width: 76,
      overflow: 'hidden',
      borderRadius: 12,
      background: 'linear-gradient(135deg, var(--stone-300, #d6d3d1), var(--stone-400, #a8a29e))',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.9)'
    }
  }, player.initials)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -6,
      bottom: -6,
      height: 28,
      width: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      border: '2px solid #fff',
      background: 'var(--zinc-100)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      fontSize: 8,
      fontWeight: 700,
      color: 'var(--zinc-600)',
      letterSpacing: '0.02em'
    },
    title: player.club
  }, player.clubCode)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flexShrink: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--zinc-500)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, player.club), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      margin: '4px 0 0',
      fontSize: 42,
      lineHeight: 1.08,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--zinc-950)'
    }
  }, player.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 15,
      color: 'var(--zinc-500)'
    }
  }, player.metaLine)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, "Positions"), /*#__PURE__*/React.createElement(Pitch, {
    width: 160,
    primary: player.primaryPosition,
    dots: player.positionDots,
    ariaLabel: player.positionsLabel
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      width: 1,
      background: 'var(--zinc-200)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, "Market value"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      lineHeight: 1,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: 'var(--zinc-950)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, player.marketValue), player.marketValueDelta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: 'var(--emerald-600)'
    }
  }, player.marketValueDelta)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      width: 1,
      background: 'var(--zinc-200)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, "Contract"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      lineHeight: 1,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: 'var(--zinc-950)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, player.contractYear))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 6,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(HeroActionButton, {
    label: "Shortlist",
    variant: "secondary"
  }), /*#__PURE__*/React.createElement(HeroActionButton, {
    label: "Write report",
    variant: "primary"
  }))));
}
const PROFILE_TABS = [{
  id: 'overview',
  label: 'Overview'
}, {
  id: 'performance',
  label: 'Performance'
}, {
  id: 'career',
  label: 'Career'
}, {
  id: 'scouting',
  label: 'Scouting'
}, {
  id: 'compare',
  label: 'Compare'
}];
function ProfileTabNav({
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      borderRadius: 12,
      background: 'var(--zinc-100)',
      padding: 6
    }
  }, PROFILE_TABS.map(tab => {
    const isActive = tab.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      role: "tab",
      "aria-selected": isActive,
      type: "button",
      onClick: () => onChange(tab.id),
      className: isActive ? '' : 'profile-tab-idle',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 8,
        padding: '8px 14px',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        background: isActive ? 'var(--zinc-950)' : 'transparent',
        color: isActive ? '#fff' : 'var(--zinc-700)'
      }
    }, tab.label);
  }));
}
Object.assign(window, {
  PlayerHero,
  ProfileTabNav,
  PROFILE_TABS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_player_profile/PlayerHero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_player_profile/app.jsx
try { (() => {
// Player profile app root — shell + tab state + FAB
const PLAYER = {
  name: 'Jonas van den Berg',
  initials: 'JV',
  club: 'Feyenoord',
  clubCode: 'FEY',
  metaLine: 'Age 19 · 187cm · Left foot · Netherlands',
  primaryPosition: 'ST',
  positionDots: [{
    position: 'ST',
    percentage: 62
  }, {
    position: 'LW',
    percentage: 24
  }, {
    position: 'AM',
    percentage: 9
  }],
  positionsLabel: 'Plays as Striker, Left Winger, Attacking Midfielder',
  positionMinutes: '1,840',
  positionMatches: 24,
  marketValue: '€18M',
  marketValueDelta: '↑ €2.5M (90d)',
  contractYear: '2027',
  verdict: {
    reportCount: 6,
    headline: 'Explosive box presence with elite finishing instincts; needs a stronger left-sided defensive workrate.',
    body: 'All six reports converge on finishing quality and movement in the final third — repeatedly found attacking the front post ahead of his marker. Two scouts independently flag pressing intensity dropping after the 70th minute. Profile fits a high-possession side looking for a penalty-box striker who can also rotate wide left.',
    mostRecent: 'M. de Vries · 18 May 2026 vs Ajax',
    grades: [{
      label: 'Perf',
      value: '7.8'
    }, {
      label: 'Pot',
      value: '8.5'
    }, {
      label: 'Char',
      value: '7.2'
    }]
  },
  seasonContextLabel: 'Season 2025/26 · Eredivisie',
  quickStats: [{
    label: 'Goals',
    value: 14,
    caption: '0.68 per 90',
    chip: 'TOP 5%'
  }, {
    label: 'Assists',
    value: 5,
    caption: '0.24 per 90'
  }, {
    label: 'Minutes',
    value: '1,840',
    caption: '24 matches'
  }, {
    label: 'xG',
    value: '11.2',
    caption: '+2.8 over xG'
  }],
  technicalContext: 'vs Eredivisie ST',
  technicalMetrics: [{
    label: 'Shots on target / 90',
    displayValue: '1.9',
    percentile: 92
  }, {
    label: 'Successful dribbles / 90',
    displayValue: '2.4',
    percentile: 78
  }, {
    label: 'Progressive passes / 90',
    displayValue: '3.1',
    percentile: 54
  }],
  physicalContext: 'vs Eredivisie ST',
  physicalMetrics: [{
    label: 'Top speed',
    displayValue: '34.6 km/h',
    percentile: 88
  }, {
    label: 'Sprints / 90',
    displayValue: '21.3',
    percentile: 71
  }, {
    label: 'Distance / 90',
    displayValue: '10.4 km',
    percentile: 46
  }],
  squadContextLabel: 'Squad context · Feyenoord',
  leaderboards: [{
    metricLabel: 'Goals / 90',
    playerRank: 1,
    totalPlayers: 24,
    entries: [{
      rank: 1,
      name: 'J. van den Berg',
      value: '0.68',
      me: true
    }, {
      rank: 2,
      name: 'S. Ueda',
      value: '0.51'
    }, {
      rank: 3,
      name: 'I. Paixão',
      value: '0.43'
    }, {
      rank: 4,
      name: 'C. Stengs',
      value: '0.31'
    }, {
      rank: 5,
      name: 'Q. Timber',
      value: '0.18'
    }]
  }, {
    metricLabel: 'xG / 90',
    playerRank: 2,
    totalPlayers: 24,
    entries: [{
      rank: 1,
      name: 'S. Ueda',
      value: '0.58'
    }, {
      rank: 2,
      name: 'J. van den Berg',
      value: '0.55',
      me: true
    }, {
      rank: 3,
      name: 'I. Paixão',
      value: '0.40'
    }, {
      rank: 4,
      name: 'C. Stengs',
      value: '0.27'
    }, {
      rank: 5,
      name: 'A. Milambo',
      value: '0.21'
    }]
  }, {
    metricLabel: 'Sprints / 90',
    playerRank: 3,
    totalPlayers: 24,
    entries: [{
      rank: 1,
      name: 'I. Paixão',
      value: '24.8'
    }, {
      rank: 2,
      name: 'B. Read',
      value: '22.6'
    }, {
      rank: 3,
      name: 'J. van den Berg',
      value: '21.3',
      me: true
    }, {
      rank: 4,
      name: 'C. Stengs',
      value: '19.7'
    }, {
      rank: 5,
      name: 'A. Milambo',
      value: '18.2'
    }]
  }],
  marketValueHistory: [{
    label: '21/22',
    value: 1.5
  }, {
    label: '22/23',
    value: 3
  }, {
    label: '23/24',
    value: 6.5
  }, {
    label: '24/25',
    value: 12
  }, {
    label: '25/26',
    value: 18
  }],
  fixtures: [{
    date: 'Sat 14 Jun',
    match: 'Feyenoord vs PSV',
    competition: 'Eredivisie'
  }, {
    date: 'Sun 22 Jun',
    match: 'AZ Alkmaar vs Feyenoord',
    competition: 'Eredivisie'
  }, {
    date: 'Wed 25 Jun',
    match: 'Feyenoord vs FC Twente',
    competition: 'KNVB Beker'
  }],
  performance: {
    technicalSubtitle: 'ST template · 8 KPIs · 1,840 mins',
    physicalSubtitle: 'ST cohort · 6 KPIs · 22 tracked matches',
    technicalContextLabel: 'vs Eredivisie ST',
    physicalContextLabel: 'vs Eredivisie ST',
    technicalPizza: [{
      metric: 'Shots',
      fullName: 'Shots on target / 90',
      rawValue: '1.9',
      percentile: 92
    }, {
      metric: 'xG',
      fullName: 'Expected goals / 90',
      rawValue: '0.55',
      percentile: 89
    }, {
      metric: 'Box touch',
      fullName: 'Touches in box / 90',
      rawValue: '6.8',
      percentile: 84
    }, {
      metric: 'Drib',
      fullName: 'Successful dribbles / 90',
      rawValue: '2.4',
      percentile: 78
    }, {
      metric: 'Aerial',
      fullName: 'Aerial duels won / 90',
      rawValue: '2.1',
      percentile: 62
    }, {
      metric: 'PXT pass',
      fullName: 'Pass value added (PXT)',
      rawValue: '0.18',
      percentile: 54
    }, {
      metric: 'Press',
      fullName: 'Pressing actions / 90',
      rawValue: '14.2',
      percentile: 41
    }, {
      metric: 'Cross',
      fullName: 'Crosses completed / 90',
      rawValue: '0.4',
      percentile: 23
    }],
    physicalPizza: [{
      metric: 'Speed',
      fullName: 'Top speed',
      rawValue: '34.6',
      unit: 'km/h',
      percentile: 88
    }, {
      metric: 'Accel',
      fullName: 'High accelerations / 90',
      rawValue: '11.9',
      percentile: 76
    }, {
      metric: 'Sprints',
      fullName: 'Sprints / 90',
      rawValue: '21.3',
      percentile: 71
    }, {
      metric: 'HSR',
      fullName: 'High-speed running m / 90',
      rawValue: '624',
      unit: 'm',
      percentile: 64
    }, {
      metric: 'Intensity',
      fullName: 'Distance at intensity %',
      rawValue: '8.4',
      percentile: 52
    }, {
      metric: 'Dist',
      fullName: 'Total distance / 90',
      rawValue: '10.41',
      unit: 'km',
      percentile: 46
    }],
    technicalMetrics: [{
      label: 'Shots on target / 90',
      displayValue: '1.9',
      percentile: 92
    }, {
      label: 'Expected goals / 90',
      displayValue: '0.55',
      percentile: 89
    }, {
      label: 'Touches in box / 90',
      displayValue: '6.8',
      percentile: 84
    }, {
      label: 'Successful dribbles / 90',
      displayValue: '2.4',
      percentile: 78
    }, {
      label: 'Pass value added',
      subLabel: '(PXT Pass)',
      displayValue: '0.18',
      percentile: 54
    }],
    physicalMetrics: [{
      label: 'Top speed',
      displayValue: '34.6 km/h',
      percentile: 88
    }, {
      label: 'High accelerations / 90',
      displayValue: '11.9',
      percentile: 76
    }, {
      label: 'Sprints / 90',
      displayValue: '21.3',
      percentile: 71
    }, {
      label: 'High-speed running / 90',
      displayValue: '624 m',
      percentile: 64
    }, {
      label: 'Total distance / 90',
      displayValue: '10.4 km',
      percentile: 46
    }],
    matchHistory: [{
      date: '18 May',
      opponent: 'Ajax',
      home: false,
      pos: 'ST',
      comp: 'Eredivisie',
      min: 90,
      ga: 3,
      gaDisplay: '2+1',
      drib: 0.31,
      xgxa: 1.24,
      speed: 34.1,
      sprints: 23,
      dist: 10.8
    }, {
      date: '11 May',
      opponent: 'FC Utrecht',
      home: true,
      pos: 'ST',
      comp: 'Eredivisie',
      min: 84,
      ga: 1,
      gaDisplay: '1+0',
      drib: 0.18,
      xgxa: 0.62,
      speed: 33.4,
      sprints: 21,
      dist: 10.2
    }, {
      date: '3 May',
      opponent: 'NEC Nijmegen',
      home: true,
      pos: 'LW',
      comp: 'Eredivisie',
      min: 90,
      ga: 0,
      gaDisplay: '0+1',
      drib: 0.42,
      xgxa: 0.48,
      speed: 34.6,
      sprints: 25,
      dist: 11.1
    }, {
      date: '27 Apr',
      opponent: 'PSV',
      home: false,
      pos: 'ST',
      comp: 'Eredivisie',
      min: 73,
      ga: 0,
      gaDisplay: '0+0',
      drib: 0.09,
      xgxa: 0.21,
      speed: 33.8,
      sprints: 18,
      dist: 9.4
    }, {
      date: '19 Apr',
      opponent: 'Sparta Rotterdam',
      home: true,
      pos: 'ST',
      comp: 'Eredivisie',
      min: 90,
      ga: 2,
      gaDisplay: '2+0',
      drib: 0.27,
      xgxa: 0.93,
      speed: 34.2,
      sprints: 22,
      dist: 10.6
    }, {
      date: '12 Apr',
      opponent: 'Go Ahead Eagles',
      home: false,
      pos: 'ST',
      comp: 'Eredivisie',
      min: 90,
      ga: 1,
      gaDisplay: '1+1',
      drib: 0.22,
      xgxa: 0.81,
      speed: 33.9,
      sprints: 20,
      dist: 10.3
    }, {
      date: '5 Apr',
      opponent: 'AZ Alkmaar',
      home: true,
      pos: 'ST',
      comp: 'KNVB Beker',
      min: 120,
      ga: 1,
      gaDisplay: '1+0',
      drib: 0.15,
      xgxa: 0.44,
      speed: 34.0,
      sprints: 27,
      dist: 13.2
    }, {
      date: '29 Mar',
      opponent: 'FC Twente',
      home: false,
      pos: 'LW',
      comp: 'Eredivisie',
      min: 64,
      ga: 0,
      gaDisplay: '0+0',
      drib: 0.36,
      xgxa: 0.18,
      speed: 34.4,
      sprints: 16,
      dist: 7.9
    }],
    trendSeries: [{
      id: 'tech_xgxa',
      label: 'xG+xA / 90',
      unit: '',
      peerMedian: 0.42,
      decimals: 2,
      points: [{
        month: 'SEP',
        value: 0.31,
        contextLabel: 'vs Heerenveen'
      }, {
        month: 'OCT',
        value: 0.48,
        contextLabel: 'vs Vitesse'
      }, {
        month: 'NOV',
        value: 0.39,
        contextLabel: 'vs Ajax'
      }, {
        month: 'DEC',
        value: 0.57,
        contextLabel: 'vs NEC'
      }, {
        month: 'JAN',
        value: 0.52,
        contextLabel: 'vs Heracles'
      }, {
        month: 'FEB',
        value: 0.71,
        contextLabel: 'vs Sparta'
      }, {
        month: 'MAR',
        value: 0.64,
        contextLabel: 'vs Twente'
      }, {
        month: 'APR',
        value: 0.58,
        contextLabel: 'vs PSV'
      }, {
        month: 'MAY',
        value: 0.92,
        contextLabel: 'vs Ajax'
      }]
    }, {
      id: 'phys_speed',
      label: 'Top speed',
      unit: ' km/h',
      peerMedian: 33.1,
      decimals: 1,
      points: [{
        month: 'SEP',
        value: 33.2,
        contextLabel: 'vs Heerenveen'
      }, {
        month: 'OCT',
        value: 33.8,
        contextLabel: 'vs Vitesse'
      }, {
        month: 'NOV',
        value: 33.5,
        contextLabel: 'vs Ajax'
      }, {
        month: 'DEC',
        value: 34.0,
        contextLabel: 'vs NEC'
      }, {
        month: 'JAN',
        value: 33.6,
        contextLabel: 'vs Heracles'
      }, {
        month: 'FEB',
        value: 34.2,
        contextLabel: 'vs Sparta'
      }, {
        month: 'MAR',
        value: 34.4,
        contextLabel: 'vs Twente'
      }, {
        month: 'APR',
        value: 33.8,
        contextLabel: 'vs PSV'
      }, {
        month: 'MAY',
        value: 34.6,
        contextLabel: 'vs Ajax'
      }]
    }, {
      id: 'phys_sprints',
      label: 'Sprints / 90',
      unit: '',
      peerMedian: 18.5,
      decimals: 0,
      points: [{
        month: 'SEP',
        value: 17
      }, {
        month: 'OCT',
        value: 19
      }, {
        month: 'NOV',
        value: 18
      }, {
        month: 'DEC',
        value: 21
      }, {
        month: 'JAN',
        value: 20
      }, {
        month: 'FEB',
        value: 22
      }, {
        month: 'MAR',
        value: 16
      }, {
        month: 'APR',
        value: 20
      }, {
        month: 'MAY',
        value: 23
      }]
    }]
  },
  career: {
    totals: {
      apps: 74,
      minutes: '5,480',
      minPerApp: 74,
      goals: 33,
      goalsPer90: '0.54',
      assists: 12,
      assistsPer90: '0.20',
      clubs: 2,
      youthClubs: 1
    },
    clubs: [{
      range: '2024 → now',
      name: 'Feyenoord',
      code: 'FEY',
      type: 'First team',
      fee: '—',
      apps: 45,
      goals: 22,
      assists: 8,
      current: true
    }, {
      range: '2023 → 2024',
      name: 'Excelsior',
      code: 'EXC',
      type: 'Loan',
      fee: 'Loan',
      apps: 29,
      goals: 11,
      assists: 4
    }, {
      range: '2016 → 2023',
      name: 'Feyenoord Academy',
      code: 'FEY',
      type: 'Academy',
      fee: '—',
      apps: null,
      goals: null,
      assists: null
    }],
    seasonStats: [{
      season: '2025/26',
      competition: 'Eredivisie',
      club: 'Feyenoord',
      apps: 24,
      minutes: 1840,
      goals: 14,
      assists: 5,
      y: 3,
      r: 0
    }, {
      season: '2025/26',
      competition: 'KNVB Beker',
      club: 'Feyenoord',
      apps: 3,
      minutes: 282,
      goals: 2,
      assists: 1,
      y: 0,
      r: 0
    }, {
      season: '2024/25',
      competition: 'Eredivisie',
      club: 'Feyenoord',
      apps: 18,
      minutes: 1058,
      goals: 6,
      assists: 2,
      y: 2,
      r: 0
    }, {
      season: '2023/24',
      competition: 'Eerste Divisie',
      club: 'Excelsior',
      apps: 29,
      minutes: 2300,
      goals: 11,
      assists: 4,
      y: 4,
      r: 1
    }],
    currentSeason: '2025/26',
    injuries: [{
      dates: '4 Sep → 28 Sep 2025',
      type: 'Hamstring strain',
      recovered: true,
      days: 24,
      matches: 4
    }, {
      dates: '11 Feb → 1 Mar 2024',
      type: 'Ankle sprain',
      recovered: true,
      days: 18,
      matches: 3
    }],
    availability: [{
      season: '2025/26',
      pct: 93.4,
      days: 24
    }, {
      season: '2023/24',
      pct: 95.1,
      days: 18
    }]
  }
};
function AskFab({
  playerName
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 40,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 40,
      borderRadius: 9999,
      padding: '0 18px',
      border: 'none',
      cursor: 'pointer',
      background: hover ? 'var(--zinc-800)' : 'var(--zinc-950)',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-floating)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      width: 14,
      height: 14
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
  })), "Ask about ", playerName);
}
function PlayerProfileApp() {
  const [collapsed, setCollapsed] = React.useState(true);
  const [tab, setTab] = React.useState('overview');
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(window.AppSidebar, {
    collapsed: collapsed,
    onToggle: () => setCollapsed(c => !c),
    onNewChat: () => {},
    conversations: [],
    activeId: null,
    onSelect: () => {}
  }), /*#__PURE__*/React.createElement("main", {
    className: "app-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-col"
  }, /*#__PURE__*/React.createElement(window.PlayerHero, {
    player: PLAYER
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement(window.ProfileTabNav, {
    active: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 24
    }
  }, tab === 'overview' ? /*#__PURE__*/React.createElement(window.OverviewTab, {
    player: PLAYER,
    onFullPerformance: () => setTab('performance'),
    onFullComparison: () => setTab('compare')
  }) : tab === 'performance' ? /*#__PURE__*/React.createElement(window.PerformanceTab, {
    data: PLAYER.performance
  }) : tab === 'career' ? /*#__PURE__*/React.createElement(window.CareerTab, {
    data: PLAYER.career,
    marketValueHistory: PLAYER.marketValueHistory,
    currentValue: PLAYER.marketValue
  }) : /*#__PURE__*/React.createElement(window.TabPlaceholder, {
    label: window.PROFILE_TABS.find(t => t.id === tab).label
  })))), /*#__PURE__*/React.createElement(AskFab, {
    playerName: PLAYER.name.split(' ')[0] + ' ' + PLAYER.name.split(' ').slice(-1)[0]
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(PlayerProfileApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_player_profile/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_team_profile/OverviewCards.jsx
try { (() => {
// Team profile Overview tab — FormCard, AgeProfileCard, TopPerformerCard,
// AvailabilityCard, LastMatchFormation, TacticalIdentityCard,
// UpcomingFixturesCard, SentrumPanel. Ports of components/profiles/club/*.
const {
  Eyebrow: TovEyebrow,
  StatCard: TovStatCard
} = window.SentrumDesignSystem_fd9502;
const tovMono = (size, color = 'var(--zinc-500)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra
});
const tovMicro = {
  ...tovMono(9, 'var(--zinc-400)', {
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase'
  })
};
const tovOutfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra
});

/* ---- Form card ---- */
function chipColor(r) {
  if (r === 'W') return 'var(--emerald-500)';
  if (r === 'D') return 'var(--zinc-400)';
  return '#ef4444';
}
function VenueSplit({
  label,
  split
}) {
  const total = split.w + split.d + split.l;
  const pct = n => total > 0 ? n / total * 100 : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '36px 1fr auto',
      alignItems: 'center',
      gap: 8,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: tovMicro
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      height: 6,
      overflow: 'hidden',
      borderRadius: 9999,
      background: 'var(--zinc-100)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--emerald-500)',
      width: pct(split.w) + '%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--zinc-400)',
      width: pct(split.d) + '%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#ef4444',
      width: pct(split.l) + '%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: tovMono(12, 'var(--zinc-900)', {
      fontWeight: 500
    })
  }, split.w, "-", split.d, "-", split.l));
}
function MidStat({
  label,
  value,
  tone
}) {
  const color = tone === 'up' ? 'var(--emerald-600)' : tone === 'down' ? '#dc2626' : 'var(--zinc-950)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...tovMono(9, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      })
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      ...tovOutfit(16),
      color
    }
  }, value));
}
function FormCard({
  form
}) {
  return /*#__PURE__*/React.createElement(TovStatCard, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(TovEyebrow, null, "Form"), /*#__PURE__*/React.createElement("span", {
    style: tovMicro
  }, "Last ", form.matches.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'flex',
      justifyContent: 'center',
      gap: 12
    }
  }, form.matches.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    },
    title: `${m.home ? 'vs' : '@'} ${m.opponent} (${m.score})`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      height: 32,
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
      color: '#fff',
      background: chipColor(m.result),
      boxShadow: i === 0 ? '0 0 0 2px rgba(16,185,129,0.7), 0 0 0 3px #fff' : 'none'
    }
  }, m.result), /*#__PURE__*/React.createElement("span", {
    style: tovMono(9, 'var(--zinc-400)', {
      fontWeight: 500
    })
  }, m.opponentCode), /*#__PURE__*/React.createElement("span", {
    style: tovMono(9, 'var(--zinc-400)')
  }, m.home ? 'H' : 'A')))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
      borderTop: '1px solid var(--zinc-100)',
      borderBottom: '1px solid var(--zinc-100)',
      padding: '12px 0'
    }
  }, /*#__PURE__*/React.createElement(MidStat, {
    label: "Form Pts",
    value: form.pts
  }), /*#__PURE__*/React.createElement(MidStat, {
    label: "Goals",
    value: form.goals
  }), /*#__PURE__*/React.createElement(MidStat, {
    label: "Diff",
    value: form.diff > 0 ? `+${form.diff}` : form.diff,
    tone: form.diff > 0 ? 'up' : form.diff < 0 ? 'down' : undefined
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(VenueSplit, {
    label: "Home",
    split: form.home
  }), /*#__PURE__*/React.createElement(VenueSplit, {
    label: "Away",
    split: form.away
  })));
}

/* ---- Age profile card ---- */
function AgeProfileCard({
  age
}) {
  const total = age.brackets.reduce((s, b) => s + b.count, 0);
  const modal = Math.max(...age.brackets.map(b => b.count));
  const [intPart, decPart] = age.average.toFixed(1).split('.');
  return /*#__PURE__*/React.createElement(TovStatCard, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(TovEyebrow, null, "Age Profile"), /*#__PURE__*/React.createElement("span", {
    style: tovMicro
  }, total, " players")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20,
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: tovOutfit(36, {
      letterSpacing: '-0.02em'
    })
  }, intPart), /*#__PURE__*/React.createElement("span", {
    style: tovOutfit(24, {
      letterSpacing: '-0.01em',
      color: 'var(--zinc-400)'
    })
  }, ".", decPart), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      paddingBottom: 4,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: 'var(--zinc-500)'
    }
  }, "avg age")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, age.brackets.map(b => {
    const isModal = b.count === modal && modal > 0;
    return /*#__PURE__*/React.createElement("div", {
      key: b.bracket,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 48,
        ...tovMono(10, isModal ? 'var(--zinc-900)' : 'var(--zinc-500)', {
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        })
      }
    }, b.bracket), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 6,
        flex: 1,
        overflow: 'hidden',
        borderRadius: 9999,
        background: 'var(--zinc-100)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        borderRadius: 9999,
        background: isModal ? 'var(--emerald-500)' : 'var(--zinc-300)',
        width: b.pct + '%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        textAlign: 'right',
        ...tovMono(12, isModal ? 'var(--zinc-900)' : 'var(--zinc-600)', {
          fontWeight: isModal ? 600 : 400
        })
      }
    }, b.count));
  })));
}

/* ---- Top performers card ---- */
function TopPerformerCard({
  performers
}) {
  const [metric, setMetric] = React.useState('goals');
  const list = performers[metric];
  const labels = {
    goals: 'Goals',
    assists: 'Assists',
    minutes: 'Minutes'
  };
  return /*#__PURE__*/React.createElement(TovStatCard, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(TovEyebrow, null, "Top Performers"), /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": "Metric",
    style: {
      display: 'inline-flex',
      alignSelf: 'flex-start',
      gap: 2,
      borderRadius: 6,
      background: 'var(--zinc-100)',
      padding: 2
    }
  }, Object.keys(labels).map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    role: "tab",
    "aria-selected": metric === m,
    onClick: () => setMetric(m),
    style: {
      borderRadius: 4,
      padding: '4px 10px',
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      background: metric === m ? '#fff' : 'transparent',
      color: metric === m ? 'var(--zinc-900)' : 'var(--zinc-500)',
      boxShadow: metric === m ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
    }
  }, labels[m])))), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, list.map((entry, i) => {
    const isLeader = i === 0;
    return /*#__PURE__*/React.createElement("li", {
      key: entry.name,
      className: "row-hover",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderRadius: 6,
        padding: '6px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 12,
        textAlign: 'right',
        ...tovMono(10, isLeader ? 'var(--emerald-600)' : 'var(--zinc-400)', {
          fontWeight: 500
        })
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      className: "snt-avatar",
      style: {
        width: 36,
        height: 36,
        fontSize: 11,
        boxShadow: isLeader ? '0 0 0 2px rgba(52,211,153,0.6)' : 'none'
      }
    }, entry.initials), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: 14,
        fontWeight: isLeader ? 600 : 500,
        color: isLeader ? 'var(--zinc-900)' : 'var(--zinc-700)'
      }
    }, entry.name), /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...tovMono(11)
      }
    }, entry.sub[metric])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...tovOutfit(18),
        color: isLeader ? 'var(--zinc-900)' : 'var(--zinc-600)'
      }
    }, entry.values[metric].toLocaleString()), /*#__PURE__*/React.createElement("span", {
      style: {
        ...tovMono(9, 'var(--zinc-400)', {
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        })
      }
    }, metric === 'minutes' ? 'min' : metric)));
  })));
}

/* ---- Availability card ---- */
function AvailabilityCard({
  injuries
}) {
  const count = injuries.length;
  const toneFor = days => days <= 7 ? 'var(--emerald-600)' : days <= 30 ? '#d97706' : '#dc2626';
  return /*#__PURE__*/React.createElement(TovStatCard, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(TovEyebrow, null, "Availability"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...tovMicro,
      color: count === 0 ? 'var(--emerald-600)' : count >= 3 ? '#d97706' : 'var(--zinc-500)'
    }
  }, count === 0 ? 'All fit' : `${count} out`)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, injuries.map(injury => /*#__PURE__*/React.createElement("li", {
    key: injury.name,
    className: "row-hover",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      borderRadius: 6,
      padding: '6px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "snt-avatar",
    style: {
      width: 36,
      height: 36,
      fontSize: 11
    }
  }, injury.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--zinc-900)'
    }
  }, injury.name), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 11,
      color: 'var(--zinc-500)'
    }
  }, injury.type)), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      ...tovMono(11, toneFor(injury.daysOut), {
        fontWeight: 500
      })
    }
  }, "back in ", injury.daysOut, "d")))));
}
Object.assign(window, {
  FormCard,
  AgeProfileCard,
  TopPerformerCard,
  AvailabilityCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_team_profile/OverviewCards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_team_profile/OverviewCards2.jsx
try { (() => {
// Team profile Overview tab, part 2 — LastMatchFormation, TacticalIdentityCard,
// UpcomingFixturesCard, SentrumPanel. Ports of components/profiles/club/*.
const {
  Eyebrow: Tov2Eyebrow,
  StatCard: Tov2StatCard
} = window.SentrumDesignSystem_fd9502;
const t2Mono = (size, color = 'var(--zinc-500)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra
});
const t2Outfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra
});

/* ---- Last match formation ---- */
// Landscape green pitch, 4-3-3 slots in % coords (attacking right).
const FORMATION_433 = [{
  pos: 'GK',
  x: 6,
  y: 50
}, {
  pos: 'RB',
  x: 22,
  y: 82
}, {
  pos: 'CB',
  x: 20,
  y: 62
}, {
  pos: 'CB2',
  x: 20,
  y: 38
}, {
  pos: 'LB',
  x: 22,
  y: 18
}, {
  pos: 'CM1',
  x: 44,
  y: 68
}, {
  pos: 'DM',
  x: 38,
  y: 50
}, {
  pos: 'CM2',
  x: 44,
  y: 32
}, {
  pos: 'RW',
  x: 68,
  y: 80
}, {
  pos: 'ST',
  x: 74,
  y: 50
}, {
  pos: 'LW',
  x: 68,
  y: 20
}];
function PitchLandscape() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 113 72",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      display: 'block',
      borderRadius: 8
    },
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "113",
    height: "72",
    fill: "#2d7a4f"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.08"
  }, Array.from({
    length: 8
  }).map((_, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: i * 14.125,
    y: "0",
    width: "7.06",
    height: "72",
    fill: "#fff"
  }))), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(255,255,255,0.65)",
    strokeWidth: "0.5",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "111",
    height: "70"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "56.5",
    y1: "1",
    x2: "56.5",
    y2: "71"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "56.5",
    cy: "36",
    r: "8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "56.5",
    cy: "36",
    r: "0.6",
    fill: "rgba(255,255,255,0.65)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "18",
    width: "15",
    height: "36"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "27",
    width: "5.5",
    height: "18"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "97",
    y: "18",
    width: "15",
    height: "36"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "106.5",
    y: "27",
    width: "5.5",
    height: "18"
  })));
}
function PlayerChip({
  player
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "snt-avatar",
    style: {
      width: 34,
      height: 34,
      fontSize: 10,
      background: '#fff',
      color: 'var(--zinc-700)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
    }
  }, player.initials), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -4,
      right: -7,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 15,
      height: 15,
      borderRadius: 9999,
      background: 'var(--zinc-950)',
      color: '#fff',
      ...t2Mono(8, '#fff', {
        fontWeight: 600
      }),
      padding: '0 3px'
    }
  }, player.num)), /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 3,
      background: 'rgba(0,0,0,0.55)',
      padding: '1px 5px',
      fontSize: 9,
      fontWeight: 600,
      color: '#fff',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-sans)'
    }
  }, player.short));
}
function LastMatchFormation({
  match
}) {
  return /*#__PURE__*/React.createElement(Tov2StatCard, {
    style: {
      overflow: 'hidden',
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--zinc-200)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      ...t2Mono(10, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase'
      })
    }
  }, /*#__PURE__*/React.createElement("span", null, match.competition), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-300)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, match.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minWidth: 0,
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: match.homeIsUs ? 'var(--zinc-900)' : 'var(--zinc-500)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, match.homeTeam)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...t2Outfit(30, {
        fontWeight: 700
      }),
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, match.scoreHome), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-300)'
    }
  }, "\u2013"), /*#__PURE__*/React.createElement("span", null, match.scoreAway)), /*#__PURE__*/React.createElement("span", {
    style: {
      borderRadius: 4,
      padding: '2px 6px',
      fontSize: 10,
      fontWeight: 700,
      color: '#fff',
      background: match.result === 'W' ? 'var(--emerald-500)' : match.result === 'D' ? '#f59e0b' : '#ef4444'
    }
  }, match.result)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minWidth: 0,
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: match.homeIsUs ? 'var(--zinc-500)' : 'var(--zinc-900)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, match.awayTeam)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 220px 220px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 760,
      margin: '0 auto',
      aspectRatio: '113 / 72'
    }
  }, /*#__PURE__*/React.createElement(PitchLandscape, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      borderRadius: 9999,
      background: 'rgba(255,255,255,0.7)',
      padding: '2px 8px',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#064e3b',
      backdropFilter: 'blur(2px)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Attack"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192")), FORMATION_433.map((slot, i) => /*#__PURE__*/React.createElement("div", {
    key: slot.pos,
    style: {
      position: 'absolute',
      left: slot.x + '%',
      top: slot.y + '%',
      transform: 'translate(-50%, -50%)'
    }
  }, /*#__PURE__*/React.createElement(PlayerChip, {
    player: match.starters[i]
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      ...t2Mono(11, 'var(--zinc-500)', {
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
      })
    }
  }, match.formation)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '1px solid var(--zinc-200)',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      ...t2Mono(10, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      })
    }
  }, "Subs Used (", match.subs.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, match.subs.map((sub, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      ...t2Mono(10)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--zinc-700)'
    }
  }, sub.minute, "'"), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "off ", sub.off)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      borderRadius: 6,
      background: 'var(--zinc-100)',
      padding: '4px 6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--zinc-900)'
    }
  }, sub.on), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--zinc-400)'
    }
  }, "(", sub.num, ")")))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      ...t2Mono(10, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      })
    }
  }, "Bench (", match.bench.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, match.bench.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      borderRadius: 6,
      background: 'var(--zinc-50)',
      padding: '4px 6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--zinc-700)'
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--zinc-400)'
    }
  }, "(", p.num, ")")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '1px solid var(--zinc-200)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      ...t2Mono(10, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      })
    }
  }, "Match Events (", match.events.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, match.events.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      textAlign: 'right',
      ...t2Mono(11, 'var(--zinc-500)', {
        fontWeight: 600
      })
    }
  }, e.minute, "'"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 14,
      display: 'inline-flex',
      justifyContent: 'center'
    }
  }, e.kind === 'goal' ? /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--zinc-700)",
    strokeWidth: "2",
    style: {
      width: 11,
      height: 11
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3.5",
    fill: "var(--zinc-700)",
    stroke: "none"
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 8,
      height: 11,
      borderRadius: 1.5,
      background: e.kind === 'yellow' ? '#facc15' : '#ef4444',
      verticalAlign: 'middle'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: 'var(--zinc-900)'
    }
  }, e.player, e.detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-400)'
    }
  }, " ", e.detail)), /*#__PURE__*/React.createElement("span", {
    style: {
      ...t2Mono(10, e.us ? 'var(--emerald-600)' : 'var(--zinc-400)', {
        fontWeight: 600
      })
    }
  }, e.teamCode)))))));
}

/* ---- Tactical identity card ---- */
function TacticalIdentityCard({
  data
}) {
  const [filter, setFilter] = React.useState(data.competitions[0].id);
  const [openRow, setOpenRow] = React.useState(null);
  const showComp = filter === 'all';
  const matches = filter === 'all' ? data.matches : data.matches.filter(m => m.compId === filter);
  const groups = {};
  for (const m of matches) {
    groups[m.formation] = groups[m.formation] || [];
    groups[m.formation].push(m);
  }
  const formations = Object.entries(groups).map(([name, ms]) => ({
    name,
    count: ms.length,
    pct: Math.round(ms.length / matches.length * 100),
    matches: ms
  })).sort((a, b) => b.count - a.count);
  return /*#__PURE__*/React.createElement(Tov2StatCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      borderBottom: '1px solid var(--zinc-100)',
      padding: '12px 16px'
    }
  }, [...data.competitions, {
    id: 'all',
    name: 'All'
  }].map(c => {
    const selected = filter === c.id;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      type: "button",
      "aria-pressed": selected,
      onClick: () => {
        setFilter(c.id);
        setOpenRow(null);
      },
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 9999,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        border: selected ? '1px solid transparent' : '1px solid var(--zinc-200)',
        background: selected ? 'var(--zinc-950)' : 'var(--zinc-50)',
        color: selected ? '#fff' : 'var(--zinc-700)',
        whiteSpace: 'nowrap'
      }
    }, c.name);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px'
    }
  }, formations.map(entry => {
    const open = openRow === entry.name;
    return /*#__PURE__*/React.createElement("div", {
      key: entry.name,
      style: {
        borderBottom: '1px solid var(--zinc-100)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setOpenRow(open ? null : entry.name),
      "aria-expanded": open,
      className: "row-hover",
      style: {
        display: 'grid',
        width: '100%',
        gridTemplateColumns: '16px 104px minmax(0,1fr) 68px',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0',
        fontSize: 12,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        width: 14,
        height: 14,
        color: 'var(--zinc-400)',
        transform: open ? 'rotate(90deg)' : 'none'
      },
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "m9 18 6-6-6-6"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'left',
        fontWeight: 500,
        color: 'var(--zinc-900)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, entry.name), /*#__PURE__*/React.createElement("span", {
      style: {
        height: 12,
        overflow: 'hidden',
        borderRadius: 4,
        background: 'var(--zinc-100)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        height: '100%',
        background: open ? 'var(--emerald-500)' : 'var(--zinc-400)',
        width: entry.pct + '%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        ...t2Mono(12, 'var(--zinc-600)')
      }
    }, entry.pct, "% ", /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.6
      }
    }, "(", entry.count, ")"))), open && /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: 'none',
        margin: 0,
        padding: '4px 4px 8px 28px'
      }
    }, entry.matches.map((m, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '52px minmax(0,1fr) 16px 56px',
        alignItems: 'center',
        gap: 8,
        padding: '6px 0',
        fontSize: 12,
        borderTop: i > 0 ? '1px solid var(--zinc-50)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        ...t2Mono(11, 'var(--zinc-500)', {
          fontWeight: 500
        })
      }
    }, m.date), /*#__PURE__*/React.createElement("span", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'var(--zinc-900)'
      }
    }, m.opponent), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'center',
        ...t2Mono(10, 'var(--zinc-400)', {
          fontWeight: 500,
          textTransform: 'uppercase'
        })
      }
    }, m.home ? 'H' : 'A'), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 4,
        padding: '2px 6px',
        ...t2Mono(11, undefined, {
          fontWeight: 600
        }),
        background: m.result === 'W' ? 'var(--emerald-50)' : m.result === 'L' ? '#fef2f2' : 'var(--zinc-100)',
        color: m.result === 'W' ? 'var(--emerald-700)' : m.result === 'L' ? '#b91c1c' : 'var(--zinc-700)',
        boxShadow: 'inset 0 0 0 1px ' + (m.result === 'W' ? 'rgba(5,150,105,0.2)' : m.result === 'L' ? 'rgba(220,38,38,0.2)' : 'var(--zinc-300)')
      }
    }, /*#__PURE__*/React.createElement("span", null, m.result), /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.7
      }
    }, m.score))))));
  })));
}

/* ---- Upcoming fixtures card ---- */
function UpcomingFixturesCard({
  fixtures
}) {
  const badgeTone = {
    now: {
      background: '#d1fae5',
      color: '#065f46'
    },
    soon: {
      background: '#fef3c7',
      color: '#92400e'
    },
    far: {
      background: 'var(--zinc-100)',
      color: 'var(--zinc-600)'
    }
  };
  return /*#__PURE__*/React.createElement(Tov2StatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, fixtures.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'stretch',
      gap: 12,
      padding: 12,
      borderTop: i > 0 ? '1px solid var(--zinc-100)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: 48,
      flexShrink: 0,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      background: 'var(--zinc-50)',
      padding: '4px 0',
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: t2Mono(9, 'var(--zinc-500)', {
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    })
  }, f.weekday), /*#__PURE__*/React.createElement("span", {
    style: t2Outfit(16, {
      fontWeight: 700
    })
  }, f.day), /*#__PURE__*/React.createElement("span", {
    style: t2Mono(9, 'var(--zinc-500)', {
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    })
  }, f.month)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minWidth: 0,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      ...t2Mono(10, 'var(--zinc-500)', {
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      })
    }
  }, f.competition), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--zinc-900)'
    }
  }, f.opponent)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexShrink: 0,
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 4
    }
  }, f.badge && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 4,
      padding: '2px 6px',
      fontSize: 10,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      ...badgeTone[f.badgeTone]
    }
  }, f.badge), /*#__PURE__*/React.createElement("span", {
    style: t2Mono(10, 'var(--zinc-400)', {
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    })
  }, f.home ? 'Home' : 'Away'))))));
}

/* ---- Sentrum panel ("What we know") ---- */
function SentrumPanel({
  activity
}) {
  const totalReports = activity.players.reduce((s, p) => s + p.reports, 0);
  return /*#__PURE__*/React.createElement(Tov2StatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8,
      borderBottom: '1px solid var(--zinc-100)',
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ...t2Mono(10, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase'
      })
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      height: 4,
      width: 4,
      borderRadius: 9999,
      background: 'var(--emerald-500)'
    }
  }), activity.players.length, " covered", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-300)'
    }
  }, "\xB7"), totalReports, " reports"), /*#__PURE__*/React.createElement("span", {
    style: t2Mono(10, 'var(--zinc-400)')
  }, activity.lastActivity)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, activity.players.map((p, i) => /*#__PURE__*/React.createElement("li", {
    key: p.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      borderTop: i > 0 ? '1px solid var(--zinc-100)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "snt-avatar",
    style: {
      width: 28,
      height: 28,
      fontSize: 9,
      background: '#d1fae5',
      color: '#047857'
    }
  }, p.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--zinc-900)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: t2Mono(9, 'var(--zinc-500)', {
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    })
  }, p.pos)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, p.reports > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      borderRadius: 6,
      background: '#d1fae5',
      padding: '2px 6px',
      ...t2Mono(10, '#065f46', {
        fontWeight: 600
      })
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      width: 10,
      height: 10
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v4a2 2 0 0 0 2 2h4"
  })), p.reports), p.shortlisted && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "#fbbf24",
    stroke: "#f59e0b",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      width: 12,
      height: 12
    },
    "aria-label": "Shortlisted"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      flexShrink: 0,
      textAlign: 'right',
      ...t2Mono(10, 'var(--zinc-500)', {
        fontWeight: 500
      })
    }
  }, p.last)))));
}
Object.assign(window, {
  LastMatchFormation,
  TacticalIdentityCard,
  UpcomingFixturesCard,
  SentrumPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_team_profile/OverviewCards2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_team_profile/SquadAndTable.jsx
try { (() => {
// Team profile — Squad table (ClubSquad.tsx port) and League standings
// (LeagueStandings.tsx port).
const {
  Eyebrow: TsqEyebrow,
  StatCard: TsqStatCard
} = window.SentrumDesignSystem_fd9502;
const sqMono = (size, color = 'var(--zinc-500)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra
});
const sqTh = {
  ...sqMono(10, 'var(--zinc-500)', {
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
  })
};
const POS_BADGE = {
  GK: {
    background: '#fef3c7',
    color: '#b45309'
  },
  DEF: {
    background: '#e0f2fe',
    color: '#0369a1'
  },
  MID: {
    background: 'var(--emerald-50)',
    color: 'var(--emerald-700)'
  },
  FWD: {
    background: '#fee2e2',
    color: '#b91c1c'
  }
};
const POS_ORDER = {
  GK: 1,
  DEF: 2,
  MID: 3,
  FWD: 4
};
function contractColor(year) {
  if (year <= 2026) return {
    color: '#dc2626',
    fontWeight: 500
  };
  if (year <= 2027) return {
    color: '#d97706'
  };
  return {
    color: 'var(--zinc-700)'
  };
}
const SortGlyph = ({
  state
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    width: 13,
    height: 13,
    opacity: state ? 1 : 0.45
  },
  "aria-hidden": "true"
}, state === 'asc' ? /*#__PURE__*/React.createElement("path", {
  d: "m18 15-6-6-6 6"
}) : state === 'desc' ? /*#__PURE__*/React.createElement("path", {
  d: "m6 9 6 6 6-6"
}) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
  d: "m7 15 5 5 5-5"
}), /*#__PURE__*/React.createElement("path", {
  d: "m7 9 5-5 5 5"
})));
function SquadTable({
  players
}) {
  const [sortField, setSortField] = React.useState('position');
  const [sortDir, setSortDir] = React.useState('asc');
  const [minutesView, setMinutesView] = React.useState('league');
  const getMinutes = p => minutesView === 'league' ? p.minLeague : p.minAll;
  const maxMinutes = Math.max(...players.map(getMinutes));
  const handleSort = field => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');else {
      setSortField(field);
      setSortDir(field === 'name' || field === 'position' ? 'asc' : 'desc');
    }
  };
  const sorted = [...players].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'position') cmp = (POS_ORDER[a.pos] || 99) - (POS_ORDER[b.pos] || 99);else if (sortField === 'name') cmp = a.name.localeCompare(b.name);else if (sortField === 'age') cmp = a.age - b.age;else if (sortField === 'value') cmp = a.valueNum - b.valueNum;else if (sortField === 'minutes') cmp = getMinutes(a) - getMinutes(b);else if (sortField === 'contract') cmp = a.contract - b.contract;
    return sortDir === 'asc' ? cmp : -cmp;
  });
  const SortHeader = ({
    label,
    field,
    align = 'left'
  }) => /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '12px',
      textAlign: align
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleSort(field),
    className: "sort-btn",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 0,
      ...sqTh,
      color: sortField === field ? 'var(--zinc-900)' : 'var(--zinc-500)'
    }
  }, label, /*#__PURE__*/React.createElement(SortGlyph, {
    state: sortField === field ? sortDir : null
  })));
  return /*#__PURE__*/React.createElement(TsqStatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--zinc-100)',
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...sqMono(10, 'var(--zinc-500)', {
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase'
      })
    }
  }, "Minutes Played"), /*#__PURE__*/React.createElement("div", {
    className: "snt-tabs__list",
    style: {
      padding: 2
    }
  }, [['league', 'League Only'], ['all', 'All Competitions']].map(([v, label]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    type: "button",
    className: "snt-tabs__trigger",
    "data-active": minutesView === v ? 'true' : 'false',
    style: {
      height: 24,
      fontSize: 12,
      padding: '2px 10px'
    },
    onClick: () => setMinutesView(v)
  }, label)))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid var(--zinc-200)',
      background: 'var(--zinc-50)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 40,
      padding: 12,
      textAlign: 'left',
      ...sqTh
    }
  }, "#"), /*#__PURE__*/React.createElement(SortHeader, {
    label: "Player",
    field: "name"
  }), /*#__PURE__*/React.createElement(SortHeader, {
    label: "Pos",
    field: "position",
    align: "center"
  }), /*#__PURE__*/React.createElement(SortHeader, {
    label: "Age",
    field: "age",
    align: "center"
  }), /*#__PURE__*/React.createElement(SortHeader, {
    label: "Minutes",
    field: "minutes",
    align: "right"
  }), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: 12,
      textAlign: 'right',
      ...sqTh
    }
  }, "Share"), /*#__PURE__*/React.createElement(SortHeader, {
    label: "Value",
    field: "value",
    align: "right"
  }), /*#__PURE__*/React.createElement(SortHeader, {
    label: "Contract",
    field: "contract",
    align: "right"
  }))), /*#__PURE__*/React.createElement("tbody", null, sorted.map((p, i) => {
    const mins = getMinutes(p);
    return /*#__PURE__*/React.createElement("tr", {
      key: p.name,
      className: "row-hover",
      style: {
        cursor: 'pointer',
        borderBottom: i < sorted.length - 1 ? '1px solid var(--zinc-100)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        textAlign: 'center',
        ...sqMono(14, 'var(--zinc-500)', {
          fontWeight: 500
        })
      }
    }, p.num), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "snt-avatar",
      style: {
        width: 32,
        height: 32,
        fontSize: 10
      }
    }, p.initials), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--zinc-900)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--zinc-500)'
      }
    }, p.nationality)))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        borderRadius: 4,
        padding: '2px 6px',
        ...sqMono(10, undefined, {
          fontWeight: 600,
          letterSpacing: '0.1em'
        }),
        ...POS_BADGE[p.pos]
      }
    }, p.pos)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        textAlign: 'center',
        fontSize: 14,
        color: 'var(--zinc-700)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.age), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        textAlign: 'right',
        fontSize: 14,
        color: 'var(--zinc-700)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, mins.toLocaleString()), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        textAlign: 'right',
        fontSize: 14,
        color: 'var(--zinc-500)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, Math.round(mins / maxMinutes * 100), "%"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--emerald-600)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.value), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 12px',
        textAlign: 'right',
        fontSize: 14,
        fontVariantNumeric: 'tabular-nums',
        ...contractColor(p.contract)
      }
    }, p.contract));
  }))));
}

/* ---- League standings ---- */
function positionAccent(position, total) {
  if (position <= 4) return '#0ea5e9';
  if (position <= 6) return '#f59e0b';
  if (position === 7) return 'var(--emerald-500)';
  if (position > total - 3) return '#ef4444';
  return 'transparent';
}
function LeagueStandings({
  standings,
  highlightTeam
}) {
  const total = standings.length;
  const center = {
    padding: '10px 8px',
    textAlign: 'center',
    fontSize: 14,
    color: 'var(--zinc-700)',
    fontVariantNumeric: 'tabular-nums'
  };
  return /*#__PURE__*/React.createElement(TsqStatCard, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid var(--zinc-200)',
      background: 'var(--zinc-50)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 40,
      padding: '12px 8px',
      textAlign: 'center',
      ...sqTh
    }
  }, "#"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '12px 8px',
      textAlign: 'left',
      ...sqTh
    }
  }, "Team"), ['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      width: 52,
      padding: '12px 8px',
      textAlign: 'center',
      ...sqTh
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, standings.map((team, i) => {
    const highlighted = team.name === highlightTeam;
    return /*#__PURE__*/React.createElement("tr", {
      key: team.name,
      className: highlighted ? '' : 'row-hover',
      style: {
        background: highlighted ? 'var(--emerald-50)' : 'transparent',
        borderBottom: i < standings.length - 1 ? '1px solid var(--zinc-100)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 20,
        width: 4,
        borderRadius: 9999,
        background: positionAccent(team.position, total)
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--zinc-700)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, team.position))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: 24,
        width: 24,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 4,
        background: 'var(--zinc-100)',
        ...sqMono(8, 'var(--zinc-500)', {
          fontWeight: 700
        })
      }
    }, team.tla), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: highlighted ? 700 : 500,
        color: 'var(--zinc-900)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, team.name))), /*#__PURE__*/React.createElement("td", {
      style: center
    }, team.p), /*#__PURE__*/React.createElement("td", {
      style: center
    }, team.w), /*#__PURE__*/React.createElement("td", {
      style: center
    }, team.d), /*#__PURE__*/React.createElement("td", {
      style: center
    }, team.l), /*#__PURE__*/React.createElement("td", {
      style: center
    }, team.gf), /*#__PURE__*/React.createElement("td", {
      style: center
    }, team.ga), /*#__PURE__*/React.createElement("td", {
      style: {
        ...center,
        color: team.gd > 0 ? 'var(--emerald-600)' : team.gd < 0 ? '#dc2626' : 'var(--zinc-700)'
      }
    }, team.gd > 0 ? `+${team.gd}` : team.gd), /*#__PURE__*/React.createElement("td", {
      style: {
        ...center,
        fontWeight: 700,
        color: 'var(--zinc-950)'
      }
    }, team.pts));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
      borderTop: '1px solid var(--zinc-100)',
      padding: '10px 16px'
    }
  }, [['#0ea5e9', 'Champions League'], ['#f59e0b', 'Europa League'], ['var(--emerald-500)', 'Conference League'], ['#ef4444', 'Relegation']].map(([color, label]) => /*#__PURE__*/React.createElement("span", {
    key: label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: 'var(--zinc-500)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      height: 10,
      width: 4,
      borderRadius: 9999,
      background: color
    }
  }), label))));
}
Object.assign(window, {
  SquadTable,
  LeagueStandings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_team_profile/SquadAndTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_team_profile/TeamHeader.jsx
try { (() => {
// Team profile header + sticky tab nav — recreation of ClubHeader.tsx
// and the pill nav from club-profile-content.tsx.
const {
  Eyebrow: ThEyebrow
} = window.SentrumDesignSystem_fd9502;
const thLabel = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--zinc-500)',
  lineHeight: 1,
  fontFamily: 'var(--font-sans)'
};
const thOutfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  ...extra
});
const ThIcon = ({
  d,
  size = 16
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    width: size,
    height: size,
    flexShrink: 0
  },
  "aria-hidden": "true"
}, d);
const PinIcon = () => /*#__PURE__*/React.createElement(ThIcon, {
  d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  }))
});
const StadiumIcon = () => /*#__PURE__*/React.createElement(ThIcon, {
  d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 14v.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 14v.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.25 16.25h1.5L12 17z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"
  }))
});
const CalIcon = () => /*#__PURE__*/React.createElement(ThIcon, {
  d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M8 2v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "18",
    height: "18",
    x: "3",
    y: "4",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 10h18"
  }))
});
function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function TeamKpi({
  label,
  value,
  sub,
  subTone,
  tone
}) {
  const toneColor = tone === 'up' ? 'var(--emerald-600)' : tone === 'down' ? '#dc2626' : 'var(--zinc-950)';
  const subColor = subTone === 'up' ? 'var(--emerald-600)' : subTone === 'down' ? '#dc2626' : 'var(--zinc-500)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: thLabel
  }, label), /*#__PURE__*/React.createElement("span", {
    style: thOutfit(30, {
      letterSpacing: '-0.01em',
      color: toneColor
    })
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      fontVariantNumeric: 'tabular-nums',
      color: subColor,
      visibility: sub ? 'visible' : 'hidden'
    }
  }, sub || ' '));
}
function TeamHeader({
  team
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid var(--zinc-200)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '24px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minWidth: 0,
      flex: 1,
      alignItems: 'center',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 80,
      width: 80,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 12,
      background: 'linear-gradient(135deg, #f5f5f4, #e7e5e4)',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: thOutfit(24, {
      fontWeight: 700,
      color: 'var(--zinc-400)'
    })
  }, team.tla)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--zinc-500)'
    }
  }, team.competition), /*#__PURE__*/React.createElement("h1", {
    style: {
      ...thOutfit(36, {
        letterSpacing: '-0.02em',
        lineHeight: 1.08,
        color: 'var(--zinc-950)'
      }),
      margin: '4px 0 0',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, team.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: 16,
      rowGap: 4,
      fontSize: 14,
      color: 'var(--zinc-500)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(StadiumIcon, null), team.venue, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-400)'
    }
  }, "(", team.venueCapacity, ")")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(PinIcon, null), team.city), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(CalIcon, null), "Est. ", team.founded)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: 12,
      rowGap: 4,
      fontSize: 12,
      color: 'var(--zinc-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, team.colors), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--zinc-400)'
    }
  }, "Manager \xB7 "), team.coach)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'stretch',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(TeamKpi, {
    label: "Position",
    value: ordinal(team.standings.position),
    sub: team.standings.positionDelta ? `↑ ${team.standings.positionDelta} vs last season` : null,
    subTone: "up"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--zinc-200)'
    }
  }), /*#__PURE__*/React.createElement(TeamKpi, {
    label: "Points",
    value: team.standings.points,
    sub: `${team.standings.played} played`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--zinc-200)'
    }
  }), /*#__PURE__*/React.createElement(TeamKpi, {
    label: "Goal diff",
    value: team.standings.gd > 0 ? `+${team.standings.gd}` : team.standings.gd,
    tone: team.standings.gd > 0 ? 'up' : team.standings.gd < 0 ? 'down' : undefined,
    sub: `${team.standings.gf} for · ${team.standings.ga} ag.`
  })))));
}
const TEAM_TABS = [{
  key: 'overview',
  label: 'Overview'
}, {
  key: 'squad',
  label: 'Squad'
}, {
  key: 'table',
  label: 'Table'
}, {
  key: 'fixtures',
  label: 'Fixtures & Results'
}];
function TeamTabNav({
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Club profile sections",
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderBottom: '1px solid rgba(228,228,231,0.8)',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      display: 'flex',
      padding: '10px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      borderRadius: 12,
      background: 'var(--zinc-100)',
      padding: 6
    }
  }, TEAM_TABS.map(({
    key,
    label
  }) => {
    const selected = active === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      type: "button",
      role: "tab",
      "aria-selected": selected,
      onClick: () => onChange(key),
      className: selected ? '' : 'profile-tab-idle',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 8,
        padding: '8px 14px',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        background: selected ? 'var(--zinc-950)' : 'transparent',
        color: selected ? '#fff' : 'var(--zinc-700)'
      }
    }, label);
  }))));
}
Object.assign(window, {
  TeamHeader,
  TeamTabNav,
  TEAM_TABS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_team_profile/TeamHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sentrum_team_profile/app.jsx
try { (() => {
// Team profile app root — sample data + tab switching + shell
const TEAM = {
  name: 'Feyenoord',
  tla: 'FEY',
  competition: 'Eredivisie',
  venue: 'De Kuip',
  venueCapacity: '47,500',
  city: 'Rotterdam',
  founded: 1908,
  colors: 'Red / White / Black',
  coach: 'R. van Persie',
  standings: {
    position: 2,
    positionDelta: 1,
    points: 71,
    played: 32,
    gd: 38,
    gf: 74,
    ga: 36
  }
};
const FORM = {
  matches: [{
    result: 'W',
    opponent: 'Ajax',
    opponentCode: 'AJA',
    score: '3-1',
    home: true
  }, {
    result: 'W',
    opponent: 'FC Utrecht',
    opponentCode: 'UTR',
    score: '2-0',
    home: true
  }, {
    result: 'D',
    opponent: 'NEC Nijmegen',
    opponentCode: 'NEC',
    score: '1-1',
    home: false
  }, {
    result: 'L',
    opponent: 'PSV',
    opponentCode: 'PSV',
    score: '0-2',
    home: false
  }, {
    result: 'W',
    opponent: 'Sparta Rotterdam',
    opponentCode: 'SPA',
    score: '4-1',
    home: true
  }],
  pts: '10/15',
  goals: '10-5',
  diff: 5,
  home: {
    w: 11,
    d: 3,
    l: 2
  },
  away: {
    w: 9,
    d: 4,
    l: 3
  }
};
const AGE = {
  average: 24.3,
  brackets: [{
    bracket: 'U21',
    count: 6,
    pct: 33
  }, {
    bracket: '21-24',
    count: 5,
    pct: 28
  }, {
    bracket: '25-28',
    count: 4,
    pct: 22
  }, {
    bracket: '29-32',
    count: 2,
    pct: 11
  }, {
    bracket: '33+',
    count: 1,
    pct: 6
  }]
};
const PERFORMERS = {
  goals: [{
    name: 'J. van den Berg',
    initials: 'JV',
    values: {
      goals: 16,
      assists: 6,
      minutes: 2122
    },
    sub: {
      goals: '6a · 27 apps',
      assists: '16g · 27 apps',
      minutes: '16g · 6a'
    }
  }, {
    name: 'S. Ueda',
    initials: 'SU',
    values: {
      goals: 12,
      assists: 3,
      minutes: 1980
    },
    sub: {
      goals: '3a · 26 apps',
      assists: '12g · 26 apps',
      minutes: '12g · 3a'
    }
  }, {
    name: 'I. Paixão',
    initials: 'IP',
    values: {
      goals: 9,
      assists: 11,
      minutes: 2540
    },
    sub: {
      goals: '11a · 30 apps',
      assists: '9g · 30 apps',
      minutes: '9g · 11a'
    }
  }],
  assists: [{
    name: 'I. Paixão',
    initials: 'IP',
    values: {
      goals: 9,
      assists: 11,
      minutes: 2540
    },
    sub: {
      goals: '11a · 30 apps',
      assists: '9g · 30 apps',
      minutes: '9g · 11a'
    }
  }, {
    name: 'C. Stengs',
    initials: 'CS',
    values: {
      goals: 5,
      assists: 9,
      minutes: 2310
    },
    sub: {
      goals: '9a · 29 apps',
      assists: '5g · 29 apps',
      minutes: '5g · 9a'
    }
  }, {
    name: 'J. van den Berg',
    initials: 'JV',
    values: {
      goals: 16,
      assists: 6,
      minutes: 2122
    },
    sub: {
      goals: '6a · 27 apps',
      assists: '16g · 27 apps',
      minutes: '16g · 6a'
    }
  }],
  minutes: [{
    name: 'T. Wellenreuther',
    initials: 'TW',
    values: {
      goals: 0,
      assists: 0,
      minutes: 2880
    },
    sub: {
      goals: '0a · 32 apps',
      assists: '0g · 32 apps',
      minutes: '0g · 0a'
    }
  }, {
    name: 'D. Hancko',
    initials: 'DH',
    values: {
      goals: 3,
      assists: 2,
      minutes: 2790
    },
    sub: {
      goals: '2a · 31 apps',
      assists: '3g · 31 apps',
      minutes: '3g · 2a'
    }
  }, {
    name: 'I. Paixão',
    initials: 'IP',
    values: {
      goals: 9,
      assists: 11,
      minutes: 2540
    },
    sub: {
      goals: '11a · 30 apps',
      assists: '9g · 30 apps',
      minutes: '9g · 11a'
    }
  }]
};
const INJURIES = [{
  name: 'Q. Timber',
  initials: 'QT',
  type: 'Hamstring strain',
  daysOut: 6
}, {
  name: 'B. Read',
  initials: 'BR',
  type: 'Ankle sprain',
  daysOut: 19
}, {
  name: 'G. Trauner',
  initials: 'GT',
  type: 'ACL rehabilitation',
  daysOut: 74
}];
const LAST_MATCH = {
  competition: 'Eredivisie',
  date: '18 May 2026',
  homeTeam: 'Feyenoord',
  awayTeam: 'Ajax',
  homeIsUs: true,
  scoreHome: 3,
  scoreAway: 1,
  result: 'W',
  formation: '4-3-3',
  starters: [{
    short: 'Wellenreuther',
    initials: 'TW',
    num: 1
  }, {
    short: 'Read',
    initials: 'BR',
    num: 2
  }, {
    short: 'Beelen',
    initials: 'TB',
    num: 4
  }, {
    short: 'Hancko',
    initials: 'DH',
    num: 6
  }, {
    short: 'Smal',
    initials: 'GS',
    num: 5
  }, {
    short: 'Stengs',
    initials: 'CS',
    num: 10
  }, {
    short: 'Zerrouki',
    initials: 'RZ',
    num: 8
  }, {
    short: 'Milambo',
    initials: 'AM',
    num: 18
  }, {
    short: 'Hadj Moussa',
    initials: 'AH',
    num: 11
  }, {
    short: 'Van den Berg',
    initials: 'JV',
    num: 9
  }, {
    short: 'Paixão',
    initials: 'IP',
    num: 14
  }],
  subs: [{
    minute: 63,
    off: 'A. Milambo',
    on: 'I. Hwang',
    num: 26
  }, {
    minute: 74,
    off: 'A. Hadj Moussa',
    on: 'L. Sauer',
    num: 7
  }, {
    minute: 88,
    off: 'J. van den Berg',
    on: 'S. Ueda',
    num: 19
  }],
  bench: [{
    name: 'J. Bijlow',
    num: 22
  }, {
    name: 'J. Mitchell',
    num: 3
  }, {
    name: 'T. Nieuwkoop',
    num: 15
  }],
  events: [{
    minute: 12,
    kind: 'goal',
    player: 'J. van den Berg',
    detail: '(pen)',
    teamCode: 'FEY',
    us: true
  }, {
    minute: 34,
    kind: 'yellow',
    player: 'R. Zerrouki',
    teamCode: 'FEY',
    us: true
  }, {
    minute: 41,
    kind: 'goal',
    player: 'K. Taylor',
    teamCode: 'AJA'
  }, {
    minute: 58,
    kind: 'goal',
    player: 'I. Paixão',
    teamCode: 'FEY',
    us: true
  }, {
    minute: 71,
    kind: 'yellow',
    player: 'J. Šutalo',
    teamCode: 'AJA'
  }, {
    minute: 84,
    kind: 'goal',
    player: 'J. van den Berg',
    teamCode: 'FEY',
    us: true
  }]
};
const TACTICAL = {
  competitions: [{
    id: 'ere',
    name: 'Eredivisie'
  }, {
    id: 'knvb',
    name: 'KNVB Beker'
  }],
  matches: [{
    formation: '4-3-3',
    compId: 'ere',
    date: '18 May',
    opponent: 'Ajax',
    home: true,
    result: 'W',
    score: '3-1'
  }, {
    formation: '4-3-3',
    compId: 'ere',
    date: '11 May',
    opponent: 'FC Utrecht',
    home: true,
    result: 'W',
    score: '2-0'
  }, {
    formation: '4-3-3',
    compId: 'ere',
    date: '3 May',
    opponent: 'NEC Nijmegen',
    home: false,
    result: 'D',
    score: '1-1'
  }, {
    formation: '4-2-3-1',
    compId: 'ere',
    date: '27 Apr',
    opponent: 'PSV',
    home: false,
    result: 'L',
    score: '0-2'
  }, {
    formation: '4-3-3',
    compId: 'ere',
    date: '19 Apr',
    opponent: 'Sparta Rotterdam',
    home: true,
    result: 'W',
    score: '4-1'
  }, {
    formation: '4-3-3',
    compId: 'ere',
    date: '12 Apr',
    opponent: 'Go Ahead Eagles',
    home: false,
    result: 'W',
    score: '2-1'
  }, {
    formation: '4-2-3-1',
    compId: 'knvb',
    date: '5 Apr',
    opponent: 'AZ Alkmaar',
    home: true,
    result: 'W',
    score: '2-1 aet'
  }, {
    formation: '4-3-3',
    compId: 'ere',
    date: '29 Mar',
    opponent: 'FC Twente',
    home: false,
    result: 'D',
    score: '0-0'
  }, {
    formation: '3-5-2',
    compId: 'ere',
    date: '15 Mar',
    opponent: 'Heracles',
    home: true,
    result: 'W',
    score: '3-0'
  }]
};
const FIXTURES = [{
  weekday: 'Sat',
  day: '14',
  month: 'Jun',
  competition: 'Eredivisie',
  opponent: 'PSV',
  home: true,
  badge: 'in 4d',
  badgeTone: 'soon'
}, {
  weekday: 'Sun',
  day: '22',
  month: 'Jun',
  competition: 'Eredivisie',
  opponent: 'AZ Alkmaar',
  home: false,
  badge: 'in 2w',
  badgeTone: 'far'
}, {
  weekday: 'Wed',
  day: '25',
  month: 'Jun',
  competition: 'KNVB Beker',
  opponent: 'FC Twente',
  home: true,
  badge: 'in 2w',
  badgeTone: 'far'
}, {
  weekday: 'Sun',
  day: '29',
  month: 'Jun',
  competition: 'Eredivisie',
  opponent: 'FC Groningen',
  home: false,
  badge: 'in 3w',
  badgeTone: 'far'
}, {
  weekday: 'Sat',
  day: '05',
  month: 'Jul',
  competition: 'Eredivisie',
  opponent: 'Heerenveen',
  home: true,
  badge: null
}];
const SENTRUM_ACTIVITY = {
  lastActivity: '2d ago',
  players: [{
    name: 'J. van den Berg',
    initials: 'JV',
    pos: 'ST',
    reports: 6,
    shortlisted: true,
    last: '2d'
  }, {
    name: 'A. Milambo',
    initials: 'AM',
    pos: 'CM',
    reports: 3,
    shortlisted: true,
    last: '1w'
  }, {
    name: 'I. Paixão',
    initials: 'IP',
    pos: 'LW',
    reports: 2,
    shortlisted: false,
    last: '3w'
  }, {
    name: 'T. Beelen',
    initials: 'TB',
    pos: 'CB',
    reports: 1,
    shortlisted: false,
    last: '1mo'
  }]
};
const SQUAD = [{
  num: 1,
  name: 'T. Wellenreuther',
  initials: 'TW',
  nationality: 'Germany',
  pos: 'GK',
  age: 30,
  minLeague: 2880,
  minAll: 3240,
  value: '€8M',
  valueNum: 8,
  contract: 2028
}, {
  num: 22,
  name: 'J. Bijlow',
  initials: 'JB',
  nationality: 'Netherlands',
  pos: 'GK',
  age: 28,
  minLeague: 0,
  minAll: 240,
  value: '€5M',
  valueNum: 5,
  contract: 2026
}, {
  num: 2,
  name: 'B. Read',
  initials: 'BR',
  nationality: 'England',
  pos: 'DEF',
  age: 21,
  minLeague: 2210,
  minAll: 2530,
  value: '€12M',
  valueNum: 12,
  contract: 2029
}, {
  num: 4,
  name: 'T. Beelen',
  initials: 'TB',
  nationality: 'Netherlands',
  pos: 'DEF',
  age: 21,
  minLeague: 2470,
  minAll: 2790,
  value: '€10M',
  valueNum: 10,
  contract: 2028
}, {
  num: 6,
  name: 'D. Hancko',
  initials: 'DH',
  nationality: 'Slovakia',
  pos: 'DEF',
  age: 28,
  minLeague: 2790,
  minAll: 3110,
  value: '€32M',
  valueNum: 32,
  contract: 2027
}, {
  num: 5,
  name: 'G. Smal',
  initials: 'GS',
  nationality: 'Netherlands',
  pos: 'DEF',
  age: 26,
  minLeague: 2380,
  minAll: 2660,
  value: '€9M',
  valueNum: 9,
  contract: 2027
}, {
  num: 8,
  name: 'R. Zerrouki',
  initials: 'RZ',
  nationality: 'Algeria',
  pos: 'MID',
  age: 28,
  minLeague: 2190,
  minAll: 2490,
  value: '€14M',
  valueNum: 14,
  contract: 2027
}, {
  num: 10,
  name: 'C. Stengs',
  initials: 'CS',
  nationality: 'Netherlands',
  pos: 'MID',
  age: 27,
  minLeague: 2310,
  minAll: 2620,
  value: '€18M',
  valueNum: 18,
  contract: 2028
}, {
  num: 18,
  name: 'A. Milambo',
  initials: 'AM',
  nationality: 'Netherlands',
  pos: 'MID',
  age: 21,
  minLeague: 2050,
  minAll: 2370,
  value: '€22M',
  valueNum: 22,
  contract: 2027
}, {
  num: 26,
  name: 'I. Hwang',
  initials: 'IH',
  nationality: 'South Korea',
  pos: 'MID',
  age: 24,
  minLeague: 1240,
  minAll: 1480,
  value: '€11M',
  valueNum: 11,
  contract: 2028
}, {
  num: 33,
  name: 'Q. Timber',
  initials: 'QT',
  nationality: 'Netherlands',
  pos: 'MID',
  age: 25,
  minLeague: 1680,
  minAll: 1890,
  value: '€16M',
  valueNum: 16,
  contract: 2026
}, {
  num: 9,
  name: 'J. van den Berg',
  initials: 'JV',
  nationality: 'Netherlands',
  pos: 'FWD',
  age: 19,
  minLeague: 1840,
  minAll: 2122,
  value: '€18M',
  valueNum: 18,
  contract: 2027
}, {
  num: 19,
  name: 'S. Ueda',
  initials: 'SU',
  nationality: 'Japan',
  pos: 'FWD',
  age: 27,
  minLeague: 1980,
  minAll: 2230,
  value: '€15M',
  valueNum: 15,
  contract: 2027
}, {
  num: 14,
  name: 'I. Paixão',
  initials: 'IP',
  nationality: 'Brazil',
  pos: 'FWD',
  age: 22,
  minLeague: 2540,
  minAll: 2870,
  value: '€28M',
  valueNum: 28,
  contract: 2029
}, {
  num: 11,
  name: 'A. Hadj Moussa',
  initials: 'AH',
  nationality: 'Algeria',
  pos: 'FWD',
  age: 23,
  minLeague: 1760,
  minAll: 2010,
  value: '€13M',
  valueNum: 13,
  contract: 2028
}, {
  num: 7,
  name: 'L. Sauer',
  initials: 'LS',
  nationality: 'Netherlands',
  pos: 'FWD',
  age: 20,
  minLeague: 980,
  minAll: 1190,
  value: '€7M',
  valueNum: 7,
  contract: 2029
}];
const STANDINGS = [{
  position: 1,
  name: 'PSV',
  tla: 'PSV',
  p: 32,
  w: 24,
  d: 5,
  l: 3,
  gf: 82,
  ga: 30,
  gd: 52,
  pts: 77
}, {
  position: 2,
  name: 'Feyenoord',
  tla: 'FEY',
  p: 32,
  w: 22,
  d: 5,
  l: 5,
  gf: 74,
  ga: 36,
  gd: 38,
  pts: 71
}, {
  position: 3,
  name: 'Ajax',
  tla: 'AJA',
  p: 32,
  w: 20,
  d: 6,
  l: 6,
  gf: 68,
  ga: 38,
  gd: 30,
  pts: 66
}, {
  position: 4,
  name: 'AZ Alkmaar',
  tla: 'AZ',
  p: 32,
  w: 18,
  d: 7,
  l: 7,
  gf: 61,
  ga: 40,
  gd: 21,
  pts: 61
}, {
  position: 5,
  name: 'FC Twente',
  tla: 'TWE',
  p: 32,
  w: 16,
  d: 8,
  l: 8,
  gf: 55,
  ga: 42,
  gd: 13,
  pts: 56
}, {
  position: 6,
  name: 'FC Utrecht',
  tla: 'UTR',
  p: 32,
  w: 14,
  d: 9,
  l: 9,
  gf: 48,
  ga: 44,
  gd: 4,
  pts: 51
}, {
  position: 7,
  name: 'Go Ahead Eagles',
  tla: 'GAE',
  p: 32,
  w: 12,
  d: 8,
  l: 12,
  gf: 44,
  ga: 46,
  gd: -2,
  pts: 44
}, {
  position: 8,
  name: 'NEC Nijmegen',
  tla: 'NEC',
  p: 32,
  w: 11,
  d: 9,
  l: 12,
  gf: 46,
  ga: 50,
  gd: -4,
  pts: 42
}, {
  position: 9,
  name: 'Sparta Rotterdam',
  tla: 'SPA',
  p: 32,
  w: 10,
  d: 9,
  l: 13,
  gf: 38,
  ga: 46,
  gd: -8,
  pts: 39
}, {
  position: 10,
  name: 'Heerenveen',
  tla: 'HEE',
  p: 32,
  w: 9,
  d: 9,
  l: 14,
  gf: 36,
  ga: 48,
  gd: -12,
  pts: 36
}, {
  position: 11,
  name: 'Heracles Almelo',
  tla: 'HER',
  p: 32,
  w: 9,
  d: 7,
  l: 16,
  gf: 38,
  ga: 56,
  gd: -18,
  pts: 34
}, {
  position: 12,
  name: 'FC Groningen',
  tla: 'GRO',
  p: 32,
  w: 8,
  d: 9,
  l: 15,
  gf: 32,
  ga: 48,
  gd: -16,
  pts: 33
}, {
  position: 13,
  name: 'Fortuna Sittard',
  tla: 'FOR',
  p: 32,
  w: 8,
  d: 8,
  l: 16,
  gf: 34,
  ga: 52,
  gd: -18,
  pts: 32
}, {
  position: 14,
  name: 'PEC Zwolle',
  tla: 'PEC',
  p: 32,
  w: 8,
  d: 7,
  l: 17,
  gf: 35,
  ga: 56,
  gd: -21,
  pts: 31
}, {
  position: 15,
  name: 'Willem II',
  tla: 'WIL',
  p: 32,
  w: 7,
  d: 9,
  l: 16,
  gf: 30,
  ga: 50,
  gd: -20,
  pts: 30
}, {
  position: 16,
  name: 'NAC Breda',
  tla: 'NAC',
  p: 32,
  w: 7,
  d: 8,
  l: 17,
  gf: 31,
  ga: 54,
  gd: -23,
  pts: 29
}, {
  position: 17,
  name: 'RKC Waalwijk',
  tla: 'RKC',
  p: 32,
  w: 6,
  d: 8,
  l: 18,
  gf: 28,
  ga: 56,
  gd: -28,
  pts: 26
}, {
  position: 18,
  name: 'Almere City',
  tla: 'ALM',
  p: 32,
  w: 5,
  d: 7,
  l: 20,
  gf: 24,
  ga: 62,
  gd: -38,
  pts: 22
}];
function PlaceholderCard({
  label,
  note
}) {
  const {
    Eyebrow
  } = window.SentrumDesignSystem_fd9502;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 6,
      border: '1px dashed var(--zinc-300)',
      background: 'rgba(250,250,250,0.3)',
      padding: 48,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    dot: false,
    style: {
      justifyContent: 'center'
    }
  }, label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 14,
      color: 'var(--zinc-500)'
    }
  }, note));
}
function OverviewTabContent() {
  const {
    Eyebrow
  } = window.SentrumDesignSystem_fd9502;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    className: "mission-row",
    style: {
      marginBottom: 24,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(window.FormCard, {
    form: FORM
  }), /*#__PURE__*/React.createElement(window.AgeProfileCard, {
    age: AGE
  }), /*#__PURE__*/React.createElement(window.TopPerformerCard, {
    performers: PERFORMERS
  }), /*#__PURE__*/React.createElement(window.AvailabilityCard, {
    injuries: INJURIES
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Last Match"), /*#__PURE__*/React.createElement(window.LastMatchFormation, {
    match: LAST_MATCH
  })), /*#__PURE__*/React.createElement("div", {
    className: "triple-row",
    style: {
      marginBottom: 32,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Tactical Identity"), /*#__PURE__*/React.createElement(window.TacticalIdentityCard, {
    data: TACTICAL
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Next 5 fixtures"), /*#__PURE__*/React.createElement(window.UpcomingFixturesCard, {
    fixtures: FIXTURES
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 16
    }
  }, "What we know"), /*#__PURE__*/React.createElement(window.SentrumPanel, {
    activity: SENTRUM_ACTIVITY
  }))));
}
function SquadTabContent() {
  const {
    Eyebrow
  } = window.SentrumDesignSystem_fd9502;
  const [view, setView] = React.useState('list');
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Squad \xB7 ", SQUAD.length, " players"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "snt-btn snt-btn--outline snt-btn--sm"
  }, "Compare"), /*#__PURE__*/React.createElement("div", {
    className: "snt-tabs__list",
    style: {
      padding: 2
    }
  }, [['list', 'List'], ['overview', 'Overview']].map(([v, label]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    type: "button",
    className: "snt-tabs__trigger",
    "data-active": view === v ? 'true' : 'false',
    style: {
      height: 26,
      fontSize: 12,
      padding: '2px 12px'
    },
    onClick: () => setView(v)
  }, label))))), view === 'list' ? /*#__PURE__*/React.createElement(window.SquadTable, {
    players: SQUAD
  }) : /*#__PURE__*/React.createElement(PlaceholderCard, {
    label: "Squad overview",
    note: "Squad analysis charts not recreated in this kit \u2014 see SquadAnalysis.tsx in the repo."
  }));
}
function TeamProfileApp() {
  const {
    Eyebrow
  } = window.SentrumDesignSystem_fd9502;
  const [collapsed, setCollapsed] = React.useState(true);
  const [tab, setTab] = React.useState('overview');
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(window.AppSidebar, {
    collapsed: collapsed,
    onToggle: () => setCollapsed(c => !c),
    onNewChat: () => {},
    conversations: [],
    activeId: null,
    onSelect: () => {}
  }), /*#__PURE__*/React.createElement("main", {
    className: "app-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-scroll"
  }, /*#__PURE__*/React.createElement(window.TeamHeader, {
    team: TEAM
  }), /*#__PURE__*/React.createElement(window.TeamTabNav, {
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '24px 32px 96px'
    }
  }, tab === 'overview' && /*#__PURE__*/React.createElement(OverviewTabContent, null), tab === 'squad' && /*#__PURE__*/React.createElement(SquadTabContent, null), tab === 'table' && /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 16
    }
  }, "League Standings"), /*#__PURE__*/React.createElement(window.LeagueStandings, {
    standings: STANDINGS,
    highlightTeam: "Feyenoord"
  })), tab === 'fixtures' && /*#__PURE__*/React.createElement(PlaceholderCard, {
    label: "Fixtures & Results",
    note: "Full fixtures list not recreated in this kit \u2014 see FixturesResultsTab.tsx in the repo."
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ask-fab"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      width: 14,
      height: 14
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
  })), "Ask about Feyenoord")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(TeamProfileApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sentrum_team_profile/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.SentrumAttribution = __ds_scope.SentrumAttribution;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Composer = __ds_scope.Composer;

__ds_ns.FollowUpChips = __ds_scope.FollowUpChips;

__ds_ns.PromptRow = __ds_scope.PromptRow;

__ds_ns.TypingIndicator = __ds_scope.TypingIndicator;

__ds_ns.UserMessage = __ds_scope.UserMessage;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.SidebarNavItem = __ds_scope.SidebarNavItem;

__ds_ns.SidebarSection = __ds_scope.SidebarSection;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.PercentileBar = __ds_scope.PercentileBar;

__ds_ns.Pitch = __ds_scope.Pitch;

__ds_ns.StatCard = __ds_scope.StatCard;

})();
