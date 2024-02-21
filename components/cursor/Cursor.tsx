import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
	color: string;
	x: number;
	y: number;
	message: string;

}

export default function Cursor({color, y, x, message}: Props) {
	return (
		<div className="pointer-events-none absolute top-0 left-0"
			style={{ transform: `translateX(${x}px) translateY(${y}px)` }}>
			<CursorSVG color={color } />
			
			{message && (
				<div
					className="absolute left-2 top-5 rounded-3xl px-4 py-2"
					style={{  background: color}}
				>
					<p
						className="text-white whitespace-nowrap text-sm leading-relaxed"
					>{message}</p>
				</div>
			)}
		</div>
	)
}
