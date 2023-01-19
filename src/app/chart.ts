import { Interaction, InteractionItem } from 'chart.js';
import { getRelativePosition } from 'chart.js/helpers';

declare module 'chart.js' {
  interface InteractionModeMap {
    closestCol: InteractionModeFunction;
  }
}

Interaction.modes.closestCol = function (chart, e) {
  const position = getRelativePosition(e, chart);
  const items = new Map<number, InteractionItem>();

  Interaction.evaluateInteractionItems(
    chart,
    'x',
    position,
    (element, datasetIndex, index) => {
      const curr = items.get(datasetIndex);
      if (curr) {
        if (
          Math.abs(curr.element.x - position.x) >
          Math.abs(element.x - position.x)
        ) {
          items.set(datasetIndex, { element, datasetIndex, index });
        }
      } else {
        items.set(datasetIndex, { element, datasetIndex, index });
      }
    }
  );

  return [...items.values()];
};
