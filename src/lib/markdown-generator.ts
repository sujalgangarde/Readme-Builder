import type { BuilderState, SkillGroup, SocialPlatform, TemplateId, WidgetType } from '@/types';

// ---------------------------------------------------------------------------
// Per-template visual identity: each template maps to a widget theme (matches
// github-readme-stats/streak-stats/trophy color themes), a capsule-render
// banner gradient, and an accent color used for typing text + divider.
// ---------------------------------------------------------------------------

interface TemplateStyle {
  statsTheme: string; // github-readme-stats theme name
  trophyTheme: string; // github-profile-trophy theme name
  bannerColor: string; // capsule-render gradient (comma-separated hex, no #)
  bannerType: 'waving' | 'rect' | 'venom' | 'soft' | 'egg';
  typingColor: string; // hex without #, for readme-typing-svg
  divider: string;
  badgeColor: string; // shields.io badge color
}

const TEMPLATE_STYLES: Record<TemplateId, TemplateStyle> = {
  minimal: {
    statsTheme: 'default',
    trophyTheme: 'flat',
    bannerColor: 'f5f5f5,e0e0e0',
    bannerType: 'rect',
    typingColor: '2F2F2F',
    divider: '\n\n',
    badgeColor: '2F2F2F',
  },
  modern: {
    statsTheme: 'tokyonight',
    trophyTheme: 'tokyonight',
    bannerColor: '6a11cb,2575fc',
    bannerType: 'waving',
    typingColor: '2575FC',
    divider: '\n\n<br/>\n\n',
    badgeColor: '2575FC',
  },
  professional: {
    statsTheme: 'default',
    trophyTheme: 'flat',
    bannerColor: '0f4c81,3a7ca5',
    bannerType: 'rect',
    typingColor: '0F4C81',
    divider: '\n\n---\n\n',
    badgeColor: '0F4C81',
  },
  developer: {
    statsTheme: 'radical',
    trophyTheme: 'radical',
    bannerColor: '0d1117,1f6feb',
    bannerType: 'waving',
    typingColor: '58A6FF',
    divider: '\n\n<br/>\n\n',
    badgeColor: '58A6FF',
  },
  terminal: {
    statsTheme: 'dark',
    trophyTheme: 'dark',
    bannerColor: '000000,1a1a1a',
    bannerType: 'rect',
    typingColor: '00FF00',
    divider: '\n\n<br/>\n\n',
    badgeColor: '00FF00',
  },
  cyberpunk: {
    statsTheme: 'radical',
    trophyTheme: 'radical',
    bannerColor: 'ff00cc,00fff2',
    bannerType: 'venom',
    typingColor: 'FF00CC',
    divider: '\n\n<br/>\n\n',
    badgeColor: 'FF00CC',
  },
  nature: {
    statsTheme: 'gruvbox',
    trophyTheme: 'gruvbox',
    bannerColor: '134e5e,71b280',
    bannerType: 'soft',
    typingColor: '2E8B57',
    divider: '\n\n<br/>\n\n',
    badgeColor: '2E8B57',
  },
};

const SOCIAL_BADGE: Record<SocialPlatform, (value: string) => string> = {
  github: (v) => `[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${v})`,
  linkedin: (v) => `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${v})`,
  twitter: (v) => `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${v})`,
  instagram: (v) => `[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/${v})`,
  discord: (v) => `[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/${v})`,
  leetcode: (v) => `[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/${v})`,
  codeforces: (v) => `[![Codeforces](https://img.shields.io/badge/Codeforces-1F8ACB?style=for-the-badge&logo=codeforces&logoColor=white)](https://codeforces.com/profile/${v})`,
  hackerrank: (v) => `[![HackerRank](https://img.shields.io/badge/HackerRank-2EC866?style=for-the-badge&logo=hackerrank&logoColor=white)](https://hackerrank.com/${v})`,
  kaggle: (v) => `[![Kaggle](https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://kaggle.com/${v})`,
  medium: (v) => `[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@${v})`,
  devto: (v) => `[![Dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](https://dev.to/${v})`,
  stackoverflow: (v) => `[![Stack Overflow](https://img.shields.io/badge/Stack_Overflow-FE7A16?style=for-the-badge&logo=stackoverflow&logoColor=white)](https://stackoverflow.com/users/${v})`,
  youtube: (v) => `[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/${v})`,
  portfolio: (v) => `[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](${v})`,
  email: (v) => `[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${v})`,
};

