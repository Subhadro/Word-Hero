class ReportManager {
	showReport() {
		const score = ScoreState.score;
		const accuracy = ScoreState.getAccuracy();

		document.getElementById("final-score").textContent = score;
		document.getElementById("stat-correct").textContent =
			ScoreState.correctCount;
		document.getElementById("stat-mistakes").textContent =
			ScoreState.mistakeCount;
		document.getElementById("stat-missed").textContent =
			ScoreState.missedCount;
		document.getElementById("stat-accuracy").textContent = `${accuracy}%`;

		let gradeTitle = "Respect Hero";
		let badgeText = "Elite Performance!";
		let trophyIcon = "🏆";

		if (score < 400) {
			gradeTitle = "Needs Practice";
			badgeText = "Keep Growing!";
			trophyIcon = "🌱";
		} else if (score < 600) {
			gradeTitle = "Good Effort";
			badgeText = "Well Done!";
			trophyIcon = "⭐";
		}

		document.getElementById("report-grade-title").textContent = gradeTitle;
		document.getElementById("report-badge").textContent = badgeText;
		document.getElementById("report-trophy-icon").textContent = trophyIcon;

		document
			.querySelectorAll(".screen")
			.forEach(s => s.classList.remove("active"));
		document.getElementById("report-screen").classList.add("active");
	}
}

const ReportScreen = new ReportManager();
