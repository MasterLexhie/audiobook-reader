interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="ml-auto flex items-center gap-2 border-b border-text-faint pb-[5px] px-[2px] w-[190px] max-sm:w-[130px]">
      <div className="w-[10px] h-[10px] border-[1.5px] border-text-faint rounded-full relative">
        <div className="absolute w-[5px] h-[1.5px] bg-text-faint rotate-45 -right-1 -bottom-[1px]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        className="flex-1 bg-transparent border-none outline-none font-serif italic text-[12.5px] text-text
          placeholder:text-text-faint max-sm:text-[12px]"
      />
    </div>
  );
}
