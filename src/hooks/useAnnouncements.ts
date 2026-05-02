export interface Announcement {
  id: string;
  title: string;
  message: string;
  enabled: boolean;
  show_on_pages: string[];
  start_date: string | null;
  end_date: string | null;
  excluded_days: number[];
  delay_seconds: number;
  show_once_per_session: boolean;
  bg_color: string;
  text_color: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useAnnouncements = () => {
  return { data: [] as Announcement[], isLoading: false, error: null };
};

export const useActiveAnnouncement = (_currentPath: string) => {
  return { data: null, isLoading: false, error: null };
};
