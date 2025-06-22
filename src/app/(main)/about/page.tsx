import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, FileText, Flame, PenTool, Users, Bot } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About AIGAMI
          </h1>
          <p className="text-xl text-gray-600">
            Your AI-powered note-taking workspace with gamification
          </p>
        </div>

        {/* How to Play Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            How to Play
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  1. Create Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Start by creating your first note. Write about anything - your
                  thoughts, ideas, plans, or daily reflections. The more you
                  write, the more points you earn!
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  2. Chat with AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Use the AI chat feature to ask questions about your notes. Get
                  insights, summaries, and suggestions to improve your writing
                  and organization.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  3. Build Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Write consistently to build your streak! Update or create
                  notes daily to maintain your writing momentum and climb the
                  leaderboards.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  4. Compete & Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Check the leaderboards to see how you rank against other
                  users. Compete in characters written, streak length, and total
                  notes created.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ranking System Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            How Rankings Work
          </h2>

          <div className="grid gap-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-blue-600" />
                  Characters Written
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Your ranking based on the total number of characters you've
                  written across all your notes.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Tip:</strong> Write longer, more detailed notes to
                  increase your character count!
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Your ranking based on consecutive days of note activity. A
                  streak is maintained by updating or creating notes daily.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Tip:</strong> Write something every day, even if it's
                  just a quick thought, to maintain your streak!
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Total Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Your ranking based on the total number of notes you've created
                  in your workspace.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Tip:</strong> Break down your thoughts into multiple
                  notes to increase your note count!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Key Features
          </h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    AI-Powered Chat
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get insights and answers about your notes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Rich Text Editor
                  </h3>
                  <p className="text-sm text-gray-600">
                    Write and format your notes easily
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Leaderboards</h3>
                  <p className="text-sm text-gray-600">
                    Compete with other users
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Flame className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Streak Tracking
                  </h3>
                  <p className="text-sm text-gray-600">
                    Maintain daily writing habits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-600 mb-6">
            Begin your journey by creating your first note and watch your
            rankings grow!
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/notes"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create A Note
            </a>
            <a
              href="/leaderboards"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              View Leaderboards
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
