import { NextRequest, NextResponse } from 'next/server';
import { fetchGithubProfile, fetchGithubRepos, GithubApiError } from '@/lib/github';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username || !/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json(
      { error: 'Invalid GitHub username format.' },
      { status: 400 }
    );
  }

  try {
    const [profile, repos] = await Promise.all([
      fetchGithubProfile(username),
      fetchGithubRepos(username),
    ]);

    return NextResponse.json({ profile, repos });
  } catch (err) {
    if (err instanceof GithubApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
    }
    return NextResponse.json(
      { error: 'Unexpected error while fetching GitHub data.' },
      { status: 500 }
    );
  }
}
