import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import verbs from "./data/verbs.json";
import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  mdiAccountGroup,
  mdiAccountMultiple,
  mdiAccount,
  mdiHexagon,
  mdiHexagonMultiple,
  mdiMessageFlash,
  mdiCommentQuestion,
  mdiHistory,
  mdiUpdate,
  mdiRun,
  mdiHelp,
  mdiAllInclusive,
  mdiSwapHorizontal,
  mdiRunFast,
  mdiExclamationThick,
} from "@mdi/js";

console.log(verbs);

type Person = 1 | 2 | 3;
type Number = 1 | 2;
type Mood = "indicative" | "subjunctive" | "imperative";
type Tense =
  | "present"
  | "imperfect"
  | "preterit"
  | "future"
  | "presentConditional";

type Additional = "infinitive" | "imperative" | "gerund" | "pastParticiple";

const personAndNumber: { person: Person; number: Number }[] = [
  { person: 1, number: 1 },
  { person: 2, number: 1 },
  { person: 3, number: 1 },
  { person: 1, number: 2 },
  { person: 2, number: 2 },
  { person: 3, number: 2 },
];

type Conjugation = {
  person?: Person;
  number?: Number;
  mood?: Mood;
  tense?: Tense;
  additional?: Additional;
  stem?: string;
  term: string;
};

