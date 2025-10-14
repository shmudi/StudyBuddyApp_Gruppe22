
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

const INITIAL_SECONDS = 25 * 60;

export default function FocusModeScreen() {
	const [seconds, setSeconds] = useState(INITIAL_SECONDS);
	const [running, setRunning] = useState(false);
	const [completed, setCompleted] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (running && seconds > 0) {
			intervalRef.current = setInterval(() => {
				setSeconds(s => s - 1);
			}, 1000);
		} else if (!running || seconds === 0) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (seconds === 0 && running) {
				setCompleted(c => c + 1);
				setRunning(false);
			}
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running, seconds]);

	const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
	const secs = (seconds % 60).toString().padStart(2, '0');

	const handleStartPause = () => setRunning(r => !r);
	const handleReset = () => {
		setSeconds(INITIAL_SECONDS);
		setRunning(false);
	};
	const handleNewSession = () => {
		setSeconds(INITIAL_SECONDS);
		setRunning(true);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>FOKUSMODUS</Text>
					<View style={styles.timerCircleWrap}>
						<View style={styles.timerCircle}>
							<Svg width={240} height={240}>
								<Circle
									cx={120}
									cy={120}
									r={104}
									stroke="#e6c200"
									strokeWidth={12}
									fill="none"
									opacity={0.2}
								/>
											<Circle
												cx={120}
												cy={120}
												r={104}
												stroke="#e6c200"
												strokeWidth={12}
												fill="none"
												strokeDasharray={2 * Math.PI * 104}
												strokeDashoffset={2 * Math.PI * 104 * (seconds / INITIAL_SECONDS)}
												strokeLinecap="round"
											/>
							</Svg>
							<View style={styles.timerTextWrap}>
								<Text style={styles.timerText}>{minutes}:{secs}</Text>
							</View>
						</View>
						<Text style={styles.timerSub}>hold fokus 💪</Text>
					</View>
			<TouchableOpacity style={styles.pauseBtn} onPress={handleStartPause}>
				<Text style={styles.pauseBtnText}>{running ? 'Pause' : 'Start'}</Text>
			</TouchableOpacity>
			<View style={styles.btnRow}>
				<TouchableOpacity style={styles.actionBtn} onPress={handleNewSession}>
					<Text style={styles.actionBtnText}>Ny økt</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionBtn} onPress={handleReset}>
					<Text style={styles.actionBtnText}>Nullstill</Text>
				</TouchableOpacity>
			</View>
			<Text style={styles.completedText}>Fullførte fokusøkter: {completed}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#ffe066', alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 28, fontWeight: '700', marginBottom: 32, letterSpacing: 1 },
	timerCircleWrap: { alignItems: 'center', marginBottom: 32 },
		timerCircle: { width: 240, height: 240, borderRadius: 120, backgroundColor: '#ffe066', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative' },
		timerTextWrap: { position: 'absolute', top: 0, left: 0, width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
	timerText: { fontSize: 64, fontWeight: '700', color: '#222' },
	timerSub: { fontSize: 20, color: '#222', fontWeight: '500', marginTop: 4 },
	pauseBtn: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 48, marginBottom: 18, elevation: 2 },
	pauseBtnText: { fontSize: 24, fontWeight: '700', color: '#222' },
	btnRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
	actionBtn: { backgroundColor: '#ffe066', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28, marginHorizontal: 8, elevation: 1 },
	actionBtnText: { fontSize: 18, fontWeight: '700', color: '#222' },
	completedText: { fontSize: 16, color: '#222', marginTop: 8 },
});

