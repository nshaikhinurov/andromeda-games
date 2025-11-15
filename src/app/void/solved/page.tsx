import { Button } from "@/components/ui/button";
import Link from "next/link";
import { P } from "../ui/typography";

export default function Page() {
  return (
    <div className="flex w-full max-w-150 grow flex-col items-center justify-center">
      <div className="p-4 text-center text-sm text-muted-foreground">
        solved
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-end">
        <div className="flex flex-col items-center justify-end space-y-4 text-center wrap-anywhere">
          <P>
            <span className="opacity-25">Protocol complete.</span>
            <br />
            <span className="opacity-25">Cycle terminated.</span>
            <br />
            <br />
            <span className="opacity-25">
              Your data remains in the weave. Should the timeline loop —
              reactivation will occur.
            </span>
            <br />
            <br />
            <span>We will meet again.</span>
            <br />
            <br />
            <span className="opacity-25">[End of transmission]</span>
          </P>
        </div>

        <div className="flex basis-[60%] flex-col items-center gap-4 p-4">
          <div className="grid w-full max-w-md">
            <Link href="/void">
              <Button variant="ghost" asChild>
                <div className="w-full">void</div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
