# Changelog

## Unreleased

### Changed

- Added the React `initialValue` prop and forwarded `value` and `initialValue` directly as React 19 custom-element properties.
- Breaking: renamed `--jb-pin-input-message-error-color` to `--jb-pin-input-message-color-error`.
- Added reusable custom theme recipes and standardized them on `jb-pin-input.<theme>-style`, parts, and states.

### Fixed

- Preserved property-assigned values until pin cells are initialized during connection.
- Added the missing `jb-core/i18n` build external and UMD global mapping.
