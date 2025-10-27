import { IconNode, LucideIcon } from "lucide-react";

interface IProps {
  Icon: LucideIcon; 
  title: string;
  text: string;
}

export default function IconBox({ Icon, title, text }: IProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition">
      {/* Icon */}
      <div className="p-4 rounded-lg bg-sgreen text-black flex items-center justify-center">
        <Icon size={22} />
      </div>

      {/* Text */}
      <div>
        <h3 className="font-poppins text-gray-900 text-lg font-semibold">
          {title}
        </h3>
        <p className="font-inter text-cgreen text-sm">{text}</p>
      </div>
    </div>
  );
}
