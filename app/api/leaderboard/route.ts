import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { ScoreEntry } from "@/types/game";

// GET: Ambil Top 10 Skor Tertinggi
export async function GET() {
  try {
    const leaderboardRef = collection(db, "leaderboard");
    // Query: urutkan dari score terbanyak, ambil top 10
    const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    const scores: ScoreEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        username: data.username || "Anonymous",
        score: data.score || 0,
        stage: data.stage || 1,
        date: data.date || new Date().toISOString().split("T")[0],
      });
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data skor" },
      { status: 500 },
    );
  }
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

    const leaderboardRef = collection(db, "leaderboard");
    const newDoc = await addDoc(leaderboardRef, {
      username: username.trim().substring(0, 15),
      score: Number(score),
      stage: Number(stage),
      date: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      message: "Skor berhasil disimpan ke Cloud!",
      id: newDoc.id,
    });
  } catch (error) {
    console.error("Firebase POST Error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan skor" },
      { status: 500 },
    );
  }
}