function escapeForUrl(text: string): string {
  return encodeURIComponent(text);
}

/** capsule-render banner — an animated/gradient SVG header used at the very top */
function bannerMarkdown(style: TemplateStyle, headline: string): string {
  const text = escapeForUrl(headline || 'Welcome to my profile');
  return `<img width="100%" src="https://capsule-render.vercel.app/api?type=${style.bannerType}&color=gradient&customColorList=${style.bannerColor}&height=180&section=header&text=${text}&fontSize=32&fontColor=ffffff&animation=fadeIn&fontAlignY=40" />`;
}

/** readme-typing-svg — animated multi-line typing text under the banner */
function typingSvg(style: TemplateStyle, lines: string[]): string {
  const joined = lines.map((l) => escapeForUrl(l)).join(';');
  return `<img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&size=20&pause=1000&color=${style.typingColor}&center=true&vCenter=true&width=600&lines=${joined}" alt="Typing SVG" />`;
}

function widgetMarkdown(type: WidgetType, username: string, style: TemplateStyle): string {
  const u = username || 'your-username';
  switch (type) {
    case 'stats':
      return `<img align="center" src="https://github-readme-stats.vercel.app/api?username=${u}&show_icons=true&theme=${style.statsTheme}&hide_border=true&count_private=true" alt="${u}'s GitHub stats" />`;
    case 'streak':
      return `<img align="center" src="https://github-readme-streak-stats.herokuapp.com/?user=${u}&theme=${style.statsTheme}&hide_border=true" alt="${u}'s GitHub streak" />`;
    case 'top-languages':
      return `<img align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&layout=compact&theme=${style.statsTheme}&hide_border=true" alt="Top Languages" />`;
    case 'trophy':
      return `<img src="https://github-profile-trophy.vercel.app/?username=${u}&theme=${style.trophyTheme}&column=7&margin-w=8&margin-h=8&no-bg=true" alt="Trophies" />`;
    case 'profile-views':
      return `![Profile Views](https://komarev.com/ghpvc/?username=${u}&color=${style.typingColor}&style=flat-square&label=Profile+Views)`;
    case 'activity-graph':
      return `<img width="100%" src="https://github-readme-activity-graph.vercel.app/graph?username=${u}&theme=react-dark&hide_border=true&area=true" alt="Activity Graph" />`;
    default:
      return '';
  }
}

/** GitHub's official contribution snake — animated eating-the-graph SVG, powered by a GitHub Action the user adds to their own profile repo */
function snakeMarkdown(username: string): string {
  const u = username || 'your-username';
  return `<img width="100%" src="https://raw.githubusercontent.com/${u}/${u}/output/github-contribution-grid-snake.svg" alt="Snake animation" />`;
}

function skillsTable(skills: SkillGroup[], style: TemplateStyle): string {
  const nonEmpty = skills.filter((g) => g.items.length > 0);
  if (nonEmpty.length === 0) return '';

  const rows = nonEmpty
    .map((group) => {
      const badges = group.items
        .map(
          (item) =>
            `<img src="https://img.shields.io/badge/${escapeForUrl(item.name)}-${style.badgeColor}?style=flat-square&logo=${item.iconSlug}&logoColor=white" alt="${item.name}"/>`
        )
        .join(' ');
      return `| **${group.label}** | ${badges} |`;
    })
    .join('\n');

  return `<table>\n<tr><th align="left">Category</th><th align="left">Stack</th></tr>\n${rows
    .split('\n')
    .map((r) => `<tr>${r.replace(/^\|(.*)\|(.*)\|$/, '<td>$1</td><td>$2</td>')}</tr>`)
    .join('\n')}\n</table>`;
}

