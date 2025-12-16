import { GraduationCap } from "lucide-react";

interface CollabHeaderProps {
  sectionTitle: string;
}

const CollabHeader = ({ sectionTitle }: CollabHeaderProps) => {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">{sectionTitle}</h1>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-primary italic tracking-wide">UniResource</span>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Facultad de</span>
            <span className="text-lg font-bold text-primary">CIENCIAS</span>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CollabHeader;
