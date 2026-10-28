interface HandoffElements {
  hero: HTMLElement;
  stage: HTMLElement;
  layers: readonly HTMLElement[];
  debug: HTMLElement;
  debugMode: boolean;
}

// Oculta las capas DE VERDAD: visibility heredada no basta, porque la proyección
// declara visibility:visible. No se elimina el escenario ni el espaciador del flujo.
export function applyCinematicHandoff(elements: HandoffElements, complete: boolean) {
  elements.hero.classList.toggle('cinematic-complete', complete);
  for (const layer of elements.layers) {
    if (layer.hidden !== complete) layer.hidden = complete;
  }
  elements.stage.inert = complete;
  elements.debug.hidden = complete || !elements.debugMode;
}