function projectCards(state: BuilderState, style: TemplateStyle): string {
  const selected = state.repos.filter((r) => r.selected);
  if (selected.length === 0) return '';

  const username = state.githubData?.login ?? state.githubUsername;

  // Use github-readme-stats' repo-card for a genuinely visual card per project,
  // falling back to a plain markdown block if there's no username context.
  const cards = selected
    .map((r) => {
      if (username) {
        return `<a href="${r.html_url}"><img src="https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${r.name}&theme=${style.statsTheme}&hide_border=true" alt="${r.name}" /></a>`;
      }
      const desc = r.description ? `${r.description}` : 'No description provided.';
      return `### [${r.name}](${r.html_url})\n${desc}\n\n⭐ ${r.stargazers_count} &nbsp;|&nbsp; 🍴 ${r.forks_count}${r.language ? ` &nbsp;|&nbsp; ${r.language}` : ''}`;
    })
    .join(username ? '\n' : '\n\n');

  return username
    ? `<p align="center">\n${cards}\n</p>`
    : cards;
}

function sectionHeading(emoji: string, title: string, template: TemplateId): string {
  if (template === 'terminal') {
    return `\`\`\`\n${emoji} ${title}\n\`\`\``;
  }
  return `### ${emoji} ${title}`;
}

export function generateReadme(state: BuilderState): string {
  const { profile, sections, template } = state;
  const style = TEMPLATE_STYLES[template];
  const username = state.githubData?.login ?? state.githubUsername;
  const parts: string[] = [];

  for (const section of sections) {
    if (!section.enabled) continue;

    switch (section.type) {
      case 'header': {
        const headline = profile.headline || 'A passionate developer';
        const name = profile.name || 'Your Name';

        if (template === 'terminal') {
          const typingLines = [
            `Hi, I'm ${name}`,
            headline,
            profile.currentWork ? `Building ${profile.currentWork}` : 'Always shipping',
          ];
          parts.push(
            `<div align="center">\n\n${bannerMarkdown(style, `${name} :: root`)}\n\n${typingSvg(style, typingLines)}\n\n</div>`
          );
        } else {
          const typingLines = [headline, profile.currentWork ? `Currently building ${profile.currentWork}` : '', profile.learning ? `Learning ${profile.learning}` : ''].filter(Boolean);
          parts.push(
            `<div align="center">\n\n${bannerMarkdown(style, `Hi, I'm ${name} 👋`)}\n\n${typingSvg(style, typingLines)}\n\n${
              username ? `<img src="https://komarev.com/ghpvc/?username=${username}&style=flat-square&color=${style.typingColor}&label=Profile+Views" alt="views"/>` : ''
            }\n\n</div>`
          );
          if (profile.pronouns) {
            parts.push(`<p align="center"><i>Pronouns: ${profile.pronouns}</i></p>`);
          }
        }
        break;
      }

      case 'about': {
        if (profile.bio) {
          parts.push(
            `<div align="center">\n\n${sectionHeading('👋', 'About Me', template)}\n\n</div>\n\n${profile.bio}`
          );
        }
        break;
      }

      case 'currentFocus': {
        const rows: string[] = [];
        if (profile.currentWork) rows.push(`| 🔭 | Currently working on | **${profile.currentWork}** |`);
        if (profile.learning) rows.push(`| 🌱 | Currently learning | **${profile.learning}** |`);
        if (profile.collaboration) rows.push(`| 👯 | Looking to collaborate on | **${profile.collaboration}** |`);
        if (profile.askMeAbout) rows.push(`| 💬 | Ask me about | **${profile.askMeAbout}** |`);
        if (profile.location) rows.push(`| 📍 | Based in | **${profile.location}** |`);
        if (profile.email) rows.push(`| 📫 | Reach me at | **${profile.email}** |`);

        if (rows.length > 0) {
          parts.push(
            `${sectionHeading('🎯', "What I'm Up To", template)}\n\n<table>\n${rows
              .map((r) => `<tr>${r.replace(/^\|(.*)\|(.*)\|(.*)\|$/, '<td>$1</td><td>$2</td><td>$3</td>')}</tr>`)
              .join('\n')}\n</table>`
          );
        }
        break;
      }

      case 'skills': {
        const table = skillsTable(state.skills, style);
        if (table) {
          parts.push(`${sectionHeading('🛠️', 'Tech Stack', template)}\n\n<div align="center">\n\n${table}\n\n</div>`);
        }
        break;
      }

      case 'projects': {
        const projects = projectCards(state, style);
        if (projects) {
          parts.push(`${sectionHeading('🚀', 'Featured Projects', template)}\n\n${projects}`);
        }
        break;
      }

      case 'stats': {
        if (username) {
          const enabledWidgets = state.widgets.filter((w) => w.enabled);
          const nonGraphWidgets = enabledWidgets.filter((w) => w.type !== 'activity-graph');
          const graphWidget = enabledWidgets.find((w) => w.type === 'activity-graph');
          const showSnake = template === 'developer' || template === 'cyberpunk' || template === 'modern';

          if (enabledWidgets.length > 0 || showSnake) {
            const widgetLines = nonGraphWidgets.map((w) => widgetMarkdown(w.type, username, style)).join('\n');
            const graphLine = graphWidget ? `\n\n${widgetMarkdown('activity-graph', username, style)}` : '';
            const snakeLine = showSnake ? `\n\n${snakeMarkdown(username)}` : '';
            parts.push(
              `${sectionHeading('📊', 'GitHub Stats', template)}\n\n<div align="center">\n\n${widgetLines}\n\n</div>${graphLine}${snakeLine}`
            );
          }
        }
        break;
      }

      case 'socials': {
        if (state.socials.length > 0) {
          const badges = state.socials
            .map((s) => SOCIAL_BADGE[s.platform]?.(s.value) ?? '')
            .filter(Boolean)
            .join(' ');
          parts.push(`${sectionHeading('🔗', 'Connect With Me', template)}\n\n<p align="center">\n${badges}\n</p>`);
        }
        break;
      }

      case 'funFact': {
        if (profile.funFact) {
          parts.push(`${sectionHeading('⚡', 'Fun Fact', template)}\n\n> ${profile.funFact}`);
        }
        break;
      }
    }
  }

  // Bottom banner + footer note (only for non-minimal templates, to keep minimal clean)
  if (template !== 'minimal') {
    const usesSnake = template === 'developer' || template === 'cyberpunk' || template === 'modern';
    if (usesSnake && username) {
      parts.push(
        `<details>\n<summary>⚙️ Enable the snake animation above</summary>\n\nThe contribution snake needs a small GitHub Action running on your own profile repository (\`${username}/${username}\`) to generate and update it daily. Add this file at \`.github/workflows/snake.yml\` in that repo:\n\n\`\`\`yaml\nname: Generate Snake\non:\n  schedule:\n    - cron: "0 0 * * *"\n  workflow_dispatch:\njobs:\n  generate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: Platane/snk@v3\n        with:\n          github_user_name: \${{ github.repository_owner }}\n          outputs: dist/github-contribution-grid-snake.svg\n      - uses: crazy-max/ghaction-github-pages@v4\n        with:\n          target_branch: output\n          build_dir: dist\n        env:\n          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}\n\`\`\`\n\nIt'll run once a day and keep the snake animation current. Until then, this image will show as broken.\n\n</details>\n\n`
      );
    }
    parts.push(
      `<img width="100%" src="https://capsule-render.vercel.app/api?type=${style.bannerType}&color=gradient&customColorList=${style.bannerColor}&height=100&section=footer" />`
    );
  }

  return parts.join(style.divider);
}

