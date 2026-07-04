export function renderHTML(): string {
  return /* html */ `
  <div class="jb-pin-input-web-component">
    <div class="inputs-wrapper" part="inputs-wrapper" role="group" aria-describedby="message">
    </div>
    <div class="message-box" id="message" part="message" aria-live="polite" role="status"></div>
  </div>
  `;
}
