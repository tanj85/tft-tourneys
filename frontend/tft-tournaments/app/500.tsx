import Link from "next/link";
import Image from "next/image";

export default function FiveHundred() {
  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-row items-center">
        <Image src="/sad_emote.png" width={200} height={200} alt="icon" />
        <div className="flex flex-col gap-4">
          <div className="text-3xl italic text-center font-bold">
            <h1>Something went wrong!</h1>
          </div>
          <div className="text-not-white italic text-center">
            Return{" "}
            <Link className="text-pris-purple font-bold" href="/">
              home{" "}
            </Link>
            and try again.
          </div>
        </div>
      </div>
    </div>
  );
}
