export const INTERVAL = 100;
export const DELAY = 7000;

type User = {
  id: number;
  name: string;
  avatar: string;
  valueText: string;
};

type Template = {
  title: string;
  subtitle: string;
};

type LeadersData = Template & {
  emoji: string;
  users: User[];
  selectedUserId?: User['id'];
};

type VoteData = Template & {
  emoji: string;
  users: User[];
  selectedUserId?: User['id'];
  offset?: User['id'];
};

type ChartValue = {
  title: string;
  value: number;
  active?: boolean;
};

type ChartData = Template & {
  users: User[];
  values: ChartValue[];
};

type DiagramCategory = {
  title: string;
  valueText: string;
  differenceText: string;
};

type DiagramData = Template & {
  totalText: string;
  differenceText: string;
  categories: DiagramCategory[];
};

// Tuple of 24 numbers
type ActivityDataItem = [
  number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number,
];

type Days = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
type ActivityData = Template & {
  data: {
    [Day in Days]: ActivityDataItem;
  };
};

type TemplateData = LeadersData | VoteData | ChartData | DiagramData | ActivityData;

type TemplateAlias = 'leaders' | 'vote' | 'chart' | 'diagram' | 'activity';

export interface Slide {
    alias: TemplateAlias;
    data: TemplateData;
}

export type SlideTheme = 'light' | 'dark';
export const possibleThemes: SlideTheme[] = ['dark', 'light'];

export interface State {
    theme: SlideTheme;
    stories: Slide[];
    index: number;
    progress: number;
    pause: boolean;
}
