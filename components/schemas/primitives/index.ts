/**
 * Primitives SVG des schémas pédagogiques.
 *
 * Point d'entrée unique : `import { … } from "@/components/schemas/primitives"`.
 * Tous les composants sont des composants serveur sans état ; toutes les
 * couleurs passent par la palette sémantique (`SCHEMA_COLORS`).
 */

export {
  SCHEMA_COLORS,
  SCHEMA_COLOR_NAMES,
  schemaColor,
  isSchemaColor,
  type SchemaColor,
} from "./palette";

export { SchemaSvg, type SchemaSvgProps } from "./schema-svg";
export { WaterBackground, type WaterBackgroundProps } from "./water-background";
export {
  DepthAxis,
  createDepthScale,
  type DepthAxisProps,
  type DepthScaleConfig,
} from "./depth-axis";
export {
  TimeAxis,
  createTimeScale,
  type TimeAxisProps,
  type TimeScaleConfig,
} from "./time-axis";
export {
  DiverSilhouette,
  type DiverSilhouetteProps,
  type DiverOrientation,
} from "./diver-silhouette";
export { TankIcon, RegulatorIcon, type EquipmentIconProps } from "./equipment";
export {
  ArrowAnnotated,
  type ArrowAnnotatedProps,
  type ArrowCoude,
} from "./arrow-annotated";
export { ValueCursor, type ValueCursorProps } from "./value-cursor";
export { LegendBox, type LegendBoxProps, type LegendItem } from "./legend-box";
export { Bubble, BubbleColumn, type BubbleProps, type BubbleColumnProps } from "./bubble";
export {
  FlowBox,
  FlowArrow,
  flowBoxHeight,
  FLOW_BOX_WIDTH,
  FLOW_LINE_HEIGHT,
  FLOW_PADDING_Y,
  type FlowBoxProps,
  type FlowArrowProps,
} from "./flow";
