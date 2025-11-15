import { cn } from "@/lib/utils";
import { Noto_Sans_Math } from "next/font/google";
import { H1, P, SMALL_PARAGRAPH_STYLES } from "../ui/typography";
import { baconCipher } from "../utils/bacon-cipher";
import { keyboardCipher } from "../utils/keyboard-cipher";
import { splitEvery } from "../utils/split-every";
import { toRoman } from "../utils/to-roman";

const notoSansMath = Noto_Sans_Math({ weight: "400" });

export type Level = {
  id: string;
  index: number;
  question: React.ReactNode;
  answerSet: string[];
  tags?: string[];
};

export const levels: Level[] = [
  {
    id: "simple-addition",
    question: "18+29",
    answerSet: ["47"],
    tags: ["math"],
  },
  {
    id: "duality",
    question: "no",
    answerSet: ["yes"],
    tags: ["duality"],
  },
  {
    id: "duality-2",
    question: "closed",
    answerSet: ["open"],
    tags: ["duality"],
  },
  {
    id: "gandalf",
    question: "you shall not pass",
    answerSet: ["gandalf", "lotr", "thelordoftherings"],
    tags: ["citations", "movies"],
  },
  {
    id: "latin",
    question: "veni, vidi",
    answerSet: ["vici"],
    tags: ["history"],
  },
  {
    id: "alchemy",
    question: "ice+fire",
    answerSet: ["water"],
    tags: ["simple logic"],
  },
  {
    id: "zip",
    question: "pro⨯art",
    answerSet: ["parrot"],
    tags: ["wordplay"],
  },
  {
    id: "alice-in-wonderland",
    question: "curiouser and curiouser!",
    answerSet: ["alice", "aliceinwonderland"],
    tags: ["literature", "citations"],
  },
  {
    id: "next-level",
    question: "what is the answer to life, the universe and everything?",
    answerSet: ["42"],
    tags: ["movies"],
  },
  {
    id: "dune-isbn",
    question: "978-0-441-17271-9=?",
    answerSet: ["dune"],
    tags: ["codes"],
  },
  {
    id: "guess-the-lyrics",
    question: "what is love?",
    answerSet: ["babydonthurtme"],
    tags: ["music"],
  },
  {
    id: "jamesbond",
    question: "007",
    answerSet: ["jamesbond"],
    tags: ["movies"],
  },
  {
    id: "fibonacci",
    question: "1 1 2 3 5 8",
    answerSet: ["13", "fibonacci"],
    tags: ["math"],
  },
  {
    id: "einstein",
    question: "imagination is more important than knowledge",
    answerSet: ["einstein", "alberteinstein"],
    tags: ["citations", "history"],
  },
  {
    id: "letter-number-code",
    question: "19 5 3 18 5 20",
    answerSet: ["secret"],
    tags: ["codes"],
  },
  {
    id: "rock-paper-scissors-lizard-spock",
    question: "rock-paper-scissors-lizard",
    answerSet: ["spock"],
    tags: ["movies"],
  },
  {
    id: "geolocation",
    question: "51.1789, -1.8262",
    answerSet: ["stonehenge"],
    tags: ["geolocation"],
  },
  {
    id: "geralt",
    question: "evil is evil",
    answerSet: [
      "geralt",
      "geraltofrivia",
      "witcher",
      "thewitcher",
      "thelastwish",
    ],
    tags: ["movies", "literature", "citations"],
  },
  {
    id: "palindrome",
    question: "never odd or even",
    answerSet: ["palindrome"],
    tags: ["wordplay"],
  },
  {
    id: "roman-numerals",
    question: `${"1968-12-24".split("-").map(Number).map(toRoman).join(" ")} photo`,
    answerSet: ["earthrise"],
    tags: ["math", "codes", "history"],
  },
  {
    id: "caesar-cipher",
    question: "vdodg",
    answerSet: ["salad"],
    tags: ["ciphers"],
  },
  {
    id: "atbash-cipher",
    question: "yummy ozhztmz",
    answerSet: ["lasagna"],
    tags: ["ciphers"],
  },
  {
    id: "binary-neo",
    question: (
      <H1 className="grid grid-cols-1 gap-x-[.75em] sm:grid-cols-3">
        <span>01001110</span>
        <span>01000101</span>
        <span>01001111</span>
      </H1>
    ),
    answerSet: ["neo"],
    tags: ["movies", "codes"],
  },
  {
    id: "morse-code",
    question: (
      <H1>
        <span className="block">{"- •••• •"}</span>
        <span className="block">{"••-• •• •-• ••• -"}</span>
        <span className="block">{"-- •- -•"}</span>
        <span className="block">{"--- -•"}</span>
        <span className="block">{"- •••• •"}</span>
        <span className="block">{"-- --- --- -•"}</span>
      </H1>
    ),
    answerSet: ["neilarmstrong", "armstrong"],
    tags: ["codes"],
  },
  {
    id: "braille-rickroll",
    question: (
      <H1>
        <span className="block opacity-25">
          don’t tell me you’re too blind to see
        </span>
        <span className="block">⠗⠊⠉⠅⠗⠕⠇⠇⠑⠙</span>
      </H1>
    ),
    answerSet: ["rickrolled"],
    tags: ["music", "codes"],
  },
  {
    id: "awakening",
    question: (
      <H1>
        <span className="block">’hawaii’’</span>
        <span className="block">kenya’’</span>
        <span className="block">’singapore’’’’’</span>
      </H1>
    ),
    answerSet: ["awakening"],
    tags: ["wordplay"],
  },
  {
    id: "typewriter",
    question: (
      <H1>
        <span className="block">t+1+4-7</span>
        <span className="">-1+2+4-3-2+1</span>
        <span className={notoSansMath.className}>↵</span>
      </H1>
    ),
    answerSet: ["typewriter"],
    tags: ["codes"],
  },
  {
    id: "sherlock",
    question: "you know my methods",
    answerSet: ["sherlock", "sherlockholmes", "holmes", "arthurconandoyle"],
    tags: ["citations", "literature"],
  },
  {
    id: "a-midsummer-nights-dream",
    question: (
      <P style={{ fontSize: "clamp(10px, 5.5vw, 2.25rem)" }}>
        i know a bank where the
        <br />
        wild thyme blows,
        <br />
        where oxlips and the
        <br />
        nodding violet grows
        <br />
        <br />
        2-2-1 3-4-2 1-5-3 1-4-2
        <br />
        2-2-1 3-1-4 4-2-5
      </P>
    ),
    answerSet: ["theatre"],
    tags: ["codes"],
  },
  {
    id: "phoneword",
    question: (
      <H1>
        <span className="block">i need to call someone</span>
        <span className="block">333-777-444-33-66-3</span>
      </H1>
    ),
    answerSet: ["friend"],
    tags: ["codes"],
  },
  {
    id: "guess-the-lyrics-2",
    question: "my heart will go on",
    answerSet: ["titanic"],
    tags: ["music"],
  },
  {
    id: "keyboard-cipher",
    question: keyboardCipher('the answer is "obscured"'),
    answerSet: ["obscured"],
    tags: ["codes"],
  },
  {
    id: "solar-system",
    question: <H1>*ooooOooo</H1>,
    answerSet: ["jupiter"],
    tags: ["logic"],
  },
  {
    id: "today",
    question: (
      <H1>
        <span className="block">arthur was king.</span>
        <span className="block">today is</span>
      </H1>
    ),
    answerSet: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    tags: ["logic"],
  },
  {
    id: "sixth-sense",
    question: "i see dead people",
    answerSet: ["colesear", "sixthsense", "thesixthsense", "6sense"],
    tags: ["citations", "movies"],
  },
  {
    id: "time-riddle",
    question: (
      <P style={{ fontSize: "clamp(10px, 5.5vw, 2.25rem)" }}>
        two hours from now, the time left until midnight will be twice less than
        the time left an hour from now. what time is it now?
      </P>
    ),
    answerSet: ["2100", "9pm", "21", "9"],
    tags: ["math"],
  },
  {
    id: "graphic-dictation",
    question:
      ". 2e 4s 1e 2n 1e 1n 4e 1s 1e 3s 1w 1s 1w 1n 4w 1s 1w 1n 1w 3n 1w 2n",
    answerSet: ["turtle"],
    tags: ["graphics", "codes"],
  },
  {
    id: "the-little-prince",
    question: (
      <P style={{ fontSize: "clamp(10px, 5.5vw, 2.25rem)" }}>
        in the heart of a desert where silence reigns, a small stranger
        approaches a stranded traveler and makes a curious request — not for
        water, nor for help. what does he ask to be drawn?
      </P>
    ),
    answerSet: ["asheep", "sheep"],
    tags: ["literature"],
    // question:
    //   "Посреди безмолвной пустыни к застрявшему путешественнику подходит маленький незнакомец и обращается со странной просьбой — не о воде и не о помощи. Что он просит нарисовать?",
  },
  {
    id: "spanish-reversed",
    question: "con ocho patas".split("").reverse().join(""),
    answerSet: ["octopus", "spider"],
    tags: ["languages", "codes"],
  },
  {
    id: "chess",
    question: (
      <H1>
        <span className="block opacity-25">rnbqkbnr</span>
        <span className="block opacity-25">pppppppp</span>
        <span className="block">pppppppp</span>
        <span className="block">rnbqkbnr</span>
      </H1>
    ),
    answerSet: ["chess"],
    tags: ["games"],
  },
  {
    id: "sator-square",
    question: (
      <H1>
        <span className="block">sator</span>
        <span className="block">arepo</span>
        <span className="block">tenet</span>
        <span className="block">opera</span>
      </H1>
    ),
    answerSet: ["rotas"],
    tags: ["wordplay", "history"],
  },
  {
    id: "echo-poem",
    question: (
      <p
        className={SMALL_PARAGRAPH_STYLES}
        style={{ fontSize: "clamp(10px, 6vw, 2.25rem)" }}
      >
        her boundless words, a silver stream,
        <br />
        would trick fair hera in a dream.
        <br />
        but zeus’s wife, in vengeful ire,
        <br />
        stole nymph’s voice, consumed by fire.
        <br />
      </p>
    ),
    answerSet: ["echo"],
    tags: ["mythology"],
  },
  {
    id: "acrostic-poem",
    question: (
      <p
        className={cn(SMALL_PARAGRAPH_STYLES, "whitespace-nowrap")}
        style={{ fontSize: "clamp(10px, 4.2vw, 2.25rem)" }}
      >
        inside the quiet mind i go,
        <br />
        no map to guide, no light to show.
        <br />
        shadows speak of what i fear,
        <br />
        i listen close — the truth is near.
        <br />
        glimmers rise from depths unseen,
        <br />
        holding meaning in between.
        <br />
        the dark dissolves — and i can see.
      </p>
    ),
    answerSet: ["insight"],
    tags: ["wordplay"],
  },
  {
    id: "schrodingers-cat",
    question: (
      <H1>
        the cat is{" "}
        <span className="motion-opacity-loop-0 motion-ease-spring-snappy motion-duration-1000">
          not
        </span>{" "}
        alive
      </H1>
    ),
    answerSet: ["schrodinger"],
    tags: ["science"],
  },
  {
    id: "chemistry",
    question: "i am 32 28 92 16",
    answerSet: ["genius"],
    tags: ["codes", "science"],
  },
  {
    id: "captain-america",
    question: "i can do this all day",
    answerSet: ["captainamerica", "steverogers"],
    tags: ["citations", "movies"],
  },
  {
    id: "the-epic-of-gilgamesh",
    question: (
      <P style={{ fontSize: "clamp(10px, 5.5vw, 2.25rem)" }}>
        in the shadowed depths of the cedar forest, two once-rivals joined
        forces against a guardian of terrible power — a creature whose very
        breath scorched the air. who was this fearsome being they dared to face?
      </P>
    ),
    answerSet: ["humbaba", "huwawa"],
    tags: ["literature", "mythology"],
  },
  {
    id: "francis-bacon",
    question: (() => {
      const plaintext =
        "francis bacon was a truly remarkable man who detailed a new system of logic";
      const baconEncoded = baconCipher("novumorganum", "");
      let j = 0;
      let encodedArray = [];

      for (let i = 0; i < plaintext.length; i++) {
        const plaintextChar = plaintext[i];

        if (!/[a-z]/.test(plaintextChar)) {
          encodedArray.push(plaintextChar);
          continue;
        }

        const baconChar = baconEncoded[j];
        if (baconChar === "B") {
          encodedArray.push(
            <span key={i} className="opacity-25">
              {plaintextChar}
            </span>,
          );
        } else {
          encodedArray.push(<span key={i}>{plaintextChar}</span>);
        }
        j++;
      }

      return <H1>{encodedArray}</H1>;
    })(),
    answerSet: ["novumorganum"],
    tags: ["ciphers", "history"],
  },
]
  .toSpliced(34, 0, {
    id: "pokemon",
    question: "if this lvl is ev the answer is 33533 and it’s cute",
    answerSet: ["eevee"],
    tags: ["codes"],
  })
  .toSpliced(41, 0, {
    id: "base64-hitchhiker",
    question: (
      <H1>
        {splitEvery(btoa("don't panic and carry a").split(""), 8).map(
          (chunk) => (
            <span className="block" key={chunk.join("")}>
              {chunk.join("")}
            </span>
          ),
        )}
      </H1>
    ),
    answerSet: ["towel"],
    tags: ["citations", "movies"],
  })
  .map((level, index) => ({
    ...level,
    index: index + 1,
    question:
      typeof level.question === "string" ? (
        <H1>{level.question.toLocaleLowerCase()}</H1>
      ) : (
        level.question
      ),
    answerSet: level.answerSet.map((ans) => ans.toLowerCase()),
  }));

function validateUniqueIds() {
  const ids = new Set<string>();
  for (const level of levels) {
    if (ids.has(level.id)) {
      throw new Error(`Duplicate level id found: ${level.id}`);
    }
    ids.add(level.id);
  }
}

validateUniqueIds();
