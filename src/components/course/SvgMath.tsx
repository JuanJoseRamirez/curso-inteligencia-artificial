import MathText from './MathText';

export default function SvgMath({ tex, x, y, width = 80 }: { tex: string; x: number; y: number; width?: number }) {
  return <foreignObject x={x - width / 2} y={y - 15} width={width} height="32"><div className="svg-math"><MathText text={`$${tex}$`} /></div></foreignObject>;
}
