import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between px-4 py-3 bg-background">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Faculta de</span>
            <span className="text-xl font-bold text-primary tracking-tight">Ciencias</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary italic tracking-wide">
          UniResource
        </h1>
      </div>

      <div className="h-1 bg-primary w-full"></div>

    </header>
  );
}

export default Header;