import Image from "next/image";

export default function SectionLabel({ sourceImage, text, props }: any) {
  return (
    <div className="flex items-center gap-1 px-2 my-[.1rem] sm:ml-1">
      <Image src={sourceImage} width={25} height={25} alt="icon" />
      <div className={props}>{text}</div>
    </div>
  );
}