const addPersonAndNumber = (mood: Mood, tense: Tense, words: string[]) => {
  const stemLength = words
    .map((a) => a.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    .reduce((acc, word, i, words) => {
      if (i === 0) {
        return acc;
      }

      for (let j = 1; j < acc; j++) {
        if (word.substring(0, i) !== words[i - 1].substring(0, i)) {
          return Math.min(acc, i);
        }
      }

      return Math.min(acc, word.length);
    }, words[0].length);

  return personAndNumber.map((personAndNumber, i) => {
    const { person, number } = personAndNumber;
    const conjugation = {
      person,
      number,
      mood,
      tense,
      term: words[i],
      stem: words[i].substring(0, stemLength),
    } as Conjugation;
    return conjugation;
  });
};

const generateList = (inf: keyof typeof verbs) => {
  const verb = verbs[inf];

  const {
    indicative,
    subjunctive,
    imperative,
    infinitive,
    gerund,
    pastParticiple,
  } = verb;

  const conjugations: Conjugation[] = [
    ...addPersonAndNumber("indicative", "present", indicative.present),
    ...addPersonAndNumber("indicative", "imperfect", indicative.imperfect),
    ...addPersonAndNumber("indicative", "preterit", indicative.preterit),
    ...addPersonAndNumber("indicative", "future", indicative.future),
    ...addPersonAndNumber(
      "indicative",
      "presentConditional",
      indicative.presentConditional
    ),
    ...addPersonAndNumber("subjunctive", "present", subjunctive.present),
    ...addPersonAndNumber("subjunctive", "imperfect", subjunctive.imperfect),
    ...addPersonAndNumber("subjunctive", "future", subjunctive.future),
    {
      mood: "imperative",
      additional: "imperative",
      term: imperative,
    },
    {
      additional: "infinitive",
      term: infinitive,
    },
    {
      additional: "gerund",
      term: gerund,
    },
    {
      additional: "pastParticiple",
      term: pastParticiple,
    },
  ];

  return conjugations;
};

const hasPersonAndNumber = (conj: Conjugation) =>
  !!conj.person && !!conj.number;

function App() {
  const [verb, setVerb] = useState("amar");
  const [write, setWrite] = useState("");
  const conjugations = useMemo(
    () => generateList(verb as keyof typeof verbs),
    [verb]
  );
  const [current, setCurrent] = useState(0);
  const conj = useMemo(
    () => conjugations[Math.floor(Math.random() * conjugations.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, verb]
  );
  const input = useRef<HTMLInputElement | null>(null);
  const [describe, setDescribe] = useState(false);
  const [descPerson, setDescPerson] = useState<Person>(1);
  const [descNumber, setDescNumber] = useState<Number>(1);
  const [descMood, setDescMood] = useState<Mood>("indicative");
  const [descTense, setDescTense] = useState<Tense>("present");
  const [error, setError] = useState("");

  useEffect(() => {
    if (conj.term === write) {
      if (hasPersonAndNumber(conj)) {
        setDescribe(true);
      } else {
        setCurrent((c) => c + 1);
      }
      setWrite("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conj.term, write]);

  return (
    <Box>
      <Container component="main" sx={{ py: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Verb</InputLabel>
          <Select
            value={verb}
            onChange={(e) => setVerb(e.target.value)}
            label="Verb"
            fullWidth
            variant="outlined"
          >
            {Object.keys(verbs).map((inf) => (
              <MenuItem key={inf} value={inf}>
                {inf}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ py: 3 }}>
          {!describe && (
            <Box>
              {hasPersonAndNumber(conj) ? (
                <Box sx={{ fontSize: "1.3rem" }}>
                  <Chip
                    sx={{ mr: 2, fontSize: "1.3rem" }}
                    color="warning"
                    label={`${
                      conj.person === 1
                        ? "First"
                        : conj.person === 2
                        ? "Second"
                        : "Third"
                    } Person`}
                    icon={
                      <SvgIcon>
                        <path
                          d={
                            conj.person === 1
                              ? mdiAccount
                              : conj.person === 2
                              ? mdiAccountMultiple
                              : mdiAccountGroup
                          }
                        />
                      </SvgIcon>
                    }
                  />
                  <Chip
                    sx={{ mr: 2, fontSize: "1.3rem" }}
                    color="success"
                    label={conj.number === 1 ? "Singular" : "Plural"}
                    icon={
                      <SvgIcon>
                        <path
                          d={
                            conj.number === 1 ? mdiHexagon : mdiHexagonMultiple
                          }
                        />
                      </SvgIcon>
                    }
                  />
                  <Chip
                    sx={{ mr: 2, fontSize: "1.3rem" }}
                    color="primary"
                    label={`${
                      conj.mood === "indicative" ? "Indicative" : "Subjunctive"
                    } Mood`}
                    icon={
                      <SvgIcon>
                        <path
                          d={
                            conj.mood === "indicative"
                              ? mdiMessageFlash
                              : mdiCommentQuestion
                          }
                        />
                      </SvgIcon>
                    }
                  />
                  <Chip
                    sx={{ mr: 2, fontSize: "1.3rem" }}
                    color="error"
                    label={`${
                      conj.tense === "present"
                        ? "Present"
                        : conj.tense === "imperfect"
                        ? "Imperfect"
                        : conj.tense === "preterit"
                        ? "Preterit"
                        : conj.tense === "future"
                        ? "Future"
                        : "Present Conditional"
                    } Tense`}
                    icon={
                      <>
                        {conj.tense === "present" && (
                          <>
                            <SvgIcon>
                              <path d={mdiRun} />
                            </SvgIcon>
                          </>
                        )}
                        {conj.tense === "imperfect" && (
                          <>
                            <SvgIcon>
                              <path d={mdiHistory} />
                            </SvgIcon>
                            <SvgIcon>
                              <path d={mdiRun} />
                            </SvgIcon>
                          </>
                        )}
                        {conj.tense === "preterit" && (
                          <>
                            <SvgIcon>
                              <path d={mdiHistory} />
                            </SvgIcon>
                          </>
                        )}
                        {conj.tense === "future" && (
                          <>
                            <SvgIcon>
                              <path d={mdiUpdate} />
                            </SvgIcon>
                          </>
                        )}
                        {conj.tense === "presentConditional" && (
                          <>
                            <SvgIcon>
                              <path d={mdiHelp} />
                            </SvgIcon>
                            <SvgIcon>
                              <path d={mdiRun} />
                            </SvgIcon>
                          </>
                        )}
                      </>
                    }
                  />
                </Box>
              ) : (
                <Box>
                  <Chip
                    sx={{ fontSize: "1.3rem" }}
                    color="success"
                    label={
                      conj.additional === "infinitive"
                        ? "Infinitive"
                        : conj.additional === "gerund"
                        ? "Gerund"
                        : conj.additional === "pastParticiple"
                        ? "Past Participle"
                        : "Imperative"
                    }
                    icon={
                      <SvgIcon>
                        <path
                          d={
                            conj.additional === "infinitive"
                              ? mdiAllInclusive
                              : conj.additional === "gerund"
                              ? mdiRunFast
                              : conj.additional === "pastParticiple"
                              ? mdiSwapHorizontal
                              : mdiExclamationThick
                          }
                        />
                      </SvgIcon>
                    }
                  />
                </Box>
              )}
            </Box>
          )}

          <Typography variant="h3" sx={{ my: 2 }}>
            {conj.number === 1 && (conj.person === 1 || conj.person === 3) && (
              <Typography variant="inherit" component="span" fontWeight={300}>
                ({conj.person === 1 ? "yo" : "él/ella"})&nbsp;
              </Typography>
            )}
            <Typography variant="inherit" component="span" fontWeight={300}>
              {conj.stem}
            </Typography>
            <Typography variant="inherit" component="span" fontWeight={500}>
              {conj.term.substring(conj?.stem?.length ?? 0)}
            </Typography>
          </Typography>

          {!describe && (
            <TextField
              autoFocus
              value={write}
              onChange={(e) => setWrite(e.target.value)}
              fullWidth
              variant="outlined"
              label="Write"
              inputRef={(ref) => (input.current = ref)}
            />
          )}

          {!describe && (
            <Box sx={{ mt: 1 }}>
              {["á", "é", "í", "ó"].map((accent) => (
                <IconButton
                  key={accent}
                  onClick={() => {
                    setWrite(write + accent);
                    input.current?.focus();
                  }}
                >
                  {accent}
                </IconButton>
              ))}
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {describe && (
            <>
              <FormControl>
                <FormLabel>Person</FormLabel>
                <RadioGroup
                  value={descPerson}
                  onChange={(e) =>
                    setDescPerson(Number(e.target.value) as Person)
                  }
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="First"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Second"
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label="Third"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Number</FormLabel>
                <RadioGroup
                  value={descNumber}
                  onChange={(e) =>
                    setDescNumber(Number(e.target.value) as Number)
                  }
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Singular"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Plural"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Mood</FormLabel>
                <RadioGroup
                  value={descMood}
                  onChange={(e) => setDescMood(e.target.value as Mood)}
                >
                  <FormControlLabel
                    value="indicative"
                    control={<Radio />}
                    label="Indicative"
                  />
                  <FormControlLabel
                    value="subjunctive"
                    control={<Radio />}
                    label="Subjunctive"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Tense</FormLabel>
                <RadioGroup
                  value={descTense}
                  onChange={(e) => setDescTense(e.target.value as Tense)}
                >
                  <FormControlLabel
                    value="present"
                    control={<Radio />}
                    label="Present"
                  />
                  <FormControlLabel
                    value="imperfect"
                    control={<Radio />}
                    label="Imperfect"
                  />
                  <FormControlLabel
                    value="preterit"
                    control={<Radio />}
                    label="Preterit"
                  />
                  <FormControlLabel
                    value="future"
                    control={<Radio />}
                    label="Future"
                  />
                  <FormControlLabel
                    value="presentConditional"
                    control={<Radio />}
                    label="Present Conditional"
                  />
                </RadioGroup>
              </FormControl>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  if (descPerson !== conj.person) {
                    setError("Person doesn't match");
                  } else if (descNumber !== conj.number) {
                    setError("Number doesn't match");
                  } else if (descMood !== conj.mood) {
                    setError("Mood doesn't match");
                  } else if (descTense !== conj.tense) {
                    setError("Tense doesn't match");
                  } else {
                    setError("");
                    setDescribe(false);
                    setCurrent((c) => c + 1);
                    setDescPerson(1);
                    setDescNumber(1);
                    setDescMood("indicative");
                    setDescTense("present");
                  }
                }}
              >
                Submit
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
