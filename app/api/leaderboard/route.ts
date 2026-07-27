import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ScoreEntry } from "@/types/game";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

// Helper untuk membaca file JSON
function getLeaderboard(): ScoreEntry[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
}

// GET: Ambil Daftar Leaderboard (Diurutkan berdasarkan Score Tertinggi)
export async function GET() {
  const data = getLeaderboard();
  // Sortir dari skor tertinggi ke terendah, ambil Top 10
  const sortedData = data.sort((a, b) => b.score - a.score).slice(0, 10);
  return NextResponse.json(sortedData);
}

// POST: Simpan Skor Baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, score, stage } = body;

    if (!username || score === undefined || stage === undefined) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const currentData = getLeaderboard();
    const newEntry: ScoreEntry = {
      id: Date.now().toString(),
      username: username.trim().substring(0, 15), // Batasi max 15 karakter
      score: Number(score),
      stage: Number(stage),
      date: new Date().toISOString().split("T")[0],
    };

    currentData.push(newEntry);

    // Simpan kembali ke file JSON
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf8");

    return NextResponse.json({
      message: "Skor berhasil disimpan!",
      entry: newEntry,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menyimpan skor" },
      { status: 500 },
    );
  }
}
