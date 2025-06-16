import { Film, Subtitles as SubtitlesIcon } from 'lucide-react';

interface Subtitle {
  code: string;
  language: string;
  url: string;
}

const Subtitles = () => {
  return (
    <div>
      <Film />
      <SubtitlesIcon />
    </div>
  );
};

export default Subtitles;