Collapsible group in the app sidebar (Scouting, Recruitment, Shadow Teams, …).

```jsx
<SidebarSection icon={<ClipboardIcon />} title="Scouting">
  <SidebarNavItem icon={<FileTextIcon />} label="Reports" active />
  <SidebarNavItem icon={<FilePlusIcon />} label="New Report" />
</SidebarSection>
```

Child rows are inset 8px; the chevron rotates 90° when open.
