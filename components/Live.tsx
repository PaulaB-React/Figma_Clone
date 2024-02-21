import {
	RoomProvider,
	useBroadcastEvent,
	useEventListener,
	useMyPresence,
	useOthers
} from "@/liveblocks.config";
import {
	useState,
	useCallback,
	useEffect,
	useMemo
} from "react";

import useInterval from "@/hooks/useInterval";

import LiveCursors from "./cursor/LiveCursors";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState, Reaction } from "@/types/type";
import ReactionSelector from "./reaction/ReactionBtn";


export default function Live() {
	const others = useOthers();
	const [{ cursor }, updateMyPresence] = useMyPresence() as any;
	
	const [cursorState, setCursorState] = useState<CursorState>({
		mode: CursorMode.Hidden
	});

	const [reaction, setReaction] = useState<Reaction[]>([]);

	const handlePointerMove = useCallback((event: React.PointerEvent) =>
	{
		event.preventDefault();

		if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
			const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
			const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
	
			updateMyPresence({ cursor: { x, y } });
		}
	}, []);

	const handlePointerLeave = useCallback((event: React.PointerEvent) =>
	{
		setCursorState({ mode: CursorMode.Hidden });

		updateMyPresence({cursor:null, message:null});
	}, []);

	const handlePointerDown = useCallback((event: React.PointerEvent) =>
	{
		
		const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
		const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

		updateMyPresence({ cursor: { x, y } });
		setCursorState((state: CursorState) =>
			cursorState.mode === CursorMode.Reaction ?
				{ ...state, isPreset: true } : state
		);
	}, [cursorState.mode, setCursorState]);

	const handlePointerUp = useCallback((event: React.PointerEvent) => {
		setCursorState((state: CursorState) =>
			cursorState.mode === CursorMode.Reaction ?
				{ ...state, isPreset: true } : state
		);
	}, [cursorState.mode, setCursorState])

	useEffect(() => {
		const onKeyUp = (e: KeyboardEvent) => { 
			if (e.key === "/") {
				setCursorState({
					mode: CursorMode.Chat,
					previousMessage: null,
					message: ""
				});
			} else if (e.key === "Escape") {
				updateMyPresence({ message: "" });
				setCursorState({mode: CursorMode.Hidden})
			} else if (e.key === "e") {
				setCursorState({mode: CursorMode.ReactionSelector})
			}
		};
		const onKeyDown = (e: KeyboardEvent) => { 
			if (e.key === "/") {
				e.preventDefault();
			}
		};
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("keyup", onKeyDown);

		return () => {
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("keyup", onKeyDown);
		}
	}, [updateMyPresence]);

	const setReactions = useCallback((reaction: string) => {
		setCursorState({mode: CursorMode.Reaction, reaction, isPressed: false})
	}, []);
	return (
		<div
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			className="h-[100vh] w-full flex justify-center items-center text-center"
		>
			<h1 className="text-2xl text-white">Liveblocks Playground</h1>

			{cursor && (
				<CursorChat
					cursor={cursor}
					cursorState={cursorState}
					setCursorState={setCursorState}
					updateMyPresence={updateMyPresence}
				/>
			)}

			{cursorState.mode === CursorMode.ReactionSelector && (
				<ReactionSelector
					setReaction={setReactions}
				/>
			)}
			<LiveCursors others={others} />
		</div>
	)
}
