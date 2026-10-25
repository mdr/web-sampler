var e=`
html[data-color-mode="light"][data-theme~="light:light-increased-contrast"], [data-subtree-theme][data-color-mode="light"][data-theme~="light:light-increased-contrast"],
html[data-color-mode="dark"][data-theme~="dark:light-increased-contrast"], [data-subtree-theme][data-color-mode="dark"][data-theme~="dark:light-increased-contrast"],
html[data-color-mode="light"][data-contrast-mode="more"][data-theme~="light:light"],
html[data-color-mode="dark"][data-contrast-mode="more"][data-theme~="dark:light"] {
  color-scheme: light;
  --ds-background-neutral-subtle-hovered: #17171708;
  --ds-background-neutral-subtle-pressed: #0515240F;
  --ds-background-selected: #0515240F;
  --ds-background-selected-hovered: #0B120E24;
  --ds-background-selected-pressed: #080F214A;
  --ds-background-selected-bold: #292A2E;
  --ds-background-selected-bold-hovered: #3B3D42;
  --ds-background-selected-bold-pressed: #505258;
  --ds-border-selected: #292A2E;
  --ds-text-selected: #292A2E;
  --ds-icon-selected: #292A2E;
  --ds-blanket-selected: #0515240F;
}
`;export{e as default};