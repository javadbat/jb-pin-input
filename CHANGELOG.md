# Changelog

## [2.0.0] - 2026-09-03

### Added

- Added the standard public `reset()` method; native form reset delegates to the same behavior.

### Changed

- Standardized private DOM event handlers on the `#on<Target><Event>()` naming convention.
- Standardized private empty-value and form synchronization helpers as `#clearValue()` and `#updateFormValue()`.

## [1.16.0]

### Changed

- Made custom-element module evaluation SSR-safe by extending `JBBaseComponent` where needed and registering elements through the shared `defineWebComponent()` helper; raised the minimum `jb-core` version to `0.35.0`.
- Updated component color defaults to use the shared semantic content and surface tokens.

## [1.15.0] - 2026-07-30

### Added

- Added the standard `formDisabledCallback()` to synchronize the component disabled state with disabled forms and fieldsets.
- Added Storybook interaction coverage for initial-value initialization, live-value precedence, explicit `null`, and native form reset.

### Changed

- Added `initialValue` as the default and reset PIN; it seeds `value` only until the live value is explicitly set.
- Updated the React wrapper so an omitted `value` does not overwrite `initialValue`, while explicit `null` still clears the live value.

### Fixed

- fix name assignment property


## [1.14.0] - 2026-07-19

### Added

- Added the standard `formResetCallback()` to restore `initialValue` and clear validation state.

### Changed

- Standardized `invalid` custom-state and `ariaInvalid` updates in validation display and cleanup callbacks.
- Added the React `initialValue` prop and forwarded `value` and `initialValue` directly as React 19 custom-element properties.
- Breaking: renamed `--jb-pin-input-message-error-color` to `--jb-pin-input-message-color-error`.
- Added reusable custom theme recipes and standardized them on `jb-pin-input.<theme>-style`, parts, and states.

### Fixed

- Preserved property-assigned values until pin cells are initialized during connection.
- Added the missing `jb-core/i18n` build external and UMD global mapping.
