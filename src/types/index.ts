export type SkillCategory =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cloud'
  | 'devops'
  | 'tools';

export interface SkillItem {
  id: string;
  name: string;
  iconSlug: string; // devicon / simple-icons slug used to render a badge
}

export interface SkillGroup {
  category: SkillCategory;
  label: string;
  items: SkillItem[];
}

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'discord'
  | 'leetcode'
  | 'codeforces'
  | 'hackerrank'
  | 'kaggle'
  | 'medium'
  | 'devto'
  | 'stackoverflow'
  | 'youtube'
  | 'portfolio'
  | 'email';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  value: string; // username, url, or email depending on platform
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  selected: boolean;
}

export interface GithubProfileData {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  hireable: boolean | null;
  created_at: string;
}

export type WidgetType =
  | 'stats'
  | 'streak'
  | 'top-languages'
  | 'trophy'
  | 'profile-views'
  | 'activity-graph';

export interface Widget {
  id: string;
  type: WidgetType;
  enabled: boolean;
}

export type SectionType =
  | 'header'
  | 'about'
  | 'currentFocus'
  | 'skills'
  | 'stats'
  | 'projects'
  | 'socials'
  | 'funFact';

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
}

export interface ProfileFields {
  name: string;
  headline: string;
  pronouns: string;
  bio: string;
  currentWork: string;
  learning: string;
  collaboration: string;
  askMeAbout: string;
  funFact: string;
  email: string;
  location: string;
  company: string;
  website: string;
}

export type TemplateId =
  | 'minimal'
  | 'modern'
  | 'professional'
  | 'developer'
  | 'terminal'
  | 'cyberpunk'
  | 'nature';

export interface BuilderState {
  profile: ProfileFields;
  githubUsername: string;
  githubData: GithubProfileData | null;
  repos: GithubRepo[];
  skills: SkillGroup[];
  socials: SocialLink[];
  widgets: Widget[];
  sections: Section[];
  template: TemplateId;
}
