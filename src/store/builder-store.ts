import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/utils';
import type {
  BuilderState,
  GithubProfileData,
  GithubRepo,
  Section,
  SectionType,
  SkillGroup,
  SocialLink,
  SocialPlatform,
  TemplateId,
  Widget,
  WidgetType,
} from '@/types';

const DEFAULT_SECTIONS: Section[] = [
  { id: generateId(), type: 'header', enabled: true },
  { id: generateId(), type: 'about', enabled: true },
  { id: generateId(), type: 'currentFocus', enabled: true },
  { id: generateId(), type: 'skills', enabled: true },
  { id: generateId(), type: 'projects', enabled: true },
  { id: generateId(), type: 'stats', enabled: true },
  { id: generateId(), type: 'socials', enabled: true },
  { id: generateId(), type: 'funFact', enabled: false },
];

const DEFAULT_WIDGETS: Widget[] = [
  { id: generateId(), type: 'stats', enabled: true },
  { id: generateId(), type: 'streak', enabled: true },
  { id: generateId(), type: 'top-languages', enabled: true },
  { id: generateId(), type: 'trophy', enabled: false },
  { id: generateId(), type: 'profile-views', enabled: false },
  { id: generateId(), type: 'activity-graph', enabled: false },
];

interface BuilderActions {
  setField: <K extends keyof BuilderState['profile']>(
    key: K,
    value: BuilderState['profile'][K]
  ) => void;
  setGithubUsername: (username: string) => void;
  applyGithubImport: (profile: GithubProfileData, repos: GithubRepo[]) => void;
  toggleRepoSelection: (repoId: number) => void;
  addSkill: (category: SkillGroup['category'], name: string, iconSlug: string) => void;
  removeSkill: (category: SkillGroup['category'], skillId: string) => void;
  addSocial: (platform: SocialPlatform, value: string) => void;
  removeSocial: (id: string) => void;
  toggleWidget: (id: string) => void;
  toggleSection: (id: string) => void;
  reorderSections: (sections: Section[]) => void;
  setTemplate: (template: TemplateId) => void;
  resetAll: () => void;
}

const initialProfile: BuilderState['profile'] = {
  name: '',
  headline: '',
  pronouns: '',
  bio: '',
  currentWork: '',
  learning: '',
  collaboration: '',
  askMeAbout: '',
  funFact: '',
  email: '',
  location: '',
  company: '',
  website: '',
};

const initialSkills: SkillGroup[] = [
  { category: 'languages', label: 'Languages', items: [] },
  { category: 'frontend', label: 'Frontend', items: [] },
  { category: 'backend', label: 'Backend', items: [] },
  { category: 'database', label: 'Databases', items: [] },
  { category: 'cloud', label: 'Cloud & DevOps', items: [] },
  { category: 'tools', label: 'Tools', items: [] },
];

const initialState: BuilderState = {
  profile: initialProfile,
  githubUsername: '',
  githubData: null,
  repos: [],
  skills: initialSkills,
  socials: [],
  widgets: DEFAULT_WIDGETS,
  sections: DEFAULT_SECTIONS,
  template: 'modern',
};

export const useBuilderStore = create<BuilderState & BuilderActions>()(
  persist(
    (set) => ({
      ...initialState,

      setField: (key, value) =>
        set((state) => ({ profile: { ...state.profile, [key]: value } })),

      setGithubUsername: (username) => set({ githubUsername: username }),

      applyGithubImport: (profile, repos) =>
        set((state) => ({
          githubData: profile,
          repos,
          profile: {
            ...state.profile,
            name: state.profile.name || profile.name || profile.login,
            bio: state.profile.bio || profile.bio || '',
            location: state.profile.location || profile.location || '',
            company: state.profile.company || profile.company || '',
            website: state.profile.website || profile.blog || '',
          },
          socials: profile.twitter_username
            ? [
                ...state.socials.filter((s) => s.platform !== 'twitter'),
                { id: generateId(), platform: 'twitter', value: profile.twitter_username },
              ]
            : state.socials,
        })),

      toggleRepoSelection: (repoId) =>
        set((state) => ({
          repos: state.repos.map((r) =>
            r.id === repoId ? { ...r, selected: !r.selected } : r
          ),
        })),

      addSkill: (category, name, iconSlug) =>
        set((state) => ({
          skills: state.skills.map((group) =>
            group.category === category
              ? {
                  ...group,
                  items: [
                    ...group.items,
                    { id: generateId(), name, iconSlug },
                  ],
                }
              : group
          ),
        })),

      removeSkill: (category, skillId) =>
        set((state) => ({
          skills: state.skills.map((group) =>
            group.category === category
              ? { ...group, items: group.items.filter((i) => i.id !== skillId) }
              : group
          ),
        })),

      addSocial: (platform, value) =>
        set((state) => ({
          socials: [...state.socials, { id: generateId(), platform, value }],
        })),

      removeSocial: (id) =>
        set((state) => ({
          socials: state.socials.filter((s) => s.id !== id),
        })),

      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, enabled: !w.enabled } : w
          ),
        })),

      toggleSection: (id) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          ),
        })),

      reorderSections: (sections) => set({ sections }),

      setTemplate: (template) => set({ template }),

      resetAll: () => set(initialState),
    }),
    { name: 'readme-builder-storage' }
  )
);
